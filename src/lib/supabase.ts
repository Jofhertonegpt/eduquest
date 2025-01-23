import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jemwazskuncpsnpqxsso.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbXdhenNrdW5jcHNucHF4c3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NjAwNjEsImV4cCI6MjA1MzIzNjA2MX0.G0hMc-f5X3MAIVoAn2CiRSvmOrlMAVaHBxcZdCiQPwU';

export const supabase = createClient(supabaseUrl, supabaseKey);