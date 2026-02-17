import { SupabaseClient, User } from '@supabase/supabase-js'

export async function verifyAdmin(supabase: SupabaseClient): Promise<{ user: User | null; isAdmin: boolean }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, isAdmin: false }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return { user, isAdmin: profile?.role === 'admin' }
}
