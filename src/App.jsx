import React, { useState } from 'react';
import { Calendar, CheckCircle, TrendingUp, Users, Mail, Linkedin } from 'lucide-react';

export default function GhostwritingLanding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    linkedin: '',
    tier: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in your name and email');
      return;
    }
    setSubmitted(true);
    console.log('Form submitted:', formData);
  };

  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-900">BioVoice</h1>
            <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
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
            <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              Schedule a Call
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
              <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Get Started
              </button>
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
              <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Get Started
              </button>
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
              <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Get Started
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

      {/* Contact Form */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">Ready to Build Your LinkedIn Presence?</h3>
          <p className="text-center text-gray-600 mb-8">Schedule a free 30-minute discovery call to discuss how I can help you.</p>
          
          {!submitted ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Package Interest</label>
                <select
                  value={formData.tier}
                  onChange={(e) => handleChange('tier', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a package</option>
                  <option value="essential">Essential - €650/month</option>
                  <option value="professional">Professional - €1,100/month</option>
                  <option value="executive">Executive - €1,650/month</option>
                  <option value="custom">Custom solution</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Tell me about your goals</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What do you want to achieve with your LinkedIn presence?"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Schedule Discovery Call
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h4 className="text-2xl font-bold text-green-900 mb-2">Thank You!</h4>
              <p className="text-green-800">I'll reach out within 24 hours to schedule our discovery call.</p>
            </div>
          )}
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
  );
}
