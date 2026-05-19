'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ventWithAura, revealCareerPath, type PathfinderMessage, type RevealData } from '@/lib/pathfinder';

type Phase = 'vent' | 'synthesizing' | 'reveal';

// Only very explicit, intentional phrases trigger auto-synthesis
// Casual "what do you think" is handled by Aura as a normal conversation turn
const SYNTHESIS_TRIGGERS = [
  'give me your verdict',
  'give me the verdict',
  'give me my verdict',
  'get my verdict',
  'get the verdict',
  'get your verdict',
  'i want my verdict',
  'i want the verdict',
  "i'm ready for my verdict",
  'i am ready for my verdict',
  "i'm ready for the verdict",
  "i'm done ranting",
  'i am done ranting',
  "okay i'm done",
  'okay i am done',
  'verdict please',
  'hit me with it',
  'just tell me already',
  'tell me what you think overall',
  'give me the full picture',
  'what is your verdict',
  "what's your final verdict",
  'make your verdict',
  'drop the verdict',
];

function hasSynthesisTrigger(text: string): boolean {
  const lower = text.toLowerCase();
  return SYNTHESIS_TRIGGERS.some(t => lower.includes(t));
}

interface VibeDef {
  label: string;
  keywords: string[];
}

const VIBE_DEFINITIONS: VibeDef[] = [
  { label: 'Burnout 🌋', keywords: [
    'burnout', 'burned out', 'burnt out', 'exhausted', 'tired', 'miserable', 'agotado', 'agotada', 'cansado', 'cansada', 'estresado', 'estresada', 'quemado', 'quemada',
    '疲惫', '累', '心累', '枯竭', '倦怠', '压力大', '번아웃', '피곤', '지침', '스트레스', '힘듦', '힘들어', '燃え尽き', '疲れた', 'つかれた', 'しんどい', '限界',
    'épuisé', 'épuisée', 'fatigué', 'fatiguée', 'surmené', 'surmenée', 'stressé', 'stressée', 'выгорание', 'устал', 'устала', 'выгорел', 'выгорела', 'утомление', 'стресс',
    'шаршадым', 'шаршау', 'күйіп кету', 'күйіп кеттім', 'capek', 'cape', 'lelah', 'letih', 'penat', 'jenuh'
  ] },
  { label: 'Frustrated 😤', keywords: [
    'frustrated', 'frustration', 'annoyed', 'hate', 'dislike', 'annoy', 'frustrado', 'frustrada', 'molesto', 'molesta', 'odio',
    '挫败', '沮丧', '生气', '烦', '讨厌', '恨', '좌절', '짜증', '화남', '싫어', '답답', 'イライラ', 'いらいら', '不満', '嫌', 'いや', 'うざい',
    'frustré', 'frustrée', 'énervé', 'énervée', 'colère', 'déçu', 'déçue', 'déteste', 'разочарован', 'разочарована', 'раздражает', 'бесит', 'ненавижу',
    'ызаландым', 'ызалану', 'ренжідім', 'жек көремін', 'kesal', 'sebal', 'kecewa', 'marah', 'kesel', 'dongkol'
  ] },
  { label: 'Excited ✨', keywords: [
    'excited', 'passionate', 'motivated', 'goosebumps', 'thrill', 'emocionado', 'emocionada', 'motivado', 'motivada', 'entusiasmado', 'entusiasmada',
    '兴奋', '激动', '热情', '鸡皮疙瘩', '动力', '설렘', '기대', '열정', '소름', '신남', 'ワクワク', 'わくわく', '楽しみ', '情熱', '鳥肌',
    'excité', 'excitée', 'passionné', 'passionnée', 'motivé', 'motivée', 'frissons', 'воодушевлен', 'воодушевлена', 'радость', 'мурашки', 'страсть',
    'қуаныштымын', 'рухтандым', 'қызықты', 'шабыт', 'semangat', 'antusias', 'gembira', 'tertarik'
  ] },
  { label: 'Happy 😊', keywords: [
    'happy', 'enjoy', 'enjoyed', 'enjoying', 'love', 'goodness', 'ejnoy', 'ejnoyed', 'ejnoying', 'feliz', 'disfruto', 'encanta', 'gusta', 'disfrutar',
    '开心', '快乐', '喜欢', '享受', '爱', '행복', '좋아', '즐거움', '즐겁', '사랑', '嬉しい', 'うれしい', '楽しい', 'たのしい', '好き', 'すき',
    'heureux', 'heureuse', 'adore', 'aime', 'content', 'contente', 'рад', 'рада', 'счастлив', 'счастлива', 'нравится', 'люблю',
    'бақыттымын', 'ұнайды', 'жақсы көремін', 'қуанамын', 'senang', 'bahagia', 'suka', 'menikmati'
  ] },
  { label: 'Afraid 😰', keywords: [
    'afraid', 'fear', 'worried', 'anxious', 'lose', 'lost', 'miedo', 'asustado', 'asustada', 'preocupado', 'preocupada', 'perder',
    '害怕', '担心', '焦虑', '迷茫', '怕', '걱정', '불안', '두려움', '무서움', '不安', '心配', '怖い', 'こわい', '恐れ',
    'peur', 'inquiet', 'inquiète', 'inquiets', 'angoisse', 'боюсь', 'страх', 'беспокоюсь', 'тревога', 'қорқамын', 'уайымдаймын', 'қорқыныш', 'takut', 'khawatir', 'cemas', 'gugup'
  ] },
  { label: 'Stuck 🧗', keywords: [
    'stuck', 'confused', 'bored', 'rusty', 'shelf', 'stagnant', 'atascado', 'atascada', 'perdido', 'perdida', 'aburrido', 'aburrida',
    '卡住', '迷失', '无聊', '瓶颈', '停滞', '막힘', '지루', '답이 없음', '정체', '行き詰まり', 'つまらない', '退屈', 'マンネリ',
    'bloqué', 'bloquée', 'perdu', 'perdue', 'ennuyé', 'ennuyée', 'застрял', 'застряла', 'потерялся', 'потерялась', 'скучно', 'тұрып қалдым', 'адастым', 'ішім пысты', 'bingung', 'bosan', 'stagnan', 'terjebak', 'mampet'
  ] },
  { label: 'AI & ML 🤖', keywords: [
    'ai', 'ml', 'machine learning', 'deep learning', 'model', 'fine-tuning', 'fine tuning', 'llm', 'nlp', 'pytorch', 'tensorflow', 'multimodal', 'agent', 'agents', 'open source', 'dataset', 'datasets', 'ia', 'inteligencia artificial',
    '人工智能', '机器学习', '深度学习', '模型', '微调', '大模型', '智能体', '开源', '인공지능', '머신러닝', '딥러닝', '모델', '파인튜닝', '에이전트', '오픈소스', '人工知能', '機械学習', '深層学習', 'モデル', 'ファインチューニング', 'エージェント',
    'apprentissage automatique', 'intelligence artificielle', 'ии', 'искусственный интеллект', 'машинное обучение', 'жасанды интеллект', 'жи', 'машиналық оқыту'
  ] },
  { label: 'Coding 💻', keywords: [
    'coding', 'code', 'programmer', 'software', 'engineer', 'developer', 'architecture', 'fullstack', 'backend', 'frontend', 'programar', 'programación', 'codigo', 'código', 'desarrollador', 'desarrolladora', 'ingeniero', 'ingeniera',
    '写代码', '编程', '程序员', '软件', '开发', '架构', '全栈', '后端', '前端', '코딩', '개발', '프로그래머', '소프트웨어', '엔지니어', '아키텍처', '풀스택', '백엔드', '프론트엔드', 'コーディング', 'コード', 'プログラミング', '開発', 'エンジニア', '設計', 'フルスタック', 'バックエンド', 'フロントエンド',
    'coder', 'programmeur', 'développeur', 'développeuse', 'ingénieur', 'ingénieure', 'кодить', 'программист', 'разработчик', 'инженер', 'кодтау', 'бағдарламашы', 'әзірлеуші'
  ] },
  { label: 'Company & Team 👥', keywords: [
    'company', 'team', 'boss', 'manager', 'colleague', 'office', 'hr', 'empresa', 'compañía', 'equipo', 'jefe', 'jefa', 'oficina',
    '公司', '团队', '老板', '经理', '同事', '办公室', '회사', '팀', '사장', '매니저', '동료', '사무실', '会社', 'チーム', '上司', 'マネージャー', '同僚', 'オフィス',
    'entreprise', 'équipe', 'patron', 'bureau', 'компания', 'команда', 'босс', 'начальник', 'коллега', 'офис', 'ұжым', 'бастық', 'әріптес', 'perusahaan', 'kantor', 'rekan', 'kolega'
  ] },
  { label: 'Money & Level 💸', keywords: [
    'salary', 'money', 'underpaid', 'promotion', 'raise', 'salario', 'sueldo', 'dinero', 'pagado', 'pagada', 'aumento',
    '工资', '薪水', '钱', '晋升', '加薪', '贬值', '월급', '연봉', '돈', '승진', '인상', '給料', '年収', 'お金', '昇進', '昇給',
    'argent', 'augmenter', 'augmentation', 'зарплата', 'деньги', 'повышение', 'жалақы', 'ақша', 'лауазым', 'gaji', 'duit', 'promosi'
  ] },
  { label: 'Impact & Mission 💚', keywords: [
    'impact', 'purpose', 'mission', 'goodness', 'helping', 'help', 'mental health', 'impacto', 'misión', 'ayudar', 'ayuda', 'salud mental',
    '影响', '使命', '帮助', '心理健康', '영향', '사명', '도ум', '정신 건강', '影響', '使命', '助ける', 'メンタルヘルス',
    'aider', 'santé mentale', 'влияние', 'помогать', 'ментальное здоровье', 'ықпал', 'көмектесу', 'психикалық саулық', 'dampak', 'tujuan', 'kesehatan mental'
  ] },
  { label: 'Web Builder 🌐', keywords: [
    'web builder', 'builder', 'website', 'websites', 'creador web', 'sitio web', 'pagina web', 'página web',
    '网页生成器', '网站', '建站', '웹 빌дер', '웹사이트', '홈페이지', 'ホームページ', 'ウェブサイト', 'サイト',
    'créateur de site', 'конструктор сайтов', 'сайт жасаушы'
  ] },
  { label: 'Degree & Science 🎓', keywords: [
    'degree', 'master', 'phd', 'science', 'university', 'thesis', 'graduate', 'título', 'maestría', 'universidad', 'tesis', 'graduado', 'graduada',
    '学位', '硕士', '博士', '大学', '论文', '毕业', '학위', '석사', '박사', '대학', '논문', '졸업', '学位', '修士', '博士', '大学', '論文', '卒業',
    'diplôme', 'thèse', 'диплом', 'магистр', 'диссертация', 'wisuda', 'kuliah'
  ] },
];

function getVibeDetected(history: PathfinderMessage[]): string[] {
  const allText = history
    .filter(m => m.isUser)
    .map(m => m.text.toLowerCase())
    .join(' ');

  const detected: string[] = [];

  for (const def of VIBE_DEFINITIONS) {
    const hasMatch = def.keywords.some(keyword => {
      const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const pattern = (keyword.length <= 3 && /^[a-z0-9]+$/i.test(keyword))
        ? new RegExp(`\\b${escaped}\\b`, 'i')
        : new RegExp(escaped, 'i');
      
      return pattern.test(allText);
    });

    if (hasMatch) {
      detected.push(def.label);
    }
  }

  return detected;
}

const FALLBACK_GREETINGS: Record<string, string> = {
  English: "Okay, spill the tea! No need for the professional jargon or the polished answers. What's really going down in your work world right now? Lay it all on me. ☕️",
  Indonesian: "Oke, spill the tea! Nggak perlu bahasa formal atau jawaban yang dipoles. Apa sih yang sebenarnya terjadi di dunia kerjamу sekarang? Keluarin semuanya! ☕️",
  Spanish: "¡Vale, cuéntame el chisme! Sin rodeos profesionales ni respuestas preparadas. ¿Qué está pasando realmente en tu trabajo ahora mismo? ¡Desahógate! ☕️",
  Chinese: "好啦，快跟我八卦一下！不需要官方客套，也不用完美回答。你工作上到底发生什么事了？统统说出来吧！ ☕️",
  Korean: "자, 썰 좀 풀어봐요! 회사용 말투나 꾸며낸 대답은 필요 없어요. 요즘 회사에서 진짜 무슨 일이 일어나고 있는 건가요? 다 털어놓으세요! ☕️",
  Japanese: "さあ、本音で話しましょう！仕事用の言葉遣いや取り繕った答えは要りません。今、職場で本当に何が起きているんですか？全部吐き出してください！ ☕️",
  French: "Allez, balance tout ! Pas besoin de jargon professionnel ni de réponses polies. Qu'est-ce qui se passe vraiment au boulot en ce moment ? Raconte-moi tout ! ☕️",
  Russian: "Ладно, выкладывай! Забудь про профессиональный жаргон и подготовленные ответы. Что на самом деле происходит у тебя на работе? Рассказывай всё! ☕️",
  Kazakh: "Ал, бәрін жайып сал! Кәсіби сөздер мен сыпайы жауаптардың қажеті жоқ. Қазір жұмысыңда не болып жатыр? Бәрін айт! ☕️"
};

export default function CareerPathfinderChatPage() {
  const [messages, setMessages] = useState<PathfinderMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>('vent');
  const [reveal, setReveal] = useState<RevealData | null>(null);
  const [started, setStarted] = useState(false);
  const [roadmap, setRoadmap] = useState<RevealData['roadmap']>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMessages = sessionStorage.getItem('pathfinder_messages');
        if (savedMessages) setMessages(JSON.parse(savedMessages));

        const savedPhase = sessionStorage.getItem('pathfinder_phase');
        if (savedPhase) setPhase(savedPhase as Phase);

        const savedReveal = sessionStorage.getItem('pathfinder_reveal');
        if (savedReveal) setReveal(JSON.parse(savedReveal));

        const savedStarted = sessionStorage.getItem('pathfinder_started');
        if (savedStarted) setStarted(JSON.parse(savedStarted));

        const savedRoadmap = sessionStorage.getItem('pathfinder_roadmap');
        if (savedRoadmap) setRoadmap(JSON.parse(savedRoadmap));
      } catch (e) {
        console.error('Error loading session storage:', e);
      }
    }
  }, []);

  // Save changes to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (messages.length > 0) {
        sessionStorage.setItem('pathfinder_messages', JSON.stringify(messages));
      }
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pathfinder_phase', phase);
    }
  }, [phase]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (reveal) {
        sessionStorage.setItem('pathfinder_reveal', JSON.stringify(reveal));
      }
    }
  }, [reveal]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pathfinder_started', JSON.stringify(started));
    }
  }, [started]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (roadmap.length > 0) {
        sessionStorage.setItem('pathfinder_roadmap', JSON.stringify(roadmap));
      }
    }
  }, [roadmap]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const vibes = getVibeDetected(messages);
  const userMessageCount = messages.filter(m => m.isUser).length;

  const startSession = () => {
    setStarted(true);
    setMessages([{ text: "Hey! Before we get started, which language are you most comfortable with? ☕", isUser: false }]);
  };

  const selectLanguage = async (lang: string) => {
    if (loading) return;
    const userMsg = `I am comfortable with ${lang}`;
    const newHistory: PathfinderMessage[] = [...messages, { text: userMsg, isUser: true }];
    setMessages(newHistory);
    setLoading(true);
    try {
      const reply = await ventWithAura(userMsg, newHistory);
      setMessages([...newHistory, { text: reply, isUser: false }]);
    } catch {
      const fallbackMsg = FALLBACK_GREETINGS[lang] || FALLBACK_GREETINGS['English'];
      setMessages([...newHistory, { text: fallbackMsg, isUser: false }]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const newHistory: PathfinderMessage[] = [...messages, { text: userMsg, isUser: true }];
    setMessages(newHistory);

    if (hasSynthesisTrigger(userMsg)) {
      triggerReveal(newHistory);
      return;
    }

    setLoading(true);
    try {
      const reply = await ventWithAura(userMsg, newHistory);
      setMessages([...newHistory, { text: reply, isUser: false }]);
      if (phase === 'reveal') setPhase('vent');
    } catch {
      if (messages.length === 1) {
        const lower = userMsg.toLowerCase();
        let matchedLang = 'English';
        if (lower.includes('indonesia') || lower.includes('indo')) matchedLang = 'Indonesian';
        else if (lower.includes('span') || lower.includes('español') || lower.includes('espanol')) matchedLang = 'Spanish';
        else if (lower.includes('chin') || lower.includes('中文') || lower.includes('汉语') || lower.includes('漢語')) matchedLang = 'Chinese';
        else if (lower.includes('kor') || lower.includes('한국') || lower.includes('한글')) matchedLang = 'Korean';
        else if (lower.includes('jap') || lower.includes('日本語') || lower.includes('にほんご')) matchedLang = 'Japanese';
        else if (lower.includes('fren') || lower.includes('fran') || lower.includes('français') || lower.includes('francais')) matchedLang = 'French';
        else if (lower.includes('russ') || lower.includes('рус') || lower.includes('русский')) matchedLang = 'Russian';
        else if (lower.includes('kaz') || lower.includes('қазақ') || lower.includes('казах')) matchedLang = 'Kazakh';
        
        const fallbackMsg = FALLBACK_GREETINGS[matchedLang] || FALLBACK_GREETINGS['English'];
        setMessages([...newHistory, { text: fallbackMsg, isUser: false }]);
      } else {
        setMessages([...newHistory, { text: "Ugh, lost my train of thought for a sec. Say that again?", isUser: false }]);
      }
    }
    setLoading(false);
  };

  const triggerReveal = async (history: PathfinderMessage[]) => {
    setPhase('synthesizing');
    setLoading(true);
    const thinkingMsg = "Okay okay okay. Give me a second to put this all together — you've given me a LOT to work with. 🔮";
    setMessages([...history, { text: thinkingMsg, isUser: false }]);
    try {
      const data = await revealCareerPath(history);
      setReveal(data);
      setRoadmap(data.roadmap);
      setPhase('reveal');
      const followUp = "So — does that feel right to you? 👆 Check the panel on the right for your full verdict and roadmap. If something feels off, or you want me to factor in more context, just keep talking below and hit \"Refine Verdict\" when you're ready. No verdict is final until YOU say so.";
      setMessages(prev => [...prev, { text: followUp, isUser: false }]);
    } catch {
      setPhase('vent');
      setMessages([...history, { text: "My brain glitched on that one 😅 Try again in a sec?", isUser: false }]);
    }
    setLoading(false);
  };

  const refineVerdict = () => {
    setPhase('vent');
  };

  const toggleMilestone = (id: string) =>
    setRoadmap(r => r.map(m => m.id === id ? { ...m, done: !m.done } : m));

  const resetSession = () => {
    setMessages([]); setInput(''); setPhase('vent');
    setReveal(null); setRoadmap([]); setStarted(false); setLoading(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pathfinder_messages');
      sessionStorage.removeItem('pathfinder_phase');
      sessionStorage.removeItem('pathfinder_reveal');
      sessionStorage.removeItem('pathfinder_started');
      sessionStorage.removeItem('pathfinder_roadmap');
    }
  };

  const modeConfig = {
    UPGRADE: { label: 'The Double Down', emoji: '🚀', tagline: 'Career Upgrade', gradient: 'from-teal-400 to-emerald-500', border: 'border-teal-500/30', bg: 'bg-teal-500/8', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
    PIVOT:   { label: 'The Great Escape', emoji: '🌅', tagline: 'Career Pivot',  gradient: 'from-rose-400 to-amber-400', border: 'border-rose-500/30',  bg: 'bg-rose-500/8',  text: 'text-rose-400',  glow: 'shadow-rose-500/20' },
  };
  const cfg = reveal ? modeConfig[reveal.mode] : null;

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/playground/career-pathfinder" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300">
          ← Go away from this playground
        </Link>
        <div className="flex items-center space-x-2">
          {phase === 'vent' && <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black rounded-full uppercase tracking-widest">☕ The Vent</span>}
          {phase === 'synthesizing' && <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black rounded-full uppercase tracking-widest animate-pulse">🔮 Synthesizing...</span>}
          {phase === 'reveal' && cfg && <span className={`px-3 py-1 ${cfg.bg} border ${cfg.border} ${cfg.text} text-xs font-black rounded-full uppercase tracking-widest`}>{cfg.emoji} {cfg.tagline}</span>}
        </div>
      </div>

      {/* Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-[640px]">

        {/* LEFT — Chat */}
        <div className="lg:col-span-3 glass-card rounded-3xl border border-purple-500/10 flex flex-col overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-white/5 flex items-center space-x-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">☕</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#03000a]" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Aura</div>
              <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest">Your Career BFF · No Judgment Zone</div>
            </div>
            {userMessageCount >= 5 && phase === 'vent' && (
              <button
                onClick={() => triggerReveal(messages)}
                disabled={loading}
                className="ml-auto px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-40 flex-shrink-0"
              >
                🔮 Get My Verdict
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {!started ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
                <div className="text-5xl animate-bounce">☕</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">Meet Aura</h3>
                  <p className="text-gray-400 text-sm max-w-xs leading-relaxed">Your brutally honest, surprisingly funny career friend. No resume. No assessments. Just talk.</p>
                </div>
                <div className="space-y-2 text-left max-w-xs">
                  {["🤬 Rant about your boss", "💭 Share your wildest career dreams", "😴 Admit you're totally burned out", "🦆 Ask if cartoon ducks pay well"].map((t,i) => (
                    <div key={i} className="text-xs text-gray-500 flex items-center space-x-2">
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
                <button onClick={startSession} className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold text-sm tracking-widest uppercase rounded-2xl transition-all shadow-lg shadow-purple-500/20">
                  Start Venting ☕
                </button>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className="space-y-2">
                    <div className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                      {!msg.isUser && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs flex-shrink-0 mb-0.5">☕</div>}
                      <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.isUser
                          ? 'bg-purple-600/20 border border-purple-500/20 text-white rounded-br-sm font-medium'
                          : 'bg-white/5 border border-white/5 text-gray-200 rounded-bl-sm'
                      }`}>{msg.text}</div>
                    </div>
                    {i === 0 && !msg.isUser && messages.length === 1 && (
                      <div className="flex flex-wrap gap-2 pl-8">
                        {[
                          { name: 'English 🇺🇸', val: 'English' },
                          { name: 'Indonesian 🇮🇩', val: 'Indonesian' },
                          { name: 'Spanish 🇪🇸', val: 'Spanish' },
                          { name: 'Chinese 🇨🇳', val: 'Chinese' },
                          { name: 'Korean 🇰🇷', val: 'Korean' },
                          { name: 'Japanese 🇯🇵', val: 'Japanese' },
                          { name: 'French 🇫🇷', val: 'French' },
                          { name: 'Russian 🇷🇺', val: 'Russian' },
                          { name: 'Kazakh 🇰🇿', val: 'Kazakh' }
                        ].map((lang) => (
                          <button
                            key={lang.val}
                            onClick={() => selectLanguage(lang.val)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/30 rounded-xl text-xs text-gray-300 hover:text-white transition-all font-medium"
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs flex-shrink-0">☕</div>
                    <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center space-x-1">
                      {[0,150,300].map(d => <div key={d} style={{ animationDelay: `${d}ms` }} className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />)}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          {started && phase !== 'synthesizing' && (
            <div className="px-4 py-3.5 border-t border-white/5">
              {userMessageCount >= 4 && userMessageCount < 5 && phase === 'vent' && (
                <p className="text-[10px] text-gray-500 text-center mb-2">Keep going — say <span className="text-purple-400 font-bold">&ldquo;give me your verdict&rdquo;</span> or hit <span className="text-purple-400 font-bold">Get My Verdict</span> when you&apos;re ready</p>
              )}
              <div className="flex items-end space-x-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={phase === 'reveal' ? "Ask Aura anything about your results..." : "Just talk. Rant. Dream. Whatever."}
                  disabled={loading}
                  rows={2}
                  className="flex-1 bg-white/5 border border-white/10 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none resize-none transition-all disabled:opacity-40 leading-relaxed"
                />
                <button onClick={sendMessage} disabled={!input.trim() || loading}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Dynamic Panel */}
        <div className="lg:col-span-2 glass-card rounded-3xl border border-purple-500/10 overflow-hidden shadow-2xl flex flex-col">

          {/* PHASE: VENT */}
          {phase === 'vent' && (
            <div className="flex-1 flex flex-col p-6 space-y-5">
              <div className="text-center space-y-1">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Vibe Detector</div>
                <p className="text-[10px] text-gray-500">What Aura&apos;s picking up from your words</p>
              </div>

              {!started || vibes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/10 flex items-center justify-center text-3xl animate-pulse">🎙️</div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Nothing detected yet</p>
                    <p className="text-xs text-gray-500 max-w-[160px] leading-relaxed">Start venting — Aura will pick up on key themes from your words.</p>
                  </div>
                  <div className="w-full space-y-2 pt-2">
                    {['Emotional Tone', 'Hidden Passions', 'Pain Points'].map((label, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 400}ms` }} />
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-purple-500/30 rounded-full" />
                        </div>
                        <span className="text-[9px] text-gray-600 font-bold uppercase">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-4 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {vibes.map((v, i) => (
                      <span key={i} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full uppercase tracking-wide animate-in fade-in">
                        {v}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Session Stats</div>
                    {[
                      { label: 'Messages exchanged', value: messages.length },
                      { label: 'Topics detected', value: vibes.length },
                      { label: 'Vibe intensity', value: `${Math.min(vibes.length * 15 + userMessageCount * 8, 100)}%` },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-[10px] text-gray-400">{stat.label}</span>
                        <span className="text-[10px] font-black text-purple-400">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {userMessageCount >= 3 && (
                    <div className="pt-2 space-y-2">
                      <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-center">
                        <p className="text-[10px] text-gray-400 leading-relaxed">Aura has enough to work with. Ready for your verdict?</p>
                      </div>
                      <button onClick={() => triggerReveal(messages)} disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-40">
                        🔮 Get My Verdict
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PHASE: SYNTHESIZING */}
          {phase === 'synthesizing' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full border-2 border-pink-500/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                <div className="absolute inset-4 rounded-full border-2 border-rose-500/20 animate-spin" style={{ animationDuration: '1.5s' }} />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🔮</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white animate-pulse">Connecting the dots...</h3>
                <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">Aura is reading between the lines of everything you said.</p>
              </div>
              <div className="space-y-2 w-full max-w-[200px] text-left">
                {['Analyzing emotional tone', 'Mapping hidden passions', 'Identifying your pattern', 'Building your verdict'].map((step, i) => (
                  <div key={i} className="flex items-center space-x-2" style={{ animationDelay: `${i * 0.5}s` }}>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 300}ms` }} />
                    <span className="text-[10px] text-gray-500">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHASE: REVEAL */}
          {phase === 'reveal' && reveal && cfg && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className={`px-5 py-4 bg-gradient-to-r ${cfg.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-white to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl">{cfg.emoji}</span>
                    <div>
                      <div className="text-xs font-black text-white/80 uppercase tracking-widest">{cfg.tagline}</div>
                      <div className="text-base font-black text-white leading-tight">{cfg.label}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className={`p-4 ${cfg.bg} border ${cfg.border} rounded-2xl`}>
                  <p className={`text-sm font-black ${cfg.text} leading-snug`}>&ldquo;{reveal.headline}&rdquo;</p>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Why Aura chose this</div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">{reveal.evidence}</p>
                </div>

                {reveal.skills.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-t border-white/5 pt-3">
                      {reveal.mode === 'PIVOT' ? '🔗 Your Skill Transfer Map' : '📈 Your Skill Landscape'}
                    </div>
                    {reveal.skills.map((skill, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-semibold text-gray-300 flex items-center gap-1.5">
                            {reveal.mode === 'PIVOT' && skill.isTransferable !== undefined && (
                              <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase ${skill.isTransferable ? 'bg-teal-500/15 text-teal-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                {skill.isTransferable ? '✓ Transfers' : '+ To Learn'}
                              </span>
                            )}
                            {skill.name}
                          </span>
                          <span className={`text-[9px] font-black ${skill.level >= 65 ? cfg.text : 'text-gray-500'}`}>{skill.level}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} transition-all duration-1000`} style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {roadmap.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-t border-white/5 pt-3">📋 Your Action Blueprint</div>
                    {roadmap.map(m => (
                      <button key={m.id} onClick={() => toggleMilestone(m.id)}
                        className={`w-full flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all duration-300 ${m.done ? `${cfg.bg} ${cfg.border}` : 'bg-white/3 border-white/5 hover:border-white/10'}`}>
                        <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${m.done ? `bg-gradient-to-br ${cfg.gradient} border-transparent` : 'border-white/20'}`}>
                          {m.done && <span className="text-[7px] text-white font-black">✓</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[8px] font-black uppercase tracking-widest ${cfg.text}`}>{m.timeframe}</div>
                          <div className={`text-[11px] font-medium leading-snug mt-0.5 ${m.done ? 'line-through opacity-40 text-gray-400' : 'text-white'}`}>{m.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={refineVerdict}
                    className={`flex-1 py-2.5 ${cfg.bg} border ${cfg.border} ${cfg.text} hover:opacity-80 font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all`}
                  >
                    🔄 Refine Verdict
                  </button>
                  <button
                    onClick={resetSession}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all"
                  >
                    Start Fresh
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
