export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { query } = body

    if (!query || typeof query !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Query is required and must be a string'
      })
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Mock AI responses based on keywords
    const responses = getResponseByKeyword(query.toLowerCase())
    
    const response = {
      answer: responses[Math.floor(Math.random() * responses.length)],
      context: [], // Could include relevant sources/documents
      timestamp: new Date().toISOString()
    }

    return response

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})

function getResponseByKeyword(query) {
  // Simple keyword-based responses
  if (query.includes('help') || query.includes('support')) {
    return [
      "I'm here to help! What specific question do you have about Vindio AI Software?",
      "I'd be happy to assist you. Could you provide more details about what you need help with?",
      "I'm your AI assistant, ready to help with any questions about our platform."
    ]
  }
  
  if (query.includes('vindio') || query.includes('software') || query.includes('platform')) {
    return [
      "Vindio AI Software is a comprehensive platform designed to streamline your workflow with AI-powered tools.",
      "Our platform offers advanced AI capabilities to help you manage projects, tasks, and collaborate more effectively.",
      "Vindio combines powerful AI technology with intuitive design to enhance your productivity."
    ]
  }
  
  if (query.includes('feature') || query.includes('what can') || query.includes('capabilities')) {
    return [
      "Vindio offers project management, task tracking, AI-powered insights, team collaboration, and much more!",
      "Our key features include smart project planning, automated task prioritization, real-time collaboration, and AI-driven analytics.",
      "You can manage projects, track tasks, collaborate with your team, and get AI-powered recommendations to optimize your workflow."
    ]
  }
  
  if (query.includes('how to') || query.includes('tutorial') || query.includes('guide')) {
    return [
      "I can guide you through using our platform. What specific feature would you like to learn about?",
      "Let me help you get started! Are you looking for help with projects, tasks, or team collaboration?",
      "I'd be happy to provide step-by-step guidance. What would you like to learn how to do?"
    ]
  }

  if (query.includes('price') || query.includes('cost') || query.includes('subscription')) {
    return [
      "For pricing information, please visit our pricing page or contact our sales team for custom enterprise solutions.",
      "We offer flexible pricing plans to suit different needs. You can find detailed pricing on our website.",
      "Our pricing is designed to scale with your team. Contact us for a personalized quote based on your requirements."
    ]
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return [
      "Hello! I'm your Vindio AI assistant. How can I help you today?",
      "Hi there! Welcome to Vindio. What would you like to know about our platform?",
      "Hey! I'm here to help you with any questions about Vindio AI Software."
    ]
  }

  // Default responses
  return [
    "That's an interesting question! Let me help you with that. Could you provide a bit more context?",
    "I understand what you're asking. Here's what I can tell you about that topic...",
    "Great question! Based on what you're asking, I'd recommend exploring our documentation or contacting our support team for detailed assistance.",
    "I'd be happy to help you with that. Can you tell me more about what you're trying to accomplish?",
    "Thanks for your question! While I may not have the exact answer, I can help you find the right resources or connect you with our support team."
  ]
}
