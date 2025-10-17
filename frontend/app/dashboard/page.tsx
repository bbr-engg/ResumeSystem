'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI, achievementAPI } from '@/lib/api';
import { CompleteProfile } from '@/lib/types';
import { FileText, Award, Target, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { getAchievementTypeColor, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CompleteProfile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        userAPI.getCompleteProfile(),
        achievementAPI.getStats(),
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={48} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/resume')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Resume
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {profile.firstName}! 👋
          </h2>
          <p className="text-blue-100">
            Your resume is automatically updating from your achievements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="text-blue-600" size={32} />
              <span className="text-3xl font-bold text-gray-900">{stats?.total || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Achievements</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-green-600" size={32} />
              <span className="text-3xl font-bold text-gray-900">{stats?.totalSkills || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Skills</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="text-purple-600" size={32} />
              <span className="text-3xl font-bold text-gray-900">{stats?.verified || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Verified</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="text-orange-600" size={32} />
              <span className="text-3xl font-bold text-gray-900">{profile.resume ? '1' : '0'}</span>
            </div>
            <p className="text-gray-600 font-medium">Resume</p>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Achievements</h3>
            <button
              onClick={() => alert('Add achievement modal - Coming soon!')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Achievement
            </button>
          </div>

          {profile.achievements.length > 0 ? (
            <div className="space-y-4">
              {profile.achievements.slice(0, 5).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getAchievementTypeColor(achievement.type)}`}>
                        {achievement.type}
                      </span>
                      {achievement.isVerified && (
                        <CheckCircle2 size={16} className="text-green-500" />
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.organization}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(achievement.startDate)} - {achievement.endDate ? formatDate(achievement.endDate) : 'Present'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Award size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No achievements yet. Add your first achievement to get started!</p>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Skills</h3>
          {profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="ml-2 text-xs text-gray-600">• {skill.proficiency}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills yet. They'll be added automatically from your achievements!</p>
          )}
        </div>
      </main>
    </div>
  );
}

