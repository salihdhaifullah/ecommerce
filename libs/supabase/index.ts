import { createClient } from '@supabase/supabase-js'
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY
if (!URL) throw new Error('Missing env.URL')
if (!KEY) throw new Error('Missing env.KEY')

const supabase = createClient(URL, KEY)

export default supabase;