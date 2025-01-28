import { supabase } from "@/lib/supabase";
import type { Program } from "@/types/curriculum-module";
import type { Course } from "@/types/curriculum";

export interface CurriculumTemplate {
  id: string;
  name: string;
  description: string | null;
  template_type: 'program' | 'course' | 'module';
  content: Program | Course;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const curriculumTemplateService = {
  async createTemplate(data: Omit<CurriculumTemplate, 'id' | 'created_at' | 'updated_at'>) {
    const { data: template, error } = await supabase
      .from('curriculum_templates')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return template;
  },

  async getTemplates() {
    const { data: templates, error } = await supabase
      .from('curriculum_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return templates;
  },

  async getDefaultTemplates() {
    const { data: templates, error } = await supabase
      .from('curriculum_templates')
      .select('*')
      .eq('is_default', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return templates;
  }
};