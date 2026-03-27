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
              Marco Libanore — Biotechnologist &amp; LinkedIn Ghostwriter
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              I am Marco Libanore, a biotechnologist from Italy based in the Netherlands. I hold an MSc in Biotechnology from Wageningen University &amp; Research (WUR) and a BSc from the University of Milano-Bicocca, with hands-on research experience spanning genetic engineering, industrial bioprocess design, synthetic biology, novel food technologies and EU regulatory frameworks.
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
              My scientific career has taken me from the Italian National Research Council (CNR-IBBA) to Wageningen, from a nationally recognised MSc Thesis project — awarded 8/10 — that expanded a genetic engineering toolbox for a publicly-funded NWO research programme, to an internship at dsm-firmenich's Biotech Campus in Delft, where I independently built an in-house genetic toolbox for an industrially relevant bacterium. I have worked across academia, national research institutes and industrial biotech, giving me a genuinely varied perspective on how science, business and regulation intersect.
            </p>
            <p>
              Beyond the lab, I am an experienced writer. I have been praised for producing some of the strongest application materials recruiters had received — including a cover letter for Cradle described as the best they had seen. I have navigated the EPSO AD5 Graduate Administrators competition and the EPO Young Professional Programme, both of which required translating complex scientific and policy arguments into compelling, structured written documents under strict evaluation criteria. I understand how to make science legible, relevant and persuasive to audiences who are not scientists.
            </p>
            <p>
              This combination — deep technical credibility in life sciences and biotech, paired with genuine writing ability and an understanding of the EU innovation and regulatory landscape — is what I bring to LinkedIn ghostwriting. I help scientists, founders, researchers and biotech professionals communicate their work, their expertise and their vision in a way that actually lands with the people they are trying to reach.
            </p>
            <p>
              If you work in life sciences, biotech, foodtech, regulatory affairs, precision fermentation, synthetic biology or EU innovation policy — I speak your language, and I can help you find yours.
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
                MSc from Wageningen University &amp; Research with expertise in genetic engineering, synthetic biology, industrial bioprocess design and novel food technologies.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FlaskConical className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Industry Knowledge</h3>
              <p className="text-gray-600 text-sm">
                Experience across academia, national research institutes (CNR-IBBA) and industrial biotech (dsm-firmenich), with a varied perspective on science, business and regulation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pen className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Content Expertise</h3>
              <p className="text-gray-600 text-sm">
                Proven writing ability recognised across competitive EU selection processes (EPSO, EPO) and by industry recruiters — making science legible, relevant and persuasive.
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
          <p className="text-gray-400 text-sm">MSc Biotechnology — Wageningen University &amp; Research | Based in the Netherlands</p>
        </div>
      </footer>
    </div>
  );
}
