import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = 'MMM yyyy') {
  return format(new Date(date), formatStr);
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function calculateDuration(startDate: string, endDate?: string) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                 (end.getMonth() - start.getMonth());
  
  if (months < 1) return '< 1 month';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
  return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
}

export function getAchievementTypeColor(type: string) {
  const colors: Record<string, string> = {
    INTERNSHIP: 'bg-blue-100 text-blue-800',
    COURSE: 'bg-green-100 text-green-800',
    HACKATHON: 'bg-purple-100 text-purple-800',
    PROJECT: 'bg-orange-100 text-orange-800',
    CERTIFICATION: 'bg-teal-100 text-teal-800',
    COMPETITION: 'bg-pink-100 text-pink-800',
    WORKSHOP: 'bg-indigo-100 text-indigo-800',
    VOLUNTEER: 'bg-yellow-100 text-yellow-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

export function getSkillProficiencyColor(level: string) {
  const colors: Record<string, string> = {
    BEGINNER: 'bg-gray-200 text-gray-700',
    INTERMEDIATE: 'bg-blue-200 text-blue-700',
    ADVANCED: 'bg-purple-200 text-purple-700',
    EXPERT: 'bg-green-200 text-green-700',
  };
  return colors[level] || 'bg-gray-200 text-gray-700';
}

