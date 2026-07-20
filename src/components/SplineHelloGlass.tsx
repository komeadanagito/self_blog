import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineHelloGlassProps {
  sceneUrl?: string;
}

export const SplineHelloGlass: React.FC<SplineHelloGlassProps> = ({
  // Spline Community Official High-Fidelity 3D Liquid Glass Text Scene
  sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ✦ LOADING 3D JELLY SCENE...
        </div>
      )}
      <Spline
        scene={sceneUrl}
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      />
    </div>
  );
};
