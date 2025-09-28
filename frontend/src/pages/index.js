import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import StudyMode from '../components/StudyMode';
import { MessageCircle, BookOpen, Info, Wifi, WifiOff, Feather } from 'lucide-react';
import { healthCheck } from '../utils/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [apiStatus, setApiStatus] = useState('unknown');

  useEffect(() => {
    // Check API health on component mount
    const checkApiHealth = async () => {
      try {
        await healthCheck();
        setApiStatus('healthy');
      } catch (error) {
        setApiStatus('error');
      }
    };

    checkApiHealth();
  }, []);

  const tabs = [
    { id: 'chat', label: 'Chat with Krishna', icon: MessageCircle },
    { id: 'study', label: 'Study Mode', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <>
      <Head>
        <title>Ask Krishna - Divine Wisdom from Bhagavad Gita</title>
        <meta name="description" content="Get life guidance from Lord Krishna using teachings from the Bhagavad Gita. Emotion-aware AI chatbot with multilingual support." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <Header />
        
        {/* API Status Indicator */}
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-end">
            <div className={`flex items-center space-x-2 text-xs px-3 py-1 rounded-full ${
              apiStatus === 'healthy' ? 'bg-green-100 text-green-700' :
              apiStatus === 'error' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {apiStatus === 'healthy' ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span>API Connected</span>
                </>
              ) : apiStatus === 'error' ? (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span>API Disconnected</span>
                </>
              ) : (
                <span>Checking connection...</span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-md p-1 flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-900 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'chat' && (
              <div className="h-[70vh]">
                <ChatInterface />
              </div>
            )}
            
            {activeTab === 'study' && <StudyMode />}
            
            {activeTab === 'about' && (
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                  About Ask Krishna
                </h2>
                
                <div className="prose prose-lg max-w-none space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">🕉️</span>
                    </div>
                    <p className="text-xl text-gray-600 italic">
                      "Whenever dharma declines and the purpose of life is forgotten, I manifest myself on earth."
                    </p>
                    <p className="text-sm text-gray-500">- Bhagavad Gita 4.7</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">🎯 Purpose</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Ask Krishna is an AI-powered spiritual guide that brings the timeless wisdom of the Bhagavad Gita 
                        to modern life. Just as Krishna guided Arjuna through his moment of crisis, this application 
                        helps you navigate life's challenges with divine wisdom.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">💝 Features</h3>
                      <ul className="text-gray-600 space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400">•</span>
                          <span><strong>Emotion-Aware Responses:</strong> AI detects your emotional state and provides relevant guidance</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400">•</span>
                          <span><strong>Study Mode:</strong> Explore verses by chapter, verse number, or theme</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400">•</span>
                          <span><strong>Multilingual Support:</strong> Available in English, Hindi, and Sanskrit</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400">•</span>
                          <span><strong>Contextual Wisdom:</strong> Receives relevant Gita verses with explanations</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-900/5 to-yellow-400/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">🔬 How It Works</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h4 className="font-semibold mb-1">Ask Your Question</h4>
                        <p>Share your life questions, concerns, or seek spiritual guidance</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h4 className="font-semibold mb-1">AI Analysis</h4>
                        <p>Advanced AI analyzes your query and emotional context using RAG technology</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h4 className="font-semibold mb-1">Divine Response</h4>
                        <p>Receive Krishna's guidance with relevant Gita verses and explanations</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">🙏 Spiritual Disclaimer</h3>
                    <p className="text-gray-600 leading-relaxed italic">
                      This application is a technological tool designed to make the wisdom of the Bhagavad Gita more accessible. 
                      While it provides guidance based on sacred texts, it should complement, not replace, traditional spiritual 
                      study, meditation, and guidance from qualified teachers. The responses are generated by AI and should be 
                      considered as one perspective on the infinite wisdom of the Gita.
                    </p>
                  </div>
                  
                  <div className="text-center bg-blue-900/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">🛠️ Technology Stack</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="font-semibold text-blue-900">Backend</div>
                        <div className="text-gray-600">FastAPI + Python</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="font-semibold text-blue-900">Frontend</div>
                        <div className="text-gray-600">Next.js + React</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="font-semibold text-blue-900">AI/ML</div>
                        <div className="text-gray-600">RAG + Embeddings</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="font-semibold text-blue-900">Database</div>
                        <div className="text-gray-600">FAISS Vector DB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-blue-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Feather className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold">Ask Krishna</span>
            </div>
            <p className="text-blue-200 text-sm mb-2">
              Bringing ancient wisdom to modern life through technology
            </p>
            <p className="text-xs text-blue-300">
              Made with 🙏 for spiritual seekers everywhere
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}