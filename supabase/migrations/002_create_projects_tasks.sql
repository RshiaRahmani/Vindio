-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('active', 'completed', 'archived')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Project policies
CREATE POLICY "Users can view projects they own or are assigned to"
  ON projects FOR SELECT
  USING (
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT assignee_id FROM tasks WHERE project_id = projects.id
    )
  );

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects"
  ON projects FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete their projects"
  ON projects FOR DELETE
  USING (auth.uid() = owner_id);

-- Task policies
CREATE POLICY "Users can view tasks in accessible projects"
  ON tasks FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE 
        owner_id = auth.uid() OR
        id IN (SELECT project_id FROM tasks WHERE assignee_id = auth.uid())
    )
  );

CREATE POLICY "Project owners and assignees can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    ) OR
    assignee_id = auth.uid()
  );

CREATE POLICY "Project owners and assignees can update tasks"
  ON tasks FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    ) OR
    assignee_id = auth.uid()
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects(owner_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);
CREATE INDEX IF NOT EXISTS tasks_assignee_id_idx ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);