import React from 'react';
import { soundManager } from '../utils/audio';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        COLLABORATION & INQUIRIES
      </div>
      <h2 className="footer-title">
        LET'S CREATE SOMETHING<br />
        <span style={{ color: 'var(--accent-lime)' }}>EXTRAORDINARY</span>
      </h2>

      <div className="footer-links-row">
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>DIRECT MAIL: </span>
          <a
            href="mailto:mutsumi.wakaba@gmail.com"
            className="social-link"
            onMouseEnter={() => soundManager.playHoverBlip()}
          >
            MUTSUMI.WAKABA@GMAIL.COM
          </a>
        </div>

        <div className="social-links">
          {['TWITTER/X', 'FIGMA', 'GITHUB', 'LINKEDIN'].map((link, idx) => (
            <a
              key={idx}
              href="#"
              className="social-link"
              onMouseEnter={() => soundManager.playHoverBlip()}
              onClick={() => soundManager.playClickTone()}
            >
              {link}
            </a>
          ))}
        </div>

        <div style={{ color: 'var(--text-mono)' }}>
          MUTSUMI WAKABA © 2026 — ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
};
