import React, { useState } from 'react';
import { soundManager } from '../utils/audio';

export const InteractiveTerminalPill: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM READY v2.6.0',
    'AI CORE: Mutsumi Wakaba Neural Engine initialized.',
    'WebGL context: OK. 3D Transmission Shader: OK.',
    'Type "help" or "status" to interact.',
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    soundManager.playClickTone();

    const cmd = inputVal.trim().toLowerCase();
    const newLogs = [...logs, `> ${inputVal}`];

    if (cmd === 'help') {
      newLogs.push('Available commands: help, status, theme, clear, quote');
    } else if (cmd === 'status') {
      newLogs.push('STATUS: All AI pipelines operating at 99.8% efficiency. Latency 14ms.');
    } else if (cmd === 'quote') {
      newLogs.push('"Thinking in systems. Designing with care." — 若叶睦');
    } else if (cmd === 'clear') {
      setLogs(['SYSTEM READY v2.6.0']);
      setInputVal('');
      return;
    } else {
      newLogs.push(`Command not recognized: "${inputVal}". Try "help".`);
    }

    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999 }}>
      {!isOpen ? (
        <button
          onClick={() => {
            soundManager.playClickTone();
            setIsOpen(true);
          }}
          onMouseEnter={() => soundManager.playHoverBlip()}
          style={{
            background: 'var(--text)',
            color: 'var(--bg)',
            border: '2px solid var(--text)',
            padding: '10px 20px',
            borderRadius: '100px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '4px 4px 0 var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }} />
          AI CLI TERMINAL [⌘]
        </button>
      ) : (
        <div
          style={{
            width: '360px',
            height: '260px',
            background: '#0a0a0f',
            border: '2px solid var(--text-dark, #333)',
            borderRadius: '12px',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--accent)',
          }}
        >
          <div
            style={{
              padding: '8px 12px',
              background: '#14141f',
              borderBottom: '1px solid #222',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#fff',
            }}
          >
            <span>AI_ENGINEER_CLI_v2.6</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 800 }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ opacity: i === logs.length - 1 ? 1 : 0.75 }}>
                {log}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommand} style={{ display: 'flex', borderTop: '1px solid #222' }}>
            <span style={{ padding: '8px 4px 8px 10px', color: '#888' }}>&gt;</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type a command..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                outline: 'none',
              }}
            />
          </form>
        </div>
      )}
    </div>
  );
};
