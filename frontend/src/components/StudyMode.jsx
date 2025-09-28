import React, { useState } from 'react';
import { Search, Book, BookOpen, Hash, Tag, Loader2 } from 'lucide-react';
import { studyGita } from '../utils/api';

const StudyMode = () => {
  const [studyResults, setStudyResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [searchParams, setSearchParams] = useState({
    chapter: '',
    verse: '',
    theme: ''
  });

  const handleSearch = async (searchType) => {
    setIsLoading(true);
    try {
      let params = { language: selectedLanguage };
      
      if (searchType === 'chapter' && searchParams.chapter) {
        params.chapter = parseInt(searchParams.chapter);
      } else if (searchType === 'verse' && searchParams.verse) {
        params.verse = searchParams.verse;
      } else if (searchType === 'theme' && searchParams.theme) {
        params.theme = searchParams.theme;
      }

      const response = await studyGita(params);
      setStudyResults(response);
    } catch (error) {
      console.error('Study search error:', error);
      setStudyResults({
        verses: [],
        total_found: 0,
        query_type: 'Error',
        error: 'Failed to search. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const popularThemes = [
    'karma_yoga', 'bhakti', 'dharma', 'meditation', 'detachment', 
    'divine_love', 'wisdom', 'surrender', 'peace', 'duty'
  ];

  const getVerseText = (verse) => {
    switch (selectedLanguage) {
      case 'hindi': return verse.hindi;
      case 'sanskrit': return verse.sanskrit;
      default: return verse.english;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-bold text-blue-900">Study the Bhagavad Gita</h2>
        </div>
        
        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="english">English</option>
            <option value="hindi">हिंदी</option>
            <option value="sanskrit">संस्कृत</option>
          </select>
        </div>

        {/* Search Options */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Chapter Search */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Hash className="w-5 h-5 text-blue-900" />
              <h3 className="font-semibold text-gray-800">By Chapter</h3>
            </div>
            <div className="space-y-2">
              <input
                type="number"
                min="1"
                max="18"
                placeholder="Chapter (1-18)"
                value={searchParams.chapter}
                onChange={(e) => setSearchParams(prev => ({ ...prev, chapter: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                onClick={() => handleSearch('chapter')}
                disabled={!searchParams.chapter || isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white py-2 rounded transition-colors duration-200"
              >
                Search Chapter
              </button>
            </div>
          </div>

          {/* Verse Search */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Book className="w-5 h-5 text-blue-900" />
              <h3 className="font-semibold text-gray-800">By Verse</h3>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Verse (e.g., 2.47)"
                value={searchParams.verse}
                onChange={(e) => setSearchParams(prev => ({ ...prev, verse: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                onClick={() => handleSearch('verse')}
                disabled={!searchParams.verse || isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white py-2 rounded transition-colors duration-200"
              >
                Search Verse
              </button>
            </div>
          </div>

          {/* Theme Search */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-blue-900" />
              <h3 className="font-semibold text-gray-800">By Theme</h3>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Theme (e.g., karma yoga)"
                value={searchParams.theme}
                onChange={(e) => setSearchParams(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                onClick={() => handleSearch('theme')}
                disabled={!searchParams.theme || isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white py-2 rounded transition-colors duration-200"
              >
                Search Theme
              </button>
            </div>
          </div>
        </div>

        {/* Popular Themes */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Popular Themes:</h4>
          <div className="flex flex-wrap gap-2">
            {popularThemes.map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setSearchParams(prev => ({ ...prev, theme }));
                  handleSearch('theme');
                }}
                className="text-xs bg-blue-900/10 hover:bg-blue-900/20 text-blue-900 px-3 py-1 rounded-full transition-colors duration-200"
              >
                {theme.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-900" />
            <span className="text-gray-600">Searching the sacred texts...</span>
          </div>
        </div>
      )}

      {/* Results */}
      {studyResults && !isLoading && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-900">
              {studyResults.query_type}
            </h3>
            <span className="text-sm text-gray-600">
              {studyResults.total_found} verse(s) found
            </span>
          </div>

          {studyResults.error ? (
            <div className="text-red-600 text-center py-4">
              {studyResults.error}
            </div>
          ) : studyResults.verses.length > 0 ? (
            <div className="space-y-6">
              {studyResults.verses.map((verse, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {verse.chapter}.{verse.verse_number}
                        </span>
                      </div>
                      <span className="font-semibold text-blue-900">
                        Chapter {verse.chapter}, Verse {verse.verse_number}
                      </span>
                    </div>
                  </div>

                  <div className={`text-lg leading-relaxed mb-4 ${
                    selectedLanguage === 'sanskrit' ? 'font-sanskrit text-xl' : 
                    selectedLanguage === 'hindi' ? 'font-hindi' : ''
                  }`}>
                    {getVerseText(verse)}
                  </div>

                  {selectedLanguage !== 'english' && (
                    <div className="text-gray-600 italic mb-4 p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500 mb-1">English Translation:</div>
                      {verse.english}
                    </div>
                  )}

                  {verse.themes && verse.themes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-600">Themes:</span>
                      {verse.themes.map((theme, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-900/10 text-blue-900 px-2 py-1 rounded-full"
                        >
                          {theme.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {verse.emotions && verse.emotions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-medium text-gray-600">Emotions:</span>
                      {verse.emotions.map((emotion, i) => (
                        <span
                          key={i}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No verses found for your search. Try different keywords or browse by chapter.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyMode;