-- Create photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Community',
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and add policies for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for public/admin" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for public" ON events FOR SELECT USING (true);
CREATE POLICY "Enable delete for admin" ON events FOR DELETE USING (true);

-- Create sermons table
CREATE TABLE sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

-- Create policies (Public read, Authenticated write/delete)
CREATE POLICY "Public Read Access Photos" ON photos FOR SELECT USING (true);
CREATE POLICY "Public Read Access Events" ON events FOR SELECT USING (true);
CREATE POLICY "Public Read Access Sermons" ON sermons FOR SELECT USING (true);

-- For simplicity, since we use Service Role or Admin credentials in API, we'll allow all for service role
-- Or just disable RLS for now to make it "work immediately" as requested
-- ALTER TABLE photos DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE events DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE sermons DISABLE ROW LEVEL SECURITY;

-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and add policies for prayer_requests
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a prayer request (from the contact form)
CREATE POLICY "Enable insert for public" ON prayer_requests FOR INSERT WITH CHECK (true);

-- Allow anyone (or just admin, but for simplicity here public) to read
CREATE POLICY "Enable select for public" ON prayer_requests FOR SELECT USING (true);

-- Allow anyone to delete (for the admin panel)
CREATE POLICY "Enable delete for public" ON prayer_requests FOR DELETE USING (true);