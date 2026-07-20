import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import Spline from '@splinetool/react-spline';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Spline 3D Scene Runtime Exception caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.03)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ✦ 3D SCENE LOAD FALLBACK
          </div>
        )
      );
    }

    return this.props.children;
  }
}

interface SplineViewerProps {
  sceneUrl: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SplineViewer: React.FC<SplineViewerProps> = ({
  sceneUrl,
  className = '',
  style = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SplineErrorBoundary>
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
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              background: 'rgba(236, 237, 239, 0.3)',
              backdropFilter: 'blur(6px)',
              zIndex: 10,
            }}
          >
            ✦ LOADING 3D SPLINE SCENE...
          </div>
        )}
        <Spline
          scene={sceneUrl}
          onLoad={() => setIsLoaded(true)}
          style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        />
      </div>
    </SplineErrorBoundary>
  );
};
