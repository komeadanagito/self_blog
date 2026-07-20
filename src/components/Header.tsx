import React, { useState } from 'react';
import { soundManager } from '../utils/audio';

export type ThemeMode = 'theme-a' | 'theme-b' | 'theme-c';

interface HeaderProps {
  currentTheme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTheme, onToggleTheme }) => {
  const [soundActive, setSoundActive] = useState(false);

  const handleSoundToggle = () => {
    const active = soundManager.toggleSound();
    setSoundActive(active);
  };

  const getThemeLabel = () => {
    if (currentTheme === 'theme-a') return 'THEME[A: CREAM]';
    if (currentTheme === 'theme-b') return 'THEME[B: BLUE]';
    return 'THEME[C: DARK]';
  };

  return (
    <header className="site-header">
      <a href="#" className="logo" onMouseEnter={() => soundManager.playHoverBlip()}>
        MUTSUMI.DESIGN <span className="logo-badge">AI / ENG</span>
      </a>

      <nav className="nav-links">
        <button
          className="nav-item"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          WORK
        </button>
        <button
          className="nav-item"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          BLOG
        </button>
        <button
          className="nav-item"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => soundManager.playClickTone()}
        >
          CONTACT
        </button>
        <button
          className="nav-item btn-pill"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={() => {
            soundManager.playClickTone();
            onToggleTheme();
          }}
          style={{ background: 'var(--bg-card-secondary)' }}
        >
          {getThemeLabel()}
        </button>
        <button
          className="nav-item btn-pill"
          onMouseEnter={() => soundManager.playHoverBlip()}
          onClick={handleSoundToggle}
          style={{
            borderColor: soundActive ? 'var(--accent-lime)' : 'inherit',
            color: soundActive ? 'var(--accent-lime)' : 'inherit'
          }}
        >
          SOUND[{soundActive ? 'ON' : '/'}]
        </button>
      </nav>
    </header>
  );
};
