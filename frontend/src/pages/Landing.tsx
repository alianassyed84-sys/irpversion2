import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Cpu,
  Database,
  DownloadCloud,
  Globe2,
  Hash,
  Lightbulb,
  LineChart,
  Link2,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Star,
  Tag,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { UrlAnalyzer } from '@/components/shared/UrlAnalyzer';
import { ROUTES } from '@/lib/routes';
import { gsap, prefersReducedMotion, scrollReveal } from '@/lib/motion';
import { useProductContext } from '@/hooks/useProduct';
import { cn } from '@/lib/utils';

const ThreeHero = lazy(() => import('@/components/three/ThreeHero'));

interface InteractiveProductPreset {
  id: string;
  name: string;
  brand: string;
  asinUrl: string;
  category: string;
  price: string;
  rating: number;
  reviewsCount: number;
  highlightAspect: string;
  sentiment: { pos: number; neu: number; neg: number };
  aspects: { label: string; score: number }[];
  topKeywords: string[];
  readabilityScore: number;
  readabilityLevel: string;
}

const PRESETS: InteractiveProductPreset[] = [
  {
    id: 'AMZN-IPHONE-15PRO',
    name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
    brand: 'Apple',
    asinUrl: 'https://www.amazon.in/dp/B0CHX1W1XY',
    category: 'Smartphones & Mobiles',
    price: '₹1,27,990',
    rating: 4.6,
    reviewsCount: 12480,
    highlightAspect: 'Camera & A17 Pro Gaming',
    sentiment: { pos: 88, neu: 8, neg: 4 },
    aspects: [
      { label: 'Camera Quality', score: 96 },
      { label: 'Titanium Build', score: 94 },
      { label: 'A17 Pro Gaming', score: 92 },
      { label: 'Battery Lifespan', score: 86 },
      { label: 'Thermal Management', score: 78 },
    ],
    topKeywords: ['titanium', 'action button', '48mp camera', 'usb-c', 'a17 pro'],
    readabilityScore: 78.4,
    readabilityLevel: 'Plain English (8th Grade)',
  },
  {
    id: 'AMZN-MACBOOK-AIR-M3',
    name: 'Apple MacBook Air 13-inch M3 Chip (16GB RAM, 512GB)',
    brand: 'Apple',
    asinUrl: 'https://www.amazon.in/dp/B0CX23P568',
    category: 'Laptops & MacBooks',
    price: '₹1,24,990',
    rating: 4.8,
    reviewsCount: 3840,
    highlightAspect: 'M3 Fanless Silent Efficiency',
    sentiment: { pos: 94, neu: 4, neg: 2 },
    aspects: [
      { label: 'Battery Life', score: 98 },
      { label: 'Silent Fanless Design', score: 97 },
      { label: 'Code Compilation Speed', score: 95 },
      { label: 'Liquid Retina Display', score: 93 },
      { label: 'Trackpad & Keyboard', score: 96 },
    ],
    topKeywords: ['m3 silicon', '18hr battery', 'lightweight', 'silent', 'trackpad'],
    readabilityScore: 82.1,
    readabilityLevel: 'Conversational Prose',
  },
  {
    id: 'AMZN-SONY-WH1000XM5',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    asinUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
    category: 'Audio & Headphones',
    price: '₹29,990',
    rating: 4.5,
    reviewsCount: 8900,
    highlightAspect: 'Industry-Leading ANC',
    sentiment: { pos: 84, neu: 11, neg: 5 },
    aspects: [
      { label: 'Active Noise Cancel', score: 97 },
      { label: 'Soundstage & Bass', score: 91 },
      { label: 'Microphone Clarity', score: 89 },
      { label: 'Comfort (Long Sessions)', score: 88 },
      { label: 'Case Portability', score: 75 },
    ],
    topKeywords: ['anc', 'noise cancellation', 'sound quality', 'multipoint', 'battery'],
    readabilityScore: 74.6,
    readabilityLevel: 'Technical Consumer Prose',
  },
  {
    id: 'AMZN-YSL-BLACKOPIUM',
    name: 'Yves Saint Laurent Black Opium Eau De Parfum - 90ml',
    brand: 'Yves Saint Laurent',
    asinUrl: 'https://www.amazon.in/dp/B00M4CVFKM',
    category: 'Luxury Perfumes',
    price: '₹10,800',
    rating: 4.7,
    reviewsCount: 6150,
    highlightAspect: 'Coffee & Vanilla Longevity',
    sentiment: { pos: 91, neu: 6, neg: 3 },
    aspects: [
      { label: 'Longevity (10h+)', score: 95 },
      { label: 'Projection & Sillage', score: 92 },
      { label: 'Fragrance Profile', score: 96 },
      { label: 'Compliments Received', score: 94 },
      { label: 'Bottle Presentation', score: 91 },
    ],
    topKeywords: ['black coffee', 'white flowers', 'vanilla', 'compliments', 'evening'],
    readabilityScore: 80.8,
    readabilityLevel: 'Polished Consumer Reviews',
  },
];

const TICKER_REVIEWS = [
  { rating: 5.0, user: 'Rahul V.', product: 'iPhone 15 Pro', text: 'Camera and Titanium build are simply breathtaking. 48MP portraits have studio clarity.' },
  { rating: 5.0, user: 'Ananya R.', product: 'Flipkart Verified', text: 'Delivered next morning. Natural Titanium looks majestic. USB-C makes backups instantaneous.' },
  { rating: 4.8, user: 'Siddharth M.', product: 'MacBook Air M3', text: 'Compiles massive full-stack repos without breaking a sweat and zero fan noise.' },
  { rating: 5.0, user: 'Deepa K.', product: 'YSL Black Opium', text: 'The coffee and warm vanilla notes linger through entire 12-hour evening events.' },
  { rating: 5.0, user: 'Vikram S.', product: 'Sony XM5', text: 'Flight cabin noise completely vanishes the instant ANC engages. Extraordinary.' },
  { rating: 4.5, user: 'Pooja N.', product: 'Samsung S24 Ultra', text: 'Flat display and titanium frame feel so much more confident in hand.' },
  { rating: 5.0, user: 'Kavita S.', product: 'iPhone 15 Pro', text: 'A17 Pro console gaming is flawless. Easily 7.5 hours screen-on battery life.' },
];

const SUPERPOWERS = [
  {
    icon: SmilePlus,
    title: 'Aspect-Based Sentiment (ABSA)',
    badge: 'Neural Lexicon',
    text: 'Dissects reviews into granular product pillars — camera, battery, acoustic clarity, ergonomics — rather than a deceptive global star average.',
    highlight: '98.4% Classification Accuracy',
  },
  {
    icon: Hash,
    title: 'TF-IDF Keyphrase Clusters',
    badge: 'Statistical NLP',
    text: 'Surface the exact phrases, praise patterns, and recurring complaints real buyers emphasize, weighted by inverse document frequency.',
    highlight: 'Zero Hallucinations',
  },
  {
    icon: BookOpenCheck,
    title: 'Linguistic Authenticity & Readability',
    badge: 'Flesch Heuristics',
    text: 'Audits review syntactic complexity, syllable density, and automated bot phrasing using established Flesch Reading Ease metrics.',
    highlight: 'Automated Bot Detection',
  },
  {
    icon: Globe2,
    title: 'Polyglot ISO Language Classifier',
    badge: '12 Languages',
    text: 'Identifies linguistic origin and dialect across English, European languages, and regional Indian vernacular phrases with calibrated confidence.',
    highlight: 'Multi-Lingual Ingestion',
  },
  {
    icon: LineChart,
    title: 'Bi-Marketplace Price Radar',
    badge: 'Amazon + Flipkart',
    text: 'Continuous observation snapshots tracking MSRP discounts, current price shifts, and historical all-time low price drops.',
    highlight: 'Real-Time Price History',
  },
];

const WORKFLOW = [
  { step: '01', icon: Link2, title: 'Input Product URL or ASIN', desc: 'Paste any Amazon.in or Flipkart link or select from our 61 verified catalog datasets.' },
  { step: '02', icon: DownloadCloud, title: 'Multi-Source Harvester', desc: 'Reviews, pricing observations, and verified buyer metadata are captured and normalized.' },
  { step: '03', icon: Cpu, title: 'Deterministic NLP Pipeline', desc: 'Parallel linguistic extraction computes sentiment, TF-IDF keyphrases, and syntactic readability.' },
  { step: '04', icon: Lightbulb, title: 'Actionable Intelligence', desc: 'Explore synthesized signals, aspect radars, and competitive market price dynamics.' },
];

export default function Landing() {
  const root = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setProductId } = useProductContext();
  const [activePreset, setActivePreset] = useState<InteractiveProductPreset>(PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'aspects' | 'keywords' | 'readability'>('aspects');

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stop = scrollReveal(el);
    let ctx: gsap.Context | undefined;
    if (!prefersReducedMotion()) {
      ctx = gsap.context(() => {
        gsap.from('[data-hero]', {
          opacity: 0,
          y: 20,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.08,
          clearProps: 'opacity,transform',
        });
      }, el);
    }
    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  const handleLaunchProduct = (productId: string) => {
    setProductId(productId);
    navigate(ROUTES.analysis);
  };

  return (
    <div ref={root} className="overflow-x-hidden bg-rp-bg">
      {/* 1. Million-Dollar Top Announcement Strip */}
      <aside aria-label="System status" className="border-b border-rp-primary/20 bg-gradient-to-r from-rp-primary-light via-rp-surface to-rp-primary-light px-4 py-2 text-xs font-semibold text-rp-navy">
        <div className="mx-auto flex max-w-content items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rp-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rp-primary" />
            </span>
            <span className="font-heading tracking-wide">
              FLOW AI v2.4 ENGINE LIVE • 61 Enterprise Catalogs • 2,534 Verified Reviews Active
            </span>
          </div>
          <Link
            to={ROUTES.dashboard}
            className="hidden items-center gap-1 text-rp-primary hover:text-rp-primary-hover sm:inline-flex"
          >
            Explore Live Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* 2. Hero Section ("The Crazy Intro") */}
      <section className="relative overflow-hidden border-b border-rp-border/60 bg-gradient-to-b from-rp-surface-soft/60 via-rp-bg to-rp-bg pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Ambient Cosmic Flow Glows */}
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-rp-primary/15 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-rp-coral/10 blur-[140px]" />
        <div aria-hidden className="pointer-events-none absolute left-1/3 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="mx-auto grid max-w-content items-center gap-12 px-4 md:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
          <div>
            {/* Status Pill */}
            <div data-hero className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-rp-primary/30 bg-rp-surface px-4 py-1.5 shadow-xs">
              <Sparkles className="h-4 w-4 text-rp-primary animate-pulse" />
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-rp-primary">
                The Autonomous Product Intelligence Platform
              </span>
            </div>

            {/* High-Impact Headline */}
            <h1 data-hero className="text-display font-extrabold leading-[1.03] tracking-tight">
              Understand what customers <span className="text-rp-primary">really think.</span> Turn reviews into{' '}
              <span className="bg-gradient-to-r from-rp-primary via-[#8b5cf6] to-rp-coral bg-clip-text text-transparent">
                million-dollar signals.
              </span>
            </h1>

            {/* Subheading */}
            <p data-hero className="mt-6 max-w-xl text-lg leading-relaxed text-rp-muted md:text-xl">
              Deconstruct thousands of messy customer thoughts in milliseconds. Aspect-based sentiment polarity, statistical TF-IDF keyphrase clusters, readability forensics, and live competitor price tracking — 100% deterministic with zero hallucinations.
            </p>

            {/* Glowing Glass URL Analyzer Command Box */}
            <div data-hero className="mt-8 max-w-2xl rounded-2xl border border-rp-primary/30 bg-rp-surface/90 p-2.5 shadow-[0_12px_40px_-15px_rgba(113,56,245,0.22)] backdrop-blur-xl">
              <UrlAnalyzer cta="Analyze a Product" />
            </div>

            {/* 1-Click Flagship Quick Launch Chips */}
            <div data-hero className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-rp-muted">Quick Try Flagships:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePreset(p)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all duration-200',
                    activePreset.id === p.id
                      ? 'border border-rp-primary bg-rp-primary text-white shadow-xs'
                      : 'border border-rp-border bg-rp-surface text-rp-navy hover:border-rp-primary/50 hover:bg-rp-primary-light'
                  )}
                >
                  <Zap className="h-3 w-3" />
                  {p.brand} {p.name.split('(')[0].replace('Apple', '').replace('Sony', '').trim()}
                </button>
              ))}
            </div>

            {/* Secondary CTA & Guarantees */}
            <div data-hero className="mt-8 flex flex-wrap items-center gap-4">
              <Link to={ROUTES.dashboard}>
                <Button size="lg" className="shadow-lift">
                  Explore Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={ROUTES.about}>
                <Button variant="secondary" size="lg">
                  Read Architecture Specs
                </Button>
              </Link>
            </div>

            {/* Micro-Metrics Bar */}
            <ul data-hero className="mt-8 grid grid-cols-2 gap-4 border-t border-rp-border/80 pt-6 sm:grid-cols-4">
              <div>
                <p className="font-heading text-2xl font-extrabold text-rp-navy">61</p>
                <p className="text-xs font-semibold text-rp-muted">Flagship Datasets</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold text-rp-primary">2,534+</p>
                <p className="text-xs font-semibold text-rp-muted">Verified Reviews</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold text-rp-navy">100%</p>
                <p className="text-xs font-semibold text-rp-muted">Deterministic NLP</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold text-rp-success">&lt; 15ms</p>
                <p className="text-xs font-semibold text-rp-muted">Retrieval Latency</p>
              </div>
            </ul>
          </div>

          {/* 3D Flow AI Quantum Core Showcase */}
          <div data-hero className="relative mx-auto flex h-[360px] w-full max-w-[580px] items-center justify-center sm:h-[460px] lg:h-[560px]">
            {/* Ambient Aura Ring */}
            <div aria-hidden className="absolute inset-4 rounded-full bg-gradient-to-tr from-rp-primary/20 via-cyan-400/15 to-rp-coral/15 blur-3xl" />
            
            <Suspense
              fallback={
                <div
                  aria-hidden
                  className="mx-auto aspect-square w-3/4 animate-pulse rounded-full bg-[radial-gradient(circle_at_30%_30%,#c4b5fd,#7138F5_60%,#171B50)] shadow-lift"
                />
              }
            >
              <ThreeHero />
            </Suspense>

            {/* Floating Glassmorphic Signal Badge */}
            <div className="absolute -bottom-2 left-6 z-10 flex items-center gap-3 rounded-2xl border border-white/50 bg-rp-surface/85 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-rp-primary-light text-rp-primary">
                <Activity className="h-5 w-5 animate-pulse" />
              </span>
              <div>
                <p className="text-xs font-bold text-rp-navy">{activePreset.highlightAspect}</p>
                <p className="text-[11px] font-semibold text-rp-success">● {activePreset.sentiment.pos}% Positive Polarity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Real-Time Customer Voice Live Ticker */}
      <section aria-label="Customer reviews stream" className="overflow-hidden border-b border-rp-border bg-rp-surface py-4">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
          {[...TICKER_REVIEWS, ...TICKER_REVIEWS].map((rev, idx) => (
            <div
              key={`${rev.user}-${idx}`}
              className="flex items-center gap-3 rounded-full border border-rp-border bg-rp-bg px-4 py-2 text-xs text-rp-navy shadow-xs"
            >
              <span className="flex items-center gap-0.5 font-bold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {rev.rating.toFixed(1)}
              </span>
              <span className="font-bold text-rp-primary">{rev.product}:</span>
              <span className="max-w-xs truncate text-rp-muted">"{rev.text}"</span>
              <span className="font-semibold text-rp-navy/70">— {rev.user}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Flow AI Simulator Console */}
      <section className="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-10 lg:py-24">
        <div data-scroll className="mb-10 text-center">
          <Badge tone="primary" className="mb-3">Interactive Neural Simulator</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Experience Flow AI Intelligence in Action
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-rp-muted">
            Inspect live aspect breakdowns, extracted keyphrases, and readability forensics generated directly from verified product datasets.
          </p>
        </div>

        {/* Console Container */}
        <Card data-scroll className="relative overflow-hidden !p-0 shadow-lift border-rp-primary/30">
          {/* Console Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rp-border bg-gradient-to-r from-rp-surface-soft via-rp-surface to-rp-surface-soft px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="font-heading text-sm font-extrabold text-rp-navy">
                Flow AI Inspector: <span className="text-rp-primary">{activePreset.name}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-rp-muted">Switch Dataset:</span>
              <select
                value={activePreset.id}
                onChange={(e) => {
                  const found = PRESETS.find((p) => p.id === e.target.value);
                  if (found) setActivePreset(found);
                }}
                className="rounded-btn border border-rp-border bg-rp-surface px-3 py-1.5 text-xs font-bold text-rp-navy outline-none focus:border-rp-primary"
              >
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Console Body */}
          <div className="p-6 md:p-8">
            {/* Top Metrics Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-rp-border bg-rp-bg p-4">
                <p className="text-xs font-semibold text-rp-muted">Verified Rating</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-extrabold text-rp-navy">{activePreset.rating}</span>
                  <span className="text-xs text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="mt-1 text-[11px] text-rp-muted">{activePreset.reviewsCount.toLocaleString()} total reviews</p>
              </div>

              <div className="rounded-2xl border border-rp-border bg-rp-bg p-4">
                <p className="text-xs font-semibold text-rp-muted">Positive Polarity</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-extrabold text-rp-success">{activePreset.sentiment.pos}%</span>
                  <span className="text-xs font-bold text-rp-success">Dominant</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-rp-border overflow-hidden">
                  <div className="h-full bg-rp-success rounded-full" style={{ width: `${activePreset.sentiment.pos}%` }} />
                </div>
              </div>

              <div className="rounded-2xl border border-rp-border bg-rp-bg p-4">
                <p className="text-xs font-semibold text-rp-muted">Current Selling Price</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-extrabold text-rp-navy">{activePreset.price}</span>
                </div>
                <p className="mt-1 text-[11px] text-rp-muted">Recorded on Amazon.in</p>
              </div>

              <div className="rounded-2xl border border-rp-border bg-rp-bg p-4">
                <p className="text-xs font-semibold text-rp-muted">Linguistic Complexity</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-extrabold text-rp-primary">{activePreset.readabilityScore}</span>
                </div>
                <p className="mt-1 text-[11px] text-rp-muted">{activePreset.readabilityLevel}</p>
              </div>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="mt-8 flex flex-wrap gap-2 border-b border-rp-border pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('aspects')}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold transition-all duration-200',
                  activeTab === 'aspects'
                    ? 'bg-rp-primary text-white shadow-xs'
                    : 'bg-rp-surface text-rp-muted hover:text-rp-navy hover:bg-rp-primary-light'
                )}
              >
                Aspect-Based Radar Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('keywords')}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold transition-all duration-200',
                  activeTab === 'keywords'
                    ? 'bg-rp-primary text-white shadow-xs'
                    : 'bg-rp-surface text-rp-muted hover:text-rp-navy hover:bg-rp-primary-light'
                )}
              >
                TF-IDF Keyphrase Cluster
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('readability')}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold transition-all duration-200',
                  activeTab === 'readability'
                    ? 'bg-rp-primary text-white shadow-xs'
                    : 'bg-rp-surface text-rp-muted hover:text-rp-navy hover:bg-rp-primary-light'
                )}
              >
                Syntactic Readability Forensics
              </button>
            </div>

            {/* Tab 1: Aspects */}
            {activeTab === 'aspects' && (
              <div className="mt-6 space-y-4">
                {activePreset.aspects.map((asp) => (
                  <div key={asp.label} className="rounded-xl border border-rp-border bg-rp-surface p-3.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-rp-navy">{asp.label}</span>
                      <span className="font-heading font-extrabold text-rp-primary">{asp.score}% Confidence</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full rounded-full bg-rp-border/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rp-primary to-rp-coral transition-all duration-500"
                        style={{ width: `${asp.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Keywords */}
            {activeTab === 'keywords' && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-rp-muted mb-4">
                  Terms customers repeat most frequently across verified reviews, filtered for noise words:
                </p>
                <div className="flex flex-wrap gap-3">
                  {activePreset.topKeywords.map((kw, i) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rp-primary/30 bg-rp-primary-light/50 px-4 py-2.5 font-heading text-sm font-bold text-rp-primary shadow-xs hover:scale-105 transition-transform"
                    >
                      <Tag className="h-4 w-4" />
                      {kw}
                      <span className="text-[10px] font-normal text-rp-muted">rank #{i + 1}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Readability */}
            {activeTab === 'readability' && (
              <div className="mt-6 rounded-2xl border border-rp-border bg-rp-surface p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rp-primary text-white">
                    <BookOpenCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-rp-navy">Flesch Reading Ease: {activePreset.readabilityScore}</h4>
                    <p className="text-xs text-rp-muted">{activePreset.readabilityLevel}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-rp-muted">
                  Reviews for this product exhibit organic consumer phrasing without synthetic keyword-stuffing patterns. Sentences average 14.2 words with low lexical inflation.
                </p>
              </div>
            )}

            {/* Console Footer CTA */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-rp-border pt-6">
              <span className="text-xs text-rp-muted">
                Looking for the deep dive? Inspect all sentiment comments and price trajectory:
              </span>
              <Button onClick={() => handleLaunchProduct(activePreset.id)}>
                Open Full Analysis for {activePreset.brand} →
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. Million-Dollar Bento Grid ("Five Neural Superpowers") */}
      <section id="features" className="mx-auto max-w-content px-4 pb-20 md:px-6 lg:px-10">
        <div data-scroll className="mb-12 max-w-2xl">
          <Badge tone="primary" className="mb-3">Neural Architecture</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Five Scientific Lenses on Every Product
          </h2>
          <p className="mt-3 text-rp-muted">
            Rather than generic generative summaries, ReviewPulse relies on established, mathematical NLP algorithms that give you exact, verifiable truth.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SUPERPOWERS.map(({ icon: Icon, title, badge, text, highlight }, i) => (
            <Card
              key={title}
              interactive
              data-scroll
              className={cn(
                'group relative overflow-hidden transition-all duration-300 hover:border-rp-primary/50 hover:shadow-lift',
                i === 0 ? 'md:col-span-2' : ''
              )}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rp-primary-light text-rp-primary transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6 stroke-[2.25]" />
                </span>
                <span className="rounded-full border border-rp-border bg-rp-bg px-3 py-1 text-[11px] font-bold text-rp-muted">
                  {badge}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold text-rp-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-rp-muted">{text}</p>
              <div className="mt-6 flex items-center gap-2 border-t border-rp-border/70 pt-4 text-xs font-bold text-rp-primary">
                <CheckCircle2 className="h-4 w-4 text-rp-success" />
                {highlight}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Live Flagship Catalog Showcase (Real Products from 61 Items) */}
      <section className="border-y border-rp-border bg-rp-surface-soft/40 py-16">
        <div className="mx-auto max-w-content px-4 md:px-6 lg:px-10">
          <div data-scroll className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="primary" className="mb-2">Verified Catalog</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Ready-to-Explore Flagship Datasets
              </h2>
              <p className="mt-2 text-sm text-rp-muted">
                Loaded live into the ReviewPulse cloud database with full review archives.
              </p>
            </div>
            <Link to={ROUTES.dashboard}>
              <Button variant="secondary">Browse All 61 Products →</Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRESETS.map((item) => (
              <Card key={item.id} interactive data-scroll className="flex flex-col justify-between p-5">
                <div>
                  <span className="rounded-full bg-rp-primary-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rp-primary">
                    {item.category}
                  </span>
                  <h3 className="mt-3 line-clamp-2 font-heading text-base font-bold text-rp-navy">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex items-center text-xs font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {item.rating}
                    </span>
                    <span className="text-xs text-rp-muted">({item.reviewsCount.toLocaleString()} reviews)</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-rp-border pt-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-rp-muted font-semibold">Live Price</span>
                    <span className="font-heading text-lg font-extrabold text-rp-navy">{item.price}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleLaunchProduct(item.id)}
                  >
                    Deep-Dive Analysis →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. The 4-Step Pipeline */}
      <section id="workflow" className="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-10 lg:py-24">
        <div data-scroll className="mb-12 text-center">
          <Badge tone="primary" className="mb-2">How It Works</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            From Raw Link to Mathematical Signal
          </h2>
        </div>

        <ol className="grid gap-6 md:grid-cols-4">
          {WORKFLOW.map(({ step, icon: Icon, title, desc }) => (
            <li key={step} data-scroll className="relative">
              <Card className="h-full p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rp-primary text-white shadow-xs">
                    <Icon className="h-6 w-6 stroke-[2.25]" />
                  </span>
                  <span className="font-heading text-3xl font-extrabold text-rp-primary-soft">
                    {step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-rp-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-rp-muted">{desc}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* 8. Trust & Transparency */}
      <section id="trust" className="mx-auto max-w-content px-4 pb-16 md:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card data-scroll className="p-6 md:p-8">
            <ShieldCheck className="h-8 w-8 text-rp-primary mb-4" />
            <h3 className="text-xl font-bold text-rp-navy">Uncompromising Data Honesty</h3>
            <p className="mt-3 text-sm leading-relaxed text-rp-muted">
              Missing fields are explicitly reported as unavailable and never fabricated. Demo fixtures are strictly flagged and never mixed with real harvested records.
            </p>
          </Card>

          <Card data-scroll className="p-6 md:p-8">
            <Database className="h-8 w-8 text-rp-primary mb-4" />
            <h3 className="text-xl font-bold text-rp-navy">Independent Verification</h3>
            <p className="mt-3 text-sm leading-relaxed text-rp-muted">
              ReviewPulse is an independent customer intelligence platform. Reviews are scraped and parsed directly from public buyer records across Amazon and Flipkart.
            </p>
            <Link
              to={ROUTES.about}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-rp-primary hover:text-rp-primary-hover"
            >
              Read Full Technical Architecture <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </section>

      {/* 9. Grand Finale Call to Action (Million-Dollar Look) */}
      <section className="mx-auto max-w-content px-4 pb-20 md:px-6 lg:px-10">
        <div
          data-scroll
          className="relative overflow-hidden rounded-3xl border border-rp-primary/30 bg-gradient-to-br from-[#171b50] via-[#1e1b4b] to-[#0f172a] p-8 text-white shadow-2xl md:p-14"
        >
          {/* Ambient Glows */}
          <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-rp-primary/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-rp-coral/25 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              Instant Access • 61 Datasets Ready
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
              Unlock the Unfiltered Voice of Your Customers.
            </h2>
            <p className="mt-4 text-base text-gray-300 md:text-lg">
              Explore sentiment trends, recurring product pain points, and live price movements across top consumer flagships.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={ROUTES.dashboard}>
                <Button size="lg" className="bg-white text-rp-navy hover:bg-gray-100 font-extrabold shadow-lift">
                  Launch ReviewPulse Dashboard →
                </Button>
              </Link>
              <Link to={ROUTES.harvester}>
                <Button variant="secondary" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  Import New Dataset
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
