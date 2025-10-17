'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Resume } from '@/lib/types';
import { resumeAPI } from '@/lib/api';
import { Save, RefreshCw, Loader2, Sparkles } from 'lucide-react';

interface ResumeCustomizationProps {
  resume: Resume;
  onUpdate: (resume: Resume) => void;
}

interface ResumeFormData {
  title: string;
  summary: string;
  objective: string;
  templateStyle: string;
  isPublic: boolean;
}

export default function ResumeCustomization({ resume, onUpdate }: ResumeCustomizationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ResumeFormData>({
    defaultValues: {
      title: resume.title || '',
      summary: resume.summary || '',
      objective: resume.objective || '',
      templateStyle: resume.templateStyle || 'modern',
      isPublic: resume.isPublic || false,
    },
  });

  const onSubmit = async (data: ResumeFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage('');
      
      const response = await resumeAPI.updateResume(data);
      onUpdate(response.data);
      
      setSuccessMessage('✅ Resume updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      setSuccessMessage('');
      
      const response = await resumeAPI.regenerate();
      onUpdate(response.data);
      
      setSuccessMessage('✨ Resume regenerated from your achievements!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to regenerate resume');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customize Your Resume</h2>
          <p className="text-gray-600 text-sm mt-1">
            Personalize your resume content and settings
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {isRegenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Auto-Regenerate
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Resume Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume Title
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Software Engineer Resume"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Professional Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary
            <span className="text-gray-500 font-normal ml-2">
              (Auto-generated from achievements, but you can customize)
            </span>
          </label>
          <textarea
            {...register('summary')}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="A brief professional summary about yourself..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Tip: Highlight your key strengths, experience, and career goals
          </p>
        </div>

        {/* Career Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Career Objective <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <textarea
            {...register('objective')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What are you looking for in your next role?"
          />
        </div>

        {/* Template Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Style
          </label>
          <select
            {...register('templateStyle')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="professional">Professional</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {/* Public/Private */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            {...register('isPublic')}
            id="isPublic"
            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="flex-1">
            <span className="block font-medium text-gray-900">Make resume public</span>
            <span className="text-sm text-gray-600">
              Allow others to view your resume via a public link
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">🎯 Pro Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your resume automatically updates when you add new achievements</li>
          <li>• Use the "Auto-Regenerate" button to refresh content from your latest achievements</li>
          <li>• Experience and Education sections are populated from your achievements</li>
          <li>• Add more internships, courses, and projects to enrich your resume</li>
        </ul>
      </div>

      {/* Last Updated */}
      {resume.lastGeneratedAt && (
        <div className="text-center text-sm text-gray-500">
          Last auto-updated: {new Date(resume.lastGeneratedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}

