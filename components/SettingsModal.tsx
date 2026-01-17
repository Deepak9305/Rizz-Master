import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, userEmail, onLogout, onDeleteAccount }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="glass w-full max-w-md rounded-3xl border border-white/10 p-6 relative shadow-2xl overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white">✕</button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

        {!confirmDelete ? (
          <>
            <div className="mb-8">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Account</label>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-white/80 break-all flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                    {userEmail.charAt(0).toUpperCase()}
                </div>
                {userEmail || 'Guest User'}
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={onLogout}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white flex items-center justify-center gap-2"
              >
                <span>Log Out</span>
              </button>
              
              <button 
                onClick={() => setConfirmDelete(true)}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Delete Account</span>
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center flex justify-center gap-4">
                 <a href="/privacy.html" className="text-xs text-white/30 hover:text-white transition-colors">Privacy</a>
                 <a href="/contact.html" className="text-xs text-white/30 hover:text-white transition-colors">Support</a>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 text-3xl mb-4 border border-red-500/20 animate-pulse">
                ⚠️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Account?</h3>
            <p className="text-white/60 text-sm mb-6 leading-relaxed px-4">
              This action is <span className="text-red-400 font-bold">permanent</span>. All your saved lines, credits, and profile data will be wiped immediately.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={onDeleteAccount}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
              >
                Yes, Delete Everything
              </button>
              
              <button 
                onClick={() => setConfirmDelete(false)}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white/60 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;