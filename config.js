const SUPABASE_URL = 'https://sukqpqlmuhcpakyadmvy.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1a3FwcWxtdWhjcGFreWFkbXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjU5MzIsImV4cCI6MjA2Njk0MTkzMn0.MrzubAP7PvU8oySrq1suXuImirAqyd-KxDFsi_D_vFk'; 
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

window.supabase = supabaseClient;
