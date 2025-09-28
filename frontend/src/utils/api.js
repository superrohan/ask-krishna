import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const askKrishna = async (query, language = 'english', mode = 'default') => {
  try {
    const response = await api.post('/ask', {
      query,
      language,
      mode,
    });
    
    // Transform response to match frontend expectations
    const data = response.data;
    return {
      krishna_response: data.krishna_response,
      verse: {
        english: data.krishna_response.substring(0, 200) + '...',
        sanskrit: "Sanskrit available in full response",
        hindi: "Hindi available in full response",
        themes: extractThemes(data.krishna_response),
        emotions: mode === 'emotion' ? [data.detected_emotion].filter(Boolean) : [],
        chapter: extractChapter(data.verses_referenced),
        verse_number: extractVerseNumber(data.verses_referenced)
      },
      reference: data.verses_referenced.join(', ') || 'Bhagavad Gita Wisdom',
      detected_emotion: data.detected_emotion,
      language: language
    };
  } catch (error) {
    console.error('Error asking Krishna:', error);
    throw error;
  }
};

export const studyGita = async (params) => {
  try {
    const response = await api.post('/study', params);
    const data = response.data;
    
    return {
      verses: [{
        chapter: extractChapter(data.verses_referenced),
        verse_number: extractVerseNumber(data.verses_referenced),
        english: data.answer,
        sanskrit: "Available in Krishna's response",
        hindi: "Available in Krishna's response",
        themes: extractThemes(data.answer),
        emotions: []
      }],
      total_found: 1,
      query_type: data.query_type,
      language: params.language || 'english'
    };
  } catch (error) {
    console.error('Error in study mode:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

// Helper functions
function extractThemes(response) {
  const themes = [];
  const themeKeywords = {
    'karma_yoga': ['karma', 'action', 'duty'],
    'dharma': ['dharma', 'righteousness'],
    'bhakti': ['devotion', 'surrender', 'love'],
    'wisdom': ['wisdom', 'knowledge'],
    'peace': ['peace', 'tranquil', 'calm']
  };
  
  const lowerResponse = response.toLowerCase();
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(keyword => lowerResponse.includes(keyword))) {
      themes.push(theme);
    }
  }
  
  return themes.length > 0 ? themes : ['wisdom'];
}

function extractChapter(versesReferenced) {
  if (!versesReferenced || versesReferenced.length === 0) return 2;
  const match = versesReferenced[0].match(/Chapter\s*(\d+)/i);
  return match ? parseInt(match[1]) : 2;
}

function extractVerseNumber(versesReferenced) {
  if (!versesReferenced || versesReferenced.length === 0) return 47;
  const match = versesReferenced[0].match(/Verse\s*(\d+)/i);
  return match ? parseInt(match[1]) : 47;
}

export default api;