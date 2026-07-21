import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { soundManager } from '../utils/audio';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

const copy = {
  en: [
    { eyebrow: 'MATERIAL STUDY / REFRACTION', title: 'LIGHT BECOMES', accent: 'material.', body: 'An interactive study in transparency, chromatic edges and weightless form.', meta: ['REAL-TIME 3D', 'POINTER REACTIVE', 'SPATIAL'] },
    { eyebrow: 'INTELLIGENT OBJECT / SYSTEM', title: 'COMPLEXITY,', accent: 'made legible.', body: 'A spatial interface language for agents, tools and the decisions between them.', meta: ['AI SYSTEMS', 'INTERACTION', 'PROTOTYPE'] },
    { eyebrow: 'SIGNAL STUDY / COMPUTATION', title: 'A MACHINE WITH', accent: 'presence.', body: 'Motion and form reveal system state without turning the interface into a dashboard.', meta: ['GENERATIVE', 'MOTION SYSTEM', 'WEBGL'] },
  ],
  zh: [
    { eyebrow: '材质实验 / 折射', title: '让光成为', accent: '可触碰的材质。', body: '关于透明度、色散边缘与失重形态的实时交互实验。', meta: ['实时 3D', '指针响应', '空间设计'] },
    { eyebrow: '智能对象 / 系统', title: '让复杂系统', accent: '变得清晰。', body: '为 Agent、工具及其决策关系建立可理解的空间界面语言。', meta: ['AI 系统', '交互设计', '原型'] },
    { eyebrow: '信号实验 / 计算', title: '让机器拥有', accent: '存在感。', body: '通过运动与形态传递系统状态，而不是堆砌仪表盘。', meta: ['生成艺术', '动态系统', 'WEBGL'] },
  ],
};

const urls = [
  'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  'https://prod.spline.design/HqdfCmOueigtautT/scene.splinecode',
  'https://prod.spline.design/3L7ADylHDDQ2VzfA/scene.splinecode',
];

const OriginalChapter: React.FC<{ index: number }> = ({ index }) => {
  const { language } = useI18n();
  const scene = copy[language][index];
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      setActive(entry.isIntersecting);
      if (!entry.isIntersecting) setLoaded(false);
    }, { rootMargin: '12% 0px', threshold: 0.01 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !active) return;
    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const raw = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const progress = Math.max(0, Math.min(1, raw));
      const focus = Math.max(0, 1 - Math.abs(progress - 0.5) * 2);
      const direction = index % 2 === 0 ? -1 : 1;
      section.style.setProperty('--chapter-focus', focus.toFixed(4));
      section.style.setProperty('--chapter-card-shift', `${(0.5 - progress) * direction * 220}px`);
      section.style.setProperty('--chapter-stage-shift', `${(progress - 0.5) * direction * 90}px`);
      section.style.setProperty('--chapter-scale', `${0.965 + focus * 0.035}`);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [active, index]);

  return (
    <section ref={sectionRef} className={`spline-chapter chapter-${['ink', 'ivory', 'blue'][index]} chapter-${index % 2 === 0 ? 'left' : 'right'}`}>
      <div className="chapter-sticky">
        <div className="chapter-stage">
          <div className="chapter-spline">
            {active && !loaded && <div className="scene-loader"><span /><small>LOADING SPATIAL SCENE</small></div>}
            {active && <Suspense fallback={null}><Spline scene={urls[index]} renderOnDemand onLoad={() => setLoaded(true)} className={loaded ? 'scene-is-loaded' : 'scene-is-loading'} /></Suspense>}
          </div>
          <div className="chapter-grid" />
          <span className="chapter-coordinate coordinate-top">0{index + 1} / 03</span>
          <span className="chapter-coordinate coordinate-bottom">MOVE / SCROLL / EXPLORE</span>
        </div>
        <article className="chapter-card" onMouseEnter={() => soundManager.playHoverBlip()}>
          <div className="chapter-card-top"><span>0{index + 1}</span><span>{scene.eyebrow}</span></div>
          <h2>{scene.title}<br /><em>{scene.accent}</em></h2>
          <p>{scene.body}</p>
          <div className="chapter-meta">{scene.meta.map((item) => <span key={item}>{item}</span>)}</div>
        </article>
      </div>
    </section>
  );
};

export const OriginalShowcaseSections: React.FC = () => {
  const { language } = useI18n();
  return (
    <main id="work" className="immersive-story">
      <header className="story-prologue">
        <span className="section-kicker">{language === 'zh' ? '精选互动作品 / 2026' : 'SELECTED INTERACTIVE WORK / 2026'}</span>
        <p>{language === 'zh' ? <>三个实验。<br /><em>三种独立世界。</em></> : <>THREE STUDIES.<br /><em>THREE DISTINCT WORLDS.</em></>}</p>
        <span className="prologue-hint">{language === 'zh' ? '滚动进入 ↓' : 'SCROLL TO ENTER ↓'}</span>
      </header>
      {[0, 1, 2].map((index) => <OriginalChapter index={index} key={index} />)}
    </main>
  );
};
