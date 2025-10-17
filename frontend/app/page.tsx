'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Award, Zap, Users, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles size={48} className="text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">Resume System</h1>
          </div>
          <p className="text-2xl text-gray-700 mb-4">
            Auto-Updating Resume Ecosystem
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Generate professional resumes automatically from your achievements.
            Track internships, courses, hackathons, and projects - your resume updates in real-time!
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button
              onClick={() => window.open('http://localhost:3000/api/docs', '_blank')}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-lg font-semibold transition-all"
            >
              View API Docs
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <Zap className="text-yellow-500 mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Auto-Updating</h3>
            <p className="text-gray-600">
              Your resume automatically updates when you add new achievements. No manual work required!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <Award className="text-blue-500 mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Achievement Tracking</h3>
            <p className="text-gray-600">
              Track internships, courses, hackathons, projects, and certifications all in one place.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <Users className="text-purple-500 mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Platform Integration</h3>
            <p className="text-gray-600">
              Connect with external platforms via webhooks. Achievements sync automatically!
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Account</h4>
              <p className="text-sm text-gray-600">Sign up and set up your profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Add Achievements</h4>
              <p className="text-sm text-gray-600">Track your internships, courses, and projects</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Auto-Generate</h4>
              <p className="text-sm text-gray-600">Resume updates automatically from your achievements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Export & Share</h4>
              <p className="text-sm text-gray-600">Download and share your professional resume</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to build your resume?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals using automated resume generation
            </p>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started For Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
