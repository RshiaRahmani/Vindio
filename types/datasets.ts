// TypeScript interfaces for datasets system
export interface Dataset {
  id: string
  title: string
  description: string
  category?: string | null
  license: string
  size?: string | null
  format?: string | null
  file_url?: string | null
  author_id: string
  publish_date: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
}

export interface DatasetTag {
  dataset_id: string
  tag_id: string
}

export interface Like {
  dataset_id: string
  user_id: string
  created_at: string
}

export interface Profile {
  id: string
  username: string
  created_at: string
}

// Combined interface for displaying datasets with all related data
export interface DatasetWithDetails {
  id: string
  title: string
  description: string | null
  publish_date: string
  owner: string
  likes: number
  tags: string[]
}

// Search and filter interfaces
export interface DatasetFilters {
  search?: string
  tags?: string[]
  sortBy?: 'publish_date' | 'likes' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface DatasetSearchResult {
  datasets: DatasetWithDetails[]
  total: number
  hasMore: boolean
}
