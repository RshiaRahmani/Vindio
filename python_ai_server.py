"""
Sample Python AI Chat Server for Vindio
This is a basic FastAPI server that can handle chat requests from the Nuxt frontend.

Requirements:
pip install fastapi uvicorn python-multipart

Run with:
python python_ai_server.py

Or manually with uvicorn:
uvicorn python_ai_server:app --host 127.0.0.1 --port 3000 --reload

The server will run on port 3000 to match the frontend configuration.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Optional
import datetime
import json

app = FastAPI(title="Vindio AI Chat Server", version="1.0.0")

# Enable CORS for your Nuxt frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Add middleware to handle all OPTIONS requests
@app.middleware("http")
async def cors_handler(request: Request, call_next):
    if request.method == "OPTIONS":
        response = JSONResponse({"status": "ok"})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response
    response = await call_next(request)
    return response

# Request/Response models
class ChatRequest(BaseModel):
    message: Optional[str] = None
    query: Optional[str] = None  # Support both 'message' and 'query' parameters
    user_id: Optional[str] = "anonymous"
    session_id: Optional[str] = None
    timestamp: Optional[str] = None
    
    @property
    def text(self):
        """Get the message text from either 'message' or 'query' field"""
        return self.message or self.query or ""

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    session_id: str

class ResetRequest(BaseModel):
    user_id: Optional[str] = "anonymous"
    session_id: Optional[str] = None
    timestamp: Optional[str] = None

# Simple in-memory storage for chat sessions
chat_sessions: Dict[str, list] = {}

@app.get("/")
async def root():
    return {
        "message": "Vindio AI Chat Server is running!",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/chat",
            "reset": "/reset", 
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "active_sessions": len(chat_sessions)
    }

@app.post("/ask", response_model=ChatResponse)
async def ask(request: ChatRequest):
    try:
        # Get message text from either 'message' or 'query' field
        message_text = request.text
        if not message_text:
            raise HTTPException(status_code=400, detail="No message or query provided")
            
        session_id = request.session_id or f"session_{datetime.datetime.now().timestamp()}"
        
        # Initialize session if it doesn't exist
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []
        
        # Add user message to session history
        chat_sessions[session_id].append({
            "role": "user",
            "message": message_text,
            "timestamp": request.timestamp or datetime.datetime.now().isoformat()
        })
        
        # Simple AI response logic (replace with your AI model)
        ai_response = generate_ai_response(message_text, chat_sessions[session_id])
        
        # Add AI response to session history
        response_timestamp = datetime.datetime.now().isoformat()
        chat_sessions[session_id].append({
            "role": "assistant", 
            "message": ai_response,
            "timestamp": response_timestamp
        })
        
        # Return response in the format expected by the frontend
        return {
            "answer": ai_response,  # Use 'answer' key as expected by frontend
            "response": ai_response,  # Also include 'response' for compatibility
            "timestamp": response_timestamp,
            "session_id": session_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")

# Keep the old /chat endpoint for backward compatibility
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    return await ask(request)

@app.post("/reset")
async def reset_chat(request: Optional[ResetRequest] = None):
    try:
        session_id = request.session_id if request else f"session_{datetime.datetime.now().timestamp()}"
        
        # Clear the session
        if session_id in chat_sessions:
            del chat_sessions[session_id]
        
        return {
            "message": "Chat session reset successfully",
            "session_id": session_id,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset error: {str(e)}")

def generate_ai_response(user_message: str, chat_history: list) -> str:
    """
    Simple AI response generator. Replace this with your actual AI model.
    This could be:
    - OpenAI GPT API calls
    - Local LLM like Ollama
    - Hugging Face transformers
    - Custom ML model
    """
    
    # Convert to lowercase for simple pattern matching
    message_lower = user_message.lower()
    
    # Simple rule-based responses (replace with your AI logic)
    if any(word in message_lower for word in ['hello', 'hi', 'hey']):
        return "Hello! I'm your Vindio AI assistant. How can I help you today?"
    
    elif any(word in message_lower for word in ['help', 'support']):
        return "I'm here to help! You can ask me about Vindio's features, datasets, or any technical questions."
    
    elif any(word in message_lower for word in ['dataset', 'data']):
        return "Vindio offers high-quality machine learning datasets. You can browse our datasets page to find what you need, or upload your own datasets to share with the community."
    
    elif any(word in message_lower for word in ['weather', 'time']):
        return f"I can help with Vindio-related questions. For real-time information like weather or time, you might want to check dedicated services. Current server time is: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    
    elif 'thank' in message_lower:
        return "You're welcome! Is there anything else I can help you with?"
    
    elif any(word in message_lower for word in ['bye', 'goodbye', 'exit']):
        return "Goodbye! Feel free to come back anytime if you have more questions."
    
    else:
        # Generic response with context awareness
        return f"I understand you're asking about: '{user_message}'. While I'm a simple demo AI, I'm designed to help with Vindio platform questions. Could you tell me more about what specific information you're looking for?"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
