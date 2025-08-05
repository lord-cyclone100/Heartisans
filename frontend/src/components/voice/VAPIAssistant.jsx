import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { FaMicrophone } from 'react-icons/fa';

const VAPIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [conversationMessages, setConversationMessages] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(''); // 'user' or 'assistant'
  const [error, setError] = useState('');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  const vapiRef = useRef(null);
  const volumeAnimationRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);

  // Initialize VAPI with better error handling and reconnection logic
  useEffect(() => {
    const initializeVAPI = () => {
      try {
        if (vapiRef.current) {
          vapiRef.current.stop();
        }

        vapiRef.current = new Vapi("da510ba8-a49a-42a1-b036-43a10c258275");
        
        // Event listeners with enhanced error handling
        vapiRef.current.on('call-start', () => {
          console.log('Call started');
          setIsConnected(true);
          setIsConnecting(false);
          setIsReconnecting(false);
          setReconnectAttempts(0);
          setError('');
          
          // Start heartbeat to monitor connection
          startHeartbeat();
        });

        vapiRef.current.on('call-end', () => {
          console.log('Call ended');
          setIsConnected(false);
          setIsConnecting(false);
          setIsReconnecting(false);
          setTranscript('');
          setConversationMessages([]);
          setCurrentSpeaker('');
          setVolume(0);
          
          // Clear heartbeat
          clearHeartbeat();
        });

        vapiRef.current.on('volume-level', (level) => {
          setVolume(level);
        });

        vapiRef.current.on('message', (message) => {
          console.log('VAPI Message:', message);
          
          if (message.type === 'transcript') {
            if (message.transcriptType === 'partial') {
              setTranscript(message.transcript);
              setCurrentSpeaker('user');
            } else if (message.transcriptType === 'final') {
              setConversationMessages(prev => [...prev, {
                type: 'user',
                text: message.transcript,
                timestamp: Date.now()
              }]);
              setTranscript('');
            }
          } else if (message.type === 'function-call') {
            setCurrentSpeaker('assistant');
            setTranscript('');
          } else if (message.type === 'speech-start') {
            setCurrentSpeaker('assistant');
            setTranscript('');
          } else if (message.type === 'speech-end') {
            setCurrentSpeaker('');
          } else if (message.type === 'assistant-response' || message.type === 'response') {
            // Handle assistant responses
            setConversationMessages(prev => [...prev, {
              type: 'assistant',
              text: message.content || message.text || message.transcript || 'Assistant responded',
              timestamp: Date.now()
            }]);
          } else if (message.type === 'conversation-update' && message.conversation) {
            // Handle conversation updates from VAPI
            const lastMessage = message.conversation[message.conversation.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              setConversationMessages(prev => [...prev, {
                type: 'assistant',
                text: lastMessage.content || lastMessage.text || 'Assistant responded',
                timestamp: Date.now()
              }]);
            }
          }
        });

        vapiRef.current.on('speech-start', () => {
          console.log('Assistant started speaking');
          setCurrentSpeaker('assistant');
        });

        vapiRef.current.on('speech-end', () => {
          console.log('Assistant stopped speaking');
          setCurrentSpeaker('');
        });

        vapiRef.current.on('error', (error) => {
          console.error('VAPI Error:', error);
          handleConnectionError(error);
        });

        // Handle connection issues
        vapiRef.current.on('disconnect', () => {
          console.log('VAPI disconnected');
          handleConnectionError('Connection lost');
        });

      } catch (err) {
        console.error('Failed to initialize VAPI:', err);
        setError('Failed to initialize voice assistant');
      }
    };

    initializeVAPI();

    return () => {
      clearHeartbeat();
      clearReconnectTimeout();
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  // Heartbeat to monitor connection health
  const startHeartbeat = () => {
    clearHeartbeat();
    heartbeatIntervalRef.current = setInterval(() => {
      if (isConnected && vapiRef.current) {
        // Check if connection is still alive
        try {
          // You can implement a ping mechanism here if VAPI supports it
          console.log('Heartbeat check');
        } catch (err) {
          console.error('Heartbeat failed:', err);
          handleConnectionError('Connection lost during heartbeat');
        }
      }
    }, 30000); // Check every 30 seconds
  };

  const clearHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  // Enhanced error handling with automatic reconnection
  const handleConnectionError = (error) => {
    const errorMessage = typeof error === 'string' ? error : error.message || 'Connection failed';
    console.error('Connection error:', errorMessage);
    
    setIsConnected(false);
    setIsConnecting(false);
    setCurrentSpeaker('');
    
    // Don't show error immediately, try to reconnect first
    if (reconnectAttempts < 3) {
      setIsReconnecting(true);
      setError(`Reconnecting... (${reconnectAttempts + 1}/3)`);
      
      clearReconnectTimeout();
      reconnectTimeoutRef.current = setTimeout(() => {
        attemptReconnect();
      }, 2000 * (reconnectAttempts + 1)); // Progressive delay
      
      setReconnectAttempts(prev => prev + 1);
    } else {
      setIsReconnecting(false);
      setError('Connection failed. Please try again.');
      setReconnectAttempts(0);
    }
  };

  // Attempt to reconnect
  const attemptReconnect = async () => {
    if (!vapiRef.current) return;
    
    try {
      console.log('Attempting to reconnect...');
      setIsConnecting(true);
      await vapiRef.current.start("3cb5663f-335e-4388-beb8-b18938f159e1");
    } catch (err) {
      console.error('Reconnection failed:', err);
      handleConnectionError(err);
    }
  };

  // Volume animation effect
  useEffect(() => {
    if (volume > 0) {
      volumeAnimationRef.current?.style.setProperty('--volume', volume);
    }
  }, [volume]);

  const startCall = async () => {
    if (!vapiRef.current) return;
    
    setIsConnecting(true);
    setError('');
    setReconnectAttempts(0);
    
    try {
      // Check microphone permissions first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      
      await vapiRef.current.start("3cb5663f-335e-4388-beb8-b18938f159e1");
    } catch (err) {
      console.error('Failed to start call:', err);
      
      if (err.name === 'NotAllowedError' || err.message.includes('permission')) {
        setError('Microphone permission denied. Please allow microphone access and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Failed to start voice chat. Please check your connection and try again.');
      }
      
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      clearHeartbeat();
      clearReconnectTimeout();
      vapiRef.current.stop();
    }
    setReconnectAttempts(0);
    setIsReconnecting(false);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (isConnected) {
      endCall();
    }
  };

  return (
    <>
      {/* Floating Trigger Button - matches VAPI design */}
      <div
        onClick={toggleWidget}
        className="fixed bottom-5 left-5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 cursor-pointer border border-gray-200"
        style={{ width: '120px', height: '48px' }}
      >
        <div className="flex items-center justify-between px-3 py-2 h-full">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ 
                background: 'conic-gradient(from 0deg, #22c55e, #16a34a, #15803d, #22c55e)',
                animation: 'spin 2s linear infinite'
              }}
            >
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-gray-800">TALK WITH AI</span>
          </div>
        </div>
      </div>

      {/* Floating Widget - positioned like VAPI */}
      {isOpen && (
        <div
          className="fixed bottom-20 left-5 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200"
          style={{ width: '320px', height: '500px' }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ 
                    background: 'conic-gradient(from 0deg, #22c55e, #16a34a, #15803d, #22c55e)',
                    animation: 'spin 2s linear infinite'
                  }}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">TALK WITH AI</h3>
                  <p className="text-xs text-gray-500">Click the microphone to start</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => window.location.reload()}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                </button>
                <button
                  onClick={toggleWidget}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-50 overflow-hidden">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 m-4">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              {!isConnected && !isConnecting && !error && (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="mb-4">
                    <div 
                      ref={volumeAnimationRef}
                      className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-600"
                      >
                        <path d="M12 1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2z"/>
                        <path d="M19 10v2c0 3.87-3.13 7-7 7s-7-3.13-7-7v-2"/>
                        <path d="M12 19v4"/>
                        <path d="M8 23h8"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">Click the microphone to start</p>
                </div>
              )}

              {isConnecting && (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-green-600"
                      >
                        <path d="M12 1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2z"/>
                        <path d="M19 10v2c0 3.87-3.13 7-7 7s-7-3.13-7-7v-2"/>
                        <path d="M12 19v4"/>
                        <path d="M8 23h8"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-green-600 font-medium text-sm">
                    {isReconnecting ? 'Reconnecting...' : 'Connecting...'}
                  </p>
                  {isReconnecting && (
                    <p className="text-xs text-gray-500 mt-1">
                      Attempt {reconnectAttempts}/3
                    </p>
                  )}
                </div>
              )}

              {isConnected && (
                <div className="h-full flex flex-col">
                  {/* Status indicator at top */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: currentSpeaker === 'assistant' ? '#ef4444' : 
                                         currentSpeaker === 'user' ? '#22c55e' : '#6b7280',
                          transform: `scale(${1 + (volume * 0.5)})`
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {currentSpeaker === 'assistant' ? 'Assistant Speaking' : 
                         currentSpeaker === 'user' ? 'Listening' : 'Ready'}
                      </span>
                    </div>
                  </div>

                  {/* Conversation area */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {conversationMessages.length === 0 && !transcript && currentSpeaker !== 'assistant' && (
                      <div className="text-center text-gray-500 text-sm mt-8">
                        Hello and welcome to Heartisans. I'm Harty, your friendly AI assistant. I can help you list your handcrafted products, suggest ideal pricing using SAP AI and craft engaging descriptions. Speak in Hindi, Tamil, English, or 13 other languages. I understand you, just tell me about your creation and I'll guide you step by step to bring it to life for your customers.
                      </div>
                    )}
                    
                    {conversationMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-3 p-3 rounded-lg max-w-[85%] ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white ml-auto rounded-br-sm' 
                            : 'bg-white border border-gray-200 text-gray-800 mr-auto rounded-bl-sm shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        {message.type === 'assistant' && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">Assistant</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Current transcript */}
                    {transcript && currentSpeaker === 'user' && (
                      <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 ml-auto max-w-[85%]">
                        <p className="text-sm text-blue-800 italic">"{transcript}"</p>
                      </div>
                    )}

                    {/* Assistant thinking/speaking indicator */}
                    {currentSpeaker === 'assistant' && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[85%]">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          </div>
                          <span className="text-sm text-gray-600">Assistant is responding...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Button - matches VAPI design exactly */}
            <div className="p-4 bg-white border-t border-gray-100">
              {!isConnected && !isConnecting ? (
                <button
                  onClick={startCall}
                  disabled={!!error}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  style={{ backgroundColor: '#479626' }}
                >
                  <FaMicrophone size={16} />
                  Start
                </button>
              ) : (
                <button
                  onClick={endCall}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                  {isConnecting ? 'Cancel' : 'End Call'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default VAPIAssistant;
