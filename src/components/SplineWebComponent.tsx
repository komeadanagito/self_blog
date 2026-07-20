import React, { useEffect, useRef, useState } from 'react';

// Declaration for custom element <spline-viewer> in JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { url?: string; 'loading-anim-type'?: string },
        HTMLElement
      >;
    }
  }
}

interface SplineWebComponentProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
  unmountWhenHidden?: boolean;
}

export const SplineWebComponent: React.FC<SplineWebComponentProps> = ({
  url,
  className = '',
  style = {},
  unmountWhenHidden = false,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!unmountWhenHidden || !hostRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '30% 0px' });
    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, [unmountWhenHidden]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden', // Hard crop outer container to hide Spline badge
        ...style,
      }}
    >
      {/* Pushed down & expanded slightly to crop out the bottom-right Spline logo & links */}
      {active && <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: '-25px',
          bottom: '-35px',
          width: 'calc(100% + 25px)',
          height: 'calc(100% + 35px)',
        }}
      >
        <spline-viewer
          url={url}
          loading-anim-type="spinner"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            pointerEvents: 'auto',
          }}
        />
      </div>}
    </div>
  );
};
