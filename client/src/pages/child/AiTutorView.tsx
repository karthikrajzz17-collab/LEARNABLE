import React, { useState, useEffect, useRef } from 'react';
import { Send, Volume2, Sparkles, Mic, MicOff, RotateCcw, Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { MascotBuddy } from '../../components/MascotBuddy';

interface Message {
  id: string;
  sender: 'child' | 'buddy';
  text: string;
  timestamp: string;
}

interface AiTutorViewProps {
  onNavigate: (view: string) => void;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({ onNavigate }) => {
  const { child } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'buddy',
      text: `Hi ${child ? child.displayName.split(' ')[0] : 'friend'}! 🌟 I'm LearnAble Buddy, your cheerful learning sidekick! Whenever you need a gentle clue, a calm breath, or a high five, ask me anytime!`,
      timestamp: '10:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    sounds.playClick();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'child',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          childId: child?.id || 'c-1',
          lessonTitle: 'Friendly Phonics & Safari Math',
          activityQuestion: 'Interactive Learning'
        })
      });
      const data = await res.json();
      
      const buddyReply = data.reply || "You are doing great! Let's keep exploring step by step!";
      
      setMessages(prev => [
        ...prev,
        {
          id: `msg-buddy-${Date.now()}`,
          sender: 'buddy',
          text: buddyReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      setIsThinking(false);
      sounds.playSuccess();
      speech.speak(buddyReply);
    } catch {
      setIsThinking(false);
      const fallbackReply = "I'm right here with you! You are doing amazing work, and every try makes your brain stronger!";
      setMessages(prev => [
        ...prev,
        {
          id: `msg-fallback-${Date.now()}`,
          sender: 'buddy',
          text: fallbackReply,
          timestamp: 'Just now'
        }
      ]);
      speech.speak(fallbackReply);
    }
  };

  // Web Speech Recognition support
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
                              (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      speech.speak("Voice recognition is not supported in this browser. You can type or tap the quick buttons!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-4 flex flex-col h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('child-home');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <MascotBuddy mood={isThinking ? 'thinking' : 'happy'} size="sm" showAudioButton={false} />
          <div>
            <h1 className="text-lg font-black text-slate-900 m-0">LearnAble Buddy</h1>
            <p className="text-[11px] font-semibold text-emerald-600 m-0 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online & Ready to Help
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setMessages([
              {
                id: 'm-reset',
                sender: 'buddy',
                text: "Fresh adventure started! What can we explore together?",
                timestamp: 'Just now'
              }
            ]);
          }}
          className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50"
          title="Restart Chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white/70 backdrop-blur-xs rounded-3xl border border-slate-200/80 shadow-inner">
        {messages.map((m) => {
          const isBuddy = m.sender === 'buddy';
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2.5 ${isBuddy ? 'justify-start' : 'justify-end'}`}
            >
              {isBuddy && (
                <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-lg flex-shrink-0 shadow-2xs">
                  🦉
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-3xl text-sm sm:text-base font-semibold leading-relaxed shadow-2xs relative group ${
                  isBuddy
                    ? 'bg-amber-50 text-slate-900 border-2 border-amber-200 rounded-bl-xs'
                    : 'bg-indigo-600 text-white rounded-br-xs'
                }`}
              >
                <p className="m-0">{m.text}</p>
                <div className="mt-1 flex items-center justify-between gap-2 text-[10px] opacity-70">
                  <span>{m.timestamp}</span>
                  {isBuddy && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        speech.speak(m.text);
                      }}
                      className="text-amber-800 hover:text-amber-950 p-0.5 rounded"
                      title="Read out loud"
                      aria-label="Listen to message"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {!isBuddy && (
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg flex-shrink-0 shadow-2xs">
                  {child?.avatar || '🦊'}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold p-2 bg-amber-50/70 rounded-2xl w-fit">
            <span className="text-lg animate-spin">🌟</span>
            <span>Buddy is thinking of a joyful clue...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Child Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {[
          'Can you give me a hint? 🧩',
          'Explain this simpler 🎈',
          'Cheer me up! 🌟',
          'How to do Balloon Breathing? 🧘'
        ].map((promptText) => (
          <button
            key={promptText}
            onClick={() => handleSendMessage(promptText)}
            className="flex-shrink-0 px-3.5 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Buddy anything..."
              className="w-full px-5 py-3.5 bg-white border-2 border-indigo-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>

          <button
            type="button"
            onClick={handleToggleVoiceInput}
            title={isListening ? 'Listening...' : 'Speak with your microphone'}
            className={`p-3.5 rounded-2xl border transition-all active:scale-95 ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-600" />}
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="p-3.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};
