import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Calendar, CheckCircle, TrendingUp, Linkedin } from 'lucide-react';
import { getUser, logout, handleAuthCallback, updateUser } from '@netlify/identity';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import WhoAmI from './WhoAmI.jsx';
import LinkedInPostGenerator from './LinkedInPostGenerator.jsx';
import LoginPage from './LoginPage.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [recoveryUser, setRecoveryUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // Process auth callbacks (OAuth, confirmation, recovery, invite)
        const result = await handleAuthCallback();
        if (result) {
          switch (result.type) {
            case 'confirmation':
            case 'oauth':
              if (result.user) setUser(result.user);
              break;
            case 'recovery':
              if (result.user) {
                setUser(result.user);
                setRecoveryUser(result.user);
              }
              break;
          }
        }
      } catch (e) {
        // Callback processing failed, continue
      }

      // Check if already logged in
      try {
        const currentUser = await getUser();
        if (currentUser) setUser(currentUser);
      } catch (e) {
        // Not logged in
      }

      setAuthChecked(true);
    }
    init();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // Ignore logout errors
    }
    setUser(null);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    try {
      await updateUser({ password: newPassword });
      setPasswordSuccess(true);
      setRecoveryUser(null);
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    }
  };

  // Show password reset form if user arrived via recovery link
  if (recoveryUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
          <p className="text-gray-600 mb-6">Enter your new password below.</p>
          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{passwordError}</div>
          )}
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="New password (min. 6 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<GhostwritingLanding user={user} onLogout={handleLogout} />} />
      <Route path="/who-am-i" element={<WhoAmI />} />
      <Route
        path="/post-generator"
        element={
          !authChecked ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : user ? (
            <LinkedInPostGenerator user={user} onLogout={handleLogout} />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        }
      />
    </Routes>
  );
}

function PayPalCheckoutButton({ tier }) {
  const [paypalError, setPaypalError] = useState('');

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 my-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or pay with</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>
      {paypalError && (
        <p className="text-red-500 text-xs text-center mb-2">{paypalError}</p>
      )}
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 40 }}
        createOrder={async () => {
          setPaypalError('');
          const res = await fetch('/api/create-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tier }),
          });
          const data = await res.json();
          if (!data.orderId) throw new Error(data.error || 'Failed to create order');
          return data.orderId;
        }}
        onApprove={async (data) => {
          const res = await fetch('/api/capture-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID, tier }),
          });
          const result = await res.json();
          if (result.success) {
            window.location.href = `/post-generator?tier=${tier}&payment=paypal`;
          } else {
            setPaypalError(result.error || 'Payment could not be completed.');
          }
        }}
        onError={() => setPaypalError('Something went wrong with PayPal. Please try again.')}
      />
    </div>
  );
}

function GhostwritingLanding({ user, onLogout }) {
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const handleCheckout = async (tier) => {
    setCheckoutLoading(tier);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb', currency: 'EUR' }}>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-900">BioVoice</h1>
            <div className="flex items-center gap-4">
              <Link to="/who-am-i" className="text-blue-600 hover:text-blue-700 font-medium transition">
                Who Am I
              </Link>
              <Link to="/post-generator" className="text-blue-600 hover:text-blue-700 font-medium transition">
                AI Post Generator
              </Link>
              {user && (
                <button onClick={onLogout} className="text-gray-500 hover:text-gray-700 text-sm font-medium transition">
                  Sign Out
                </button>
              )}
              <button onClick={() => document.getElementById('packages').scrollIntoView({behavior: 'smooth'})} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            LinkedIn Content That Combines<br />
            <span className="text-blue-600">Scientific Credibility</span> with{' '}
            <span className="text-blue-600">Engagement</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your expertise deserves a voice on LinkedIn. I help biotech and pharma executives build thought leadership without spending hours writing.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => document.getElementById('packages').scrollIntoView({behavior: 'smooth'})} className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              View Packages
            </button>
            <button onClick={() => document.getElementById('packages').scrollIntoView({behavior: 'smooth'})} className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
              View Packages
            </button>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Biotech Leaders Choose BioVoice</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-blue-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-3">MSc in Biotechnology</h4>
              <p className="text-gray-600">
                Deep expertise in genetic engineering and metabolic engineering. I speak your language and understand your science.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-blue-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-3">Engaging Content</h4>
              <p className="text-gray-600">
                Not just accurate—captivating. Content that turns complex science into compelling stories that your audience actually reads.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-blue-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-3">Consistent Presence</h4>
              <p className="text-gray-600">
                Your LinkedIn stays active with high-quality posts while you focus on running your company or leading your research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Content That Resonates</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Linkedin className="text-blue-600 mr-2" size={24} />
                <span className="font-semibold">Sample Post - Industry Insight</span>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Everyone's talking about CRISPR 2.0, but here's what most people miss about base editing in therapeutic applications...
                <br/><br/>
                After 5 years working with gene editing technologies, I've learned that precision isn't just about the tool—it's about understanding the cellular context.
                <br/><br/>
                Three insights that changed how I think about next-gen therapeutics: 🧬"
              </p>
              <span className="text-sm text-gray-500">Thought leadership that showcases expertise</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Linkedin className="text-blue-600 mr-2" size={24} />
                <span className="font-semibold">Sample Post - Company Update</span>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Why we spent 6 months optimizing a single fermentation parameter (and why it was worth it)
                <br/><br/>
                In bioprocessing, the difference between 'good enough' and 'optimized' can mean millions in production costs.
                <br/><br/>
                Here's what we learned about scaling up metabolic engineering solutions: ⚗️"
              </p>
              <span className="text-sm text-gray-500">Behind-the-scenes that builds credibility</span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Choose Your Package</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-blue-500 transition">
              <h4 className="text-2xl font-bold mb-2">Essential</h4>
              <div className="text-4xl font-bold text-blue-600 mb-4">€650<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>3 LinkedIn posts per week</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Content aligned with your expertise</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Monthly strategy call</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Approval before posting</span>
                </li>
              </ul>
              <button onClick={() => handleCheckout('essential')} disabled={checkoutLoading === 'essential'} className="w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50">
                {checkoutLoading === 'essential' ? 'Redirecting...' : 'Get Started'}
              </button>
              <PayPalCheckoutButton tier="essential" />
            </div>

            <div className="border-2 border-blue-500 rounded-lg p-8 relative shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h4 className="text-2xl font-bold mb-2">Professional</h4>
              <div className="text-4xl font-bold text-blue-600 mb-4">€1,100<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>5 LinkedIn posts per week</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Mix of thought leadership & company updates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Bi-weekly strategy calls</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Comment engagement support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Monthly analytics report</span>
                </li>
              </ul>
              <button onClick={() => handleCheckout('professional')} disabled={checkoutLoading === 'professional'} className="w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {checkoutLoading === 'professional' ? 'Redirecting...' : 'Get Started'}
              </button>
              <PayPalCheckoutButton tier="professional" />
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-blue-500 transition">
              <h4 className="text-2xl font-bold mb-2">Executive</h4>
              <div className="text-4xl font-bold text-blue-600 mb-4">€1,650<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>5 posts per week + articles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Full content strategy development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Weekly strategy calls</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Active comment engagement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Profile optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Priority support</span>
                </li>
              </ul>
              <button onClick={() => handleCheckout('executive')} disabled={checkoutLoading === 'executive'} className="w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50">
                {checkoutLoading === 'executive' ? 'Redirecting...' : 'Get Started'}
              </button>
              <PayPalCheckoutButton tier="executive" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Discovery Call</h4>
                <p className="text-gray-600">We discuss your expertise, goals, target audience, and what you want to be known for on LinkedIn.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Content Strategy</h4>
                <p className="text-gray-600">I develop a content calendar with themes, topics, and posting schedule aligned with your objectives.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Content Creation</h4>
                <p className="text-gray-600">I write posts that combine scientific accuracy with engaging storytelling. You review and approve.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Publish & Optimize</h4>
                <p className="text-gray-600">Posts go live on schedule. I track performance and continuously refine the approach based on what resonates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">© 2026 BioVoice - LinkedIn Ghostwriting for Biotech Leaders</p>
          <p className="text-gray-400 text-sm">MSc Biotechnology | Genetic Engineering Specialist | Based in the Netherlands</p>
        </div>
      </footer>
    </div>
    </PayPalScriptProvider>
  );
}
