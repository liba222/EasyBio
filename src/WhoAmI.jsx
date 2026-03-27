import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Mail, GraduationCap, FlaskConical, Pen } from 'lucide-react';

export default function WhoAmI() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-900">BioVoice</Link>
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition font-medium">
              <ArrowLeft className="mr-1" size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero / Photo + Intro */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <img
              src="/profile-photo.jpg"
              alt="Profile photo"
              className="w-56 h-56 rounded-full object-cover shadow-lg border-4 border-white"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="w-56 h-56 rounded-full bg-blue-100 border-4 border-white shadow-lg items-center justify-center hidden"
            >
              <Pen className="text-blue-400" size={64} />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Who Am I</h1>
            <p className="text-xl text-blue-600 font-medium mb-4">
              Biotechnologist turned LinkedIn Ghostwriter
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              I'm a biotechnology professional with a deep passion for science communication.
              After years in the lab and the biotech industry, I discovered that the biggest challenge
              for brilliant scientists and executives isn't doing the work — it's telling the world about it.
            </p>
          </div>
        </div>
      </section>

      {/* Bio Details */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              With an MSc in Biotechnology specializing in genetic engineering and metabolic engineering,
              I've spent years understanding the complexities of the biotech and pharma world. I know what
              it takes to develop groundbreaking research, navigate regulatory landscapes, and bring
              innovations to market.
            </p>
            <p>
              I realized that many of the most talented people in our industry struggle to share their
              expertise on platforms like LinkedIn — not because they lack knowledge, but because they
              lack the time and the right words. That's where BioVoice was born.
            </p>
            <p>
              My mission is to bridge the gap between scientific expertise and compelling content.
              I help biotech and pharma leaders build an authentic LinkedIn presence that reflects
              their knowledge, passion, and vision — without taking hours away from their actual work.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">What I Bring</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Scientific Background</h3>
              <p className="text-gray-600 text-sm">
                MSc in Biotechnology with expertise in genetic engineering and metabolic engineering.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FlaskConical className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Industry Knowledge</h3>
              <p className="text-gray-600 text-sm">
                Deep understanding of biotech, pharma, and life sciences from hands-on experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pen className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Content Expertise</h3>
              <p className="text-gray-600 text-sm">
                Turning complex science into engaging stories that resonate on LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Work Together</h2>
          <p className="text-lg text-gray-600 mb-8">
            Ready to amplify your voice on LinkedIn? I'd love to hear about your goals.
          </p>
          <Link
            to="/#contact"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">&copy; 2026 BioVoice - LinkedIn Ghostwriting for Biotech Leaders</p>
          <p className="text-gray-400 text-sm">MSc Biotechnology | Genetic Engineering Specialist | Based in the Netherlands</p>
        </div>
      </footer>
    </div>
  );
}
