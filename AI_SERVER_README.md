# Python AI Server Integration

This guide explains how to set up and use the Python AI server with your Vindio chat interface.

## 🚀 Quick Start

### 1. Install Python Dependencies

```bash
pip install fastapi uvicorn python-multipart
```

### 2. Start the Python Server

```bash
# Option 1: Using Python directly
python python_ai_server.py

# Option 2: Using uvicorn (recommended)
uvicorn python_ai_server:app --host 127.0.0.1 --port 8000 --reload

# Option 3: For network access (other devices on your network)
uvicorn python_ai_server:app --host 0.0.0.0 --port 5000 --reload
```

### 3. Configure Frontend

Edit `utils/python-ai-config.js` to match your Python server:

```javascript
export const PYTHON_AI_CONFIG = {
  host: '127.0.0.1',     // Your Python server IP
  port: '5000',          // Your Python server port
  // ... rest of config
}
```

### 4. Test the Integration

1. Start your Nuxt frontend: `npm run dev`
2. Navigate to `/ai-chat`
3. Send a message to test the connection

## 🔧 Configuration Options

### Server Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `host` | `127.0.0.1` | Server IP address |
| `port` | `8000` | Server port |
| `timeout` | `30000` | Request timeout (ms) |

### Network Access

For access from other devices on your network:

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update config: `host: '192.168.1.XXX'` (your actual IP)
3. Start server: `uvicorn python_ai_server:app --host 0.0.0.0 --port 8000`

## 📡 API Endpoints

### POST `/chat`
Send a chat message to the AI.

**Request:**
```json
{
  "message": "Hello AI!",
  "user_id": "user123",
  "session_id": "session_456",
  "timestamp": "2025-09-06T15:30:00Z"
}
```

**Response:**
```json
{
  "response": "Hello! How can I help you?",
  "timestamp": "2025-09-06T15:30:01Z",
  "session_id": "session_456"
}
```

### POST `/reset`
Reset the chat session.

**Request:**
```json
{
  "user_id": "user123",
  "session_id": "session_456"
}
```

### GET `/health`
Check server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-06T15:30:00Z",
  "active_sessions": 3
}
```

## 🤖 Integrating Your AI Model

Replace the `generate_ai_response()` function in `python_ai_server.py` with your AI model:

### Option 1: OpenAI GPT
```python
import openai

def generate_ai_response(user_message: str, chat_history: list) -> str:
    client = openai.OpenAI(api_key="your-api-key")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": user_message}]
    )
    return response.choices[0].message.content
```

### Option 2: Local LLM (Ollama)
```python
import requests

def generate_ai_response(user_message: str, chat_history: list) -> str:
    response = requests.post('http://localhost:11434/api/generate', json={
        'model': 'llama2',
        'prompt': user_message,
        'stream': False
    })
    return response.json()['response']
```

### Option 3: Hugging Face Transformers
```python
from transformers import pipeline

# Initialize once
chatbot = pipeline("conversational", model="microsoft/DialoGPT-medium")

def generate_ai_response(user_message: str, chat_history: list) -> str:
    response = chatbot(user_message)
    return response.generated_responses[-1]
```

## 🛠 Troubleshooting

### Connection Issues

1. **"Cannot connect to Python server"**
   - Check if Python server is running: `curl http://127.0.0.1:8000/health`
   - Verify host/port in `python-ai-config.js`
   - Check firewall settings

2. **"CORS Error"**
   - Add your frontend URL to `allow_origins` in `python_ai_server.py`
   - Restart the Python server

3. **"Request timeout"**
   - Increase timeout in `python-ai-config.js`
   - Optimize AI model response time

### Server Issues

1. **Port already in use**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   # Kill the process
   kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   # Use a different port
   uvicorn python_ai_server:app --port 8001
   ```

## 📊 Monitoring

Check server logs for debugging:
- Request/response timing
- Error messages
- Session management
- AI model performance

## 🔐 Security Notes

- The demo server is for development only
- Add authentication for production
- Use HTTPS in production
- Validate and sanitize all inputs
- Implement rate limiting

## 🚀 Production Deployment

For production, consider:
- Docker containers
- Reverse proxy (nginx)
- Load balancing
- Database for chat history
- Authentication middleware
- Monitoring and logging
