import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'zh';

const en: Record<string, string> = {
  'nav.work': 'WORK', 'nav.contact': 'CONTACT', 'nav.language': '中文',
  'hero.field': 'AI & Systems Engineering',
  'hero.principle': 'Thinking in systems.\nDesigning with care.',
  'hero.bio': "I'm Mutsumi Wakaba (若叶睦), leading AI Engineering & Intelligent Systems. Building products at scale.",
  'hero.title': 'I BRING\nCRAFT & TASTE\nTO DIGITAL WORK',
  'hero.role': '✦ AI ENGINEER',
  'timeline.kicker': 'AI STACK EVOLUTION / 2017—2026',
  'timeline.intro1': 'FROM TRANSFORMER', 'timeline.intro2': 'TO HARNESS.',
  'timeline.introBody': 'Seven engineering layers — from sequence models to reliable agent systems you can ship.',
  'timeline.scroll': 'SCROLL TO CLIMB THE STACK →',
  'timeline.move': 'SCROLL / SELECT / EXPLORE',
  'timeline.shift': 'SHIFT', 'timeline.solution': 'SOLUTION', 'timeline.mechanism': 'MECHANISM', 'timeline.limit': 'LIMIT',

  'timeline.1.layer': 'Infrastructure', 'timeline.1.short': 'Transformer',
  'timeline.1.title': 'Transformer', 'timeline.1.accent': 'Encoder-Decoder',
  'timeline.1.chain': 'Encoder → Multi-Head Attention → Decoder',
  'timeline.1.body': 'Attention made sequence modeling parallel. Encoder-Decoder (and later decoder-only scaling) turned prediction into the substrate of modern AI systems.',
  'timeline.1.shift': 'From RNN recurrence to attention', 'timeline.1.solution': 'Transformer architecture', 'timeline.1.mechanism': 'QKV attention + residual stacks', 'timeline.1.limit': 'Compute scale, data hunger, no tools',

  'timeline.2.layer': 'Model Interaction', 'timeline.2.short': 'Chatbot & Prompt',
  'timeline.2.title': 'Chatbot & Prompt Engineering', 'timeline.2.accent': 'Few-Shot',
  'timeline.2.chain': 'System · Few-shot · User → Completion',
  'timeline.2.body': 'The model becomes an interface. Prompt engineering and few-shot examples steer behavior without updating weights — chat is the new API.',
  'timeline.2.shift': 'Model as interactive product', 'timeline.2.solution': 'Prompt design + few-shot', 'timeline.2.mechanism': 'In-context learning', 'timeline.2.limit': 'Brittle prompts, hard to verify',

  'timeline.3.layer': 'Knowledge Expansion', 'timeline.3.short': 'LoRA vs RAG',
  'timeline.3.title': 'Fine-Tuning vs RAG', 'timeline.3.accent': 'two knowledge paths',
  'timeline.3.chain': 'LoRA (ΔW)  ·  RAG (Retrieve → Generate)',
  'timeline.3.body': 'Fine-tuning (LoRA) changes weights for style and domain. RAG keeps the base frozen and injects retrieved evidence per request.',
  'timeline.3.shift': 'Private & fresh knowledge', 'timeline.3.solution': 'LoRA and/or retrieval', 'timeline.3.mechanism': 'Adapt weights / retrieve context', 'timeline.3.limit': 'Drift · retrieval quality · cost',
  'timeline.3.ft': 'Fine-Tuning / LoRA', 'timeline.3.rag': 'RAG', 'timeline.3.weights': 'Changes weights', 'timeline.3.live': 'Live knowledge', 'timeline.3.cost': 'Update cost',

  'timeline.4.layer': 'Action Execution', 'timeline.4.short': 'Function Call → MCP',
  'timeline.4.title': 'Function Calling → MCP', 'timeline.4.accent': 'tools as protocol',
  'timeline.4.chain': 'Schema → Call → Execute → Observe → MCP ports',
  'timeline.4.body': 'Structured function calling gives models hands. MCP standardizes how apps, tools and data sources connect across systems.',
  'timeline.4.shift': 'From text to side effects', 'timeline.4.solution': 'Function calling + MCP', 'timeline.4.mechanism': 'Schema-bound tool loop', 'timeline.4.limit': 'Auth, retries, idempotency, safety',

  'timeline.5.layer': 'Autonomous Loop', 'timeline.5.short': 'Agent / Multi-Agent',
  'timeline.5.title': 'Agent (ReAct)', 'timeline.5.accent': '→ Multi-Agent',
  'timeline.5.chain': 'Think → Act → Observe ↻  ·  Multi-Agent roles',
  'timeline.5.body': 'An agent is a loop, not a persona: Think-Act-Observe. Multi-agent helps only when context, permissions or workstreams truly separate.',
  'timeline.5.shift': 'Multi-step closed loops', 'timeline.5.solution': 'ReAct + tool observations', 'timeline.5.mechanism': 'Plan / act / reflect cycle', 'timeline.5.limit': 'Handoffs blow up tokens & latency',
  'timeline.5.single': 'Single Agent', 'timeline.5.multi': 'Multi-Agent', 'timeline.5.agents': 'Agents', 'timeline.5.handoffs': 'Handoffs', 'timeline.5.pattern': 'Pattern',

  'timeline.6.layer': 'Context Management', 'timeline.6.short': 'Context & Skill',
  'timeline.6.title': 'Context Engineering', 'timeline.6.accent': '& Agent Skill',
  'timeline.6.chain': 'Write → Select → Compress → Isolate → Progressive Skill load',
  'timeline.6.body': 'Intelligence is what stays in context. Skills package instructions and resources, then load only when needed — progressive, not dump-everything.',
  'timeline.6.shift': 'Context as managed workspace', 'timeline.6.solution': 'Context ops + Skill packs', 'timeline.6.mechanism': 'Progressive dynamic loading', 'timeline.6.limit': 'Noise dilutes attention',
  'timeline.6.write': 'Write', 'timeline.6.select': 'Select', 'timeline.6.compress': 'Compress', 'timeline.6.skill': 'Skill', 'timeline.6.capacity': 'Context capacity',

  'timeline.7.layer': 'App / Control', 'timeline.7.short': 'OpenClaw & Harness',
  'timeline.7.title': 'OpenClaw & Harness', 'timeline.7.accent': 'shippable systems',
  'timeline.7.chain': 'OpenClaw (edge UX)  ·  Harness (constraints + tests)',
  'timeline.7.body': 'OpenClaw brings agent interaction to the edge. Harness engineering wraps the model with constraints, full context, verification and automated feedback so long-running work is trustworthy.',
  'timeline.7.shift': 'From demo to durable product', 'timeline.7.solution': 'Edge UX + harness loop', 'timeline.7.mechanism': 'Guide → context → verify → feedback', 'timeline.7.limit': 'Unbounded agents cannot be trusted',
  'timeline.7.openclawBody': 'Edge-side interaction layer for human ↔ agent control loops.',
  'timeline.7.guide': 'Guide', 'timeline.7.context': 'Context', 'timeline.7.verify': 'Verify', 'timeline.7.feedback': 'Feedback', 'timeline.7.pass': 'PASS',

  'timeline.end': 'THE MODEL IS THE ENGINE.\nTHE SYSTEM MAKES IT USEFUL.',
  'warp.title': 'INNOVATE WITH\nA HUMAN TOUCH',
  'warp.1': '✦ Clarity first. Delight second.', 'warp.2': '✦ Ship in small loops. Aim for long arcs.', 'warp.3': '✦ Build for the people behind the screen.',
  'footer.available': 'AVAILABLE FOR SELECTED PROJECTS ·', 'footer.kicker': 'HAVE A COMPLEX IDEA?',
  'footer.title1': "LET'S CREATE", 'footer.title2': 'SOMETHING', 'footer.accent': 'EXTRAORDINARY',
};

const zh: Record<string, string> = {
  'nav.work': '作品', 'nav.contact': '联系', 'nav.language': 'EN',
  'hero.field': 'AI 与智能系统工程',
  'hero.principle': '系统性思考。\n带着克制与关怀设计。',
  'hero.bio': '我是若叶睦，专注 AI 工程与智能系统，让复杂技术成为可规模化的产品。',
  'hero.title': '以工程与审美\n塑造数字体验',
  'hero.role': '✦ AI 工程师',
  'timeline.kicker': 'AI 技术栈演进 / 2017—2026',
  'timeline.intro1': '从 Transformer', 'timeline.intro2': '到 Harness。',
  'timeline.introBody': '七层工程跃迁：从序列模型，走到可交付、可约束、可验证的智能体系统。',
  'timeline.scroll': '向下滚动，沿技术栈向上攀升 →',
  'timeline.move': '滚动 / 点选 / 探索',
  'timeline.shift': '技术跃迁', 'timeline.solution': '解决方案', 'timeline.mechanism': '核心机制', 'timeline.limit': '工程痛点',

  'timeline.1.layer': '基础设施', 'timeline.1.short': 'Transformer',
  'timeline.1.title': 'Transformer', 'timeline.1.accent': 'Encoder-Decoder',
  'timeline.1.chain': 'Encoder → Multi-Head Attention → Decoder',
  'timeline.1.body': 'Attention 让序列建模可并行。Encoder-Decoder（及后来的 Decoder-only 规模化）把「预测」变成现代 AI 的底层算力与接口底座。',
  'timeline.1.shift': '从 RNN 循环到注意力', 'timeline.1.solution': 'Transformer 架构', 'timeline.1.mechanism': 'QKV 注意力 + 残差堆叠', 'timeline.1.limit': '算力与数据饥渴，尚无工具',

  'timeline.2.layer': '模型交互', 'timeline.2.short': 'Chatbot & Prompt',
  'timeline.2.title': 'Chatbot & Prompt Engineering', 'timeline.2.accent': 'Few-Shot',
  'timeline.2.chain': 'System · Few-shot · User → Completion',
  'timeline.2.body': '模型变成可交互产品。Prompt 工程与少样本示例在不改权重的前提下引导行为——对话即接口。',
  'timeline.2.shift': '模型成为交互产品', 'timeline.2.solution': 'Prompt 设计 + Few-Shot', 'timeline.2.mechanism': '上下文学习 (ICL)', 'timeline.2.limit': '提示脆弱、难以验证',

  'timeline.3.layer': '知识扩化', 'timeline.3.short': 'LoRA vs RAG',
  'timeline.3.title': 'Fine-Tuning vs RAG', 'timeline.3.accent': '两条知识路径',
  'timeline.3.chain': 'LoRA (ΔW)  ·  RAG (检索 → 生成)',
  'timeline.3.body': '微调（LoRA）改权重以适配风格与领域；RAG 冻结基座，在每次请求中注入检索到的外部证据。',
  'timeline.3.shift': '接入私有与最新知识', 'timeline.3.solution': 'LoRA 与/或 检索增强', 'timeline.3.mechanism': '改权重 / 检索上下文', 'timeline.3.limit': '漂移 · 检索质量 · 成本',
  'timeline.3.ft': '微调 / LoRA', 'timeline.3.rag': 'RAG 检索', 'timeline.3.weights': '改变权重', 'timeline.3.live': '知识实时性', 'timeline.3.cost': '更新成本',

  'timeline.4.layer': '动作执行', 'timeline.4.short': 'Function Call → MCP',
  'timeline.4.title': 'Function Calling → MCP', 'timeline.4.accent': '工具协议化',
  'timeline.4.chain': 'Schema → 调用 → 执行 → 观察 → MCP 端口',
  'timeline.4.body': '结构化 Function Calling 让模型拥有「手」；MCP 把应用、工具与数据源的连接标准化，实现跨应用通用工具协议。',
  'timeline.4.shift': '从生成文本到产生副作用', 'timeline.4.solution': 'Function Calling + MCP', 'timeline.4.mechanism': 'Schema 约束的工具环', 'timeline.4.limit': '权限、重试、幂等与安全',

  'timeline.5.layer': '自主循环', 'timeline.5.short': 'Agent / Multi-Agent',
  'timeline.5.title': 'Agent (ReAct)', 'timeline.5.accent': '→ Multi-Agent',
  'timeline.5.chain': 'Think → Act → Observe ↻  ·  多 Agent 分工',
  'timeline.5.body': 'Agent 的本质是循环而非人格：Think-Act-Observe。只有当上下文、权限或任务流真正可拆分时，Multi-Agent 才有价值。',
  'timeline.5.shift': '多步骤闭环', 'timeline.5.solution': 'ReAct + 工具观察', 'timeline.5.mechanism': '规划 / 行动 / 反思循环', 'timeline.5.limit': '交接放大 Token 与延迟',
  'timeline.5.single': '单 Agent', 'timeline.5.multi': 'Multi-Agent', 'timeline.5.agents': 'Agent 数', 'timeline.5.handoffs': '交接', 'timeline.5.pattern': '范式',

  'timeline.6.layer': '上下文管理', 'timeline.6.short': 'Context & Skill',
  'timeline.6.title': 'Context Engineering', 'timeline.6.accent': '& Agent Skill',
  'timeline.6.chain': '写入 → 选择 → 压缩 → 隔离 → Skill 渐进加载',
  'timeline.6.body': '智能取决于上下文里留下什么。Skill 将指令与资源打包，并只在需要时渐进式动态加载——而不是一次性塞满窗口。',
  'timeline.6.shift': '上下文成为受管工作区', 'timeline.6.solution': '上下文操作 + Skill 包', 'timeline.6.mechanism': '渐进式动态加载', 'timeline.6.limit': '噪声稀释注意力',
  'timeline.6.write': '写入', 'timeline.6.select': '选择', 'timeline.6.compress': '压缩', 'timeline.6.skill': 'Skill', 'timeline.6.capacity': '上下文容量',

  'timeline.7.layer': '应用 / 驾驭', 'timeline.7.short': 'OpenClaw & Harness',
  'timeline.7.title': 'OpenClaw & Harness', 'timeline.7.accent': '可交付系统',
  'timeline.7.chain': 'OpenClaw（端侧交互） · Harness（约束 + 自动化测试）',
  'timeline.7.body': 'OpenClaw 把人机协同放到端侧；Harness Engineering 用强约束、完整上下文、自动验证与反馈循环，让长程任务真正可被信任。',
  'timeline.7.shift': '从演示到可长期运行的产品', 'timeline.7.solution': '端侧 UX + 驾驭工程', 'timeline.7.mechanism': '约束 → 上下文 → 验证 → 反馈', 'timeline.7.limit': '不受控的 Agent 无法被信任',
  'timeline.7.openclawBody': '端侧交互层：人与 Agent 控制环的触点。',
  'timeline.7.guide': '强约束', 'timeline.7.context': '完整上下文', 'timeline.7.verify': '自动验证', 'timeline.7.feedback': '反馈修复', 'timeline.7.pass': '通过',

  'timeline.end': '模型只是引擎。\n系统让智能真正可用。',
  'warp.title': '以人的尺度\n推动技术创新',
  'warp.1': '✦ 清晰优先，惊喜随后。', 'warp.2': '✦ 小步交付，长期主义。', 'warp.3': '✦ 为屏幕背后真实的人设计。',
  'footer.available': '接受精选项目合作 ·', 'footer.kicker': '有一个复杂的想法？',
  'footer.title1': '让我们一起创造', 'footer.title2': '真正', 'footer.accent': '非凡的作品',
};

type I18nValue = { language: Language; setLanguage: (language: Language) => void; toggleLanguage: () => void; t: (key: string) => string };
const I18nContext = createContext<I18nValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem('wakaba-language');
    if (saved === 'en' || saved === 'zh') return saved;
    return window.navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    window.localStorage.setItem('wakaba-language', language);
  }, [language]);

  const value = useMemo<I18nValue>(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === 'en' ? 'zh' : 'en'),
    t: (key) => (language === 'zh' ? zh : en)[key] ?? en[key] ?? key,
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
};
