import React, { useState, useEffect } from 'react';
import { CursorCanvas } from './components/CursorCanvas';
import { SplineWebComponent } from './components/SplineWebComponent';
import { WarpCanvas } from './components/WarpCanvas';
import { PortfolioSections } from './components/PortfolioSections';
import { OriginalShowcaseSections } from './components/OriginalShowcaseSections';
import { ExperimentalSections } from './components/ExperimentalSections';
import { soundManager } from './utils/audio';
import { useI18n } from './i18n';

type Theme = 'a' | 'b' | 'c';
const THEME_LABELS: Record<Theme, string> = { a: 'THEME[A]', b: 'THEME[B]', c: 'THEME[C]' };
const NEXT_THEME: Record<Theme, Theme> = { a: 'b', b: 'c', c: 'a' };

export const App: React.FC = () => {
  const { t, toggleLanguage } = useI18n();
  const [theme, setTheme] = useState<Theme>('a');
  const [soundOn, setSoundOn] = useState(false);
  const [coords, setCoords] = useState({ x: 762, y: 391 });
  const [clockStr, setClockStr] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClockStr(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    soundManager.playClickTone();
    setTheme((t) => NEXT_THEME[t]);
  };

  const toggleSound = () => {
    const n = soundManager.toggleSound();
    setSoundOn(n);
  };

  const fmt = (n: number) => String(n).padStart(4, '0');

  return (
    <>
      <CursorCanvas />

      <div className="site-wrap">
        {/* TOP NAVIGATION */}
        <nav className="site-nav">
          <div className="nav-logo" onMouseEnter={() => soundManager.playHoverBlip()}>
            <span className="nav-logo-dot" />
            MUTSUMI.DESIGN
          </div>
          <div className="nav-right">
            {[[t('nav.work'), '#work'], [t('nav.contact'), '#contact']].map(([label, href]) => (
              <a
                key={label}
                className="nav-btn"
                href={href}
                onMouseEnter={() => soundManager.playHoverBlip()}
                onClick={() => soundManager.playClickTone()}
              >
                {label}
              </a>
            ))}
            <button className="nav-btn nav-btn-pill language-toggle" onClick={toggleLanguage} aria-label="Switch language">{t('nav.language')}</button>
            <button className="nav-btn nav-btn-pill" onMouseEnter={() => soundManager.playHoverBlip()} onClick={cycleTheme}>
              {THEME_LABELS[theme]}
            </button>
            <button
              className={`nav-btn nav-btn-pill ${soundOn ? 'sound-on' : ''}`}
              onMouseEnter={() => soundManager.playHoverBlip()}
              onClick={toggleSound}
            >
              SOUND[{soundOn ? 'ON' : '/'}]
            </button>
          </div>
        </nav>

        {/* HERO SECTION WITH ENLARGED HALF-BODY 3D ROBOT */}
        <section className="hero" style={{ position: 'relative', minHeight: '88vh', overflow: 'hidden' }}>
          {/* Top 3-Column Info Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              borderBottom: '1px solid var(--border-dark)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              position: 'relative',
              zIndex: 10,
            }}
            className="font-mono"
          >
            <div style={{ padding: '1.2rem 1.5rem', borderRight: '1px solid var(--border)' }}>
              <strong>{t('hero.field')}</strong>
            </div>
            <div style={{ padding: '1.2rem 1.5rem', borderRight: '1px solid var(--border)' }}>
              {t('hero.principle').split('\n').map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}
            </div>
            <div style={{ padding: '1.2rem 1.5rem' }}>
              {t('hero.bio')}
            </div>
          </div>

          {/* Spline 3D Scene - Half-Body Peek Robot */}
          <div
            style={{
              position: 'absolute',
              top: '18%',
              left: 0,
              right: 0,
              bottom: '-25%',
              zIndex: 1,
              transform: 'translateY(12%) scale(1.65)',
              pointerEvents: 'auto',
            }}
          >
            <SplineWebComponent url="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" unmountWhenHidden />
          </div>

          {/* Bottom Left Big Bold Typography & Floating Badges */}
          <div
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: '1.75rem',
              zIndex: 5,
              pointerEvents: 'none',
              maxWidth: '650px',
            }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 5.8vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 0.94,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: 'var(--text)',
              }}
            >
              {t('hero.title').split('\n').map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}
            </h1>

            <div
              className="sticker sticker-cyan font-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '1rem',
                pointerEvents: 'auto',
              }}
            >
              {t('hero.role')}
            </div>
          </div>

          {/* Floating Sticker Badges */}
          <div className="sticker sticker-lime sticker-1" style={{ top: '22%', right: '12%', zIndex: 10 }}>2026</div>
          <div className="sticker sticker-gold sticker-2" style={{ top: '48%', right: '8%', zIndex: 10 }}>☺ WAKABA.DESIGN</div>

          {/* Hero Bottom Live Coordinate Bar (Beijing Time) */}
          <div className="hero-status-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
            <span>GMT+8 CN {clockStr || '12:32'} · 28°C</span>
            <span className="coord-box">
              {fmt(coords.x)} X {fmt(coords.y)} Y
            </span>
          </div>
        </section>

        <OriginalShowcaseSections />
        <PortfolioSections />
        <ExperimentalSections />

        {/* WARP SPEED TYPOGRAPHY */}
        <section className="warp-section">
          <WarpCanvas />
          <div className="warp-text">
            <h2 className="warp-headline">
              {t('warp.title').split('\n').map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}
            </h2>
            <div className="warp-quotes">
              <p>{t('warp.1')}</p>
              <p>{t('warp.2')}</p>
              <p>{t('warp.3')}</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer" id="contact">
          <div className="footer-orbit" aria-hidden="true"><span>{t('footer.available')}</span></div>
          <div className="footer-content">
            <span className="section-kicker">{t('footer.kicker')}</span>
            <h2 className="footer-cta">
              {t('footer.title1')}
              <br />
              {t('footer.title2')} <span className="cta-accent">{t('footer.accent')}</span>
            </h2>

            <div className="footer-bottom">
              <a
                href="mailto:mutsumi.wakaba@outlook.com"
                style={{ fontWeight: 800, fontSize: '0.88rem' }}
                onMouseEnter={() => soundManager.playHoverBlip()}
              >
                MUTSUMI.WAKABA@OUTLOOK.COM
              </a>

              <div className="footer-socials">
                {['GITHUB', 'FIGMA', 'LINKEDIN'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    onMouseEnter={() => soundManager.playHoverBlip()}
                    onClick={() => soundManager.playClickTone()}
                  >
                    {s}
                  </a>
                ))}
              </div>

              <span>MUTSUMI WAKABA © 2026</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
