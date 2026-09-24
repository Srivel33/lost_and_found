import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatRelativeTime } from '../utils/format';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifs = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      await api.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSingleRead = async (notifId) => {
    try {
      await api.markRead(notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-2">
            <h3 className="text-sm font-bold text-slate-800">Campus Alerts</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto mt-1">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-2.5 rounded-xl transition-colors ${
                    notif.read ? 'bg-white opacity-80' : 'bg-indigo-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-slate-800 leading-snug">
                      {notif.message}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1 flex-shrink-0"></span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      {notif.matchId && (
                        <Link
                          to={`/matches/${notif.matchId}`}
                          onClick={() => {
                            handleMarkSingleRead(notif.id);
                            setOpen(false);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>Review match</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 pt-2 mt-1 text-center">
            <Link
              to="/matches"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 block py-1"
            >
              View all possible matches &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
