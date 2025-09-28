import React from 'react';
import { Feather, Book, Heart } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <Feather className="w-8 h-8 text-yellow-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
              Ask Krishna
            </h1>
            <p className="text-sm text-blue-200 font-sanskrit">
              Divine Wisdom from the Bhagavad Gita
            </p>
          </div>
          <Book className="w-6 h-6 text-yellow-400" />
        </div>
        
        <div className="flex justify-center mt-4 space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-red-300" />
            <span>Emotion-Aware</span>
          </div>
          <div className="flex items-center space-x-1">
            <Book className="w-4 h-4 text-green-300" />
            <span>Study Mode</span>
          </div>
          <div className="flex items-center space-x-1">
            <Feather className="w-4 h-4 text-yellow-300" />
            <span>Multilingual</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;