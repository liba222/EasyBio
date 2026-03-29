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
            const emailParam = result.payerEmail ? `&paypal_email=${encodeURIComponent(result.payerEmail)}` : '';
            window.location.href = `/post-generator?tier=${tier}&payment=paypal${emailParam}`;
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

  return (
    <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb', currency: 'EUR' }}>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src="/logoBiovoice.png" alt="BioVoice" className="h-10 w-auto" />
            <div className="flex items-center gap-4">
              <Link to="/who-am-i" className="text-blue-600 hover:text-blue-700 font-medium transition">
                Who Am I
              </Link>
              {user && (
                <Link to="/post-generator" className="text-blue-600 hover:text-blue-700 font-medium transition">
                  AI Post Generator
                </Link>
              )}
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
      <section className="relative px-4 py-20" style={{ backgroundImage: 'url(/backgroundWebsite.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-white/75" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 drop-shadow-sm">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-blue-500 transition">
              <h4 className="text-2xl font-bold mb-2">Essential</h4>
              <div className="text-4xl font-bold text-blue-600 mb-4">€350<span className="text-lg text-gray-600">/month</span></div>
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
              <PayPalCheckoutButton tier="essential" />
            </div>

            <div className="border-2 border-blue-500 rounded-lg p-8 relative shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h4 className="text-2xl font-bold mb-2">Professional</h4>
              <div className="text-4xl font-bold text-blue-600 mb-4">€600<span className="text-lg text-gray-600">/month</span></div>
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
              <PayPalCheckoutButton tier="professional" />
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-blue-500 transition">
              <h4 className="text-2xl font-bold mb-2">Executive</h4>
              <div className="text-4xl font-bold text-blue-600 mb-4">€900<span className="text-lg text-gray-600">/month</span></div>
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
              <PayPalCheckoutButton tier="executive" />
            </div>

            <div className="border-2 border-purple-200 rounded-lg p-8 hover:border-purple-500 transition">
              <h4 className="text-2xl font-bold mb-2">Custom</h4>
              <div className="text-4xl font-bold text-purple-600 mb-4">Let's talk</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Tailored posting frequency</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Custom content mix</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Flexible engagement model</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Pricing to match your needs</span>
                </li>
              </ul>
              <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="w-full text-center bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                Contact Me
              </button>
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

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">Let's Build Something Custom</h3>
          <p className="text-gray-600 text-center mb-10">Tell me about your goals and I'll get back to you within 24 hours.</p>
          <form name="contact" method="POST" data-netlify="true" className="space-y-5">
            <input type="hidden" name="form-name" value="contact" />
            <div>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell me about your needs, goals, and what you're looking for..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-3"><img src="/logoBiovoice.png" alt="BioVoice" className="h-8 w-auto opacity-80 brightness-0 invert" /></div>
          <p className="mb-2">© 2026 BioVoice - LinkedIn Ghostwriting for Biotech Leaders</p>
          <p className="text-gray-400 text-sm">MSc Biotechnology | Genetic Engineering Specialist | Based in the Netherlands</p>
        </div>
      </footer>
    </div>
    </PayPalScriptProvider>
  );
}
