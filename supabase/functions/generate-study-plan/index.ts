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
    const { userId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's recent assignments and feedback
    const { data: recentAssignments } = await supabase
      .from('assignments')
      .select(`
        *,
        assignment_feedback (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch user's course progress
    const { data: courseProgress } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Prepare data for AI analysis
    const performanceData = recentAssignments?.map(assignment => ({
      title: assignment.title,
      grade: assignment.assignment_feedback?.[0]?.grade,
      feedback: assignment.assignment_feedback?.[0]?.feedback,
    }));

    const prompt = `As an educational AI assistant, analyze this student's recent performance and create a personalized study plan.
      
      Recent Performance:
      ${JSON.stringify(performanceData, null, 2)}
      
      Course Progress:
      ${JSON.stringify(courseProgress, null, 2)}
      
      Please create a detailed study plan that:
      1. Identifies areas needing improvement
      2. Suggests specific learning resources and exercises
      3. Sets achievable goals and milestones
      4. Provides time management recommendations
      
      Format the response as a structured JSON object with sections for:
      - areas_of_focus
      - recommended_resources
      - weekly_goals
      - study_schedule`;

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
          { role: 'system', content: 'You are an educational AI assistant creating personalized study plans.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const aiResponse = await openAIResponse.json();
    const studyPlan = JSON.parse(aiResponse.choices[0].message.content);

    // Store study plan in database
    const { error: studyPlanError } = await supabase
      .from('study_plans')
      .insert({
        user_id: userId,
        content: studyPlan,
        status: 'active'
      });

    if (studyPlanError) {
      throw studyPlanError;
    }

    return new Response(
      JSON.stringify({ studyPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-study-plan function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});