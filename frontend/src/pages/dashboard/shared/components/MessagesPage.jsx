import { Search, Send, Paperclip, MoreVertical, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState, useRef, useEffect } from 'react';

export function MessagesPage() {
  const { conversations, addMessage, markRead } = useApp();
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    if (activeId && activeConv?.unread > 0) {
      markRead(activeId);
    }
  }, [activeId, activeConv?.unread, markRead]);

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations]);

  const handleSend = async () => {
    if (input.trim() && activeId) {
      setSending(true);
      setSendError('');
      try {
        await addMessage(activeId, input.trim());
      } catch (error) {
        setSendError(error?.message || 'Could not send message.');
        setSending(false);
        return;
      }
      setInput('');
      setSending(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleBack = () => setActiveId(null);

  return (
    <div className="flex flex-col h-[calc(100dvh-60px)] lg:h-full p-3 sm:p-5 gap-3 sm:gap-4 overflow-hidden font-sans text-slate-800">

      <header className="shrink-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide leading-tight">Messages</h1>
        <p className="text-white/70 text-xs sm:text-sm">Communicate with your creators</p>
      </header>

      <div className="flex-1 min-h-0 bg-white/70 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] lg:rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex overflow-hidden">

        {/* LEFT PANEL */}
        <div className={`${activeId ? 'hidden' : 'flex'} md:flex w-full md:w-72 lg:w-80 border-r border-white/40 flex-col bg-white/20 shrink-0`}>
          
          <div className="p-3 sm:p-4 border-b border-white/40 shrink-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                placeholder="Search messages..."
                className="w-full bg-white/60 border border-white/50 rounded-xl pl-10 pr-3 py-2.5 text-slate-800 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.map((conv) => (
              <div key={conv.id} onClick={() => setActiveId(conv.id)}
                className={`p-3 sm:p-4 border-b border-white/20 cursor-pointer ${
                  activeId === conv.id ? 'bg-white/60 border-l-4 border-l-[#6f8e97]' : ''
                }`}
              >
                <h4 className="font-bold text-sm">{conv.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT */}
        <div className={`${activeId ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
          {activeConv ? (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {activeConv.messages.map((msg, i) => (
                  <div key={i} className={msg.isMine ? 'text-right' : ''}>
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t flex gap-2">
                <div className="flex-1">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Type your message..."
                  />
                  {sendError && <p className="text-xs font-semibold text-red-600 mt-2">{sendError}</p>}
                </div>
                <button disabled={sending || !input.trim()} onClick={handleSend} className="bg-[#6f8e97] text-white px-4 rounded disabled:opacity-50">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
