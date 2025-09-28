import json
import os
from typing import List, Optional
from models import Verse

class GitaDatabase:
    def __init__(self, data_path: str = "data/bhagavad_gita.json"):
        self.data_path = data_path
        self.verses = []
        self.load_data()
    
    def load_data(self):
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.verses = [Verse(**verse) for verse in data]
        except FileNotFoundError:
            print(f"Data file not found: {self.data_path}")
            self.verses = []
    
    def get_all_verses(self) -> List[Verse]:
        return self.verses
    
    def get_verse_by_reference(self, chapter: int, verse_number: int) -> Optional[Verse]:
        for verse in self.verses:
            if verse.chapter == chapter and verse.verse_number == verse_number:
                return verse
        return None
    
    def get_verses_by_chapter(self, chapter: int) -> List[Verse]:
        return [v for v in self.verses if v.chapter == chapter]
    
    def get_verses_by_theme(self, theme: str) -> List[Verse]:
        theme_lower = theme.lower()
        return [v for v in self.verses if any(theme_lower in t.lower() for t in v.themes)]
    
    def search_verses(self, query: str) -> List[Verse]:
        query_lower = query.lower()
        results = []
        for verse in self.verses:
            if (query_lower in verse.english.lower() or 
                query_lower in verse.hindi.lower() or
                any(query_lower in theme.lower() for theme in verse.themes)):
                results.append(verse)
        return results