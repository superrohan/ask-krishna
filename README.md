# Ask Krishna 🕉️

> *"Whenever dharma declines and the purpose of life is forgotten, I manifest myself on earth."* - Bhagavad Gita 4.7

Ask Krishna is an AI-powered spiritual guide that brings the timeless wisdom of the Bhagavad Gita to modern life. Just as Krishna guided Arjuna through his moment of crisis, this application helps you navigate life's challenges with divine wisdom through advanced RAG (Retrieval-Augmented Generation) technology.

## ✨ Features

- **🧠 Emotion-Aware AI**: Detects emotional context and provides relevant spiritual guidance
- **📚 Study Mode**: Explore verses by chapter, verse number, or theme
- **🌐 Multilingual Support**: Available in English, Hindi, and Sanskrit
- **🎯 Contextual Wisdom**: Receives relevant Gita verses with detailed explanations
- **🤖 Advanced RAG**: Uses vector embeddings and semantic search for accurate responses
- **📱 Responsive Design**: Beautiful, modern UI built with Next.js and Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **OpenAI GPT**: For generating Krishna-style responses
- **FAISS**: Vector database for semantic search
- **Sentence Transformers**: Local embeddings (fallback option)
- **PyPDF2**: PDF processing for Bhagavad Gita text
- **LlamaIndex**: RAG framework for document processing

### Frontend
- **Next.js 14**: React framework with SSR/SSG capabilities
- **React 18**: Component-based UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API communication

### AI/ML Features
- **Vector Embeddings**: Text-to-vector conversion for semantic similarity
- **Semantic Search**: Find relevant verses based on query context
- **Emotion Detection**: Simple keyword-based emotion classification
- **Response Generation**: GPT-powered Krishna persona responses

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **OpenAI API Key** (optional, will fallback to local models)

### 1. Clone the Repository
```bash
git clone https://github.com/superrohan/ask-krishna.git
cd ask-krishna
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
OPENAI_API_KEY=your_openai_api_key_here  # Optional
ALLOWED_ORIGINS=http://localhost:3000
```

#### Add Bhagavad Gita PDF
```bash
# Create data directory and add your Bhagavad Gita PDF
mkdir data
# Place your bhagavad_gita.pdf in the data/ folder
```

#### Run Backend Server
```bash
# Development server
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production deployment
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Run Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
ask-krishna/
├── backend/
│   ├── main.py              # Simple RAG implementation (primary)
│   ├── app/                 # Alternative structured implementation
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py        # Pydantic models
│   │   ├── database.py      # Data management
│   │   ├── embeddings.py    # Vector embeddings
│   │   ├── emotion_classifier.py # Emotion detection
│   │   └── utils.py         # Helper functions
│   ├── requirements.txt     # Python dependencies
│   ├── data/               # PDF documents (add your Gita PDF here)
│   ├── storage/            # Vector store and embeddings cache
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.js    # Main application page
│   │   │   └── _app.js     # Next.js app configuration
│   │   ├── components/     # React components
│   │   ├── utils/
│   │   │   └── api.js      # API client functions
│   │   └── styles/         # CSS styles
│   ├── package.json        # Node.js dependencies
│   └── next.config.js      # Next.js configuration
└── README.md
```

## 🔧 API Endpoints

### Chat with Krishna
```http
POST /ask
Content-Type: application/json

{
  "query": "How do I deal with stress at work?",
  "language": "english",
  "mode": "emotion"
}
```

### Study Mode
```http
POST /study
Content-Type: application/json

{
  "chapter": 2,
  "verse": "47",
  "theme": "karma",
  "language": "english"
}
```

### Health Check
```http
GET /health
```

## 💡 Usage Examples

### Ask for Life Guidance
```
Query: "I'm feeling overwhelmed with work responsibilities"
Response: Krishna's wisdom about dharma, duty, and detachment from results
```

### Study Specific Verses
```
Query: Chapter 2, Verse 47
Response: Detailed explanation of "You have the right to perform actions, but not to the fruits"
```

### Explore Themes
```
Query: Theme - "karma yoga"
Response: Collection of verses and teachings about the path of action
```

## 🌟 Key Features Explained

### Emotion-Aware Responses
The system detects emotional keywords in queries and adapts responses accordingly:
- **Sadness**: Comfort and hope from spiritual teachings
- **Anger**: Guidance on self-control and peace
- **Fear**: Courage and divine protection
- **Confusion**: Clarity and decision-making wisdom
- **Stress**: Peace and detachment practices

### RAG Implementation
The application uses a sophisticated RAG pipeline:
1. **Document Processing**: PDF text extraction and chunking
2. **Vector Embeddings**: Convert text to numerical representations
3. **Semantic Search**: Find most relevant content using FAISS
4. **Response Generation**: GPT-powered Krishna persona responses
5. **Context Integration**: Combine search results with AI generation

### Fallback Mechanisms
- **No OpenAI Key**: Falls back to local Sentence Transformers
- **API Errors**: Graceful degradation with helpful messages
- **PDF Missing**: Clear setup instructions
- **No Matches**: Generic wisdom responses

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
```bash
# Procfile is included for easy deployment
web: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the application
npm run build

# The build output will be in .next/ directory
```

### Environment Variables for Production
```bash
# Backend
OPENAI_API_KEY=your_production_api_key
ALLOWED_ORIGINS=https://your-frontend-domain.com

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🤝 Contributing

We welcome contributions to make Ask Krishna even better!

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript/React code
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Spiritual Disclaimer

This application is a technological tool designed to make the wisdom of the Bhagavad Gita more accessible. While it provides guidance based on sacred texts, it should complement, not replace, traditional spiritual study, meditation, and guidance from qualified teachers. The responses are generated by AI and should be considered as one perspective on the infinite wisdom of the Gita.

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
- Check if Python 3.8+ is installed
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Ensure PDF is placed in `backend/data/` folder

#### Frontend API connection errors
- Verify backend is running on port 8000
- Check CORS settings in backend
- Confirm `NEXT_PUBLIC_API_URL` in frontend environment

#### No responses or poor quality
- Add OpenAI API key for better responses
- Check if PDF contains proper Bhagavad Gita text
- Verify embeddings are being generated

### Getting Help
- Check the [Issues](https://github.com/superrohan/ask-krishna/issues) page
- Create a new issue with detailed error information
- Include logs and environment details

## 📊 Performance Notes

- **Initial Startup**: May take 30-60 seconds to process PDF and create embeddings
- **Response Time**: 2-5 seconds per query (varies with API speed)
- **Memory Usage**: ~200MB for embeddings and models
- **Scaling**: Supports concurrent users with proper deployment

## 🔄 Future Enhancements

- [ ] **Mobile App**: React Native implementation
- [ ] **Voice Interface**: Speech-to-text and text-to-speech
- [ ] **Multi-language Models**: Native Hindi/Sanskrit processing
- [ ] **Advanced Analytics**: User interaction insights
- [ ] **Offline Mode**: Local-only operation
- [ ] **Expanded Texts**: Other sacred Hindu scriptures

---

*Made with 🙏 for spiritual seekers everywhere*

**"The mind is everything. What you think you become."** - Lord Krishna