/**
 * Composable for calculating and formatting time differences
 * Takes a timestamp in milliseconds and returns a human-readable time ago string
 */
export const useTimeAgo = () => {
  const formatTimeAgo = (timestamp) => {
    const now = Date.now()
    const diffMs = now - timestamp
    
    // Convert to different time units
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))
    const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))
    
    // Return appropriate format based on time difference
    if (diffYears > 0) {
      return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`
    } else if (diffMonths > 0) {
      return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`
    } else if (diffWeeks > 0) {
      return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`
    } else if (diffDays > 0) {
      if (diffDays === 1) {
        return '1 day ago'
      } else if (diffDays < 7) {
        return `${diffDays} days ago`
      }
    } else if (diffHours > 0) {
      if (diffHours === 1) {
        return '1 hour ago'
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`
      }
    } else if (diffMinutes > 0) {
      if (diffMinutes === 1) {
        return '1 minute ago'
      } else if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`
      }
    } else {
      return 'just now'
    }
    
    // Fallback (shouldn't reach here with proper logic above)
    return 'some time ago'
  }

  /**
   * More detailed format that shows days and hours together when appropriate
   */
  const formatDetailedTimeAgo = (timestamp) => {
    const now = Date.now()
    const diffMs = now - timestamp
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays > 0) {
      const remainingHours = diffHours % 24
      if (diffDays === 1 && remainingHours > 0) {
        return `1 day ${remainingHours}h ago`
      } else if (diffDays < 7 && remainingHours > 0) {
        return `${diffDays} days ${remainingHours}h ago`
      } else if (diffDays === 1) {
        return '1 day ago'
      } else {
        return `${diffDays} days ago`
      }
    } else if (diffHours > 0) {
      const remainingMinutes = diffMinutes % 60
      if (diffHours === 1 && remainingMinutes > 0) {
        return `1 hour ${remainingMinutes}m ago`
      } else if (diffHours < 24 && remainingMinutes > 0) {
        return `${diffHours} hours ${remainingMinutes}m ago`
      } else if (diffHours === 1) {
        return '1 hour ago'
      } else {
        return `${diffHours} hours ago`
      }
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`
    } else {
      return 'just now'
    }
  }

  return {
    formatTimeAgo,
    formatDetailedTimeAgo
  }
}
