import React from 'react';
import { SavedItem } from '../types';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedItem[];
  onDelete: (id: string) => void;
  onShare: (content: string) => void;
}

const SavedModal: React.FC<SavedModalProps> = ({ isOpen, onClose, savedItems, onDelete, onShare }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl border border-white/10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold text-white">Saved Rizz</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">✕</button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-4">
            {savedItems.length === 0 ? (
                <div className="text-center text-white/40 py-12">
                    <div className="text-4xl mb-4">🕸️</div>
                    <p>No saved lines yet.</p>
                </div>
            ) : (
                savedItems.map((item) => (
                    <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-pink-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                             <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                                 item.type === 'tease' ? 'bg-purple-500/20 text-purple-300' :
                                 item.type === 'smooth' ? 'bg-blue-500/20 text-blue-300' :
                                 item.type === 'chaotic' ? 'bg-orange-500/20 text-orange-300' :
                                 'bg-pink-500/20 text-pink-300'
                             }`}>
                                 {item.type}
                             </span>
                             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => onShare(item.content)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white" title="Share">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                 </button>
                                 <button onClick={() => onDelete(item.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400" title="Delete">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </button>
                             </div>
                        </div>
                        <p className="text-white/90 leading-relaxed">"{item.content}"</p>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default SavedModal;