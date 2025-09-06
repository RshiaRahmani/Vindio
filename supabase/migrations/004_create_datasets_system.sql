-- Create datasets schema
-- Note: profiles table should already exist from your auth setup

-- Table: datasets
CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  publish_date DATE DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Junction table: dataset_tags (many-to-many)
CREATE TABLE IF NOT EXISTS dataset_tags (
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (dataset_id, tag_id)
);

-- Table: likes
CREATE TABLE IF NOT EXISTS likes (
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (dataset_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_datasets_owner_id ON datasets(owner_id);
CREATE INDEX IF NOT EXISTS idx_datasets_publish_date ON datasets(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_dataset_tags_dataset_id ON dataset_tags(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_tags_tag_id ON dataset_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_likes_dataset_id ON likes(dataset_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Enable Row Level Security
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for datasets
CREATE POLICY "Anyone can view datasets" ON datasets
  FOR SELECT USING (true);

CREATE POLICY "Users can create datasets" ON datasets
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own datasets" ON datasets
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own datasets" ON datasets
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for tags
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tags" ON tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for dataset_tags
CREATE POLICY "Anyone can view dataset tags" ON dataset_tags
  FOR SELECT USING (true);

CREATE POLICY "Dataset owners can manage their tags" ON dataset_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_tags.dataset_id 
      AND datasets.owner_id = auth.uid()
    )
  );

-- RLS Policies for likes
CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON likes
  FOR ALL USING (auth.uid() = user_id);

-- Insert some sample data (optional)
INSERT INTO tags (name) VALUES 
  ('machine-learning'),
  ('computer-vision'),
  ('nlp'),
  ('deep-learning'),
  ('pytorch'),
  ('tensorflow'),
  ('data-science'),
  ('classification'),
  ('regression'),
  ('time-series')
ON CONFLICT (name) DO NOTHING;
