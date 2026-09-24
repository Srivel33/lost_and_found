import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import { Send, Loader2, MessageSquare, MapPin, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/format';

export const RelayChat = ({ matchId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const QUICK_LOCATIONS = [
    'Meet at Library Reception',
    'Meet at Security Office',
    'Meet at Food Court Desk',
    'Meet at Block A Foyer'
  ];

  const fetchMessages = async () => {
    try {
      const data = await api.getRelayMessages(matchId);
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e, textToSend) => {
    if (e) e.preventDefault();
    const message = (textToSend || inputText).trim();
    if (!message) return;

    setSending(true);
    try {
      await api.sendRelayMessage(matchId, message);
      setInputText('');
      await fetchMessages();
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="card-surface p-6 flex flex-col justify-center items-center h-72 gap-2 text-slate-400">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="text-xs">Loading secure encrypted relay...</span>
      </div>
    );
  }

  return (
    <div className="card-surface flex flex-col h-[420px] p-0 overflow-hidden border border-slate-200/90 shadow-card">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              Virtual In-App Relay Chat
            </h3>
            <p className="text-[11px] text-slate-500">
              Zero-exposure encrypted messaging for safe campus coordination.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">No messages yet</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Send a message or pick a safe meeting point below to coordinate item collection.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.isSender;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-600">{msg.senderAlias}</span>
                  <span className="text-[9px] text-slate-400">{formatDate(msg.createdAt, 'hh:mm a')}</span>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Meetup Suggestion Chips */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-semibold text-[10px] uppercase flex-shrink-0 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-indigo-600" />
          <span>Quick:</span>
        </span>
        {QUICK_LOCATIONS.map((loc, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(null, `Hello! Can we coordinate to ${loc.toLowerCase()}?`)}
            disabled={sending}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-600 font-medium text-[11px] transition-colors disabled:opacity-50"
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => handleSend(e)} className="p-3 border-t border-slate-100 bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message to coordinate handover..."
          className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="btn-primary text-xs h-10 px-4 rounded-xl shadow-none flex-shrink-0"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
