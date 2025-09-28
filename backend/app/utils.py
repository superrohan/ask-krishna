import random
from typing import List
from models import Verse, LanguageEnum

class KrishnaResponseGenerator:
    def __init__(self):
        self.greeting_phrases = [
            "Dear soul,", "Beloved devotee,", "O seeker of truth,", 
            "My child,", "Noble one,", "Dear friend,"
        ]
        
        self.wisdom_connectors = [
            "In the Gita, I teach that", "Remember, as I told Arjuna,",
            "The eternal wisdom reveals that", "Consider this divine truth:",
            "Let me share this sacred knowledge:", "As I explained to Arjuna,"
        ]
        
        self.closing_phrases = [
            "May this wisdom guide your path.",
            "Walk in dharma and find peace.",
            "Trust in the divine plan, dear one.",
            "Let go of attachment and find freedom.",
            "Surrender your worries to the divine.",
            "May you find clarity in your journey."
        ]
    
    def generate_response(self, query: str, verse: Verse, detected_emotion: str = None, language: LanguageEnum = LanguageEnum.english) -> str:
        greeting = random.choice(self.greeting_phrases)
        connector = random.choice(self.wisdom_connectors)
        closing = random.choice(self.closing_phrases)
        
        # Get verse text based on language
        verse_text = self.get_verse_text(verse, language)
        
        # Emotion-specific responses
        emotion_context = ""
        if detected_emotion:
            emotion_responses = {
                "sadness": "I understand your sorrow. Remember that joy and sorrow are temporary states.",
                "anger": "Your anger shows your passion, but let it not cloud your judgment.",
                "fear": "Fear arises from attachment. Trust in the divine protection that surrounds you.",
                "confusion": "In moments of doubt, seek the wisdom that lies within your heart.",
                "guilt": "Past actions cannot be changed, but your present choices shape your future.",
                "stress": "When overwhelmed, remember that you need only focus on your dharma.",
                "doubt": "Doubt is natural, but faith in the divine truth will guide you forward."
            }
            emotion_context = emotion_responses.get(detected_emotion, "")
        
        response = f"{greeting} {emotion_context} {connector} {verse_text} {closing}"
        return response
    
    def get_verse_text(self, verse: Verse, language: LanguageEnum) -> str:
        if language == LanguageEnum.hindi:
            return verse.hindi
        elif language == LanguageEnum.sanskrit:
            return verse.sanskrit
        else:
            return verse.english
    
    def get_reference_string(self, verse: Verse) -> str:
        return f"Bhagavad Gita {verse.chapter}.{verse.verse_number}"