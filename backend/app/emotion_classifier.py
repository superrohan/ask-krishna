import re
from typing import Optional, List

class EmotionClassifier:
    def __init__(self):
        self.emotion_keywords = {
            "sadness": ["sad", "depressed", "grief", "sorrow", "crying", "tears", "lost", "lonely", "hopeless"],
            "anger": ["angry", "furious", "rage", "hate", "annoyed", "frustrated", "mad", "irritated"],
            "fear": ["afraid", "scared", "anxious", "worry", "panic", "nervous", "terrified", "phobia"],
            "confusion": ["confused", "lost", "don't understand", "puzzled", "unclear", "bewildered"],
            "guilt": ["guilty", "shame", "regret", "sorry", "fault", "blame", "remorse"],
            "love": ["love", "affection", "care", "devotion", "heart", "romance", "relationship"],
            "stress": ["stressed", "overwhelmed", "pressure", "burden", "exhausted", "tired"],
            "doubt": ["doubt", "uncertain", "question", "unsure", "skeptical", "hesitant"],
            "joy": ["happy", "joyful", "excited", "celebration", "grateful", "blessed", "content"]
        }
        
        self.emotion_verse_mapping = {
            "sadness": ["karma", "dharma", "acceptance", "purpose"],
            "anger": ["peace", "self-control", "forgiveness", "detachment"],
            "fear": ["courage", "faith", "surrender", "divine_protection"],
            "confusion": ["wisdom", "guidance", "clarity", "purpose"],
            "guilt": ["forgiveness", "karma", "acceptance", "dharma"],
            "love": ["devotion", "bhakti", "divine_love", "compassion"],
            "stress": ["peace", "detachment", "surrender", "meditation"],
            "doubt": ["faith", "wisdom", "surrender", "divine_guidance"],
            "joy": ["gratitude", "devotion", "celebration", "divine_joy"]
        }
    
    def detect_emotion(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        emotion_scores = {}
        
        for emotion, keywords in self.emotion_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                emotion_scores[emotion] = score
        
        if emotion_scores:
            return max(emotion_scores.items(), key=lambda x: x[1])[0]
        return None
    
    def get_relevant_themes(self, emotion: str) -> List[str]:
        return self.emotion_verse_mapping.get(emotion, ["wisdom", "guidance"])