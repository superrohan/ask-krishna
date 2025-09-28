import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Heart, BookOpen, Globe } from 'lucide-react';
import { askKrishna } from '../utils/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      type: 'krishna',
      content: "🙏 Namaste! I am Krishna, here to guide you with wisdom from the Bhagavad Gita. Share your questions about life, dharma, or any challenges you face, and I shall offer divine guidance.",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('default');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askKrishna(inputMessage, selectedLanguage, selectedMode);
      
      const krishnaMessage = {
        type: 'krishna',
        content: response.krishna_response,
        verse: response.verse,
        reference: response.reference,
        detected_emotion: response.detected_emotion,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, krishnaMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: "I apologize, but I'm having trouble connecting to the divine wisdom at the moment. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'emotion': return <Heart className="w-4 h-4" />;
      case 'study': return <BookOpen className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getLanguageDisplay = (lang) => {
    const languages = {
      english: 'English',
      hindi: 'हिंदी',
      sanskrit: 'संस्कृत'
    };
    return languages[lang] || 'English';
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Controls */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 text-white">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Mode:</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            >
              <option value="default" className="text-black bg-white">Default</option>
              <option value="emotion" className="text-black bg-white">Emotion-based</option>
              <option value="study" className="text-black bg-white">Study Mode</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="english" className="text-black">English</option>
              <option value="hindi" className="text-black">हिंदी</option>
              <option value="sanskrit" className="text-black">संस्कृत</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50 to-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-900 text-white'
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-white text-gray-800 shadow-md border border-yellow-400/20'
              }`}
            >
              {message.type === 'krishna' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🕉️</span>
                  </div>
                  <span className="font-semibold text-blue-900">Krishna</span>
                  {message.detected_emotion && (
                    <span className="text-xs bg-yellow-400/20 text-blue-900 px-2 py-1 rounded-full">
                      {message.detected_emotion}
                    </span>
                  )}
                </div>
              )}
              
              <p className={`${message.type === 'krishna' ? 'leading-relaxed' : ''} ${
                selectedLanguage === 'sanskrit' ? 'font-sanskrit text-lg' : 
                selectedLanguage === 'hindi' ? 'font-hindi' : ''
              }`}>
                {message.content}
              </p>
              
              {message.verse && (
                <div className="mt-4 p-3 bg-blue-900/5 rounded-lg border-l-4 border-yellow-400">
                  <div className="text-xs text-blue-900 font-semibold mb-1">
                    {message.reference}
                  </div>
                  <div className={`text-sm italic ${
                    selectedLanguage === 'sanskrit' ? 'font-sanskrit text-base' : 
                    selectedLanguage === 'hindi' ? 'font-hindi' : ''
                  }`}>
                    {selectedLanguage === 'hindi' ? message.verse.hindi :
                     selectedLanguage === 'sanskrit' ? message.verse.sanskrit :
                     message.verse.english}
                  </div>
                  {message.verse.themes && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.verse.themes.map((theme, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-900/10 text-blue-900 px-2 py-1 rounded-full"
                        >
                          {theme.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2" suppressHydrationWarning={true}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white shadow-md border border-yellow-400/20 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🕉️</span>
                </div>
                <span className="font-semibold text-blue-900">Krishna</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
                <span className="text-gray-600 text-sm">Consulting the divine wisdom...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(e);
              }
            }}
            placeholder="Ask Krishna about life, dharma, or seek guidance..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Send</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {getModeIcon(selectedMode)}
              <span>{selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Mode</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>{getLanguageDisplay(selectedLanguage)}</span>
            </div>
          </div>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;