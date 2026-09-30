import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://poesexzpiouafhblpxkn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZXNleHpwaW91YWZoYmxweGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NTAwODIsImV4cCI6MjEwNjMyNjA4Mn0.jtHUp5_MTDbb8k9KMEUfbUBDDIKLL7fAgFHsllXHuKw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)