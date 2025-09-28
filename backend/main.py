import os
import logging
from datetime import datetime
from pathlib import Path
import PyPDF2
import json
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Simple imports - avoiding LlamaIndex issues
import openai
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss

# Load environment variables
load_dotenv(override=True)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Ask Krishna - Simple RAG",
    description="AI-powered Krishna advisor",
    version="2.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    query: str
    language: str = "english"
    mode: str = "default"

class StudyRequest(BaseModel):
    chapter: Optional[int] = None
    verse: Optional[str] = None
    theme: Optional[str] = None
    language: str = "english"

class ChatResponse(BaseModel):
    krishna_response: str
    verses_referenced: list
    timestamp: str
    query: str
    detected_emotion: Optional[str] = None

class StudyResponse(BaseModel):
    answer: str
    verses_referenced: list
    query_type: str
    timestamp: str

class SimpleKrishnaRAG:
    def __init__(self):
        self.chunks = []
        self.embeddings = None
        self.index = None
        self.model = None
        self.setup_system()
    
    def setup_system(self):
        """Initialize the simple RAG system"""
        try:
            print("🕉️ Initializing Krishna AI Advisor...")
            
            # Setup embedding model
            api_key = os.getenv("OPENAI_API_KEY")
            if api_key:
                print("🔑 Using OpenAI embeddings")
                self.client = openai.OpenAI(api_key=api_key)
                self.use_openai = True
            else:
                print("🔑 Using local sentence transformers (free)")
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                self.use_openai = False
            
            # Process PDF and create index
            self.process_pdf()
            self.create_index()
            
            print("✅ Krishna AI ready to serve divine wisdom!")
            
        except Exception as e:
            print(f"❌ Setup error: {e}")
            logger.error(f"Setup error: {e}")
            raise
    
    def process_pdf(self):
        """Extract and chunk text from PDF"""
        try:
            # Check for PDF
            data_path = Path("data")
            if not data_path.exists():
                data_path.mkdir()
                raise FileNotFoundError("📁 Please create a 'data' folder and add your bhagavad_gita.pdf")
            
            pdf_files = list(data_path.glob("*.pdf"))
            if not pdf_files:
                raise FileNotFoundError("📄 No PDF found in data/ folder")
            
            pdf_path = pdf_files[0]
            print(f"📖 Processing: {pdf_path.name}")
            
            # Extract text from PDF
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            
            print(f"📊 Extracted {len(text):,} characters")
            
            # Simple chunking - split by paragraphs and sentences
            self.chunks = self.chunk_text(text)
            print(f"📝 Created {len(self.chunks)} text chunks")
            
        except Exception as e:
            print(f"❌ PDF processing error: {e}")
            raise
    
    def chunk_text(self, text: str, chunk_size: int = 1000) -> List[str]:
        """Simple text chunking"""
        # Split by double newlines first (paragraphs)
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = ""
        
        for para in paragraphs:
            if len(current_chunk) + len(para) < chunk_size:
                current_chunk += para + "\n\n"
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = para + "\n\n"
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        # Filter out very short chunks
        chunks = [chunk for chunk in chunks if len(chunk) > 100]
        return chunks
    
    def get_embeddings(self, texts: List[str]) -> np.ndarray:
        """Get embeddings for texts"""
        if self.use_openai:
            try:
                response = self.client.embeddings.create(
                    input=texts,
                    model="text-embedding-3-small"
                )
                return np.array([item.embedding for item in response.data])
            except Exception as e:
                print(f"OpenAI embedding error: {e}, falling back to local")
                if not self.model:
                    self.model = SentenceTransformer('all-MiniLM-L6-v2')
                return self.model.encode(texts)
        else:
            return self.model.encode(texts)
    
    def create_index(self):
        """Create FAISS index for similarity search"""
        try:
            print("🔄 Creating search index...")
            
            # Generate embeddings
            embeddings = self.get_embeddings(self.chunks)
            
            # Create FAISS index
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
            self.index.add(embeddings.astype('float32'))
            
            print(f"✅ Index created with {len(self.chunks)} chunks")
            
        except Exception as e:
            print(f"❌ Index creation error: {e}")
            raise
    
    def search_similar_chunks(self, query: str, k: int = 3) -> List[str]:
        """Find most similar text chunks"""
        try:
            query_embedding = self.get_embeddings([query])
            distances, indices = self.index.search(query_embedding.astype('float32'), k)
            
            results = []
            for idx in indices[0]:
                if idx < len(self.chunks):
                    results.append(self.chunks[idx])
            
            return results
            
        except Exception as e:
            print(f"Search error: {e}")
            return []
    
    def generate_krishna_response(self, query: str, context_chunks: List[str], mode: str = "default") -> str:
        """Generate Krishna-style response"""
        try:
            # Combine context
            context = "\n\n".join(context_chunks[:2])  # Use top 2 chunks
            
            # Create Krishna persona prompt
            if mode == "emotion":
                persona = "You are Lord Krishna, providing compassionate spiritual guidance to someone in emotional distress."
            elif mode == "study":
                persona = "You are Lord Krishna, teaching the profound wisdom of the Bhagavad Gita."
            else:
                persona = "You are Lord Krishna, offering divine wisdom and guidance from the Bhagavad Gita."
            
            prompt = f"""
            {persona}

            Guidelines:
            1. Speak as Krishna would - with wisdom, compassion, and divine authority
            2. Reference specific chapters/verses when you can identify them
            3. Apply ancient wisdom to modern situations
            4. Be encouraging and spiritually uplifting
            5. Address the seeker respectfully (Dear soul, Beloved devotee, O seeker)
            6. End with a blessing or encouragement

            Context from Bhagavad Gita:
            {context}

            Seeker's question: {query}

            Krishna's response:
            """
            
            if self.use_openai:
                # Use OpenAI for response generation
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=500,
                    temperature=0.7
                )
                return response.choices[0].message.content
            else:
                # Simple fallback without OpenAI
                return f"""Dear soul, based on the wisdom of the Bhagavad Gita, I offer this guidance:

The sacred texts teach us that in times of stress, we must remember our dharma and act without attachment to results. As I taught Arjuna, perform your duties with dedication but do not be bound by the outcomes.

When work becomes a source of suffering, examine whether you are acting from ego or from duty. True peace comes when we align our actions with our higher purpose.

May divine wisdom guide your path, beloved seeker. Remember that all challenges are opportunities for spiritual growth."""
                
        except Exception as e:
            print(f"Response generation error: {e}")
            return "Dear soul, I am having difficulty accessing the divine wisdom at this moment. Please try again, and remember that the answers you seek often lie within your own heart, guided by dharma."
    
    def detect_emotion(self, text: str) -> Optional[str]:
        """Simple emotion detection"""
        emotions = {
            "sadness": ["sad", "depressed", "sorrow", "grief", "crying", "lost"],
            "anger": ["angry", "mad", "furious", "rage", "frustrated"],
            "fear": ["afraid", "scared", "worry", "anxious", "panic"],
            "confusion": ["confused", "lost", "unclear", "don't understand"],
            "stress": ["stressed", "overwhelmed", "pressure", "exhausted"]
        }
        
        text_lower = text.lower()
        for emotion, keywords in emotions.items():
            if any(keyword in text_lower for keyword in keywords):
                return emotion
        return None
    
    def extract_verses(self, text: str) -> List[str]:
        """Extract verse references from text - improved version"""
        import re
        verses = []
        
        # More specific patterns to avoid false matches
        patterns = [
            r'Chapter\s+(\d{1,2}),?\s+Verse\s+(\d{1,2})\b',  # "Chapter X, Verse Y"
            r'Gita\s+(\d{1,2})\.(\d{1,2})\b',                # "Gita X.Y"
            r'BG\s+(\d{1,2})\.(\d{1,2})\b'                   # "BG X.Y"
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                chapter, verse = int(match[0]), int(match[1])
                # Only include valid chapter/verse combinations
                if 1 <= chapter <= 18 and 1 <= verse <= 78:  # Max verses per chapter varies
                    verses.append(f"Chapter {chapter}, Verse {verse}")
        
        # If no valid verses found, return generic reference
        if not verses:
            verses = ["Bhagavad Gita Wisdom"]
        
        return list(set(verses))[:3]  # Limit to 3 references

# Initialize the RAG system
try:
    krishna_rag = SimpleKrishnaRAG()
except Exception as e:
    print(f"Failed to initialize Krishna RAG: {e}")
    krishna_rag = None

@app.get("/")
async def root():
    return {
        "message": "🕉️ Welcome to Ask Krishna - Simple RAG Version",
        "version": "2.1.0",
        "status": "Divine wisdom is ready" if krishna_rag else "Initializing..."
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if krishna_rag else "initializing",
        "chunks_loaded": len(krishna_rag.chunks) if krishna_rag else 0,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/ask", response_model=ChatResponse)
async def ask_krishna(request: ChatRequest):
    """Ask Krishna for guidance"""
    try:
        if not krishna_rag:
            raise HTTPException(status_code=503, detail="Krishna is still initializing")
            
        # Find relevant context
        context_chunks = krishna_rag.search_similar_chunks(request.query)
        
        # Detect emotion if in emotion mode
        detected_emotion = None
        if request.mode == "emotion":
            detected_emotion = krishna_rag.detect_emotion(request.query)
        
        # Generate response
        response = krishna_rag.generate_krishna_response(
            request.query, 
            context_chunks, 
            request.mode
        )
        
        # Extract verse references
        verses_referenced = krishna_rag.extract_verses(response + " ".join(context_chunks))
        
        return ChatResponse(
            krishna_response=response,
            verses_referenced=verses_referenced,
            timestamp=datetime.now().isoformat(),
            query=request.query,
            detected_emotion=detected_emotion
        )
        
    except Exception as e:
        logger.error(f"Error in ask_krishna: {e}")
        # Return graceful fallback
        return ChatResponse(
            krishna_response="Dear soul, I am having some difficulty at the moment. Please try again, and remember that the divine guidance you seek is always within your heart.",
            verses_referenced=[],
            timestamp=datetime.now().isoformat(),
            query=request.query,
            detected_emotion=None
        )

@app.post("/study", response_model=StudyResponse)
async def study_mode(request: StudyRequest):
    """Study Gita topics"""
    try:
        if not krishna_rag:
            raise HTTPException(status_code=503, detail="Krishna is still initializing")
            
        # Build study query
        if request.chapter:
            study_query = f"Chapter {request.chapter} Bhagavad Gita teachings"
            query_type = f"Chapter {request.chapter}"
        elif request.verse:
            study_query = f"Verse {request.verse} Bhagavad Gita explanation"
            query_type = f"Verse {request.verse}"
        elif request.theme:
            study_query = f"{request.theme} Bhagavad Gita wisdom"
            query_type = f"Theme: {request.theme}"
        else:
            raise HTTPException(status_code=400, detail="Please specify chapter, verse, or theme")
        
        # Get relevant context
        context_chunks = krishna_rag.search_similar_chunks(study_query)
        
        # Generate study response
        response = krishna_rag.generate_krishna_response(study_query, context_chunks, "study")
        
        # Extract verses
        verses_referenced = krishna_rag.extract_verses(response)
        
        return StudyResponse(
            answer=response,
            verses_referenced=verses_referenced,
            query_type=query_type,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in study_mode: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)