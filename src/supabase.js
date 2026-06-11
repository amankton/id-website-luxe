import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrdldhhcebervlmlwfbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZGxkaGhjZWJlcnZsbWx3ZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjQzNDgsImV4cCI6MjA3NTcwMDM0OH0.ey0HcmaUzFPlgUFKzKa3ox_7azhb6NyMroxS84v34SU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
