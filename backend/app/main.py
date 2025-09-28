from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from dotenv import load_dotenv

from models import (
    ChatRequest, StudyRequest, ChatResponse, StudyResponse, 
    Verse, LanguageEnum, ModeEnum
)
from database import GitaDatabase
from embeddings import EmbeddingManager
from emotion_classifier import EmotionClassifier
from utils import KrishnaResponseGenerator

load_dotenv()

app = FastAPI(title="Ask Krishna API", version="1.0.0")

# CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
db = GitaDatabase()
embedding_manager = EmbeddingManager(use_openai=bool(os.getenv("OPENAI_API_KEY")))
emotion_classifier = EmotionClassifier()
response_generator = KrishnaResponseGenerator()

# Load verses into embedding manager
verses_data = [verse.dict() for verse in db.get_all_verses()]
if verses_data:
    embedding_manager.add_verses(verses_data)

@app.get("/")
async def root():
    return {"message": "Welcome to Ask Krishna API", "status": "active"}

@app.post("/ask", response_model=ChatResponse)
async def ask_krishna(request: ChatRequest):
    try:
        detected_emotion = None
        search_themes = None
        
        # Emotion detection and theme mapping
        if request.mode == ModeEnum.emotion:
            detected_emotion = emotion_classifier.detect_emotion(request.query)
            if detected_emotion:
                search_themes = emotion_classifier.get_relevant_themes(detected_emotion)
        
        # Search for relevant verses
        search_results = embedding_manager.search(
            request.query, 
            k=1, 
            emotion_themes=search_themes
        )
        
        if not search_results:
            raise HTTPException(status_code=404, detail="No relevant verses found")
        
        best_verse_data, similarity_score = search_results[0]
        verse = Verse(**best_verse_data)
        
        # Generate Krishna's response
        krishna_response = response_generator.generate_response(
            request.query, 
            verse, 
            detected_emotion, 
            request.language
        )
        
        return ChatResponse(
            krishna_response=krishna_response,
            verse=verse,
            reference=response_generator.get_reference_string(verse),
            detected_emotion=detected_emotion,
            language=request.language.value
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/study", response_model=StudyResponse)
async def study_mode(request: StudyRequest):
    try:
        verses = []
        query_type = ""
        
        if request.chapter and request.verse:
            # Parse verse format "2.47"
            verse_parts = request.verse.split(".")
            if len(verse_parts) == 2:
                chapter = int(verse_parts[0])
                verse_num = int(verse_parts[1])
                verse = db.get_verse_by_reference(chapter, verse_num)
                if verse:
                    verses = [verse]
                query_type = f"Specific verse {request.verse}"
        
        elif request.chapter:
            verses = db.get_verses_by_chapter(request.chapter)
            query_type = f"Chapter {request.chapter}"
        
        elif request.theme:
            verses = db.get_verses_by_theme(request.theme)
            query_type = f"Theme: {request.theme}"
        
        elif request.verse:
            # Handle verse format "2.47"
            verse_parts = request.verse.split(".")
            if len(verse_parts) == 2:
                chapter = int(verse_parts[0])
                verse_num = int(verse_parts[1])
                verse = db.get_verse_by_reference(chapter, verse_num)
                if verse:
                    verses = [verse]
                query_type = f"Verse {request.verse}"
        
        return StudyResponse(
            verses=verses,
            total_found=len(verses),
            query_type=query_type,
            language=request.language.value
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "total_verses": len(db.get_all_verses()),
        "embedding_model": embedding_manager.model_name
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)