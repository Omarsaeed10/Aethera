require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

const isValidUrl = supabaseUrl && !supabaseUrl.includes('your-project.supabase.co') && !supabaseUrl.includes('placeholder') && supabaseUrl.startsWith('http');
const isValidKey = supabaseKey && !supabaseKey.includes('your-anon-key') && !supabaseKey.includes('your-service-role-key');

if (isValidUrl && isValidKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('⚡ Supabase Client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Supabase placeholder credentials detected. Operating in local SQLite mode.');
}

module.exports = supabase;
