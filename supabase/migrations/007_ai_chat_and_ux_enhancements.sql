-- =========================================
-- AI CHAT & USER EXPERIENCE ENHANCEMENTS
-- =========================================

-- =========================================
-- ENHANCED AI CHAT SYSTEM
-- =========================================

-- Create chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  model_used TEXT DEFAULT 'gpt-3.5-turbo',
  context_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  total_messages INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced messages table (if not already comprehensive)
-- Add columns to existing messages table
DO $$ 
BEGIN
  -- Add session reference
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'session_id') THEN
    ALTER TABLE messages ADD COLUMN session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE;
  END IF;
  
  -- Add token usage tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'tokens_used') THEN
    ALTER TABLE messages ADD COLUMN tokens_used INTEGER DEFAULT 0;
  END IF;
  
  -- Add response time tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'response_time_ms') THEN
    ALTER TABLE messages ADD COLUMN response_time_ms INTEGER;
  END IF;
  
  -- Add message status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'status') THEN
    ALTER TABLE messages ADD COLUMN status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'streaming')) DEFAULT 'completed';
  END IF;
  
  -- Add error information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'error_message') THEN
    ALTER TABLE messages ADD COLUMN error_message TEXT;
  END IF;
  
  -- Add parent message reference for conversations
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'parent_message_id') THEN
    ALTER TABLE messages ADD COLUMN parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL;
  END IF;
END $$;

-- =========================================
-- USER PREFERENCES & SETTINGS
-- =========================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'system',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  email_notifications JSONB DEFAULT '{"datasets": true, "projects": true, "teams": true, "marketing": false}',
  privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "show_email": false, "show_activity": true}',
  ai_chat_settings JSONB DEFAULT '{"model_preference": "gpt-3.5-turbo", "max_tokens": 2000, "temperature": 0.7}',
  dashboard_layout JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- DATASET USAGE TRACKING
-- =========================================

CREATE TABLE IF NOT EXISTS dataset_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  download_type TEXT CHECK (download_type IN ('full', 'sample', 'preview')) DEFAULT 'full',
  file_format TEXT,
  ip_address INET,
  user_agent TEXT,
  download_size_bytes BIGINT,
  download_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dataset_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  view_duration_seconds INTEGER,
  page_sections_viewed JSONB DEFAULT '[]',
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- CONTENT MODERATION
-- =========================================

CREATE TABLE IF NOT EXISTS content_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content_type TEXT CHECK (content_type IN ('dataset', 'comment', 'profile', 'team')) NOT NULL,
  content_id UUID NOT NULL,
  reason TEXT CHECK (reason IN ('spam', 'inappropriate', 'copyright', 'misleading', 'harmful', 'other')) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')) DEFAULT 'pending',
  moderator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  moderator_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- ADVANCED SEARCH & FILTERING
-- =========================================

CREATE TABLE IF NOT EXISTS search_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  query_text TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  clicked_result_ids JSONB DEFAULT '[]',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- USER ACHIEVEMENTS & GAMIFICATION
-- =========================================

CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT CHECK (category IN ('datasets', 'community', 'projects', 'milestones')) NOT NULL,
  criteria JSONB NOT NULL,
  points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  last_monthly_reset TIMESTAMPTZ DEFAULT NOW(),
  rank_position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- DATASET VERSIONING
-- =========================================

CREATE TABLE IF NOT EXISTS dataset_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  version_number TEXT NOT NULL,
  changelog TEXT,
  file_url TEXT,
  file_size_bytes BIGINT,
  is_current BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dataset_id, version_number)
);

-- =========================================
-- ENHANCED INDEXES
-- =========================================

-- Chat sessions indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_is_active ON chat_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON chat_sessions(last_message_at DESC);

-- Messages enhanced indexes
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_parent_message_id ON messages(parent_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Dataset tracking indexes
CREATE INDEX IF NOT EXISTS idx_dataset_downloads_dataset_id ON dataset_downloads(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_downloads_user_id ON dataset_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_dataset_downloads_created_at ON dataset_downloads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dataset_views_dataset_id ON dataset_views(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_views_created_at ON dataset_views(created_at DESC);

-- Content moderation indexes
CREATE INDEX IF NOT EXISTS idx_content_reports_content_type_id ON content_reports(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter_id ON content_reports(reporter_id);

-- Search indexes
CREATE INDEX IF NOT EXISTS idx_search_queries_user_id ON search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at DESC);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_points_total_points ON user_points(total_points DESC);

-- Dataset versions indexes
CREATE INDEX IF NOT EXISTS idx_dataset_versions_dataset_id ON dataset_versions(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_versions_is_current ON dataset_versions(is_current);

-- =========================================
-- ROW LEVEL SECURITY POLICIES
-- =========================================

-- Chat sessions RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own chat sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- User preferences RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Dataset downloads RLS
ALTER TABLE dataset_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dataset owners can view download stats" ON dataset_downloads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_downloads.dataset_id 
      AND datasets.owner_id = auth.uid()
    )
  );
CREATE POLICY "Users can view their own downloads" ON dataset_downloads
  FOR SELECT USING (auth.uid() = user_id);

-- Dataset views RLS
ALTER TABLE dataset_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dataset owners can view view stats" ON dataset_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_views.dataset_id 
      AND datasets.owner_id = auth.uid()
    )
  );

-- Content reports RLS
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create reports" ON content_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their own reports" ON content_reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Search queries RLS
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own search history" ON search_queries
  FOR SELECT USING (auth.uid() = user_id);

-- Achievements RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active achievements" ON achievements
  FOR SELECT USING (is_active = true);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view user achievements" ON user_achievements
  FOR SELECT USING (true);
CREATE POLICY "Users can manage their own achievements" ON user_achievements
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view user points" ON user_points
  FOR SELECT USING (true);
CREATE POLICY "Users can view their own points" ON user_points
  FOR ALL USING (auth.uid() = user_id);

-- Dataset versions RLS
ALTER TABLE dataset_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public dataset versions" ON dataset_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_versions.dataset_id 
      AND datasets.visibility = 'public'
    )
  );
CREATE POLICY "Dataset owners can manage versions" ON dataset_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_versions.dataset_id 
      AND datasets.owner_id = auth.uid()
    )
  );

-- =========================================
-- ENHANCED FUNCTIONS
-- =========================================

-- Function to update user points
CREATE OR REPLACE FUNCTION update_user_points(user_uuid UUID, points_to_add INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO user_points (user_id, total_points, monthly_points)
  VALUES (user_uuid, points_to_add, points_to_add)
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_points.total_points + points_to_add,
    monthly_points = user_points.monthly_points + points_to_add,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track dataset view
CREATE OR REPLACE FUNCTION track_dataset_view(
  dataset_uuid UUID,
  user_uuid UUID DEFAULT NULL,
  view_duration INTEGER DEFAULT NULL,
  sections_viewed JSONB DEFAULT '[]',
  ip_addr INET DEFAULT NULL,
  user_agent_str TEXT DEFAULT NULL,
  referrer_url TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Insert view record
  INSERT INTO dataset_views (
    dataset_id, user_id, view_duration_seconds, page_sections_viewed,
    ip_address, user_agent, referrer
  ) VALUES (
    dataset_uuid, user_uuid, view_duration, sections_viewed,
    ip_addr, user_agent_str, referrer_url
  );
  
  -- Update dataset view count
  PERFORM increment_dataset_view_count(dataset_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track dataset download
CREATE OR REPLACE FUNCTION track_dataset_download(
  dataset_uuid UUID,
  user_uuid UUID DEFAULT NULL,
  download_type_val TEXT DEFAULT 'full',
  file_format_val TEXT DEFAULT NULL,
  ip_addr INET DEFAULT NULL,
  user_agent_str TEXT DEFAULT NULL,
  download_size BIGINT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Insert download record
  INSERT INTO dataset_downloads (
    dataset_id, user_id, download_type, file_format,
    ip_address, user_agent, download_size_bytes, download_completed
  ) VALUES (
    dataset_uuid, user_uuid, download_type_val, file_format_val,
    ip_addr, user_agent_str, download_size, true
  );
  
  -- Update dataset download count
  PERFORM increment_dataset_download_count(dataset_uuid);
  
  -- Award points to user if authenticated
  IF user_uuid IS NOT NULL THEN
    PERFORM update_user_points(user_uuid, 10); -- 10 points per download
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================
-- TRIGGERS
-- =========================================

-- Update updated_at triggers for new tables
CREATE TRIGGER update_chat_sessions_updated_at 
  BEFORE UPDATE ON chat_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at 
  BEFORE UPDATE ON user_points 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- SAMPLE ACHIEVEMENTS DATA
-- =========================================

INSERT INTO achievements (name, description, icon, category, criteria, points) VALUES
  ('First Dataset', 'Upload your first dataset', '🎯', 'datasets', '{"datasets_uploaded": 1}', 100),
  ('Popular Creator', 'Get 100 downloads on a dataset', '⭐', 'datasets', '{"total_downloads": 100}', 250),
  ('Community Helper', 'Leave 10 helpful comments', '💬', 'community', '{"comments_left": 10}', 150),
  ('Active Member', 'Log in for 7 consecutive days', '🔥', 'milestones', '{"consecutive_days": 7}', 200),
  ('Data Explorer', 'Download 20 different datasets', '🔍', 'datasets', '{"datasets_downloaded": 20}', 300),
  ('Team Player', 'Join your first team', '👥', 'community', '{"teams_joined": 1}', 50),
  ('Prolific Creator', 'Upload 10 datasets', '📊', 'datasets', '{"datasets_uploaded": 10}', 500),
  ('Top Contributor', 'Reach 1000 total points', '🏆', 'milestones', '{"total_points": 1000}', 1000)
ON CONFLICT (name) DO NOTHING;

-- =========================================
-- VIEWS FOR ANALYTICS
-- =========================================

-- Dataset analytics view
CREATE OR REPLACE VIEW dataset_analytics AS
SELECT 
  d.id,
  d.title,
  d.owner_id,
  d.view_count,
  d.download_count,
  COUNT(DISTINCT dv.id) as detailed_views,
  COUNT(DISTINCT dd.id) as detailed_downloads,
  COUNT(DISTINCT dc.id) as comments_count,
  COUNT(DISTINCT dr.id) as reviews_count,
  COALESCE(AVG(dr.rating), 0) as avg_rating,
  COUNT(DISTINCT l.user_id) as likes_count
FROM datasets d
LEFT JOIN dataset_views dv ON d.id = dv.dataset_id
LEFT JOIN dataset_downloads dd ON d.id = dd.dataset_id
LEFT JOIN dataset_comments dc ON d.id = dc.dataset_id
LEFT JOIN dataset_reviews dr ON d.id = dr.dataset_id
LEFT JOIN likes l ON d.id = l.dataset_id
GROUP BY d.id, d.title, d.owner_id, d.view_count, d.download_count;

-- User activity summary view
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  p.id as user_id,
  p.full_name,
  p.username,
  COUNT(DISTINCT cs.id) as chat_sessions_count,
  COUNT(DISTINCT m.id) as messages_count,
  COUNT(DISTINCT d.id) as datasets_created,
  COUNT(DISTINCT dd.id) as datasets_downloaded,
  COUNT(DISTINCT dc.id) as comments_made,
  COUNT(DISTINCT dr.id) as reviews_made,
  COALESCE(up.total_points, 0) as total_points,
  COUNT(DISTINCT ua.id) as achievements_earned
FROM profiles p
LEFT JOIN chat_sessions cs ON p.id = cs.user_id
LEFT JOIN messages m ON p.id = m.user_id
LEFT JOIN datasets d ON p.id = d.owner_id
LEFT JOIN dataset_downloads dd ON p.id = dd.user_id
LEFT JOIN dataset_comments dc ON p.id = dc.user_id
LEFT JOIN dataset_reviews dr ON p.id = dr.user_id
LEFT JOIN user_points up ON p.id = up.user_id
LEFT JOIN user_achievements ua ON p.id = ua.user_id
GROUP BY p.id, p.full_name, p.username, up.total_points;

COMMENT ON TABLE chat_sessions IS 'AI chat conversation sessions';
COMMENT ON TABLE user_preferences IS 'User-specific preferences and settings';
COMMENT ON TABLE dataset_downloads IS 'Detailed dataset download tracking';
COMMENT ON TABLE dataset_views IS 'Detailed dataset view tracking';
COMMENT ON TABLE content_reports IS 'Content moderation and reporting system';
COMMENT ON TABLE achievements IS 'Platform achievements and gamification';
COMMENT ON TABLE user_points IS 'User point system for gamification';
COMMENT ON TABLE dataset_versions IS 'Dataset version control system';
