import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { 
  Check, 
  ChevronRight, 
  Menu, 
  X, 
  Cpu,
  Activity,
  MousePointer2,
  Crown,
  Star,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- Sub-Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-in-out px-6 py-3 rounded-full flex items-center gap-8 ${
        isScrolled 
        ? 'bg-primary/80 backdrop-blur-xl border border-accent/20 w-[90%] max-w-2xl' 
        : 'bg-transparent w-auto'
      }`}
    >
      <div className="flex items-center gap-2">
        <img 
          src="https://qrdldhhcebervlmlwfbx.supabase.co/storage/v1/object/public/Inked%20Draw%20Images/id-logo-b.png" 
          alt="Inked Draw" 
          className={`h-8 transition-all duration-500 ${isScrolled ? 'brightness-0 invert' : ''}`}
        />
        <span className="text-xl font-bold tracking-tighter text-ivory">
          Inked Draw
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        {['Experience', 'Protocol', 'Membership'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            className="text-xs uppercase tracking-widest text-ivory/60 hover:text-accent transition-colors font-medium"
          >
            {item}
          </a>
        ))}
      </div>

      <button className="bg-accent text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:scale(1.03) active:scale-95 transition-all duration-300">
        Access
      </button>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out"
      });

      gsap.from(".hero-image", {
        scale: 1.1,
        duration: 2.5,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden flex flex-col justify-end p-12 md:p-24">
      {/* Full-bleed background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=2574&auto=format&fit=crop" 
          alt="Luxury Interior" 
          className="hero-image w-full h-full object-cover grayscale opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 max-w-4xl">
        <div className="hero-text text-accent font-mono text-xs uppercase tracking-[0.5em] mb-6">Established 2026</div>
        <h1 className="hero-text text-ivory text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.8] mb-8">
          Precision meets <br />
          <span className="font-drama italic text-accent">Excellence.</span>
        </h1>
        <p className="hero-text text-ivory/60 text-lg md:text-xl max-w-xl mb-12 leading-relaxed">
          Inked Draw is a private society for the smoker whose standards keep getting better. 
          A digital instrument for the high-end collector.
        </p>
        <div className="hero-text flex gap-4">
          <button className="bg-accent text-primary px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale(1.03) transition-all">
            Request Access
          </button>
          <button className="border border-ivory/20 text-ivory px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-ivory/5 transition-all">
            The Philosophy
          </button>
        </div>
      </div>
    </section>
  );
};



// --- Experience Cards (Micro-UIs) ---

const Card1_Shuffler = () => {
  const [items, setItems] = useState([
    { id: 1, label: "Medium-bodied", brand: "Montecristo No. 2" },
    { id: 2, label: "Rich & Earthy", brand: "Padrón 1964" },
    { id: 3, label: "Creamy Finish", brand: "Davidoff Winston Churchill" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const next = [...prev];
        next.unshift(next.pop());
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-32 w-full flex items-center justify-center perspective-1000">
      {items.map((item, i) => (
        <div 
          key={item.id}
          className="absolute w-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-primary/5 shadow-lg rounded-xl p-4 bg-white"
          style={{
            transform: `translateY(${(i - 1) * 20}px) scale(${1 - Math.abs(i - 1) * 0.05})`,
            opacity: i === 1 ? 1 : 0.3,
            zIndex: 10 - Math.abs(i - 1),
          }}
        >
          <div className="text-[9px] uppercase tracking-widest text-accent font-bold mb-1">{item.label}</div>
          <div className="text-xs font-bold text-primary">{item.brand}</div>
        </div>
      ))}
    </div>
  );
};

const Card2_Typewriter = () => {
  const [text, setText] = useState("");
  const fullText = "> Analyzing draw resistance... 92% optimal.\n> Cedar and black pepper detected.\n> Session recorded to Archive.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i = (i + 1) % (fullText.length + 1);
      if (i === 0) {
        setTimeout(() => {}, 2000); // pause at end
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary/5 rounded-xl p-6 font-mono text-[10px] h-32 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-accent uppercase tracking-widest text-[8px]">Live Feed</span>
      </div>
      <pre className="text-primary/70 whitespace-pre-wrap leading-relaxed">
        {text}<span className="inline-block w-1 h-3 bg-accent animate-pulse ml-1" />
      </pre>
    </div>
  );
};

const Card3_Scheduler = () => {
  const [activeDay, setActiveDay] = useState(null);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        for (let i = 0; i < days.length; i++) {
          await new Promise(r => setTimeout(r, 800));
          setActiveDay(i);
          if (i === 5) { // Simulate click on Friday
            await new Promise(r => setTimeout(r, 400));
          }
        }
        await new Promise(r => setTimeout(r, 1000));
        setActiveDay(null);
      }
    };
    sequence();
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 border border-primary/5 h-32 flex flex-col justify-between">
      <div className="flex justify-between">
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
              activeDay === i ? 'bg-accent text-primary scale-110 shadow-lg' : 'bg-primary/5 text-primary/30'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-[9px] uppercase tracking-widest font-bold opacity-30">Reserve Session</div>
        <div className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all ${
          activeDay !== null ? 'bg-primary text-background' : 'bg-primary/5 text-primary/20'
        }`}>
          Confirmed
        </div>
      </div>
    </div>
  );
};

// --- Experience Section ---

const Experience = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".exp-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={containerRef} className="py-32 px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
        {/* Primary Narrative Panel */}
        <article className="exp-reveal relative p-12 md:p-16 rounded-premium bg-primary text-background flex flex-col justify-between overflow-hidden shadow-2xl min-h-[500px]">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1200" 
              alt="" 
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-primary via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10">
            <div className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-12">The Digital Lounge</div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-12">
              Less a tracker. <br/>More a composed <br/><span className="text-accent font-drama italic">society.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/10">
              {[
                { title: "Discovery", desc: "Curated recommendations over cluttered browsing." },
                { title: "Tasting notes", desc: "Elegant structure for body, finish, room, and pairing." },
                { title: "Membership", desc: "Private access framing that supports a high-value brand." }
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-sm font-bold mb-2">{item.title}</div>
                  <p className="text-xs text-background/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Secondary Panels */}
        <div className="flex flex-col gap-6">
          <article className="exp-reveal p-10 rounded-premium bg-white border border-primary/5 shadow-xl flex flex-col h-full">
            <div className="text-accent font-mono text-[10px] uppercase tracking-widest mb-6">Discovery</div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight">Find the next box with more context.</h3>
            <div className="flex-1 mb-8">
              <Card1_Shuffler />
            </div>
            <p className="text-xs text-primary/50 leading-relaxed">
              Surface cigars that actually fit your palate, pace, and occasion instead of scrolling through generic inventory logic.
            </p>
          </article>

          <article className="exp-reveal p-10 rounded-premium bg-white border border-primary/5 shadow-xl flex flex-col h-full">
            <div className="text-accent font-mono text-[10px] uppercase tracking-widest mb-6">Tasting memory</div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight">Keep each session in collector-grade form.</h3>
            <div className="flex-1 mb-8">
              <Card2_Typewriter />
            </div>
            <p className="text-xs text-primary/50 leading-relaxed">
              Enough structure to be useful, enough elegance to make logging feel like part of the ritual.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};


// --- Ritual Section ---

const Ritual = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".ritual-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-primary text-background py-32 px-8 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none">
        <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="ritual-reveal bg-white/5 p-12 md:p-20 rounded-premium border border-white/5 backdrop-blur-sm">
            <div className="text-accent font-mono text-[10px] uppercase tracking-[0.4em] mb-8">Desired feeling</div>
            <div className="text-4xl md:text-6xl font-drama italic text-accent leading-tight mb-8">
              “Low-lit, editorial, and assured. It should feel like a private members club with software inside it.”
            </div>
            <div className="text-background/40 font-bold uppercase tracking-widest text-xs">The standard for this launch</div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="ritual-reveal p-10 rounded-premium bg-white text-primary border border-primary/5 shadow-2xl">
              <div className="text-accent font-mono text-[10px] uppercase tracking-widest mb-6">How it now reads</div>
              <h3 className="text-3xl font-bold mb-4 tracking-tighter leading-none">More hierarchy, cleaner pacing, better restraint.</h3>
              <p className="text-primary/50 text-sm leading-relaxed mb-8">
                This pass leans into taste instead: less explanation, more hierarchy, and a calmer confidence in the layout itself.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="text-4xl font-drama italic text-accent leading-none">01</div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Sharper focal hierarchy</h4>
                    <p className="text-[11px] text-primary/40 leading-relaxed">The hero now has a more intentional cascade, moving from headline to image to offer.</p>
                  </div>
                </div>
                <div className="flex gap-6 pt-6 border-t border-primary/5">
                  <div className="text-4xl font-drama italic text-accent leading-none">02</div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Less generic symmetry</h4>
                    <p className="text-[11px] text-primary/40 leading-relaxed">Support blocks and membership stack now feel less templated, giving the page editorial poise.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Protocol Section (Stacking Cards) ---

const ProtocolCard = ({ step, title, desc, children, index, isLast }) => (
  <div
    className="protocol-card h-screen flex items-center justify-center p-8"
    style={{ zIndex: (index + 1) * 10, position: isLast ? 'relative' : 'sticky', top: 0 }}
  >
    <div className="bg-background w-full max-w-5xl rounded-premium border border-primary/10 shadow-2xl h-[80vh] flex flex-col md:flex-row overflow-hidden">
      <div className="p-12 md:w-1/2 flex flex-col justify-center">
        <div className="font-mono text-accent text-sm mb-4">PROTOCOL {step}</div>
        <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-none">{title}</h3>
        <p className="text-primary/60 text-lg">{desc}</p>
      </div>
      <div className="bg-primary/5 md:w-1/2 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  </div>
);

const Protocol = () => {
  const containerRef = useRef(null);
  const steps = [
    {
      title: "Capture the Essence",
      desc: "Log every detail from the draw to the final ash. Build a high-fidelity catalog of your smoking rituals.",
      animation: (
        <div className="w-full h-full flex items-center justify-center p-8">
          <img 
            src="/inked-phone.png" 
            alt="Inked Phone" 
            className="max-w-full max-h-full object-contain drop-shadow-2xl" 
          />
        </div>
      )
    },
    {
      title: "Scan Your Humidor",
      desc: "Instant inventory management. Know exactly what's aging and what's ready to ignite with a single glance.",
      animation: (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <div className="grid grid-cols-6 gap-4 w-64 h-64 opacity-20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="bg-accent/40 rounded-sm aspect-square" />
            ))}
          </div>
          <div className="absolute inset-x-0 h-[2px] bg-accent shadow-[0_0_15px_rgba(201,168,76,0.8)] animate-[scan_3s_ease-in-out_infinite]" />
        </div>
      )
    },
    {
      title: "Analyze Vitals",
      desc: "Uncover patterns in your palate. Track cigar performance across different humidity and aging durations.",
      animation: (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 200 100" className="w-64 h-32 overflow-visible">
            <path
              d="M 0 50 L 40 50 L 50 20 L 60 80 L 70 50 L 110 50 L 120 10 L 130 90 L 140 50 L 200 50"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="3"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              className="animate-[pulse-wf_4s_ease-in-out_infinite]"
            />
          </svg>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".protocol-card", containerRef.current);

      // Set initial filter so GSAP can interpolate from a defined state
      gsap.set(cards, { filter: "blur(0px)", willChange: "transform, opacity, filter" });

      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          // Trigger off the NEXT card entering -- animation runs the full 100vh
          // as that card scrolls from viewport-bottom to viewport-top, so the
          // blur/scale is fully tied to scroll with no sudden snap.
          gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            filter: "blur(20px)",
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="protocol-container relative bg-primary" style={{ isolation: 'isolate' }}>
      {steps.map((step, i) => (
        <ProtocolCard
          key={i}
          step={(i + 1).toString().padStart(2, '0')}
          title={step.title}
          desc={step.desc}
          index={i}
          isLast={i === steps.length - 1}
        >
          {step.animation}
        </ProtocolCard>
      ))}
    </div>
  );
};

// --- Pricing ---

const Membership = () => {
  const tiers = [
    {
      step: "01",
      tag: "Founding Access",
      title: "For early loyalists.",
      desc: "Join the first circle and help shape the standard for a more refined cigar product.",
      features: [
        "Private onboarding language",
        "Collector profile and tasting archive",
        "Early access to premium features"
      ],
      note: "Invitation-led onboarding",
      label: "First circle",
      stat: "550+ CIGARS TRACKED"
    },
    {
      step: "02",
      tag: "Host Mode",
      title: "For lounge regulars.",
      desc: "Keep better recall on pairings, standout sticks, and the moments worth repeating for guests and friends.",
      features: [
        "Session memory with richer context",
        "Pairing and atmosphere notes",
        "A calmer, premium daily workflow"
      ],
      note: "The clearest product-market fit",
      label: "Host posture",
      featured: true,
      stat: "12+ PRIVATE LOUNGES"
    },
    {
      step: "03",
      tag: "Private Reserve",
      title: "For serious collectors.",
      desc: "A higher-end path for members who want their humidor, notes, and access to feel appropriately elevated.",
      features: [
        "Collector-first brand positioning",
        "More exclusive premium framing",
        "A stronger story for future paid plans"
      ],
      note: "Built for a higher-value tier",
      label: "Reserve tier",
      stat: "125+ RARE STICKS"
    }
  ];

  return (
    <section id="membership" className="py-32 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 pb-8 border-b border-primary/10">
        <div>
          <h2 className="text-primary font-bold text-5xl md:text-6xl mb-4 tracking-tighter leading-none">Membership tiers <br/>that feel deliberate.</h2>
        </div>
        <p className="text-primary/50 max-w-sm">A premium brand needs offer architecture, not just mood. The tiering now feels a little less flat and a little more considered.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {tiers.map((tier) => (
          <article 
            key={tier.step} 
            className={`flex flex-col p-10 rounded-premium transition-all duration-500 group ${
              tier.featured 
                ? 'bg-primary text-background border border-accent/40 shadow-[0_0_80px_rgba(201,168,76,0.12)] -translate-y-4' 
                : 'bg-white text-primary border border-primary/5 hover:border-accent/20'
            }`}
          >
            <div className="flex-1">
              <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${tier.featured ? 'text-accent' : 'text-primary/40'}`}>
                {tier.tag}
              </div>
              <h3 className={`text-3xl font-bold mb-4 tracking-tight leading-none ${tier.featured ? 'text-background' : 'text-primary'}`}>
                {tier.title}
              </h3>
              <p className={`text-sm mb-8 leading-relaxed ${tier.featured ? 'text-background/60' : 'text-primary/60'}`}>
                {tier.desc}
              </p>
              <ul className="space-y-4 mb-10">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check size={14} className="text-accent shrink-0" /> 
                    <span className={tier.featured ? 'text-background/80' : 'text-primary/80'}>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-px bg-accent/40" />
                <span className={`text-[10px] uppercase tracking-widest ${tier.featured ? 'text-background/40' : 'text-primary/30'}`}>
                  {tier.note}
                </span>
              </div>
              <div className={`mt-8 pt-8 border-t ${tier.featured ? 'border-white/10' : 'border-primary/5'}`}>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${tier.featured ? 'text-accent' : 'text-primary'}`}>{tier.stat.split(' ')[0]}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-medium ${tier.featured ? 'text-background/40' : 'text-primary/40'}`}>{tier.stat.split(' ').slice(1).join(' ')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-8 border-t border-current/10 mt-auto">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-drama italic text-accent">{tier.step}</span>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${tier.featured ? 'text-background/40' : 'text-primary/40'}`}>
                  {tier.label}
                </span>
              </div>
              <button className={`p-3 rounded-full transition-transform group-hover:translate-x-1 ${tier.featured ? 'bg-accent text-primary' : 'bg-primary/5 text-primary'}`}>
                <ChevronRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const InvitationCTA = () => (
  <section className="px-8 pb-32 max-w-7xl mx-auto">
    <div className="bg-primary text-background rounded-premium p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-accent/40 to-transparent" />
      </div>
      <div className="relative z-10 max-w-xl">
        <div className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-6">Private Invitation</div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-[0.9]">
          Inked Draw now feels closer to a real premium launch.
        </h2>
        <p className="text-background/60 text-lg leading-relaxed">
          The result is more taste-led than effect-led: quieter, better judged, and easier to believe as a real premium service.
        </p>
      </div>
      <button className="relative z-10 bg-accent text-primary px-10 py-5 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform whitespace-nowrap shadow-2xl">
        Request Early Access
      </button>
    </div>
  </section>
);

// --- Testimonials ---

const Testimonials = () => {
  const reviews = [
    {
      quote: "The scan-to-humidor feature alone is worth it. I catalogued over 400 cigars in two weeks and finally know what I actually have.",
      name: "Marcus T.",
      role: "Private Collector",
      initials: "MT",
    },
    {
      quote: "Finally an app that respects the ritual. Clean, fast, no noise. Cigar Oracle Digest changed how I think about aging.",
      name: "Daniel R.",
      role: "Master Blender",
      initials: "DR",
    },
    {
      quote: "I've tried every cigar app out there. Inked Draw is the only one built for someone who takes this seriously.",
      name: "James W.",
      role: "Host Posture Member",
      initials: "JW",
    },
  ];

  return (
    <section className="py-32 px-8 bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-mono text-accent text-xs uppercase tracking-widest mb-4">What Members Say</div>
          <h2 className="text-background font-drama italic text-5xl md:text-6xl">The aficionados have spoken.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="flex flex-col gap-6 p-8 rounded-premium border border-white/5 bg-white/[0.03]">
              <div className="text-4xl font-drama italic text-accent/40 leading-none">"</div>
              <p className="text-background/70 text-sm leading-relaxed flex-1">{r.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold tracking-wide">
                  {r.initials}
                </div>
                <div>
                  <div className="text-background text-sm font-semibold">{r.name}</div>
                  <div className="text-background/40 text-xs">{r.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-accent fill-accent" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-primary text-background pt-32 pb-16 px-8 rounded-t-[4rem]">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <div>
          <img 
            src="https://qrdldhhcebervlmlwfbx.supabase.co/storage/v1/object/public/Inked%20Draw%20Images/id-logo-b.png" 
            alt="Inked Draw Logo" 
            className="h-10 w-auto object-contain mb-8 filter brightness-0 invert"
          />
          <p className="text-background/40 text-sm leading-relaxed max-w-sm mb-8">
            The premier cigar society and digital humidor. Built for the smoker who notices the details.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">System Operational</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="font-bold mb-6 text-xs uppercase tracking-widest text-accent">Navigation</div>
            <ul className="space-y-4 text-sm text-background/50">
              <li><a href="#features" className="hover:text-accent transition-colors">Experience</a></li>
              <li><a href="#protocol" className="hover:text-accent transition-colors">Protocol</a></li>
              <li><a href="#membership" className="hover:text-accent transition-colors">Membership</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-6 text-xs uppercase tracking-widest text-accent">Connect</div>
            <ul className="space-y-4 text-sm text-background/50">
              <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Journal</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] opacity-30 uppercase tracking-[0.3em]">
        <div>© 2026 Inked Draw Private Society</div>
        <div className="flex gap-8">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Access</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="selection:bg-accent selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Ritual />
        <Protocol />
        <Membership />
        <InvitationCTA />
        <Testimonials />
        <section className="py-32 px-8 flex flex-col items-center text-center bg-background">
           <h2 className="text-5xl md:text-8xl font-drama italic text-primary mb-8">Never waste <br/>money again.</h2>
           <button className="bg-accent text-primary btn-premium text-xl">
             Build Your Digital Humidor
           </button>
        </section>
      </main>
      <Footer />
      
      {/* Custom Styles for special animations */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        @keyframes pulse-wf {
          0% { stroke-dashoffset: 1000; opacity: 0.2; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -1000; opacity: 0.2; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

export default App;
