
import React, { useState, useEffect } from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'contact' | null>(null);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  return (
    <>
      <footer className={`text-center text-white/30 text-[10px] md:text-xs ${className}`}>
        <div className="flex justify-center gap-6 mb-3">
          <button 
            onClick={() => setActiveModal('privacy')} 
            className="hover:text-white hover:underline transition-all uppercase tracking-widest"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => setActiveModal('contact')} 
            className="hover:text-white hover:underline transition-all uppercase tracking-widest"
          >
            Contact Us
          </button>
        </div>
        <p>© 2024 Rizz Master AI. Built for the smooth operators.</p>
      </footer>

      {activeModal && (
        <div 
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="glass w-full max-w-lg p-6 md:p-8 rounded-3xl border border-white/10 relative shadow-2xl animate-in fade-in zoom-in duration-300 text-left"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {activeModal === 'privacy' ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 rizz-gradient bg-clip-text text-transparent">Privacy Policy</h2>
                  <div className="text-sm text-white/70 space-y-4">
                    <p>Coming soon...</p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2 rizz-gradient bg-clip-text text-transparent">Contact Us</h2>
                  <p className="text-white/50 text-sm mb-6">Coming soon...</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
