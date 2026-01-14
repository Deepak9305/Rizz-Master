
import React, { useState } from 'react';

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onUpgrade }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onUpgrade();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-3xl border border-yellow-500/30 overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors z-20"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-10 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block p-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4 animate-bounce">
              <span className="text-3xl">👑</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              Upgrade to <span className="text-yellow-400">Premium</span>
            </h2>
            <p className="text-white/50">Stop waiting. Start winning.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Free Tier */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 opacity-60">
              <h3 className="text-xl font-bold text-white mb-4">Free</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="text-white/30">✓</span> 5 Daily Credits
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white/30">✓</span> Watch Ads to Refill
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white/30">✓</span> Standard AI Speed
                </li>
              </ul>
            </div>

            {/* Premium Tier */}
            <div className="p-6 rounded-2xl border border-yellow-500/50 bg-yellow-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                Recommended
              </div>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Premium</h3>
              <ul className="space-y-3 text-sm text-white">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">✓</span> <span className="font-bold">Unlimited Rizz</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">✓</span> <span className="font-bold">No Ads Ever</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">✓</span> <span className="font-bold">Turbo Speed</span> (2x Faster)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">✓</span> Priority Support
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold text-lg text-black bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <span>Unlock Unlimited Access</span>
                <span className="text-sm font-normal opacity-70">($4.99/mo)</span>
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-white/30 mt-4">
            Recurring billing. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
