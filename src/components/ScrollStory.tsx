import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/audio';

interface RevealBlockProps {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
}

export const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  direction = 'up',
  delay = 0,
}) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Bidirectional Observer (Triggers both on scroll down and scroll up)
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          soundManager.playHoverBlip();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0,0,0) scale(1)';
    switch (direction) {
      case 'left': return 'translate3d(-50px,0,0) scale(0.96)';
      case 'right': return 'translate3d(50px,0,0) scale(0.96)';
      case 'scale': return 'translate3d(0,30px,0) scale(0.92)';
      default: return 'translate3d(0,40px,0) scale(0.98)';
    }
  };

  return (
    <div
      ref={elRef}
      style={{
        opacity: isVisible ? 1 : 0.15,
        transform: getTransform(),
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export const ScrollStory: React.FC = () => {
  return (
    <section className="story-wrap" style={{ borderTop: '1px solid var(--border-dark)' }}>
      {/* ── Section 1: Intro / Philosophy ── */}
      <div className="story-section story-intro">
        <RevealBlock direction="right">
          <span className="story-label font-mono">PHILOSOPHY / 理念</span>
        </RevealBlock>
        <RevealBlock delay={100}>
          <h2 className="story-h2">
            DESIGN IS NOT JUST<br />
            HOW IT LOOKS.<br />
            IT'S HOW IT <span style={{ color: 'var(--accent)' }}>THINKS</span>.
          </h2>
        </RevealBlock>
        <RevealBlock delay={200}>
          <p className="story-body">
            I build intelligent user interfaces and neural workflows at the intersection of high-performance WebGL graphics and modern AI models.
          </p>
        </RevealBlock>
      </div>

      {/* ── Section 2: Big Stat Counter ── */}
      <div className="story-section story-stat-row">
        {[
          { num: '06+', label: 'YEARS IN AI &amp; UI SYSTEMS' },
          { num: '40+', label: 'PRODUCTION SHIPPED' },
          { num: '99.8%', label: 'ACCURACY &amp; UPTIME' },
        ].map((item, idx) => (
          <RevealBlock key={idx} direction="scale" delay={idx * 150}>
            <div className="stat-card">
              <span className="stat-num">{item.num}</span>
              <span className="stat-label font-mono">{item.label}</span>
            </div>
          </RevealBlock>
        ))}
      </div>

      {/* ── Section 3: Core Services List ── */}
      <div className="story-section story-services">
        <RevealBlock direction="left">
          <span className="story-label font-mono">CAPABILITIES / 核心能力</span>
        </RevealBlock>

        <div className="services-grid">
          {[
            { title: 'AI Engineering &amp; LLM Apps', desc: 'Custom RAG pipelines, fine-tuned agent workflows, vector search architectures, and real-time inference.' },
            { title: 'WebGL &amp; 3D Interactive Design', desc: 'Shader programming, Three.js custom pipelines, Spline 3D embeds, and 60fps fluid UI micro-interactions.' },
            { title: 'Design Systems &amp; Architecture', desc: 'Scalable token systems, component libraries, cross-platform UI frameworks, and design-to-code pipelines.' },
            { title: 'Performance &amp; WebAssembly', desc: 'Zero-runtime CSS, Rust/WASM module integration, memory optimization, and instant load speeds.' },
          ].map((srv, idx) => (
            <RevealBlock key={idx} delay={idx * 120}>
              <div className="service-item">
                <span className="service-idx font-mono">0{idx + 1}</span>
                <div className="service-info">
                  <h3>{srv.title}</h3>
                  <p>{srv.desc}</p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>

      {/* ── Section 4: Tech Stack Chips ── */}
      <div className="story-section story-stack">
        <RevealBlock direction="right">
          <span className="story-label font-mono">TECH STACK / 技术栈</span>
        </RevealBlock>
        <div className="stack-flex">
          {[
            'TypeScript', 'React 19', 'Next.js', 'Three.js', 'WebGL / WebGPU',
            'Python', 'PyTorch', 'LangChain', 'LlamaIndex', 'TailwindCSS',
            'Node.js', 'WASM / Rust', 'Figma', 'Spline 3D', 'Docker',
          ].map((tech, idx) => (
            <RevealBlock key={tech} delay={idx * 40} direction="scale">
              <div className="stack-chip font-mono">{tech}</div>
            </RevealBlock>
          ))}
        </div>
      </div>

      {/* ── Section 5: Current focus ── */}
      <div className="story-section story-now">
        <RevealBlock direction="right">
          <span className="story-label font-mono">NOW / 当前工作</span>
        </RevealBlock>
        <RevealBlock delay={100}>
          <h2 className="story-h2 story-h2-sm">
            Currently building<br />
            <span style={{ color: 'var(--accent)' }}>next-gen AI tooling</span><br />
            for developers.
          </h2>
        </RevealBlock>
        <RevealBlock delay={200}>
          <p className="story-body">
            Open to collaborations on ambitious projects — especially those that push the boundaries
            of what software and design can do together. Based in Beijing, China (GMT+8). Available worldwide.
          </p>
        </RevealBlock>
        <RevealBlock delay={320}>
          <a href="mailto:mutsumi.wakaba@outlook.com" className="cta-pill">
            LET'S TALK ↗
          </a>
        </RevealBlock>
      </div>
    </section>
  );
};
