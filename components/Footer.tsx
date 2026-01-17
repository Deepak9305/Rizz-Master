import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`text-center text-white/30 text-[10px] md:text-xs ${className}`}>
      <div className="flex justify-center gap-6 mb-3">
        <a 
          href="/privacy.html" 
          className="hover:text-white hover:underline transition-all uppercase tracking-widest"
        >
          Privacy Policy
        </a>
        <a 
          href="/contact.html" 
          className="hover:text-white hover:underline transition-all uppercase tracking-widest"
        >
          Contact Us
        </a>
      </div>
      <p>© 2024 Rizz Master AI. Built for the smooth operators.</p>
    </footer>
  );
};

export default Footer;
