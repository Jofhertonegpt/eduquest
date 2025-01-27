import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assignmentId, submission, assignmentType } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch assignment details
    const { data: assignment } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Prepare prompt based on assignment type
    let prompt = '';
    if (assignmentType === 'coding') {
      prompt = `You are a programming instructor grading a coding assignment. 
        Assignment: ${assignment.title}
        Description: ${assignment.description}
        Student's submission: ${submission}
        
        Please evaluate the code based on:
        1. Correctness
        2. Code quality
        3. Efficiency
        
        Provide a grade (0-100) and detailed feedback.`;
    } else {
      prompt = `You are an instructor grading an essay/written assignment.
        Assignment: ${assignment.title}
        Description: ${assignment.description}
        Student's submission: ${submission}
        
        Please evaluate based on:
        1. Content quality
        2. Structure
        3. Understanding of concepts
        
        Provide a grade (0-100) and detailed feedback.`;
    }

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an experienced educator providing detailed assignment feedback.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const aiResponse = await openAIResponse.json();
    const feedback = aiResponse.choices[0].message.content;

    // Extract numerical grade from feedback (assuming it's in the format "Grade: XX/100")
    const gradeMatch = feedback.match(/Grade:\s*(\d+)/);
    const grade = gradeMatch ? parseInt(gradeMatch[1]) : null;

    // Store feedback in database
    const { error: feedbackError } = await supabase
      .from('assignment_feedback')
      .insert({
        assignment_id: assignmentId,
        user_id: assignment.user_id,
        feedback,
        grade
      });

    if (feedbackError) {
      throw feedbackError;
    }

    return new Response(
      JSON.stringify({ feedback, grade }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in grade-assignment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});