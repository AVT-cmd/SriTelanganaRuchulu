import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, X, Check, Copy, Bell, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import type { NotificationLog } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationLog[];
}

export const NotificationModal = ({ isOpen, onClose, notifications }: NotificationModalProps) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'SMS' | 'EMAIL'>('ALL');
  const [selectedNotification, setSelectedNotification] = useState<NotificationLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (activeTab === 'ALL') return true;
    return n.type === activeTab;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary/20 text-brand-primary flex items-center justify-center border border-brand-primary/30">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                Live Notification Center
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  LIVE SIMULATOR
                </span>
              </h3>
              <p className="text-xs text-gray-300">Official SMS text messages and emails dispatched to customers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-4 pt-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'border-brand-primary text-brand-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Messages ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('SMS')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'SMS'
                ? 'border-brand-primary text-brand-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Smartphone size={14} /> SMS Messages ({notifications.filter(n => n.type === 'SMS').length})
          </button>
          <button
            onClick={() => setActiveTab('EMAIL')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'EMAIL'
                ? 'border-brand-primary text-brand-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mail size={14} /> Official Emails ({notifications.filter(n => n.type === 'EMAIL').length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No notifications dispatched yet in this category.
            </div>
          ) : (
            filtered.map((notif) => {
              const isSms = notif.type === 'SMS';
              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition ${
                    isSms
                      ? 'bg-amber-50/30 border-amber-200/80 hover:border-amber-300'
                      : 'bg-blue-50/20 border-blue-200/80 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isSms
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}
                      >
                        {isSms ? <Smartphone size={11} /> : <Mail size={11} />}
                        {notif.type} • {notif.category}
                      </span>
                      <span className="text-[11px] font-bold text-gray-800 font-mono">
                        To: {notif.recipient}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {notif.subject && (
                    <h4 className="text-xs font-bold text-brand-dark mb-1 flex items-center gap-1.5">
                      {notif.category === 'WELCOME' && <Sparkles size={13} className="text-amber-500" />}
                      {notif.category === 'ORDER_CONFIRMATION' && <Truck size={13} className="text-blue-500" />}
                      {notif.category === 'OTP' && <ShieldCheck size={13} className="text-green-500" />}
                      {notif.subject}
                    </h4>
                  )}

                  <p className="text-xs text-gray-600 leading-relaxed font-sans mb-3 line-clamp-3 bg-white/70 p-2.5 rounded-xl border border-black/5">
                    {notif.previewText || notif.content.replace(/<[^>]+>/g, '')}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <Check size={13} />
                      <span>Delivered via Telecommunications Gateway</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(notif.previewText || notif.content.replace(/<[^>]+>/g, ''), notif.id)}
                        className="text-gray-500 hover:text-brand-dark flex items-center gap-1 font-bold text-[11px] px-2 py-1 bg-white rounded-lg border border-gray-200 transition"
                      >
                        {copiedId === notif.id ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                        {copiedId === notif.id ? 'Copied' : 'Copy Text'}
                      </button>

                      {notif.type === 'EMAIL' && (
                        <button
                          onClick={() => setSelectedNotification(notif)}
                          className="bg-brand-dark text-white hover:bg-brand-primary font-bold text-[11px] px-2.5 py-1 rounded-lg transition"
                        >
                          View Full HTML
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-6">
          <span>Sri Telangana Ruchulu Automated Messaging System</span>
          <button
            onClick={onClose}
            className="font-bold text-brand-dark hover:text-brand-primary"
          >
            Close Center
          </button>
        </div>

        {/* Full HTML Email Preview Modal */}
        <AnimatePresence>
          {selectedNotification && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
              >
                <div className="flex justify-between items-center pb-3 border-b mb-4">
                  <div>
                    <h4 className="font-bold text-sm text-brand-dark">{selectedNotification.subject}</h4>
                    <span className="text-xs text-gray-400">To: {selectedNotification.recipient}</span>
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div
                  className="flex-1 overflow-y-auto text-xs"
                  dangerouslySetInnerHTML={{ __html: selectedNotification.content }}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
