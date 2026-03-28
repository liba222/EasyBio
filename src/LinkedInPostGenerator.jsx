import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle, Sparkles, Copy, RefreshCw } from 'lucide-react';

export default function LinkedInPostGenerator({ user, onLogout }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [copied, setCopied] = useState(null);

  const [clientInfo, setClientInfo] = useState({
    name: '',
    company: '',
    role: '',
    expertise: '',
    targetAudience: ''
  });

  const [postBrief, setPostBrief] = useState({
    topic: '',
    goal: '',
    tone: 'professional-engaging',
    includeHashtags: true,
    personalStory: '',
    keyPoints: '',
    callToAction: ''
  });

  const handleClientInfoChange = (field, value) => {
    setClientInfo({...clientInfo, [field]: value});
  };

  const handlePostBriefChange = (field, value) => {
    setPostBrief({...postBrief, [field]: value});
  };

  const generatePosts = async () => {
    setLoading(true);

    try {
      const token = await user.jwt();
      const response = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },

        body: JSON.stringify({ clientInfo, postBrief }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate posts');
      }

      const parsed = await response.json();
      setGeneratedPosts(parsed.posts);
      setStep(3);
    } catch (error) {
      console.error('Error generating posts:', error);
      alert('There was an error generating posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const regenerate = () => {
    setStep(2);
    setGeneratedPosts([]);
  };

  const startNew = () => {
    setStep(1);
    setGeneratedPosts([]);
    setPostBrief({
      topic: '',
      goal: '',
      tone: 'professional-engaging',
      includeHashtags: true,
      personalStory: '',
      keyPoints: '',
      callToAction: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-900">BioVoice</Link>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-gray-500 text-sm">
                  {user.email}
                </span>
              )}
              <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium transition">
                Back to Home
              </Link>
              {onLogout && (
                <button onClick={onLogout} className="text-gray-500 hover:text-gray-700 text-sm font-medium transition">
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-blue-600" size={32} />
              <h1 className="text-4xl font-bold text-gray-900">AI LinkedIn Post Generator</h1>
            </div>
            <p className="text-gray-600">Create engaging biotech LinkedIn content in minutes</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="hidden sm:inline">Profile</span>
            </div>
            <div className="w-12 h-1 bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="hidden sm:inline">Post Brief</span>
            </div>
            <div className="w-12 h-1 bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="hidden sm:inline">Results</span>
            </div>
          </div>

          {/* Step 1: Client Profile */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Step 1: Your Profile</h2>
              <p className="text-gray-600 mb-6">This information helps personalize the content to your voice and expertise.</p>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={clientInfo.name}
                    onChange={(e) => handleClientInfoChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Company *</label>
                  <input
                    type="text"
                    value={clientInfo.company}
                    onChange={(e) => handleClientInfoChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="BioTech Innovations"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Your Role *</label>
                  <input
                    type="text"
                    value={clientInfo.role}
                    onChange={(e) => handleClientInfoChange('role', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="CEO, CSO, VP of R&D, etc."
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Your Expertise/Focus Area *</label>
                  <textarea
                    value={clientInfo.expertise}
                    onChange={(e) => handleClientInfoChange('expertise', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Gene therapy, metabolic engineering, CRISPR applications, etc."
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Target Audience *</label>
                  <textarea
                    value={clientInfo.targetAudience}
                    onChange={(e) => handleClientInfoChange('targetAudience', e.target.value)}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Investors, fellow researchers, biotech entrepreneurs, etc."
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!clientInfo.name || !clientInfo.company || !clientInfo.role || !clientInfo.expertise || !clientInfo.targetAudience) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  setStep(2);
                }}
                className="w-full mt-6 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Continue to Post Brief
              </button>
            </div>
          )}

          {/* Step 2: Post Brief */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Step 2: Post Brief</h2>
              <p className="text-gray-600 mb-6">Tell us what you want this post to accomplish.</p>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Topic/Subject *</label>
                  <input
                    type="text"
                    value={postBrief.topic}
                    onChange={(e) => handlePostBriefChange('topic', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New CRISPR advancement, team milestone, industry insight, etc."
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Goal of This Post *</label>
                  <select
                    value={postBrief.goal}
                    onChange={(e) => handlePostBriefChange('goal', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a goal...</option>
                    <option value="thought-leadership">Establish thought leadership</option>
                    <option value="share-insight">Share industry insight</option>
                    <option value="announce-news">Announce company news</option>
                    <option value="educate">Educate audience</option>
                    <option value="engage-community">Engage with community</option>
                    <option value="recruit">Attract talent/recruitment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Tone</label>
                  <select
                    value={postBrief.tone}
                    onChange={(e) => handlePostBriefChange('tone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional-engaging">Professional & Engaging (recommended)</option>
                    <option value="authoritative">Authoritative & Expert</option>
                    <option value="conversational">Conversational & Approachable</option>
                    <option value="inspirational">Inspirational & Motivating</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Key Points to Cover *</label>
                  <textarea
                    value={postBrief.keyPoints}
                    onChange={(e) => handlePostBriefChange('keyPoints', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List the main points you want to communicate (bullet points or short sentences)"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Personal Story or Context (Optional)</label>
                  <textarea
                    value={postBrief.personalStory}
                    onChange={(e) => handlePostBriefChange('personalStory', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any personal anecdote, behind-the-scenes detail, or context that makes this more relatable"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Call to Action (Optional)</label>
                  <input
                    type="text"
                    value={postBrief.callToAction}
                    onChange={(e) => handlePostBriefChange('callToAction', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What do you want readers to do? (comment, share, visit website, etc.)"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hashtags"
                    checked={postBrief.includeHashtags}
                    onChange={(e) => handlePostBriefChange('includeHashtags', e.target.checked)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <label htmlFor="hashtags" className="font-semibold">Include relevant hashtags</label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!postBrief.topic || !postBrief.goal || !postBrief.keyPoints) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    generatePosts();
                  }}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating Posts...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Posts
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Generated Posts */}
          {step === 3 && generatedPosts.length > 0 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Your Generated Posts</h2>
                    <p className="text-gray-600">Choose your favorite, edit as needed, and post!</p>
                  </div>
                  <CheckCircle className="text-green-500" size={48} />
                </div>

                {generatedPosts.map((post, index) => (
                  <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-blue-600">{post.variant}</h3>
                      <button
                        onClick={() => copyToClipboard(post.content, index)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        {copied === index ? (
                          <>
                            <CheckCircle size={16} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap font-sans text-gray-800">{post.content}</pre>
                    </div>
                  </div>
                ))}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={regenerate}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={20} />
                    Generate New Variations
                  </button>
                  <button
                    onClick={startNew}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Create Another Post
                  </button>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3">Pro Tips Before Posting:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>- Read through and add your personal touch - make it sound like YOU</li>
                  <li>- Check for any company-specific details that need updating</li>
                  <li>- Best posting times: Tue-Thu, 7-9 AM or 12-1 PM</li>
                  <li>- Engage with comments within the first hour for better reach</li>
                  <li>- Tag relevant people or companies when appropriate</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
