import { supabase } from "@/lib/supabase";
import type { Course } from "@/types/curriculum";
import { BaseQuiz, BaseModule } from '@/types/core';

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

interface TemplateResponse {
  data: CurriculumTemplate[] | null;
  error: Error | null;
}

export class CurriculumTemplateService {
  private maxRetries = 3;
  private retryDelay = 1000;

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
      }
    }
    
    throw lastError!;
  }

  async getTemplates(): Promise<TemplateResponse> {
    return this.withRetry(async () => {
      const { data, error } = await supabase
        .from('curriculum_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return { data, error: null };
    });
  }

  async getPaginatedTemplates(page: number, limit: number = 10): Promise<TemplateResponse> {
    return this.withRetry(async () => {
      const start = page * limit;
      const end = start + limit - 1;

      const { data, error } = await supabase
        .from('curriculum_templates')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return { data, error: null };
    });
  }

  async createTemplate(data: Omit<CurriculumTemplate, 'id' | 'created_at' | 'updated_at'>) {
    const { data: template, error } = await supabase
      .from('curriculum_templates')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return template;
  }

  async getDefaultTemplates() {
    const { data: templates, error } = await supabase
      .from('curriculum_templates')
      .select('*')
      .eq('is_default', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return templates;
  }
}