import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envLocalPath = path.resolve('c:/Users/Crispis/Documents/Cosmic Love/.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf-8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseAnonKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

console.log('Supabase URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Could not find Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  try {
    // 1. Get weddings
    const { data: weddings, error: wError } = await supabase
      .from('weddings')
      .select('*');
    if (wError) throw wError;
    console.log('\n--- WEDDINGS ---');
    console.log(weddings);

    // 2. Get guests
    const { data: guests, error: gError } = await supabase
      .from('guests')
      .select('*');
    if (gError) throw gError;
    console.log('\n--- GUESTS ---');
    console.log(guests);

    // 3. Get feedback
    const { data: feedback, error: fError } = await supabase
      .from('feedback')
      .select('*');
    if (fError) throw fError;
    console.log('\n--- FEEDBACK ---');
    console.log(feedback);

  } catch (err) {
    console.error('Error querying Supabase:', err);
  }
}

checkDatabase();
