"""
Script to pre-generate embeddings and save FAISS index
Run this after setting up your data to improve startup time
"""

import os
from app.database import GitaDatabase
from app.embeddings import EmbeddingManager

def main():
    print("Loading Bhagavad Gita data...")
    db = GitaDatabase()
    verses = db.get_all_verses()
    
    if not verses:
        print("No verses found! Make sure data/bhagavad_gita.json exists.")
        return
    
    print(f"Found {len(verses)} verses")
    print("Initializing embedding manager...")
    
    embedding_manager = EmbeddingManager(use_openai=bool(os.getenv("OPENAI_API_KEY")))
    
    print("Generating embeddings...")
    verses_data = [verse.dict() for verse in verses]
    embedding_manager.add_verses(verses_data)
    
    print("Saving FAISS index...")
    embedding_manager.save_index("gita_embeddings.index")
    
    print("Setup complete! Embeddings saved to gita_embeddings.index")

if __name__ == "__main__":
    main()