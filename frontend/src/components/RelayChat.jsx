import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import { Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/format';

export const RelayChat = ({ matchId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const data = await api.getRelayMessages(matchId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setSending(true);
    try {
      await api.sendRelayMessage(matchId, inputText.trim());
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
      <div className="card-surface p-6 flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="card-surface flex flex-col h-96 border border-slate-200">
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-bold text-slate-800">Virtual In-App Relay Chat</h3>
        <p className="text-xs text-slate-500 mt-1">Chat securely without exposing your phone number.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="text-center text-xs text-slate-400 mt-10">
            No messages yet. Say hello to coordinate the handover!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.isSender;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-[10px] font-bold text-slate-500">{msg.senderAlias}</span>
                  <span className="text-[9px] text-slate-400">{formatDate(msg.createdAt, 'hh:mm a')}</span>
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${
                  isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                }`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white rounded-b-xl flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="bg-indigo-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
