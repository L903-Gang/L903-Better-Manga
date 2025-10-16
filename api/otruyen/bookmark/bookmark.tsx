import { supabase } from '@/lib/supabase'

async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Không xác thực được người dùng.')
  return user
}

export async function addBookmark({ slug, name, image }: { slug: string; name: string; image?: string }) {
  try {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('bookmark')
      .insert([{ user_id: user.id, slug, name, image }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err: any) {
    console.error('Lỗi addBookmark:', err)
    throw err
  }
}

export async function removeBookmark(slug: string) {
  try {
    const user = await getCurrentUser()

    const { error } = await supabase.from('bookmark').delete().eq('user_id', user.id).eq('slug', slug)

    if (error) throw error
    return true
  } catch (err: any) {
    console.error('Lỗi removeBookmark:', err)
    throw err
  }
}

export async function getBookmarks(page = 1, limit = 10) {
  try {
    const user = await getCurrentUser()

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('bookmark')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      data,
      count,
      page,
      totalPages: count ? Math.ceil(count / limit) : 1
    }
  } catch (err: any) {
    console.error('Lỗi getBookmarks:', err)
    throw err
  }
}

export async function isBookmarked(slug: string) {
  try {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('bookmark')
      .select('slug')
      .eq('user_id', user.id)
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return !!data
  } catch (err: any) {
    console.error('Lỗi isBookmarked:', err)
    throw err
  }
}
