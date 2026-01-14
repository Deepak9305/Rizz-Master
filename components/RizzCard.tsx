import React from 'react';

interface RizzCardProps {
  label: string;
  content: string;
  icon: string;
  color: string;
  isSaved?: boolean;
  onSave?: () => void;
  onShare?: () => void;
}

const RizzCard: React.FC<RizzCardProps> = ({ label, content, icon, color, isSaved, onSave, onShare }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  return (
    <div 
      onClick={copyToClipboard}
      className="glass border border-white/10 p-5 rounded-2xl hover:border-pink-500/50 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">{label}</h3>
        </div>

        <div className="flex gap-2 relative z-20">
          {onShare && (
            <button 
              onClick={(e) => { e.stopPropagation(); onShare(); }}
              className="p-1.5 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title="Share"
            >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
          )}
          {onSave && (
            <button 
              onClick={(e) => { e.stopPropagation(); onSave(); }}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-all ${isSaved ? 'text-pink-500' : 'text-white/30 hover:text-pink-400'}`}
              title={isSaved ? "Unsave" : "Save"}
            >
              <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
          )}
        </div>
      </div>

      <p className="text-lg leading-relaxed font-medium">"{content}"</p>
      <div className="mt-4 text-xs text-white/30 italic group-hover:text-pink-400 transition-colors">Click to copy</div>
    </div>
  );
};

export default RizzCard;