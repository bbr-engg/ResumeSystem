'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumePreview from '@/components/resume/ResumePreview';
import ResumeCustomization from '@/components/resume/ResumeCustomization';
import { Resume } from '@/lib/types';
import { resumeAPI } from '@/lib/api';
import { Download, Share2, Loader2, Eye, Edit } from 'lucide-react';

export default function ResumePage() {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'customize'>('preview');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const response = await resumeAPI.getResume();
      setResume(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No resume yet, create one
        try {
          const createResponse = await resumeAPI.createResume({});
          setResume(createResponse.data);
        } catch (createError) {
          console.error('Failed to create resume:', createError);
        }
      } else {
        console.error('Failed to fetch resume:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'json' | 'pdf') => {
    try {
      const response = await resumeAPI.export(format);
      
      if (format === 'json') {
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume.json';
        link.click();
      } else {
        alert('PDF export coming soon!');
      }
    } catch (error) {
      console.error('Failed to export resume:', error);
      alert('Failed to export resume');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Resume Found</h2>
          <p className="text-gray-600 mb-6">
            Let's create your resume! Add some achievements first.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Resume</h1>
              <p className="text-sm text-gray-600">
                Auto-updating from your achievements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExport('json')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={() => alert('Share feature coming soon!')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye size={18} />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'customize'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit size={18} />
              Customize
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'preview' ? (
          <div className="max-w-4xl mx-auto">
            <ResumePreview resume={resume} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <ResumeCustomization resume={resume} onUpdate={setResume} />
          </div>
        )}
      </main>
    </div>
  );
}

