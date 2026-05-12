import { ArrowLeft, MessageCircle, Search, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import logo from '../../../../../assets/synkspace-logo.png';
import { useApp } from '../context/AppContext';

function initials(name = 'U') {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ conversation, size = 'h-11 w-11' }) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/60 bg-[#a3e4c7] text-sm font-black text-[#4c7569] shadow-sm`}>
      {conversation?.avatarUrl ? (
        <img src={conversation.avatarUrl} alt={conversation.name} className="h-full w-full object-cover" />
      ) : (
        initials(conversation?.name)
      )}
    </div>
  );
}

export function MessagesPage() {
  const {
    conversations = [],
    addMessage,
    markRead,
    activeConversationId,
    setActiveConversationId,
  } = useApp();
  const [localActiveId, setLocalActiveId] = useState(activeConversationId || null);
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const messagesEndRef = useRef(null);

  const filteredConversations = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return conversations;
    return conversations.filter((conversation) =>
      [conversation.name, conversation.subtitle]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search)
    );
  }, [conversations, query]);

  const activeId = activeConversationId || localActiveId || null;
  const activeConv = conversations.find((conversation) => conversation.id === activeId);

  useEffect(() => {
    if (activeConversationId) setLocalActiveId(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    if (activeId && activeConv?.unread > 0) {
      markRead(activeId);
    }
  }, [activeId, activeConv?.unread, markRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeConv?.messages?.length, activeId]);

  const selectConversation = (id) => {
    setLocalActiveId(id);
    setActiveConversationId?.(id);
    setSendError('');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    setSendError('');
    try {
      await addMessage(activeId, text);
      setInput('');
    } catch (error) {
      setSendError(error?.message || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden p-4 sm:p-6 font-sans text-slate-800">
      <header className="flex shrink-0 items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight">Messages</h1>
          <p className="text-white/75 text-sm">Communicate with creators and campaign partners</p>
        </div>
        <div className="hidden items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-white shadow-sm backdrop-blur-xl sm:flex">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90">
            <img src={logo} alt="SynkSpace" className="h-8 w-8 object-contain" />
          </span>
          <span className="font-black">SynkSpace</span>
        </div>
      </header>

      <section className="grid min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/60 bg-white/75 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:grid-cols-[320px_1fr]">
        <aside className={`${activeConv ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-r border-white/60 bg-white/35`}>
          <div className="shrink-0 border-b border-white/50 p-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search messages..."
                className="w-full rounded-2xl border border-white/60 bg-white/70 py-3 pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#6f8e97]/25"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={`flex w-full items-center gap-3 border-b border-white/40 p-4 text-left transition ${
                  activeId === conversation.id ? 'bg-white/75' : 'hover:bg-white/45'
                }`}
              >
                <Avatar conversation={conversation} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-black text-slate-900">{conversation.name}</span>
                    <span className="shrink-0 text-[11px] font-semibold text-slate-500">{conversation.time}</span>
                  </span>
                  <span className="mt-1 block truncate text-xs font-semibold text-slate-500">
                    {conversation.messages?.at(-1)?.text || conversation.subtitle || 'Start the conversation'}
                  </span>
                </span>
                {conversation.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6f8e97] px-1 text-[10px] font-black text-white">
                    {conversation.unread > 9 ? '9+' : conversation.unread}
                  </span>
                )}
              </button>
            ))}
            {!filteredConversations.length && (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center text-sm font-semibold text-slate-500">
                <MessageCircle className="mb-3 h-8 w-8 text-slate-400" />
                No conversations yet.
              </div>
            )}
          </div>
        </aside>

        <main className={`${activeConv ? 'flex' : 'hidden md:flex'} min-h-0 flex-col bg-white/25`}>
          {activeConv ? (
            <>
              <div className="flex shrink-0 items-center gap-3 border-b border-white/60 bg-white/45 px-4 py-3">
                <button
                  onClick={() => {
                    setLocalActiveId(null);
                    setActiveConversationId?.(null);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-slate-700 shadow-sm md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar conversation={activeConv} />
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-950">{activeConv.name}</p>
                  <p className="truncate text-xs font-semibold text-slate-500">{activeConv.subtitle || 'Conversation'}</p>
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                {activeConv.messages?.length ? activeConv.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm lg:max-w-[680px] ${
                        message.isMine
                          ? 'bg-[#6f8e97] text-white'
                          : 'border border-white/60 bg-white/80 text-slate-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.text}</p>
                      <p className={`mt-1 text-[10px] font-semibold ${message.isMine ? 'text-white/70' : 'text-slate-400'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-sm font-semibold text-slate-500">
                    <MessageCircle className="mb-3 h-10 w-10 text-slate-400" />
                    Start a new message with {activeConv.name}.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0 border-t border-white/60 bg-white/45 p-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="max-h-28 min-h-[48px] flex-1 resize-none rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#6f8e97]/25"
                    placeholder="Type your message..."
                  />
                  <button
                    disabled={sending || !input.trim()}
                    onClick={handleSend}
                    className="flex h-12 items-center gap-2 rounded-2xl bg-[#6f8e97] px-5 font-black text-white shadow-md transition hover:bg-[#5A7684] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
                {sendError && <p className="mt-2 text-xs font-bold text-red-600">{sendError}</p>}
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-sm font-semibold text-slate-500">
              <MessageCircle className="mb-3 h-10 w-10 text-slate-400" />
              Select a conversation or message a creator from Discover.
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
