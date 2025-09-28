import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Tuple
import openai
from dotenv import load_dotenv

load_dotenv()

class EmbeddingManager:
    def __init__(self, use_openai: bool = False):
        self.use_openai = use_openai
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        
        if use_openai and self.openai_api_key:
            openai.api_key = self.openai_api_key
            self.model_name = "text-embedding-3-small"
        else:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.model_name = "all-MiniLM-L6-v2"
        
        self.dimension = 1536 if use_openai else 384
        self.index = faiss.IndexFlatL2(self.dimension)
        self.verse_texts = []
        self.verse_metadata = []
    
    def get_embeddings(self, texts: List[str]) -> np.ndarray:
        if self.use_openai and self.openai_api_key:
            try:
                response = openai.embeddings.create(
                    input=texts,
                    model=self.model_name
                )
                embeddings = np.array([item.embedding for item in response.data])
                return embeddings
            except Exception as e:
                print(f"OpenAI embedding failed, falling back to local model: {e}")
                if not hasattr(self, 'model'):
                    self.model = SentenceTransformer('all-MiniLM-L6-v2')
                    self.dimension = 384
                return self.model.encode(texts)
        else:
            return self.model.encode(texts)
    
    def add_verses(self, verses: List[dict]):
        texts = []
        for verse in verses:
            # Combine English and themes for better semantic search
            combined_text = f"{verse['english']} {' '.join(verse['themes'])}"
            texts.append(combined_text)
            self.verse_texts.append(combined_text)
            self.verse_metadata.append(verse)
        
        embeddings = self.get_embeddings(texts)
        self.index.add(embeddings.astype('float32'))
    
    def search(self, query: str, k: int = 3, emotion_themes: List[str] = None) -> List[Tuple[dict, float]]:
        # If emotion themes provided, modify query to include them
        if emotion_themes:
            enhanced_query = f"{query} {' '.join(emotion_themes)}"
        else:
            enhanced_query = query
        
        query_embedding = self.get_embeddings([enhanced_query])
        distances, indices = self.index.search(query_embedding.astype('float32'), k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.verse_metadata):
                results.append((self.verse_metadata[idx], float(distances[0][i])))
        
        return results
    
    def save_index(self, filepath: str):
        faiss.write_index(self.index, filepath)
    
    def load_index(self, filepath: str):
        self.index = faiss.read_index(filepath)