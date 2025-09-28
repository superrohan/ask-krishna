from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class ModeEnum(str, Enum):
    default = "default"
    emotion = "emotion"
    study = "study"

class LanguageEnum(str, Enum):
    english = "english"
    hindi = "hindi"
    sanskrit = "sanskrit"

# Frontend-compatible models (matches your existing frontend)
class ChatRequest(BaseModel):
    query: str
    language: LanguageEnum = LanguageEnum.english
    mode: ModeEnum = ModeEnum.default

class StudyRequest(BaseModel):
    chapter: Optional[int] = None
    verse: Optional[str] = None  # Format: "2.47"
    theme: Optional[str] = None
    language: LanguageEnum = LanguageEnum.english

class Verse(BaseModel):
    chapter: int
    verse_number: int
    sanskrit: str
    english: str
    hindi: str
    themes: List[str]
    emotions: List[str]

class ChatResponse(BaseModel):
    krishna_response: str
    verses_referenced: List[str]  # List of verse references
    timestamp: str
    query: str
    detected_emotion: Optional[str] = None

class StudyResponse(BaseModel):
    answer: str
    verses_referenced: List[str]
    query_type: str
    timestamp: str

# Internal models for LlamaIndex integration
class EmotionDetector:
    """Simple emotion detection for compatibility"""
    
    @staticmethod
    def detect_emotion(text: str) -> Optional[str]:
        emotion_keywords = {
            "sadness": ["sad", "depressed", "grief", "sorrow", "crying", "lost", "lonely"],
            "anger": ["angry", "furious", "rage", "hate", "annoyed", "frustrated", "mad"],
            "fear": ["afraid", "scared", "anxious", "worry", "panic", "nervous"],
            "confusion": ["confused", "lost", "don't understand", "unclear", "bewildered"],
            "guilt": ["guilty", "shame", "regret", "sorry", "fault"],
            "love": ["love", "care", "devotion", "heart", "compassion"],
            "stress": ["stressed", "overwhelmed", "pressure", "burden", "exhausted"],
            "doubt": ["doubt", "uncertain", "question", "unsure", "skeptical"],
            "joy": ["happy", "joyful", "excited", "grateful", "blessed", "content"]
        }
        
        text_lower = text.lower()
        emotion_scores = {}
        
        for emotion, keywords in emotion_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                emotion_scores[emotion] = score
        
        if emotion_scores:
            return max(emotion_scores.items(), key=lambda x: x[1])[0]
        return None