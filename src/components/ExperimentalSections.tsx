import React, { useEffect, useRef } from 'react';
import { AmbientShader } from './AmbientShader';
import { FlowFieldCanvas } from './FlowFieldCanvas';
import { useI18n } from '../i18n';

const useScrollProgress = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      element.style.setProperty('--lab-progress', progress.toFixed(4));
      element.style.setProperty('--lab-shift', `${(progress - 0.5) * 38}vw`);
      element.style.setProperty('--lab-shift-reverse', `${(0.5 - progress) * 42}vw`);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
};

const ShaderLab: React.FC = () => {
  const { language } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);
  return (
    <section ref={ref} className="experiment-page shader-page">
      <div className="experiment-sticky">
        <AmbientShader className="shader-page-canvas" />
        <div className="shader-noise" />
        <div className="experiment-counter">04 / 06 · {language === 'zh' ? '自定义 GLSL' : 'CUSTOM GLSL'}</div>
        <h2 className="shader-page-title">{language === 'zh' ? <><span>颜色也是</span><em>一种材质。</em></> : <><span>COLOR IS</span><em>A MATERIAL.</em></>}</h2>
        <div className="shader-glass-card">
          <span>{language === 'zh' ? '实时材质实验' : 'LIVE MATERIAL STUDY'}</span>
          <p>{language === 'zh' ? '没有视频，也不是嵌入内容。每个像素都在实时计算，并响应你的指针。' : 'No video. No embed. Every pixel is calculated in real time and reacts to your pointer.'}</p>
          <div><i /> {language === 'zh' ? '移动以扰动材质' : 'MOVE TO DISTORT'}</div>
        </div>
      </div>
    </section>
  );
};

const KineticType: React.FC = () => {
  const { language } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);

  const tilt = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty('--tilt-x', `${y * -10}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * 12}deg`);
  };
  const reset = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <section ref={ref} className="experiment-page kinetic-page">
      <div className="experiment-sticky">
        <div className="kinetic-ribbon ribbon-one">{language === 'zh' ? '让文字运动 · 让文字运动 · 让文字运动 ·' : 'TYPE IN MOTION · TYPE IN MOTION · TYPE IN MOTION ·'}</div>
        <div className="kinetic-ribbon ribbon-two">{language === 'zh' ? '双向滚动 · 双向滚动 · 双向滚动 ·' : 'SCROLL BOTH WAYS · SCROLL BOTH WAYS · SCROLL BOTH WAYS ·'}</div>
        <div className="kinetic-stage">
          <div className="kinetic-intro"><span>05 / 06 · {language === 'zh' ? '动态排版系统' : 'KINETIC SYSTEM'}</span><h2>{language === 'zh' ? <>文字<br />也有<br /><em>重量。</em></> : <>WORDS<br />WITH<br /><em>WEIGHT.</em></>}</h2></div>
          <div className="kinetic-card card-alpha" onPointerMove={tilt} onPointerLeave={reset}><b>Aa</b><span>{language === 'zh' ? <>可变形态<br />01—09</> : <>VARIABLE FORM<br />01—09</>}</span></div>
          <div className="kinetic-card card-symbol" onPointerMove={tilt} onPointerLeave={reset}><b>↗</b><span>{language === 'zh' ? <>方向<br />就是内容</> : <>DIRECTION<br />IS CONTENT</>}</span></div>
          <div className="kinetic-card card-index" onPointerMove={tilt} onPointerLeave={reset}><b>64</b><span>{language === 'zh' ? <>每秒<br />帧数</> : <>FRAMES<br />PER SECOND</>}</span></div>
        </div>
      </div>
    </section>
  );
};

const SignalNetwork: React.FC = () => {
  const { language } = useI18n();
  return <section className="signal-page">
    <FlowFieldCanvas />
    <div className="signal-grid" />
    <div className="signal-copy">
      <span>06 / 06 · {language === 'zh' ? '行为画布' : 'BEHAVIORAL CANVAS'}</span>
      <h2>{language === 'zh' ? <>触碰这个<br /><em>网络。</em></> : <>TOUCH THE<br /><em>NETWORK.</em></>}</h2>
      <p>{language === 'zh' ? '每个节点都有记忆。移动指针扰动网络，离开后系统会重新找到自己的结构。' : 'Each node has memory. Move through the field to disturb it; leave and the system finds its structure again.'}</p>
    </div>
    <div className="signal-status"><i /> {language === 'zh' ? '实时物理 · 指针排斥' : 'LIVE PHYSICS · POINTER REPULSION'}</div>
  </section>
};

export const ExperimentalSections: React.FC = () => {
  const { language } = useI18n();
  return <div className="experimental-sections">
    <header className="lab-interlude"><span>{language === 'zh' ? '超越 SPLINE / 自研交互' : 'BEYOND SPLINE / CODED IN-HOUSE'}</span><h2>{language === 'zh' ? <>浏览器<br />就是<em>媒介。</em></> : <>THE BROWSER<br />IS THE <em>MEDIUM.</em></>}</h2></header>
    <ShaderLab />
    <KineticType />
    <SignalNetwork />
  </div>
};
