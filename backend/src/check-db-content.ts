import 'dotenv/config';
import { supabase } from './supabaseClient.js';

async function checkDatabase() {
  console.log('Checking database connection and content...');
  
  try {
    // Check flight_sessions
    const { data: sessions, error: sErr, count } = await supabase
      .from('flight_sessions')
      .select('*', { count: 'exact', head: false });

    if (sErr) {
      console.error('Error fetching flight_sessions:', sErr);
    } else {
      console.log(`Found ${count} flight sessions.`);
      if (sessions && sessions.length > 0) {
        console.log('Sample session:', sessions[0]);
      }
    }

    // Check users
    const { count: userCount, error: uErr } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (uErr) {
      console.error('Error fetching users:', uErr);
    } else {
      console.log(`Found ${userCount} users.`);
    }

    // Check barangays
    const { count: bCount, error: bErr } = await supabase
      .from('barangays')
      .select('*', { count: 'exact', head: true });

    if (bErr) {
      console.error('Error fetching barangays:', bErr);
    } else {
      console.log(`Found ${bCount} barangays.`);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkDatabase();
