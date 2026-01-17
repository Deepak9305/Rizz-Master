
import React, { useState } from 'react';
import { Native } from '../services/nativeFeatures';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentToReport?: string; // If reporting a specific card
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, contentToReport }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    Native.hapticMedium();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would send data to Supabase or your backend
    console.log("Report Submitted:", { reason, details, content: contentToReport });

    setIsSubmitting(false);
    Native.hapticSuccess();
    alert("Report received. We will investigate.");
    onClose();
    setReason('');
    setDetails('');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="glass w-full max-w-md rounded-3xl border border-white/10 p-6 relative shadow-2xl" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white">✕</button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-500/20 rounded-full text-red-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-white">Report Content</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {contentToReport && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-white/60 italic truncate">
              Reported: "{contentToReport.substring(0, 50)}..."
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Reason</label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
            >
              <option value="" disabled>Select a reason...</option>
              <option value="offensive">Offensive / Inappropriate</option>
              <option value="harmful">Harmful / Dangerous</option>
              <option value="low_quality">Low Quality / Bad Advice</option>
              <option value="bug">Bug / App Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Details</label>
            <textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              placeholder="Tell us more..."
              className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 resize-none text-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
