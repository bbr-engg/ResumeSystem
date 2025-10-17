'use client';

import { Resume } from '@/lib/types';
import { formatDate, calculateDuration } from '@/lib/utils';
import { Mail, Phone, MapPin, Calendar, Award, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume;
  className?: string;
}

export default function ResumePreview({ resume, className }: ResumePreviewProps) {
  const user = resume.user;

  return (
    <div className={`bg-white shadow-2xl rounded-lg overflow-hidden ${className || ''}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-blue-100 text-lg">{resume.title}</p>
          </div>
          {resume.lastGeneratedAt && (
            <div className="text-right">
              <p className="text-sm text-blue-200">Last updated</p>
              <p className="text-xs text-blue-100">{formatDate(resume.lastGeneratedAt, 'PPp')}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {user?.email && (
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
          )}
          {user?.phone && (
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-8">
        {/* Professional Summary */}
        {resume.summary && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {/* Objective */}
        {resume.objective && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
              Career Objective
            </h2>
            <p className="text-gray-700 leading-relaxed">{resume.objective}</p>
          </section>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.positions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
              <Award className="text-blue-600" size={24} />
              Work Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.positions.map((position, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-300">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full" />
                  
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        {position.title}
                        {position.verified && (
                          <CheckCircle2 size={18} className="text-green-500" />
                        )}
                      </h3>
                      <p className="text-blue-600 font-medium">{position.company}</p>
                      {position.location && (
                        <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                          <MapPin size={14} />
                          {position.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="flex items-center gap-1 justify-end">
                        <Calendar size={14} />
                        {formatDate(position.startDate)} - {position.endDate ? formatDate(position.endDate) : 'Present'}
                      </p>
                      {position.duration && (
                        <p className="text-gray-500 mt-1">{position.duration}</p>
                      )}
                    </div>
                  </div>

                  {position.responsibilities && position.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-3">
                      {position.responsibilities.map((resp, idx) => (
                        <li key={idx} className="leading-relaxed">{resp}</li>
                      ))}
                    </ul>
                  )}

                  {position.skills && position.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {position.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume.education && resume.education.degrees.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Education & Certifications
            </h2>
            <div className="space-y-6">
              {resume.education.degrees.map((degree, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-300">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-600 rounded-full" />
                  
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        {degree.degree}
                        {degree.verified && (
                          <CheckCircle2 size={18} className="text-green-500" />
                        )}
                      </h3>
                      <p className="text-green-600 font-medium">{degree.institution}</p>
                      {degree.grade && (
                        <p className="text-gray-600 text-sm mt-1">Grade: {degree.grade}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="flex items-center gap-1 justify-end">
                        <Calendar size={14} />
                        {formatDate(degree.startDate)} - {degree.endDate ? formatDate(degree.endDate) : 'Ongoing'}
                      </p>
                    </div>
                  </div>

                  {degree.skills && degree.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {degree.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {degree.certificateUrl && (
                    <a
                      href={degree.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <ExternalLink size={14} />
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {user?.skills && user.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="ml-2 text-xs text-gray-600">
                    • {skill.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Highlight */}
        {user?.achievements && user.achievements.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Notable Achievements
            </h2>
            <div className="grid gap-4">
              {user.achievements
                .filter(a => a.type === 'HACKATHON' || a.type === 'COMPETITION')
                .slice(0, 3)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg"
                  >
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {achievement.title}
                      {achievement.isVerified && (
                        <CheckCircle2 size={16} className="text-green-500" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">{achievement.description}</p>
                    {achievement.position && (
                      <p className="text-sm font-medium text-orange-700 mt-2">
                        🏆 {achievement.position}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600 border-t">
        <p>
          Generated automatically from verified achievements •{' '}
          <span className="text-blue-600 font-medium">Resume System</span>
        </p>
      </div>
    </div>
  );
}

