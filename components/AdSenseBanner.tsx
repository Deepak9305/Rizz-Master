
import React, { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  dataAdSlot: string;
  className?: string;
  style?: React.CSSProperties;
}

const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ dataAdSlot, className, style }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only push the ad if we haven't already, and if the container is visible
    if (adRef.current && !isLoaded.current) {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoaded.current = true;
        }
      } catch (err) {
        console.error("AdSense Error:", err);
      }
    }
  }, []);

  return (
    <div className={`overflow-hidden text-center my-4 ${className}`} style={style} ref={adRef}>
      <span className="text-[10px] text-white/20 uppercase tracking-widest block mb-1">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '100px' }}
        data-ad-client="ca-pub-7381421031784616"
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

// Add type definition for window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdSenseBanner;
