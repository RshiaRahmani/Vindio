-- =========================================
-- COMPREHENSIVE VINDIO PLATFORM SCHEMA
-- =========================================
-- This migration enhances all existing schemas and adds missing functionality

-- =========================================
-- ENHANCE PROFILES TABLE
-- =========================================
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS avatar_color TEXT DEFAULT '#3B82F6';

-- Add missing license column to datasets if it doesn't exist
ALTER TABLE datasets 
  ADD COLUMN IF NOT EXISTS license VARCHAR(100) DEFAULT 'MIT',
  ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0',
  ADD COLUMN IF NOT EXISTS doi TEXT,
  ADD COLUMN IF NOT EXISTS citation_text TEXT;

-- =========================================
-- USER AUTHENTICATION & SESSIONS
-- =========================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  device_info JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- NOTIFICATIONS SYSTEM
-- =========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error', 'dataset', 'project', 'system')) DEFAULT 'info',
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- =========================================
-- FILE STORAGE & UPLOADS
-- =========================================
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  upload_status TEXT CHECK (upload_status IN ('uploading', 'completed', 'failed', 'processing')) DEFAULT 'uploading',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =========================================
-- DATASET COMMENTS & REVIEWS
-- =========================================
CREATE TABLE IF NOT EXISTS dataset_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES dataset_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dataset_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  review_text TEXT,
  is_verified_download BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dataset_id, user_id)
);

-- =========================================
-- TEAM COLLABORATION
-- =========================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'viewer')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES profiles(id),
  UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  inviter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invitee_email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member', 'viewer')) DEFAULT 'member',
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- DATASET COLLECTIONS & BOOKMARKS
-- =========================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_datasets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, dataset_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dataset_id)
);

-- =========================================
-- API KEYS & INTEGRATIONS
-- =========================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix TEXT NOT NULL,
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- USAGE ANALYTICS
-- =========================================
CREATE TABLE IF NOT EXISTS usage_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- SUBSCRIPTION & BILLING
-- =========================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')) NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- ENHANCED INDEXES FOR PERFORMANCE
-- =========================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login_at ON profiles(last_login_at);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed);

-- Datasets indexes
CREATE INDEX IF NOT EXISTS idx_datasets_visibility ON datasets(visibility);
CREATE INDEX IF NOT EXISTS idx_datasets_download_count ON datasets(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_datasets_view_count ON datasets(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_datasets_license ON datasets(license);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- File uploads indexes
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_upload_status ON file_uploads(upload_status);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created_at ON file_uploads(created_at DESC);

-- Comments and reviews indexes
CREATE INDEX IF NOT EXISTS idx_dataset_comments_dataset_id ON dataset_comments(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_comments_user_id ON dataset_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_dataset_comments_parent_comment_id ON dataset_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_dataset_reviews_dataset_id ON dataset_reviews(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_reviews_rating ON dataset_reviews(rating);

-- Team indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- Collections indexes
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_is_public ON collections(is_public);
CREATE INDEX IF NOT EXISTS idx_collection_datasets_collection_id ON collection_datasets(collection_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_event_type ON usage_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON usage_analytics(created_at DESC);

-- =========================================
-- ROW LEVEL SECURITY POLICIES
-- =========================================

-- User sessions RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- File uploads RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own uploads" ON file_uploads
  FOR ALL USING (auth.uid() = user_id);

-- Dataset comments RLS
ALTER TABLE dataset_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments on public datasets" ON dataset_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_comments.dataset_id 
      AND datasets.visibility = 'public'
    )
  );
CREATE POLICY "Users can manage their own comments" ON dataset_comments
  FOR ALL USING (auth.uid() = user_id);

-- Dataset reviews RLS
ALTER TABLE dataset_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews on public datasets" ON dataset_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_reviews.dataset_id 
      AND datasets.visibility = 'public'
    )
  );
CREATE POLICY "Users can manage their own reviews" ON dataset_reviews
  FOR ALL USING (auth.uid() = user_id);

-- Teams RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public teams" ON teams
  FOR SELECT USING (is_public = true);
CREATE POLICY "Team members can view their teams" ON teams
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM team_members WHERE team_id = teams.id
    )
  );
CREATE POLICY "Team owners can manage their teams" ON teams
  FOR ALL USING (auth.uid() = owner_id);

-- Team members RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members can view team membership" ON team_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM team_members tm WHERE tm.team_id = team_members.team_id
    )
  );

-- Collections RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public collections" ON collections
  FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own collections" ON collections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own collections" ON collections
  FOR ALL USING (auth.uid() = user_id);

-- Collection datasets RLS
ALTER TABLE collection_datasets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public collection datasets" ON collection_datasets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections 
      WHERE collections.id = collection_datasets.collection_id 
      AND collections.is_public = true
    )
  );
CREATE POLICY "Collection owners can manage their collection datasets" ON collection_datasets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM collections 
      WHERE collections.id = collection_datasets.collection_id 
      AND collections.user_id = auth.uid()
    )
  );

-- Bookmarks RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- API keys RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own API keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Subscriptions RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- =========================================
-- FUNCTIONS AND TRIGGERS
-- =========================================

-- Function to update view count
CREATE OR REPLACE FUNCTION increment_dataset_view_count(dataset_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE datasets 
  SET view_count = view_count + 1 
  WHERE id = dataset_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update download count
CREATE OR REPLACE FUNCTION increment_dataset_download_count(dataset_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE datasets 
  SET download_count = download_count + 1 
  WHERE id = dataset_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate dataset rating
CREATE OR REPLACE FUNCTION calculate_dataset_rating(dataset_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating
  FROM dataset_reviews 
  WHERE dataset_id = dataset_uuid;
  
  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_datasets_updated_at 
  BEFORE UPDATE ON datasets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at 
  BEFORE UPDATE ON teams 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at 
  BEFORE UPDATE ON collections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- VIEWS FOR COMMON QUERIES
-- =========================================

-- Popular datasets view
CREATE OR REPLACE VIEW popular_datasets AS
SELECT 
  d.*,
  p.full_name as owner_name,
  p.username as owner_username,
  COALESCE(AVG(dr.rating), 0) as avg_rating,
  COUNT(dr.id) as review_count,
  COUNT(l.dataset_id) as like_count
FROM datasets d
LEFT JOIN profiles p ON d.owner_id = p.id
LEFT JOIN dataset_reviews dr ON d.id = dr.dataset_id
LEFT JOIN likes l ON d.id = l.dataset_id
WHERE d.visibility = 'public'
GROUP BY d.id, p.full_name, p.username
ORDER BY d.download_count DESC, d.view_count DESC;

-- User dashboard stats view
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
  p.id as user_id,
  p.full_name,
  p.username,
  COUNT(DISTINCT d.id) as datasets_count,
  COUNT(DISTINCT pr.id) as projects_count,
  COUNT(DISTINCT t.id) as tasks_count,
  COALESCE(SUM(d.download_count), 0) as total_downloads,
  COALESCE(SUM(d.view_count), 0) as total_views
FROM profiles p
LEFT JOIN datasets d ON p.id = d.owner_id
LEFT JOIN projects pr ON p.id = pr.owner_id
LEFT JOIN tasks t ON p.id = t.assignee_id
GROUP BY p.id, p.full_name, p.username;

-- =========================================
-- SAMPLE DATA INSERTIONS
-- =========================================

-- Insert additional sample tags
INSERT INTO tags (name) VALUES 
  ('computer-vision'),
  ('natural-language-processing'),
  ('reinforcement-learning'),
  ('generative-ai'),
  ('recommendation-systems'),
  ('anomaly-detection'),
  ('image-segmentation'),
  ('object-detection'),
  ('sentiment-analysis'),
  ('tabular-data')
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE profiles IS 'User profiles with extended information and settings';
COMMENT ON TABLE datasets IS 'Machine learning datasets with comprehensive metadata';
COMMENT ON TABLE notifications IS 'User notification system';
COMMENT ON TABLE teams IS 'Team collaboration functionality';
COMMENT ON TABLE collections IS 'User-created dataset collections';
COMMENT ON TABLE usage_analytics IS 'Platform usage tracking and analytics';
COMMENT ON TABLE subscriptions IS 'User subscription and billing information';
