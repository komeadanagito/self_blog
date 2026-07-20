import React from 'react';

interface SplineIframeViewerProps {
  embedUrl: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SplineIframeViewer: React.FC<SplineIframeViewerProps> = ({
  embedUrl,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      <iframe
        src={embedUrl}
        frameBorder="0"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      />
    </div>
  );
};
