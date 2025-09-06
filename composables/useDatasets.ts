import type { Dataset, Tag, DatasetWithDetails, DatasetFilters, DatasetSearchResult } from '~/types/datasets'

export const useDatasets = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Fetch datasets with all details (owner, likes, tags)
  const fetchDatasetsWithDetails = async (filters: DatasetFilters = {}): Promise<DatasetWithDetails[]> => {
    try {
      let query = supabase
        .from('datasets')
        .select(`
          id,
          title,
          description,
          publish_date,
          profiles!inner(username),
          likes(count),
          dataset_tags(tags(name))
        `)

      // Apply search filter
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'publish_date'
      const sortOrder = filters.sortOrder || 'desc'
      
      if (sortBy === 'publish_date') {
        query = query.order('publish_date', { ascending: sortOrder === 'asc' })
      } else if (sortBy === 'title') {
        query = query.order('title', { ascending: sortOrder === 'asc' })
      }

      const { data, error } = await query

      if (error) throw error

      // Transform the data to match our interface
      const datasets: DatasetWithDetails[] = data.map(dataset => ({
        id: dataset.id,
        title: dataset.title,
        description: dataset.description,
        publish_date: dataset.publish_date,
        owner: dataset.profiles.username,
        likes: dataset.likes?.[0]?.count || 0,
        tags: dataset.dataset_tags?.map(dt => dt.tags.name).filter(Boolean) || []
      }))

      // Apply tag filter on the frontend (since Supabase joins can be complex for this)
      if (filters.tags && filters.tags.length > 0) {
        return datasets.filter(dataset => 
          filters.tags!.some(tag => dataset.tags.includes(tag))
        )
      }

      return datasets
    } catch (error) {
      console.error('Error fetching datasets:', error)
      throw error
    }
  }

  // Get all available tags
  const fetchAllTags = async (): Promise<Tag[]> => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tags:', error)
      throw error
    }
  }

  // Like a dataset
  const likeDataset = async (datasetId: string) => {
    if (!user.value) throw new Error('User must be authenticated to like datasets')

    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          dataset_id: datasetId,
          user_id: user.value.id
        })

      if (error) throw error
    } catch (error) {
      console.error('Error liking dataset:', error)
      throw error
    }
  }

  // Unlike a dataset
  const unlikeDataset = async (datasetId: string) => {
    if (!user.value) throw new Error('User must be authenticated to unlike datasets')

    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('dataset_id', datasetId)
        .eq('user_id', user.value.id)

      if (error) throw error
    } catch (error) {
      console.error('Error unliking dataset:', error)
      throw error
    }
  }

  // Check if user has liked a dataset
  const checkIfLiked = async (datasetId: string): Promise<boolean> => {
    if (!user.value) return false

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('dataset_id')
        .eq('dataset_id', datasetId)
        .eq('user_id', user.value.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      console.error('Error checking like status:', error)
      return false
    }
  }

  // Get user's liked datasets
  const getUserLikes = async (): Promise<string[]> => {
    if (!user.value) return []

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('dataset_id')
        .eq('user_id', user.value.id)

      if (error) throw error
      return data?.map(like => like.dataset_id) || []
    } catch (error) {
      console.error('Error fetching user likes:', error)
      return []
    }
  }

  // Create a new dataset
  const createDataset = async (dataset: Omit<Dataset, 'id' | 'created_at'>) => {
    if (!user.value) throw new Error('User must be authenticated to create datasets')

    try {
      const { data, error } = await supabase
        .from('datasets')
        .insert({
          ...dataset,
          owner_id: user.value.id
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating dataset:', error)
      throw error
    }
  }

  // Add tags to a dataset
  const addTagsToDataset = async (datasetId: string, tagNames: string[]) => {
    try {
      // First, ensure all tags exist
      const tagPromises = tagNames.map(async (tagName) => {
        // Try to find existing tag
        let { data: existingTag } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single()

        if (!existingTag) {
          // Create new tag if it doesn't exist
          const { data: newTag, error } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select('id')
            .single()

          if (error) throw error
          existingTag = newTag
        }

        return existingTag.id
      })

      const tagIds = await Promise.all(tagPromises)

      // Insert dataset-tag relationships
      const datasetTagsData = tagIds.map(tagId => ({
        dataset_id: datasetId,
        tag_id: tagId
      }))

      const { error } = await supabase
        .from('dataset_tags')
        .insert(datasetTagsData)

      if (error) throw error
    } catch (error) {
      console.error('Error adding tags to dataset:', error)
      throw error
    }
  }

  return {
    fetchDatasetsWithDetails,
    fetchAllTags,
    likeDataset,
    unlikeDataset,
    checkIfLiked,
    getUserLikes,
    createDataset,
    addTagsToDataset
  }
}
