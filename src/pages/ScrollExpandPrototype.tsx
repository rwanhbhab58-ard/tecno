import { useState, useEffect } from 'react';
import ScrollExpand from '../components/ui/ScrollExpand';
import cinematicEngineeringImg from '../assets/cinematic-engineering.jpg';
import './ScrollExpandPrototype.css';

interface ResponsiveConfig {
  startWidth: number;
  startHeight: number;
  scrollDistance: number;
  holdDistance: number;
  mediaZoom: number;
}

const getResponsiveConfig = (width: number): ResponsiveConfig => {
  if (width < 640) {
    // Mobile: ~180vh total track (1 + 0.60 + 0.20 = 1.80)
    return {
      startWidth: 84,
      startHeight: 54,
      scrollDistance: 0.60,
      holdDistance: 0.20,
      mediaZoom: 1.25,
    };
  } else if (width < 1024) {
    // Tablet: ~210vh total track (1 + 0.85 + 0.25 = 2.10)
    return {
      startWidth: 80,
      startHeight: 58,
      scrollDistance: 0.85,
      holdDistance: 0.25,
      mediaZoom: 1.30,
    };
  } else {
    // Desktop: ~245vh total track (1 + 1.10 + 0.35 = 2.45)
    return {
      startWidth: 76,
      startHeight: 64,
      scrollDistance: 1.10,
      holdDistance: 0.35,
      mediaZoom: 1.35,
    };
  }
};

const ScrollExpandPrototype = () => {
  const [config, setConfig] = useState<ResponsiveConfig>(() =>
    getResponsiveConfig(typeof window !== 'undefined' ? window.innerWidth : 1200)
  );

  useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="prototype-root">
      <ScrollExpand
        key={`scroll-expand-${config.startWidth}`}
        src={cinematicEngineeringImg}
        mediaType="image"
        alt="Engineering Workstation - TECHNO ENJAZ"
        startWidth={config.startWidth}
        startHeight={config.startHeight}
        startRadius={24}
        endRadius={0}
        mediaZoom={config.mediaZoom}
        scrollDistance={config.scrollDistance}
        holdDistance={config.holdDistance}
        smoothing={0.08}
        overlayScrim={0.55}
        useWindowScroll={true}
        title={
          <div className="initial-content-wrapper">
            <div className="initial-eyebrow">
              <span className="initial-eyebrow-dot" />
              <span>TECHNO ENJAZ | هندسة البرمجيات والنظم</span>
            </div>
            <h1 className="initial-title">Engineering The Digital Core</h1>
          </div>
        }
        scrollHint={
          <div className="scroll-hint-wrapper">
            <span className="scroll-hint-text">
              تمرير للاستكشاف // SCROLL TO EXPAND
            </span>
            <div className="scroll-hint-arrow" aria-hidden="true">
              ↓
            </div>
          </div>
        }
      >
        <div className="expanded-overlay-wrapper">
          <h2 className="expanded-title">Empowering Scalable Innovation</h2>
          <div className="cta-group">
            <button
              type="button"
              className="cta-button cta-primary"
              onClick={() => console.log('Explore Work clicked')}
            >
              استكشف أعمالنا / Explore Work
            </button>
            <button
              type="button"
              className="cta-button cta-secondary"
              onClick={() => console.log('Start a Project clicked')}
            >
              تقديم طلب مشروع / Start a Project
            </button>
          </div>
        </div>
      </ScrollExpand>
    </main>
  );
};

export default ScrollExpandPrototype;
