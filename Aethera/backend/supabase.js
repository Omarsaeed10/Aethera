require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  console.log('⚡ Supabase Client initialized successfully.');
} else {
  console.log('⚠️ Supabase credentials not set in .env (SUPABASE_URL, SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY).');
}

module.exports = supabase;
