import { Search, Filter, MoreVertical, Send, Paperclip, Image as ImageIcon, Phone, Video, Pin, Archive, Trash2, Circle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../shared/context/AppContext';



export function MessagesScreen() {
  const app = useApp() || {};
  const dbChats = app.conversations || [];
  const normalizedDbChats = useMemo(() => dbChats.map((conversation) => {
    const messages = (conversation.messages || []).map((message) => ({
      id: message.id,
      sender: message.isMine ? 'me' : 'them',
      text: message.text,
      time: message.time,
      read: true,
    }));
    const lastMessage = messages.at(-1)?.text || 'No messages yet';
    const initials = String(conversation.name || 'Chat')
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return {
      id: conversation.id,
      name: conversation.name || 'Conversation',
      brand: conversation.name || 'Conversation',
      avatar: initials || 'C',
      lastMessage,
      time: conversation.time || '',
      unread: conversation.unread || 0,
      online: conversation.online || false,
      messages,
    };
  }), [dbChats]);

  const activeChats = normalizedDbChats;
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (!selectedChat && activeChats.length > 0) {
      setSelectedChat(activeChats[0].id);
    }
  }, [activeChats, selectedChat]);

  const filteredChats = activeChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChat = activeChats.find(chat => chat.id === selectedChat);

  const handleSendMessage = async () => {
    if (messageInput.trim() && activeChat) {
      const text = messageInput.trim();
      setSendError('');
      setSending(true);
      try {
        await app.addMessage?.(activeChat.id, text);
        setMessageInput('');
      } catch (error) {
        setSendError(error?.message || 'Could not send message.');
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-16rem)]">
      {/* Chat List Sidebar */}
      <div className="col-span-4 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>

        <div className="relative p-6 border-b border-white/30">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-md"
            />
          </div>

          <button className="w-full px-4 py-2 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold text-sm">
            <Filter className="w-4 h-4" />
            <span>Filter Chats</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto relative">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat.id);
              }}
              className={`w-full p-4 flex items-start gap-3 hover:bg-white/40 transition-all border-b border-white/20 relative ${
                selectedChat === chat.id ? 'bg-white/60' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-gray-900 truncate">{chat.name}</h4>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
              </div>

              {/* Unread Badge */}
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {activeChat ? (
        <div className="col-span-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>

          {/* Chat Header */}
          <div className="relative p-6 border-b border-white/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {activeChat.avatar}
                </div>
                {activeChat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
                <p className="text-xs text-gray-600">{activeChat.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/60 rounded-xl transition-all backdrop-blur-md hover:scale-110 hover:shadow-lg border border-transparent hover:border-white/50">
                <Phone className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-white/60 rounded-xl transition-all backdrop-blur-md hover:scale-110 hover:shadow-lg border border-transparent hover:border-white/50">
                <Video className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-white/60 rounded-xl transition-all backdrop-blur-md hover:scale-110 hover:shadow-lg border border-transparent hover:border-white/50">
                <MoreVertical className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
            {activeChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.sender === 'me'
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                      : 'bg-white/80 backdrop-blur-md text-gray-900'
                  } px-4 py-3 rounded-2xl shadow-lg border border-white/60 relative`}
                >
                  {message.sender === 'them' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                  )}
                  <p className="text-sm relative">{message.text}</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className={`text-xs ${message.sender === 'me' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.time}
                    </span>
                    {message.sender === 'me' && (
                      <Circle className={`w-2 h-2 ${message.read ? 'text-white fill-white' : 'text-white/50'}`} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="relative p-6 border-t border-white/30">
            <div className="flex items-end gap-3">
              <button className="p-3 hover:bg-white/60 rounded-xl transition-all backdrop-blur-md hover:scale-110 hover:shadow-lg border border-transparent hover:border-white/50">
                <Paperclip className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-3 hover:bg-white/60 rounded-xl transition-all backdrop-blur-md hover:scale-110 hover:shadow-lg border border-transparent hover:border-white/50">
                <ImageIcon className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-md resize-none"
                />
                {sendError && <p className="text-xs font-semibold text-red-600 mt-2">{sendError}</p>}
              </div>
              <button
                onClick={handleSendMessage}
                disabled={sending || !messageInput.trim()}
                className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-span-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-xl">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
