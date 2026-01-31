import { supabase } from '@/lib/supabase';

export async function trackInstall(platform: 'pwa' | 'ios_pwa') {
  try {
    await supabase.from('app_installs').insert({ platform });
  } catch {
    // silent
  }
}
