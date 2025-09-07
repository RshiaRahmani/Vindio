-- =========================================
-- ADVANCED PLATFORM FEATURES
-- =========================================

-- =========================================
-- ADVANCED COLLABORATION FEATURES
-- =========================================

-- Project collaborators (extending the existing projects table)
CREATE TABLE IF NOT EXISTS project_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('editor', 'viewer', 'commenter')) DEFAULT 'viewer',
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(project_id, user_id)
);

-- Task comments and attachments
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time tracking for tasks
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  hours_worked DECIMAL(5,2) NOT NULL CHECK (hours_worked > 0),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  is_billable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- ADVANCED DATASET FEATURES
-- =========================================

-- Dataset citations and references
CREATE TABLE IF NOT EXISTS dataset_citations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  citing_work_title TEXT NOT NULL,
  citing_work_url TEXT,
  authors TEXT,
  publication_date DATE,
  citation_text TEXT,
  verified BOOLEAN DEFAULT false,
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dataset API endpoints (for programmatic access)
CREATE TABLE IF NOT EXISTS dataset_api_endpoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  endpoint_type TEXT CHECK (endpoint_type IN ('rest', 'graphql', 'websocket')) DEFAULT 'rest',
  endpoint_url TEXT NOT NULL,
  authentication_required BOOLEAN DEFAULT true,
  rate_limit_per_hour INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dataset schema/structure information
CREATE TABLE IF NOT EXISTS dataset_schemas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  version TEXT DEFAULT '1.0.0',
  schema_definition JSONB NOT NULL,
  column_descriptions JSONB DEFAULT '{}',
  data_types JSONB DEFAULT '{}',
  constraints JSONB DEFAULT '{}',
  sample_data JSONB DEFAULT '{}',
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- MARKETPLACE & MONETIZATION
-- =========================================

-- Paid datasets and pricing
CREATE TABLE IF NOT EXISTS dataset_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_paid BOOLEAN DEFAULT false,
  price_type TEXT CHECK (price_type IN ('free', 'one_time', 'subscription', 'usage_based')) DEFAULT 'free',
  base_price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  subscription_interval TEXT CHECK (subscription_interval IN ('month', 'year')),
  usage_price_per_download DECIMAL(10,2) DEFAULT 0,
  free_download_limit INTEGER DEFAULT 0,
  pricing_tiers JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dataset purchases and transactions
CREATE TABLE IF NOT EXISTS dataset_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  purchase_type TEXT CHECK (purchase_type IN ('one_time', 'subscription', 'usage_credit')) NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  license_granted JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- ADVANCED USER FEATURES
-- =========================================

-- User followers/following system
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- User portfolios and showcases
CREATE TABLE IF NOT EXISTS user_portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  featured_datasets JSONB DEFAULT '[]',
  featured_projects JSONB DEFAULT '[]',
  custom_sections JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT true,
  theme_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Professional profiles and credentials
CREATE TABLE IF NOT EXISTS user_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  credential_type TEXT CHECK (credential_type IN ('education', 'certification', 'work_experience', 'publication', 'award')) NOT NULL,
  title TEXT NOT NULL,
  institution TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')) DEFAULT 'unverified',
  verification_document_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- CONTENT DISCOVERY & RECOMMENDATION
-- =========================================

-- User content interactions for recommendation engine
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_type TEXT CHECK (content_type IN ('dataset', 'project', 'user', 'collection', 'team')) NOT NULL,
  content_id UUID NOT NULL,
  interaction_type TEXT CHECK (interaction_type IN ('view', 'like', 'bookmark', 'download', 'share', 'comment', 'review')) NOT NULL,
  interaction_strength DECIMAL(3,2) DEFAULT 1.0 CHECK (interaction_strength BETWEEN 0 AND 1),
  session_id TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content recommendations
CREATE TABLE IF NOT EXISTS content_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT CHECK (content_type IN ('dataset', 'project', 'user', 'collection')) NOT NULL,
  content_id UUID NOT NULL,
  recommendation_score DECIMAL(5,4) NOT NULL CHECK (recommendation_score BETWEEN 0 AND 1),
  recommendation_reason TEXT,
  algorithm_version TEXT DEFAULT 'v1.0',
  is_shown BOOLEAN DEFAULT false,
  is_clicked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- Trending content tracking
CREATE TABLE IF NOT EXISTS trending_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT CHECK (content_type IN ('dataset', 'project', 'user', 'tag')) NOT NULL,
  content_id UUID NOT NULL,
  trending_score DECIMAL(8,4) NOT NULL,
  time_window TEXT CHECK (time_window IN ('1h', '6h', '24h', '7d', '30d')) NOT NULL,
  rank_position INTEGER,
  category TEXT,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_type, content_id, time_window, calculated_at::date)
);

-- =========================================
-- PLATFORM ADMINISTRATION
-- =========================================

-- System announcements and news
CREATE TABLE IF NOT EXISTS system_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT CHECK (announcement_type IN ('news', 'maintenance', 'feature', 'warning', 'celebration')) DEFAULT 'news',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  target_audience JSONB DEFAULT '{"all_users": true}',
  is_active BOOLEAN DEFAULT true,
  show_until TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User announcement interactions
CREATE TABLE IF NOT EXISTS user_announcement_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  announcement_id UUID REFERENCES system_announcements(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT CHECK (interaction_type IN ('viewed', 'dismissed', 'clicked')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, announcement_id, interaction_type)
);

-- Platform feature flags
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
  target_users JSONB DEFAULT '{}',
  conditions JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- COMPREHENSIVE INDEXES
-- =========================================

-- Project collaborators indexes
CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_id ON project_collaborators(user_id);

-- Task comments indexes
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);

-- Time entries indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_started_at ON time_entries(started_at DESC);

-- Dataset citations indexes
CREATE INDEX IF NOT EXISTS idx_dataset_citations_dataset_id ON dataset_citations(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_citations_verified ON dataset_citations(verified);

-- Dataset API endpoints indexes
CREATE INDEX IF NOT EXISTS idx_dataset_api_endpoints_dataset_id ON dataset_api_endpoints(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_api_endpoints_is_active ON dataset_api_endpoints(is_active);

-- Dataset schemas indexes
CREATE INDEX IF NOT EXISTS idx_dataset_schemas_dataset_id ON dataset_schemas(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_schemas_is_current ON dataset_schemas(is_current);

-- Pricing and purchases indexes
CREATE INDEX IF NOT EXISTS idx_dataset_pricing_is_paid ON dataset_pricing(is_paid);
CREATE INDEX IF NOT EXISTS idx_dataset_purchases_buyer_id ON dataset_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_dataset_purchases_dataset_id ON dataset_purchases(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_purchases_status ON dataset_purchases(status);

-- User follows indexes
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);

-- User credentials indexes
CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id ON user_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_type ON user_credentials(credential_type);
CREATE INDEX IF NOT EXISTS idx_user_credentials_verification_status ON user_credentials(verification_status);

-- Interactions and recommendations indexes
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_content ON user_interactions(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_user_id ON content_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_expires_at ON content_recommendations(expires_at);
CREATE INDEX IF NOT EXISTS idx_trending_content_score ON trending_content(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_content_time_window ON trending_content(time_window, calculated_at DESC);

-- System indexes
CREATE INDEX IF NOT EXISTS idx_system_announcements_is_active ON system_announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_system_announcements_show_until ON system_announcements(show_until);
CREATE INDEX IF NOT EXISTS idx_feature_flags_is_enabled ON feature_flags(is_enabled);

-- =========================================
-- ROW LEVEL SECURITY POLICIES
-- =========================================

-- Project collaborators RLS
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can view collaborators" ON project_collaborators
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_collaborators pc WHERE pc.project_id = project_collaborators.project_id
    ) OR
    auth.uid() IN (
      SELECT owner_id FROM projects WHERE id = project_collaborators.project_id
    )
  );

-- Task comments RLS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project members can view task comments" ON task_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = task_comments.task_id
      AND (
        p.owner_id = auth.uid() OR
        auth.uid() IN (
          SELECT user_id FROM project_collaborators WHERE project_id = p.id
        )
      )
    )
  );

-- Time entries RLS
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own time entries" ON time_entries
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Project owners can view all time entries" ON time_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = time_entries.task_id
      AND p.owner_id = auth.uid()
    )
  );

-- Dataset citations RLS
ALTER TABLE dataset_citations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view verified citations" ON dataset_citations
  FOR SELECT USING (verified = true);
CREATE POLICY "Dataset owners can manage citations" ON dataset_citations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_citations.dataset_id 
      AND datasets.owner_id = auth.uid()
    )
  );

-- Dataset API endpoints RLS
ALTER TABLE dataset_api_endpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dataset owners can manage API endpoints" ON dataset_api_endpoints
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_api_endpoints.dataset_id 
      AND datasets.owner_id = auth.uid()
    )
  );

-- Dataset schemas RLS
ALTER TABLE dataset_schemas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public dataset schemas" ON dataset_schemas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_schemas.dataset_id 
      AND datasets.visibility = 'public'
    )
  );

-- Pricing and purchases RLS
ALTER TABLE dataset_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active pricing" ON dataset_pricing
  FOR SELECT USING (is_active = true);
CREATE POLICY "Dataset owners can manage pricing" ON dataset_pricing
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_pricing.dataset_id 
      AND datasets.owner_id = auth.uid()
    )
  );

ALTER TABLE dataset_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own purchases" ON dataset_purchases
  FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Dataset owners can view their sales" ON dataset_purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM datasets 
      WHERE datasets.id = dataset_purchases.dataset_id 
      AND datasets.owner_id = auth.uid()
    )
  );

-- User follows RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view follows" ON user_follows
  FOR SELECT USING (true);
CREATE POLICY "Users can manage their own follows" ON user_follows
  FOR ALL USING (auth.uid() = follower_id);

-- User portfolios RLS
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public portfolios" ON user_portfolios
  FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own portfolio" ON user_portfolios
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own portfolio" ON user_portfolios
  FOR ALL USING (auth.uid() = user_id);

-- User credentials RLS
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view verified credentials" ON user_credentials
  FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Users can manage their own credentials" ON user_credentials
  FOR ALL USING (auth.uid() = user_id);

-- User interactions RLS
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own interactions" ON user_interactions
  FOR SELECT USING (auth.uid() = user_id);

-- Content recommendations RLS
ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own recommendations" ON content_recommendations
  FOR ALL USING (auth.uid() = user_id);

-- Trending content RLS
ALTER TABLE trending_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view trending content" ON trending_content
  FOR SELECT USING (true);

-- System announcements RLS
ALTER TABLE system_announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active announcements" ON system_announcements
  FOR SELECT USING (is_active = true AND (show_until IS NULL OR show_until > NOW()));

ALTER TABLE user_announcement_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their announcement interactions" ON user_announcement_interactions
  FOR ALL USING (auth.uid() = user_id);

-- Feature flags RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view enabled feature flags" ON feature_flags
  FOR SELECT USING (is_enabled = true);

-- =========================================
-- ADVANCED FUNCTIONS
-- =========================================

-- Function to calculate trending score
CREATE OR REPLACE FUNCTION calculate_trending_score(
  content_type_val TEXT,
  content_id_val UUID,
  time_window_val TEXT
)
RETURNS DECIMAL AS $$
DECLARE
  score DECIMAL := 0;
  time_filter TIMESTAMPTZ;
BEGIN
  -- Determine time filter based on window
  CASE time_window_val
    WHEN '1h' THEN time_filter := NOW() - INTERVAL '1 hour';
    WHEN '6h' THEN time_filter := NOW() - INTERVAL '6 hours';
    WHEN '24h' THEN time_filter := NOW() - INTERVAL '1 day';
    WHEN '7d' THEN time_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN time_filter := NOW() - INTERVAL '30 days';
    ELSE time_filter := NOW() - INTERVAL '24 hours';
  END CASE;

  -- Calculate score based on content type
  IF content_type_val = 'dataset' THEN
    SELECT 
      COALESCE(
        (COUNT(ui.id) * 1.0 + 
         COUNT(CASE WHEN ui.interaction_type = 'download' THEN 1 END) * 5.0 +
         COUNT(CASE WHEN ui.interaction_type = 'like' THEN 1 END) * 2.0 +
         COUNT(CASE WHEN ui.interaction_type = 'bookmark' THEN 1 END) * 3.0) / 
        GREATEST(EXTRACT(EPOCH FROM (NOW() - time_filter)) / 3600, 1), 
        0
      ) INTO score
    FROM user_interactions ui
    WHERE ui.content_type = content_type_val 
      AND ui.content_id = content_id_val
      AND ui.created_at >= time_filter;
  END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update trending content
CREATE OR REPLACE FUNCTION update_trending_content()
RETURNS void AS $$
DECLARE
  time_windows TEXT[] := ARRAY['1h', '6h', '24h', '7d', '30d'];
  window_val TEXT;
BEGIN
  FOREACH window_val IN ARRAY time_windows
  LOOP
    -- Insert/update trending datasets
    INSERT INTO trending_content (content_type, content_id, trending_score, time_window, rank_position)
    SELECT 
      'dataset',
      d.id,
      calculate_trending_score('dataset', d.id, window_val),
      window_val,
      ROW_NUMBER() OVER (ORDER BY calculate_trending_score('dataset', d.id, window_val) DESC)
    FROM datasets d
    WHERE d.visibility = 'public'
    ON CONFLICT (content_type, content_id, time_window, calculated_at::date)
    DO UPDATE SET 
      trending_score = EXCLUDED.trending_score,
      rank_position = EXCLUDED.rank_position,
      calculated_at = NOW();
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track user interaction
CREATE OR REPLACE FUNCTION track_user_interaction(
  user_uuid UUID,
  content_type_val TEXT,
  content_id_val UUID,
  interaction_type_val TEXT,
  interaction_strength_val DECIMAL DEFAULT 1.0,
  session_id_val TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_interactions (
    user_id, content_type, content_id, interaction_type, 
    interaction_strength, session_id
  ) VALUES (
    user_uuid, content_type_val, content_id_val, interaction_type_val,
    interaction_strength_val, session_id_val
  );
  
  -- Award points based on interaction type
  CASE interaction_type_val
    WHEN 'download' THEN PERFORM update_user_points(user_uuid, 15);
    WHEN 'like' THEN PERFORM update_user_points(user_uuid, 5);
    WHEN 'bookmark' THEN PERFORM update_user_points(user_uuid, 3);
    WHEN 'comment' THEN PERFORM update_user_points(user_uuid, 10);
    WHEN 'review' THEN PERFORM update_user_points(user_uuid, 20);
    WHEN 'share' THEN PERFORM update_user_points(user_uuid, 8);
    ELSE NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================
-- ADDITIONAL TRIGGERS
-- =========================================

-- Trigger to update updated_at for new tables
CREATE TRIGGER update_task_comments_updated_at 
  BEFORE UPDATE ON task_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dataset_pricing_updated_at 
  BEFORE UPDATE ON dataset_pricing 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_portfolios_updated_at 
  BEFORE UPDATE ON user_portfolios 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_credentials_updated_at 
  BEFORE UPDATE ON user_credentials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_announcements_updated_at 
  BEFORE UPDATE ON system_announcements 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at 
  BEFORE UPDATE ON feature_flags 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- FINAL COMMENTS
-- =========================================

COMMENT ON TABLE project_collaborators IS 'Project collaboration and access control';
COMMENT ON TABLE task_comments IS 'Comments and discussions on tasks';
COMMENT ON TABLE time_entries IS 'Time tracking for tasks and projects';
COMMENT ON TABLE dataset_citations IS 'Academic and professional citations of datasets';
COMMENT ON TABLE dataset_api_endpoints IS 'API access points for datasets';
COMMENT ON TABLE dataset_schemas IS 'Structured schema definitions for datasets';
COMMENT ON TABLE dataset_pricing IS 'Monetization and pricing for datasets';
COMMENT ON TABLE dataset_purchases IS 'Purchase transactions and licensing';
COMMENT ON TABLE user_follows IS 'Social following system between users';
COMMENT ON TABLE user_portfolios IS 'User portfolio and showcase pages';
COMMENT ON TABLE user_credentials IS 'Professional credentials and verification';
COMMENT ON TABLE user_interactions IS 'User behavior tracking for recommendations';
COMMENT ON TABLE content_recommendations IS 'AI-powered content recommendations';
COMMENT ON TABLE trending_content IS 'Trending content across time periods';
COMMENT ON TABLE system_announcements IS 'Platform-wide announcements and news';
COMMENT ON TABLE feature_flags IS 'Feature flag system for gradual rollouts';
