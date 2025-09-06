-- Add missing columns to datasets table for enhanced form functionality
ALTER TABLE datasets 
  ADD COLUMN IF NOT EXISTS category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS size VARCHAR(50),
  ADD COLUMN IF NOT EXISTS format VARCHAR(50);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_datasets_category ON datasets(category);
CREATE INDEX IF NOT EXISTS idx_datasets_format ON datasets(format);

-- Update existing records to have MIT license if null
UPDATE datasets SET license = 'MIT' WHERE license IS NULL;

-- Make license column required (not null)
ALTER TABLE datasets ALTER COLUMN license SET NOT NULL;
