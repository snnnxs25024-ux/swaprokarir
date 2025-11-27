
import { createClient } from '@supabase/supabase-js';

// Menggunakan URL dan Key yang Anda berikan
const supabaseUrl = 'https://tgthadjobzcqcnrjvxlt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndGhhZGpvYnpjcWNucmp2eGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjIyMTksImV4cCI6MjA3OTYzODIxOX0.DTkaMOBRRqoQ2rlLn95fjCgAJzd0A80rivunTScgg5Y';

export const supabase = createClient(supabaseUrl, supabaseKey);
