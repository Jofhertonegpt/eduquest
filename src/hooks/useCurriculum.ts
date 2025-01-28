import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Degree, Course, CourseModule, Module, ModuleData, CourseLevel } from '@/types/curriculum';

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('program_info')
        .select('*');
      
      if (error) throw error;
      return data.map(program => ({
        id: program.id,
        name: program.name,
        description: program.description,
        programOutcomes: program.program_outcomes || [],
        institution: program.institution,
        complianceStandards: program.compliance_standards || []
      }));
    }
  });
}

export function useDegrees(programId: string | undefined) {
  return useQuery({
    queryKey: ['degrees', programId],
    queryFn: async () => {
      if (!programId) return [];
      const { data, error } = await supabase
        .from('degrees')
        .select('*')
        .eq('program_id', programId);
      
      if (error) throw error;
      return data.map(degree => ({
        id: degree.id,
        programId: degree.program_id,
        title: degree.title,
        type: degree.type,
        description: degree.description,
        requiredCredits: degree.required_credits,
        metadata: degree.metadata || {
          academicYear: '',
          deliveryFormat: '',
          department: ''
        },
        courses: []
      })) as Degree[];
    },
    enabled: !!programId
  });
}

export function useCourses(degreeId: string | undefined) {
  return useQuery({
    queryKey: ['courses', degreeId],
    queryFn: async () => {
      if (!degreeId) return [];
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('degree_id', degreeId);
      
      if (error) throw error;
      return data.map(course => ({
        id: course.id,
        degreeId: course.degree_id,
        title: course.title,
        description: course.description,
        credits: course.credits,
        level: course.level as CourseLevel,
        metadata: course.metadata || {
          instructor: '',
          meetingTimes: '',
          tags: [],
          skills: []
        },
        modules: []
      })) as Course[];
    },
    enabled: !!degreeId
  });
}

export function useModules(curriculumId: string | undefined) {
  return useQuery({
    queryKey: ['modules', curriculumId],
    queryFn: async () => {
      if (!curriculumId) return [];
      
      console.log('Fetching modules for curriculum:', curriculumId);
      
      const { data, error } = await supabase
        .from('curriculum_modules')
        .select('*')
        .eq('curriculum_id', curriculumId)
        .eq('module_type', 'module')
        .eq('module_status', 'active')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching modules:', error);
        throw error;
      }
      
      console.log('Fetched modules:', data);
      
      return data.map(module => {
        const moduleData = module.module_data as ModuleData;
        return {
          ...moduleData,
          module_status: module.module_status,
          module_type: module.module_type,
          content: module.content,
          curriculum_id: module.curriculum_id,
          display_order: module.display_order,
          version: module.version
        } as Module;
      });
    },
    enabled: !!curriculumId
  });
}