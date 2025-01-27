import type { Module } from '@/types/curriculum';

export const filterModulesByType = (modules: any[], moduleType: string) => {
  return modules?.filter(m => m.module_type === moduleType) || [];
};

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 
    ? `${hours}h ${remainingMinutes}m` 
    : `${hours}h`;
};

export const getModuleIcon = (type: string) => {
  switch (type) {
    case 'resource':
      return 'BookOpen';
    case 'assignment':
      return 'FileText';
    case 'quiz':
      return 'CheckCircle';
    default:
      return 'File';
  }
};