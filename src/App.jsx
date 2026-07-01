import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { supabase } from './supabase';
import { 
  Check, 
  ChevronRight, 
  Menu, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  ArrowUp,
  Play,
  Layers,
  Activity,
  MousePointer2,
  Crown
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ACTIVATION_PATH = '/activate';

const normalizeEmail = (value = '') => value.trim().toLowerCase();

const getActivationRedirectUrl = () => {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}${ACTIVATION_PATH}`;
};

const markAccessRequestActivated = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return { state: 'missingRequest' };
  }

  const { data: activatedRows, error: activationError } = await supabase
    .from('access_requests')
    .update({ status: 'activated' })
    .eq('email', normalizedEmail)
    .eq('status', 'pending')
    .select('id, status');

  if (activationError) {
    throw activationError;
  }

  if (activatedRows?.length) {
    return { state: 'active' };
  }

  const { data: existingRows, error: lookupError } = await supabase
    .from('access_requests')
    .select('id, status')
    .eq('email', normalizedEmail)
    .limit(1);

  if (lookupError) {
    throw lookupError;
  }

  if (!existingRows?.length) {
    return { state: 'missingRequest' };
  }

  if (existingRows[0].status === 'pending') {
    throw new Error('The request was found, but its status did not update.');
  }

  return { state: 'active' };
};

// --- SplitText Helper Component for Word-by-Word Reveal ---
const SplitText = ({ text, className }) => {
  return (
    <span className={`inline ${className}`}>
      {text.split(' ').map((word, i) => (
        <React.Fragment key={i}>
          <span className="reveal-word inline-block overflow-hidden leading-tight py-0.5">
            <span className="reveal-inner inline-block origin-bottom-left select-none">
              {word}
            </span>
          </span>
          {i !== text.split(' ').length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
};

// --- ScrollHighlightText Helper Component for Scroll-linked Opacity Highlight ---
const ScrollHighlightText = ({ text, className = "" }) => {
  return (
    <span className={`inline ${className}`}>
      {text.split(' ').map((word, i) => (
        <React.Fragment key={i}>
          <span className="highlight-word inline-block leading-tight select-none opacity-20">
            {word}
          </span>
          {i !== text.split(' ').length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
};


// --- Sub-Components ---

const Navbar = ({ onRequestAccess, onReturnToTop }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center justify-between px-6 py-2 rounded-full border shadow-2xl ${
          isScrolled 
          ? 'bg-ivory/70 backdrop-blur-xl w-[90%] max-w-4xl py-3 border-primary/10' 
          : 'bg-transparent w-[95%] max-w-7xl border-white/5'
        }`}
      >
        <button
          type="button"
          onClick={onReturnToTop}
          className="flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          aria-label="Return to top"
        >
          <div className={`w-14 h-14 rounded-full border transition-all duration-500 bg-primary flex items-center justify-center overflow-hidden ${isScrolled ? 'border-accent/40' : 'border-accent/30'}`}>
            <img 
              src="https://qrdldhhcebervlmlwfbx.supabase.co/storage/v1/object/public/Inked%20Draw%20Images/id-logo.png" 
              alt="Inked Draw Logo" 
              className="h-[calc(100%-4px)] w-[calc(100%-4px)] object-contain transition-all duration-500"
            />
          </div>
          <span className={`font-bold tracking-tighter text-lg transition-colors duration-500 ${isScrolled ? 'text-primary' : 'text-ivory'}`}>
            Inked Draw
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Experience', href: '#experience' },
            { label: 'The humidor', href: '#humidor' },
            { label: 'Membership', href: '#membership' },
            { label: 'Philosophy', href: '#philosophy' }
          ].map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 font-bold relative group ${
                isScrolled ? 'text-primary/60 hover:text-accent' : 'text-ivory/60 hover:text-accent'
              }`}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onRequestAccess}
            className={`btn-premium group hidden sm:flex px-6 py-2.5 text-[10px] ${
              isScrolled ? 'bg-primary text-ivory' : 'bg-accent text-primary shadow-[0_0_20px_rgba(201,168,76,0.3)]'
            }`}
          >
            <span className="relative z-10">Request Access</span>
            <span className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isScrolled ? 'bg-accent' : 'bg-ivory'
            }`} />
          </button>

          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-full transition-colors ${
              isScrolled ? 'text-primary hover:bg-primary/5' : 'text-ivory hover:bg-white/10'
            }`}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[90] bg-primary/95 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col justify-center px-12 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-8">
          {[
            { label: 'Experience', href: '#experience' },
            { label: 'The humidor', href: '#humidor' },
            { label: 'Membership', href: '#membership' },
            { label: 'Philosophy', href: '#philosophy' }
          ].map((item, index) => (
            <a 
              key={item.label} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobileMenuOpen ? 1 : 0
              }}
              className="text-ivory font-drama text-4xl italic hover:text-accent transition-all duration-500 block"
            >
              {item.label}
            </a>
          ))}
          
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onRequestAccess(); }}
            style={{ 
              transitionDelay: `400ms`,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMobileMenuOpen ? 1 : 0
            }}
            className="btn-premium group bg-accent text-primary w-full max-w-xs py-4 text-xs tracking-widest mt-8 transition-all duration-500"
          >
            <span className="relative z-10">Request Early Access</span>
            <span className="absolute inset-0 bg-ivory translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
          </button>
        </div>
      </div>
    </>
  );
};

const Hero = ({ onRequestAccess }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".hero-bg", {
        scale: 1.15,
        duration: 3,
        ease: "power2.out"
      })
      .from(".hero-reveal", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out"
      }, "-=2")
      .from(".hero-accent", {
        width: 0,
        duration: 1,
        ease: "power3.inOut"
      }, "-=0.8");

      gsap.to(".hero-bg", {
        scale: 1.0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/id_hero2.jpg" 
          alt="Luxury Architectural Detail" 
          className="hero-bg w-full h-full object-cover grayscale brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl">
        <div className="hero-reveal inline-flex items-center gap-4 mb-6">
          <div className="hero-accent h-px w-12 bg-accent" />
          <span className="text-accent font-mono text-[9px] uppercase tracking-[0.4em] font-bold">Private cigar society · digital humidor · 2026</span>
        </div>
        
        <h1 ref={titleRef} className="hero-reveal text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.85] mb-8 text-ivory">
          Ritual meets <br />
          <span className="font-drama italic text-accent pr-4">Precision.</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mt-4">
          <p className="hero-reveal text-ivory/60 text-base md:text-lg max-w-md leading-relaxed font-medium">
            Inked Draw is a private cigar app for collectors, lounge regulars, and aficionados who want every cigar, tasting note, pairing, and place remembered with precision.
          </p>
          
          <div className="hero-reveal flex gap-6 md:justify-end">
            <button 
              onClick={onRequestAccess}
              className="group btn-premium bg-accent text-primary px-10 py-5 font-bold shadow-[0_0_30px_rgba(201,168,76,0.25)]"
            >
              <span className="relative z-10">Request Access</span>
              <span className="absolute inset-0 bg-ivory translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            </button>
            <button 
              onClick={onRequestAccess}
              className="group flex items-center gap-3 text-ivory/40 hover:text-ivory transition-all duration-300 font-bold uppercase tracking-widest text-[10px]"
            >
              Elevate Your Ritual <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Features Cards ---

const Card1_Shuffler = () => {
  const [items, setItems] = useState([
    { id: 1, label: "Medium-bodied", brand: "Montecristo No. 2", strength: 75, origin: "Cuba", vitola: "Torpedo", rh: 65, age: "710 days" },
    { id: 2, label: "Rich & Earthy", brand: "Padrón 1964 Anniversary", strength: 92, origin: "Nicaragua", vitola: "Toro", rh: 64, age: "480 days" },
    { id: 3, label: "Creamy Finish", brand: "Davidoff Winston Churchill", strength: 60, origin: "Dominican Rep.", vitola: "Churchill", rh: 66, age: "320 days" }
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
    <div className="relative h-48 w-full perspective-1000">
      {items.map((item, i) => (
        <div 
          key={item.id}
          className="absolute w-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark-panel rounded-3xl p-5 flex flex-col justify-between border border-accent/15"
          style={{
            transform: `translateY(${(i - 1) * 28}px) scale(${1 - Math.abs(i - 1) * 0.08})`,
            opacity: i === 1 ? 1 : i === 0 || i === 2 ? 0.35 : 0,
            zIndex: 10 - Math.abs(i - 1),
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[8px] uppercase tracking-[0.25em] text-accent font-bold mb-1">{item.label}</div>
              <div className="text-sm font-bold text-ivory leading-tight">{item.brand}</div>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="font-mono text-[8px] text-ivory/40 uppercase">Humid.</span>
              <span className="font-mono text-[9px] text-accent font-bold">{item.rh}% RH</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 my-2 text-[9px] font-mono text-ivory/50">
            <div>
              <span className="block text-[7px] uppercase text-ivory/30">Origin</span>
              <span className="text-ivory/80 font-bold">{item.origin}</span>
            </div>
            <div>
              <span className="block text-[7px] uppercase text-ivory/30">Vitola</span>
              <span className="text-ivory/80 font-bold">{item.vitola}</span>
            </div>
            <div>
              <span className="block text-[7px] uppercase text-ivory/30">Aged</span>
              <span className="text-accent font-bold">{item.age}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[8px] font-mono text-ivory/40 mb-1">
              <span>Palate Intensity</span>
              <span>{item.strength}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000 shadow-[0_0_8px_rgba(201,168,76,0.5)]" 
                style={{ width: `${item.strength}%` }} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Card2_Typewriter = () => {
  const [text, setText] = useState("");
  const lines = useMemo(() => [
    "> INITIALIZING SESSION LEDGER...",
    "> IDENTIFIED: PADRÓN 1964 ANNIVERSARY",
    "> ANALYSIS: DRAW 94% | BURN 98% | BODY: MED-FULL",
    "> VITAL FLAVOR FLUX: COCOA [8.5] · CEDAR [9.0]",
    "> PAIRING NOTED: SINGLE MALT ISLAY 18Y",
    "> CO-ORDINATES: PRIVATE SUITE, 21:42 PST",
    "> LEDGER DEPOSITED IN WAITLIST VAULT.",
    "> READY FOR THE NEXT DRAW."
  ], []);

  useEffect(() => {
    let currentLineIdx = 0;
    let currentCharIdx = 0;
    let typingTimer;
    let fullText = "";

    const typeChar = () => {
      if (currentLineIdx < lines.length) {
        const currentLine = lines[currentLineIdx];
        if (currentCharIdx < currentLine.length) {
          fullText += currentLine[currentCharIdx];
          setText(fullText);
          currentCharIdx++;
          typingTimer = setTimeout(typeChar, 30);
        } else {
          fullText += "\n";
          setText(fullText);
          currentLineIdx++;
          currentCharIdx = 0;
          typingTimer = setTimeout(typeChar, 600);
        }
      } else {
        typingTimer = setTimeout(() => {
          setText("");
          fullText = "";
          currentLineIdx = 0;
          currentCharIdx = 0;
          typeChar();
        }, 3000);
      }
    };

    typeChar();
    return () => clearTimeout(typingTimer);
  }, [lines]);

  return (
    <div className="dark-panel rounded-3xl p-6 font-mono text-[10px] h-48 flex flex-col justify-between relative overflow-hidden scanline-overlay">
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <Activity size={10} className="text-accent animate-pulse" />
          <span className="text-accent uppercase tracking-widest text-[8px] font-bold">Palate Telemetry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          <span className="text-green-500 uppercase text-[8px] font-bold">Live Link</span>
        </div>
      </div>
      <pre className="text-ivory/80 whitespace-pre-wrap leading-relaxed flex-1 overflow-hidden relative z-10 font-mono select-none">
        {text}<span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse ml-0.5" />
      </pre>
      <div className="absolute bottom-2 right-4 text-[7px] text-white/10 uppercase tracking-widest relative z-10 select-none">ID-SYS v2.4</div>
    </div>
  );
};

const Card3_Scheduler = () => {
  const [activeDay, setActiveDay] = useState(null);
  const [btnState, setBtnState] = useState("idle"); // idle, clicked, saved
  const [cursor, setCursor] = useState({ x: 90, y: 90, scale: 1, opacity: 0 });
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  useEffect(() => {
    let timer;
    const runSequence = () => {
      // Step 0: Initial state (reset)
      setActiveDay(null);
      setBtnState("idle");
      setCursor({ x: 90, y: 90, scale: 1, opacity: 0 });

      // Step 1: Cursor fades in
      timer = setTimeout(() => {
        setCursor(prev => ({ ...prev, opacity: 1 }));

        // Step 2: Cursor moves to Friday (Index 5)
        timer = setTimeout(() => {
          setCursor(prev => ({ ...prev, x: 73, y: 26 }));

          // Step 3: Cursor clicks Friday
          timer = setTimeout(() => {
            setCursor(prev => ({ ...prev, scale: 0.8 }));
            setActiveDay(5); // Highlight Friday

            timer = setTimeout(() => {
              setCursor(prev => ({ ...prev, scale: 1 }));

              // Step 4: Cursor moves to Save button
              timer = setTimeout(() => {
                setCursor(prev => ({ ...prev, x: 84, y: 78 }));

                // Step 5: Cursor clicks Save button
                timer = setTimeout(() => {
                  setCursor(prev => ({ ...prev, scale: 0.8 }));
                  setBtnState("saving");

                  timer = setTimeout(() => {
                    setCursor(prev => ({ ...prev, scale: 1 }));
                    setBtnState("saved");

                    // Step 6: Cursor fades out
                    timer = setTimeout(() => {
                      setCursor(prev => ({ ...prev, opacity: 0 }));

                      // Loop reset
                      timer = setTimeout(runSequence, 2000);
                    }, 800);
                  }, 300);
                }, 1000);
              }, 1200);
            }, 300);
          }, 1000);
        }, 500);
      }, 500);
    };

    runSequence();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dark-panel rounded-3xl p-6 h-48 flex flex-col justify-between relative overflow-hidden group border border-accent/10">
      {/* Weekly Grid */}
      <div className="flex justify-between relative z-10">
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all duration-500 border relative ${
              activeDay === i 
              ? 'bg-accent text-primary border-accent scale-105 shadow-[0_0_15px_rgba(201,168,76,0.5)]' 
              : 'bg-white/5 text-ivory/30 border-white/5'
            }`}
            style={{
              transform: activeDay === i && cursor.scale === 0.8 && cursor.x < 80 ? 'scale(0.9)' : 'none'
            }}
          >
            {day}
            {i === 5 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer Info & Button */}
      <div className="flex justify-between items-center relative z-10 pt-4 border-t border-white/5">
        <div>
          <div className="text-[9px] uppercase tracking-widest font-bold text-accent mb-0.5">Private Reserve</div>
          <div className="text-ivory/40 text-[8px] font-mono">Friday at 8:00 PM EST</div>
        </div>
        <div 
          className={`px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all duration-500 border ${
            btnState === "saved" 
            ? 'bg-accent text-primary border-accent shadow-[0_0_12px_rgba(201,168,76,0.3)]' 
            : btnState === "saving"
            ? 'bg-white/10 text-ivory border-white/10'
            : 'bg-white/5 text-ivory/30 border-white/5'
          }`}
          style={{
            transform: btnState === "saving" && cursor.scale === 0.8 ? 'scale(0.95)' : 'none'
          }}
        >
          {btnState === "saved" ? 'Saved' : btnState === "saving" ? 'Saving...' : 'Confirm'}
        </div>
      </div>

      {/* Animated SVG Cursor */}
      <div 
        className="absolute pointer-events-none z-50 transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        style={{
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
          opacity: cursor.opacity,
          transform: `scale(${cursor.scale}) translate(-50%, -50%)`,
          transitionProperty: 'left, top, opacity, transform',
          transitionDuration: cursor.scale !== 1 ? '150ms' : '1000ms'
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 text-accent fill-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{ transform: 'rotate(-25deg)' }}
        >
          <path d="M4.5 3v15.3l4.3-4.3 3.6 7.2 2.7-1.3-3.6-7.2h6L4.5 3z" />
        </svg>
      </div>
    </div>
  );
};

const Features = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Global opacity entrance
      gsap.from(".feat-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          once: true
        },
        opacity: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: "power2.out"
      });

      let mm = gsap.matchMedia();

      // Desktop (>= 1024px): Scroll-driven parallax stagger alignment
      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray(".feat-card");
        if (cards.length === 3) {
          // Left card starts lower, aligns, and goes higher
          gsap.fromTo(cards[0], 
            { y: 60 },
            {
              y: -60,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );

          // Right card starts higher, aligns, and goes lower
          gsap.fromTo(cards[2], 
            { y: -60 },
            {
              y: 60,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }
      });

      // Mobile (< 1024px): Simple y entrance slide-up
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".feat-card", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true
          },
          y: 40,
          duration: 1.0,
          stagger: 0.15,
          ease: "power2.out"
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={containerRef} className="py-32 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="feat-card glass-panel rounded-premium p-10 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-8 font-bold">Digital Humidor</div>
            <h2 className="text-3xl font-bold tracking-tight mb-6 leading-none text-primary">Intuitive Palate <br/><span className="font-drama italic">Matching.</span></h2>
            <p className="text-primary/60 text-sm leading-relaxed mb-12">
              Surface cigars that match your palate, your mood, and the kind of evening you are trying to remember.
            </p>
          </div>
          <Card1_Shuffler />
        </article>

        <article className="feat-card glass-panel rounded-premium p-10 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-8 font-bold">Tasting Records</div>
            <h2 className="text-3xl font-bold tracking-tight mb-6 leading-none text-primary">Frictionless Tasting <br/><span className="font-drama italic">Ledger.</span></h2>
            <p className="text-primary/60 text-sm leading-relaxed mb-12">
              Capture draw, burn, body, finish, pairing, and atmosphere without turning the table into a spreadsheet.
            </p>
          </div>
          <Card2_Typewriter />
        </article>

        <article className="feat-card glass-panel rounded-premium p-10 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-8 font-bold">Lounge Discovery</div>
            <h2 className="text-3xl font-bold tracking-tight mb-6 leading-none text-primary">Private Lounge <br/><span className="font-drama italic">Locator.</span></h2>
            <p className="text-primary/60 text-sm leading-relaxed mb-12">
              Find the rooms, retailers, and private lounges worth returning to, then save them beside the cigars they shaped.
            </p>
          </div>
          <Card3_Scheduler />
        </article>
      </div>
    </section>
  );
};

// --- Philosophy Section ---

const Philosophy = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      const blocks = containerRef.current.querySelectorAll('.highlight-block');
      blocks.forEach((block) => {
        const words = block.querySelectorAll('.highlight-word');
        gsap.to(words, {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: block,
            start: "top 78%",
            end: "bottom 55%",
            scrub: true,
          }
        });
      });
      
      gsap.to(".philo-bg", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        yPercent: -15
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" ref={containerRef} className="relative py-48 px-8 overflow-hidden bg-primary text-ivory">
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2670&auto=format&fit=crop" 
          alt="Abstract Architecture" 
          className="philo-bg w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="text-accent font-mono text-[10px] uppercase tracking-[0.5em] mb-16">The Philosophy</div>
        
        <div className="mb-12 max-w-3xl mx-auto highlight-block">
          <span className="text-ivory/40 uppercase tracking-widest text-xs font-bold block mb-4">Most apps focus on:</span>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
            <ScrollHighlightText text="Cluttered inventories. Flat ratings. Forgotten tasting notes. Search without taste." />
          </p>
        </div>

        <div className="mb-24 max-w-4xl mx-auto highlight-block">
          <span className="text-accent uppercase tracking-widest text-xs font-bold block mb-4">We focus on:</span>
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight text-balance">
            <ScrollHighlightText text="A composed cigar experience for the" /> <br/>
            <span className="font-drama italic text-accent underline decoration-ivory/10 underline-offset-[1rem]">
              <ScrollHighlightText text="discerning collector." />
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto grid gap-8 text-left md:text-center text-ivory/55 text-lg md:text-xl leading-relaxed font-medium">
          <p className="highlight-block leading-relaxed">
            <ScrollHighlightText text="A great cigar carries more than tobacco. It holds the place, the hour, the company, the pour, the weather, the first third, and the final conversation." />
          </p>
          <p className="highlight-block leading-relaxed">
            <ScrollHighlightText text="Most tools reduce that experience to a row in a database. Inked Draw preserves the ritual." />
          </p>
          <p className="highlight-block leading-relaxed">
            <ScrollHighlightText text="It is a digital humidor app, a premium cigar tracker, a tasting journal, and a private cigar lounge locator for collectors who care about context as much as the cigar itself." />
          </p>
        </div>
      </div>
    </section>
  );
};

// --- Protocol Section Visuals ---

const DialVisualization = () => {
  return (
    <div className="relative w-64 h-64 border border-white/5 rounded-full flex items-center justify-center overflow-hidden bg-primary/20 backdrop-blur-md">
      {/* Center core */}
      <div className="w-12 h-12 bg-accent rounded-full shadow-[0_0_35px_rgba(201,168,76,0.55)] z-20 flex items-center justify-center">
        <Crown size={18} className="text-primary" />
      </div>
      
      {/* Concentric rotating rings */}
      <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
      <div className="absolute inset-8 border border-accent/20 border-dashed rounded-full animate-[spin_12s_linear_infinite_reverse]" />
      <div className="absolute inset-12 border border-white/10 rounded-full" />
      
      {/* Outer measurement ticks */}
      <svg className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite] opacity-40" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#FAF8F5" strokeWidth="0.5" strokeDasharray="1 3" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="#FAF8F5" strokeWidth="0.5" strokeDasharray="2 12" />
      </svg>
      
      {/* Radial sweep arms */}
      <div className="absolute w-[90%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent rotate-45 animate-[spin_8s_linear_infinite]" />
      <div className="absolute w-[90%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-12 animate-[spin_15s_linear_infinite_reverse]" />

      {/* Floating labels */}
      <div className="absolute top-6 left-6 font-mono text-[7px] text-accent/50 uppercase tracking-widest">Aged Reserve</div>
      <div className="absolute bottom-6 right-6 font-mono text-[7px] text-accent/50 uppercase tracking-widest">Vitola Ledger</div>
    </div>
  );
};

const ScannerVisualization = () => {
  return (
    <div className="relative w-64 h-64 border border-white/10 rounded-2xl overflow-hidden bg-primary/40 backdrop-blur-md">
      {/* Grid cells */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 p-4 opacity-20">
        {[...Array(36)].map((_, i) => (
          <div key={i} className="border border-white/10 flex items-center justify-center">
            {i % 5 === 0 && <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-pulse" />}
          </div>
        ))}
      </div>
      
      {/* Tech indicators */}
      <div className="absolute top-4 left-4 font-mono text-[7px] text-accent/60 uppercase tracking-widest flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        Scanner Active
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[7px] text-ivory/40 uppercase tracking-widest">
        GRID-REF: 48.093
      </div>
      <div className="absolute top-4 right-4 font-mono text-[7px] text-ivory/40 uppercase tracking-widest">
        RES: 1200DPI
      </div>

      {/* Crosshair target overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-32 h-32 border border-accent rounded-full border-dashed animate-[spin_25s_linear_infinite]" />
        <div className="absolute w-8 h-px bg-accent" />
        <div className="absolute h-8 w-px bg-accent" />
      </div>

      {/* Scanning laser line */}
      <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_rgba(201,168,76,0.8)] w-full animate-[scan_3s_ease-in-out_infinite]" />
    </div>
  );
};

const WaveformVisualization = () => {
  return (
    <div className="relative w-full max-w-md h-48 border border-white/5 rounded-2xl overflow-hidden bg-primary/30 flex items-center justify-center p-4">
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.03]">
        {[...Array(72)].map((_, i) => (
          <div key={i} className="border border-white/40" />
        ))}
      </div>
      
      {/* Digital overlays */}
      <div className="absolute top-4 left-4 font-mono text-[7px] text-accent/50 uppercase tracking-widest">
        Palate Signature Wave
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[7px] text-ivory/30 uppercase">
        Hz: 0.125
      </div>

      <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible relative z-10">
        {/* Main Wave path */}
        <path
          d="M 0 50 L 30 50 L 40 30 L 48 75 L 56 45 L 64 52 L 100 52 L 110 20 L 118 85 L 126 40 L 134 50 L 200 50"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="animate-[pulse-wf_5s_linear_infinite]"
        />
        {/* Secondary out-of-phase wave (glow) */}
        <path
          d="M 0 50 L 30 50 L 40 35 L 48 68 L 56 48 L 64 51 L 100 51 L 110 28 L 118 78 L 126 44 L 134 50 L 200 50"
          fill="none"
          stroke="#FAF8F5"
          strokeWidth="1"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="animate-[pulse-wf_5s_linear_infinite] opacity-35"
          style={{ animationDelay: '0.5s' }}
        />
      </svg>
    </div>
  );
};

const ProtocolStep = ({ step, title, desc, children }) => (
  <div className="protocol-card h-screen flex items-center justify-center p-8 sticky top-0 bg-primary">
    <div className="dark-panel w-full max-w-6xl rounded-premium h-[80vh] flex flex-col md:flex-row overflow-hidden relative group border border-white/5">
      <div className="p-12 md:p-20 md:w-1/2 flex flex-col justify-center relative z-10">
        <div className="font-mono text-accent text-xs mb-6 uppercase tracking-[0.4em] font-bold">Experience {step}</div>
        <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter leading-none">{title}</h3>
        <p className="text-ivory/40 text-base md:text-lg leading-relaxed max-w-md font-medium">{desc}</p>
        
        <div className="mt-12 flex items-center gap-4">
          <div className="w-12 h-px bg-accent/30" />
          <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Preserved Ritual</span>
        </div>
      </div>
      <div className="bg-white/[0.02] md:w-1/2 flex items-center justify-center p-12 relative overflow-hidden">
        {/* Abstract background glow */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-1000">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full blur-[130px]" />
        </div>
        <div className="relative z-10 w-full flex justify-center">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const Protocol = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".protocol-card");
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.88,
            opacity: 0.4,
            filter: "blur(15px)",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true
            }
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div id="humidor" ref={containerRef} className="bg-primary relative" style={{ isolation: 'isolate' }}>
      <ProtocolStep 
        step="01" 
        title="Your collection, beautifully remembered" 
        desc="Your digital humidor becomes a private archive of every cigar worth keeping close: origin, vitola, wrapper, strength, rarity, aging notes, and the reason it belongs in your rotation."
      >
        <DialVisualization />
      </ProtocolStep>

      <ProtocolStep 
        step="02" 
        title="Scan the band. Save the story." 
        desc="Turn the cigar band into the beginning of the record. Scan, identify, organize, and return to the details when the moment calls for it."
      >
        <ScannerVisualization />
      </ProtocolStep>

      <ProtocolStep 
        step="03" 
        title="A tasting journal that remembers like you do" 
        desc="Ratings are too blunt for a serious palate. Record the draw, construction, burn, body, flavor movement, finish, pairing, setting, and whether the cigar earned a place in your rotation."
      >
        <WaveformVisualization />
      </ProtocolStep>
    </div>
  );
};

// --- Membership Section ---

const Membership = ({ onRequestAccess }) => {
  const tiers = [
    {
      step: "01",
      tag: "Founding Circle",
      title: "For early loyalists.",
      desc: "For the first members who want to help define the Inked Draw standard from the beginning.",
      features: [
        "Early access to the private digital humidor",
        "Collector profile and tasting archive",
        "Priority access to new collection tools"
      ],
      note: "Invitation-led onboarding",
      stat: "550+",
      statLabel: "EARLY MEMBERS"
    },
    {
      step: "02",
      tag: "Lounge Regular",
      title: "For the room you return to.",
      desc: "For aficionados who build their cigar life around lounges, pairings, familiar chairs, and conversations worth repeating.",
      features: [
        "Saved lounge and retailer favorites",
        "Tasting notes with setting and pairing context",
        "Private cigar lounge locator access"
      ],
      note: "Clear product-market fit",
      stat: "12",
      statLabel: "LOUNGES SAVED",
      featured: true
    },
    {
      step: "03",
      tag: "Private Reserve",
      title: "For serious collectors.",
      desc: "For members with rare cigars, aged inventory, box purchases, and a collection that deserves more than a spreadsheet.",
      features: [
        "Rare cigar catalog and private collection records",
        "Aging notes and purchase history",
        "Advanced humidor organization"
      ],
      note: "Built for the high-value tier",
      stat: "125+",
      statLabel: "RARE CIGARS"
    }
  ];

  return (
    <section id="membership" className="py-48 px-8 bg-ivory">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24 border-b border-primary/10 pb-12">
          <h2 className="text-primary text-5xl md:text-7xl font-bold tracking-tighter leading-none">Membership <br/><span className="font-drama italic text-accent pr-4">Tiers.</span></h2>
          <p className="text-primary/50 max-w-sm text-base md:text-lg leading-relaxed font-medium">
            Early access is opening deliberately for collectors, lounge regulars, and private reserve members who want the ritual preserved with taste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, i) => (
            <article 
              key={i}
              className={`flex flex-col p-12 rounded-premium transition-all duration-700 hover:scale-[1.01] hover:-translate-y-2 group relative overflow-hidden ${
                tier.featured 
                ? 'dark-panel shadow-[0_40px_100px_rgba(0,0,0,0.25)] border-accent/30' 
                : 'glass-panel hover:border-accent/30'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`text-[10px] font-bold uppercase tracking-[0.3em] ${tier.featured ? 'text-accent' : 'text-primary/40'}`}>
                    {tier.tag}
                  </div>
                  <div className={`h-px flex-1 ${tier.featured ? 'bg-white/10' : 'bg-primary/10'}`} />
                </div>
                
                <h3 className={`text-3xl md:text-4xl font-bold mb-6 tracking-tight leading-none ${tier.featured ? 'text-ivory' : 'text-primary'}`}>{tier.title}</h3>
                <p className={`text-sm mb-12 leading-relaxed font-medium ${tier.featured ? 'text-ivory/50' : 'text-primary/50'}`}>
                  {tier.desc}
                </p>

                <ul className="space-y-6 mb-16">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-4 text-xs font-bold uppercase tracking-wide">
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span className={tier.featured ? 'text-ivory/80' : 'text-primary/80'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline gap-4 mb-12">
                  <span className={`text-5xl font-bold ${tier.featured ? 'text-accent shadow-accent/5' : 'text-primary'}`}>{tier.stat}</span>
                  <span className={`text-[9px] uppercase tracking-widest font-bold ${tier.featured ? 'text-ivory/30' : 'text-primary/30'}`}>
                    {tier.statLabel}
                  </span>
                </div>
              </div>

              <div className={`pt-12 border-t flex items-center justify-between ${tier.featured ? 'border-white/10' : 'border-primary/10'}`}>
                 <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-drama italic text-accent leading-none">{tier.step}</span>
                   <span className={`text-[10px] uppercase tracking-widest font-bold ${tier.featured ? 'text-ivory/30' : 'text-primary/30'}`}>{tier.note}</span>
                 </div>
                 <button 
                   onClick={() => onRequestAccess(tier.tag)}
                   className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-45 ${tier.featured ? 'bg-accent text-primary' : 'bg-primary text-ivory'}`}
                 >
                   <ArrowRight size={18} />
                 </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Testimonials ---

const Testimonials = () => {
  const reviews = [
    {
      quote: "I stopped losing track of the cigars that mattered. Inked Draw gives my collection a memory.",
      name: "Marcus T.",
      role: "Private Collector",
      initials: "MT",
    },
    {
      quote: "Finally, a cigar app that respects the room. It remembers the cigar, the pairing, and the reason I would order it again.",
      name: "Daniel R.",
      role: "Lounge Regular",
      initials: "DR",
    },
    {
      quote: "I have tried every cigar app that treats my humidor like a warehouse. Inked Draw feels built for someone who actually smokes, collects, and pays attention.",
      name: "James W.",
      role: "Private Reserve Member",
      initials: "JW",
    },
  ];

  return (
    <section className="py-48 px-8 bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="text-accent font-mono text-[10px] uppercase tracking-[0.5em] mb-8 font-bold animate-pulse">Selected member notes</div>
          <h2 className="text-ivory font-drama italic text-5xl md:text-7xl leading-tight">The aficionados have <br/>spoken quietly.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="dark-panel rounded-premium p-10 flex flex-col justify-between group hover:border-accent/40 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1">
              <div className="text-5xl font-drama italic text-accent/20 mb-8 transition-transform group-hover:scale-110 group-hover:text-accent/40 leading-none select-none">“</div>
              <p className="text-ivory/70 text-base leading-relaxed mb-12 font-medium italic">“{r.quote}”</p>
              
              <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-accent/20 bg-accent/5 flex items-center justify-center text-accent text-xs font-bold tracking-widest">
                  {r.initials}
                </div>
                <div>
                  <div className="text-ivory text-sm font-bold tracking-tight">{r.name}</div>
                  <div className="text-ivory/30 text-[10px] uppercase tracking-widest font-bold">{r.role}</div>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={10} className="text-accent fill-accent" />
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

// --- GEO Authority ---

const GeoAuthority = () => {
  const audiences = [
    'High-end cigar collectors managing a private humidor',
    'Lounge regulars who want to remember favorite cigars and pairings',
    'Travelers looking for premium cigar lounges and retailers',
    'Aficionados building a personal tasting journal',
    'Collectors cataloging rare cigars, boxes, and memorable smokes'
  ];

  const reasons = [
    { title: 'A better way to track cigars', desc: 'Organize your collection by cigar, brand, wrapper, origin, vitola, strength, rarity, aging notes, and personal preference.' },
    { title: 'A better way to remember taste', desc: 'Record the details that matter: draw, burn, construction, body, flavor, finish, pairing, mood, and setting.' },
    { title: 'A better way to find cigar lounges', desc: 'Discover and remember premium cigar lounges, retailers, and private spaces that fit your taste.' },
    { title: 'A better way to preserve the ritual', desc: 'Keep the cigar, the room, the pairing, and the reason the moment stayed with you.' }
  ];

  const faqs = [
    { q: 'Is Inked Draw a digital humidor app?', a: 'Yes. Inked Draw is a digital humidor app for cigar collectors who want to track their collection, tasting notes, rare cigars, pairings, and cigar memories in one private place.' },
    { q: 'Is Inked Draw a cigar tracker?', a: 'Yes. Inked Draw works as a premium cigar tracker, but it is designed around ritual and taste rather than simple inventory.' },
    { q: 'Can I use Inked Draw to catalog rare cigars?', a: 'Yes. Inked Draw is built for rare cigar cataloging, private reserve tracking, box purchases, aging notes, and collector-level organization.' },
    { q: 'Does Inked Draw help find cigar lounges?', a: 'Yes. Inked Draw includes a private cigar lounge locator designed to help members discover lounges, retailers, and rooms that match their taste.' }
  ];

  return (
    <section className="py-32 md:py-40 px-6 md:px-8 bg-ivory text-primary overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,410px)] items-center gap-16 lg:gap-24 mb-24">
          <div className="max-w-4xl">
            <div className="text-accent font-mono text-[10px] uppercase tracking-[0.5em] mb-8 font-bold">Digital humidor authority</div>
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-10 text-primary">What is <span className="font-drama italic text-accent">Inked Draw?</span></h2>
            <p className="text-primary/55 text-lg md:text-2xl leading-relaxed font-medium">Inked Draw is a private digital humidor app for premium cigar collectors and aficionados. It combines cigar collection tracking, tasting notes, cigar band scanning, lounge discovery, and rare cigar cataloging into one refined experience.</p>
          </div>

          <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:ml-auto lg:max-w-[390px]">
            <div className="absolute -inset-8 rounded-[4rem] bg-accent/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[3.25rem] bg-primary p-1.5 shadow-[0_32px_90px_rgba(13,13,18,0.22)] ring-1 ring-primary/10">
              <video
                className="aspect-[9/16] w-full rounded-[2.85rem] bg-primary object-cover"
                src="/inked-draw-phone-demo.mp4"
                poster="/inked-draw-phone-demo-preview.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Inked Draw iPhone app preview"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <article className="glass-panel rounded-premium p-10 md:p-12 hover:border-accent/20 transition-all duration-500">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Who is Inked Draw for?</h3>
            <ul className="grid gap-5">
              {audiences.map((item) => (
                <li key={item} className="flex items-start gap-4 text-sm md:text-base text-primary/70 leading-relaxed font-medium">
                  <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="dark-panel rounded-premium p-10 md:p-12 border-white/5 hover:border-accent/30 transition-all duration-500">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-ivory">Why collectors use it</h3>
            <div className="grid gap-7">
              {reasons.map((item) => (
                <div key={item.title}>
                  <h4 className="text-accent text-xs uppercase tracking-[0.25em] font-bold mb-2">{item.title}</h4>
                  <p className="text-ivory/55 leading-relaxed text-sm font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((item) => (
            <article key={item.q} className="border border-primary/5 rounded-[2rem] p-8 bg-white/40 backdrop-blur-sm hover:border-accent/20 transition-all duration-500">
              <h3 className="text-xl font-bold tracking-tight mb-4 text-primary">{item.q}</h3>
              <p className="text-primary/55 text-sm leading-relaxed font-medium">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-primary text-ivory pt-48 pb-16 px-8 rounded-t-[4rem]">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-24 h-24 rounded-full border border-accent/30 bg-primary flex items-center justify-center">
              <img 
                src="https://qrdldhhcebervlmlwfbx.supabase.co/storage/v1/object/public/Inked%20Draw%20Images/id-logo-b.png" 
                alt="Inked Draw Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tighter">Inked Draw</span>
          </div>
          <p className="text-ivory/40 text-lg leading-relaxed max-w-sm mb-12 font-medium">
            The private digital humidor and premium cigar tracker for collectors who notice the details.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent font-bold">Membership Opening Soon</span>
          </div>
        </div>

        <div>
          <div className="text-accent font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Navigation</div>
          <ul className="space-y-6 text-sm">
            {[
              { label: 'Experience', href: '#experience' },
              { label: 'The humidor', href: '#humidor' },
              { label: 'Membership', href: '#membership' },
              { label: 'Philosophy', href: '#philosophy' }
            ].map(item => (
              <li key={item.label}>
                <a href={item.href} className="text-ivory/40 hover:text-accent transition-all duration-300 font-bold uppercase tracking-[0.1em] text-[11px]">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-accent font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Connect</div>
          <ul className="space-y-6 text-sm">
            {['Instagram', 'Lounge Journal', 'Member Support'].map(item => (
              <li key={item}>
                <a href="#" className="text-ivory/40 hover:text-accent transition-all duration-300 font-bold uppercase tracking-[0.1em] text-[11px]">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-ivory/20 uppercase tracking-[0.5em]">
        <div>© 2026 Inked Draw Private Society</div>
        <div className="flex gap-12">
          <a href="#" className="hover:text-ivory transition-colors">Privacy</a>
          <a href="#" className="hover:text-ivory transition-colors">Terms</a>
          <a href="#" className="hover:text-ivory transition-colors">Security</a>
        </div>
      </div>
    </div>
  </footer>
);

const ActivationPage = () => {
  const [activationState, setActivationState] = useState('checking');
  const [activationEmail, setActivationEmail] = useState('');
  const [activationErrorDetail, setActivationErrorDetail] = useState('');

  useEffect(() => {
    let isMounted = true;
    let hasResolvedActivation = false;

    const cleanActivationUrl = () => {
      if (window.location.hash || window.location.search) {
        window.history.replaceState(null, '', ACTIVATION_PATH);
      }
    };

    const syncActivatedSession = async (session) => {
      if (!isMounted || hasResolvedActivation || !session?.user?.email) return;

      hasResolvedActivation = true;
      const verifiedEmail = normalizeEmail(session.user.email);
      setActivationEmail(verifiedEmail);

      try {
        const result = await markAccessRequestActivated(verifiedEmail);
        if (!isMounted) return;
        setActivationState(result.state);
      } catch (err) {
        console.error('Access request activation failed:', err);
        if (!isMounted) return;
        setActivationErrorDetail(err.message || 'The request status could not be updated.');
        setActivationState('syncError');
      } finally {
        if (isMounted) {
          cleanActivationUrl();
        }
      }
    };

    const resolveSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted || hasResolvedActivation) return;

      if (error) {
        setActivationErrorDetail(error.message || '');
        setActivationState('error');
        return;
      }

      if (data.session) {
        await syncActivatedSession(data.session);
        return;
      }

      setActivationState('missing');
    };

    const timer = window.setTimeout(resolveSession, 600);
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncActivatedSession(session);
    });

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const copyByState = {
    checking: {
      label: 'Verifying Link',
      title: 'Activating your early access',
      body: 'Hold tight while we verify the secure link from your email.',
      action: null,
    },
    active: {
      label: 'Access Activated',
      title: 'Your email is verified',
      body: `${activationEmail || 'This email'} is verified and your early access request is marked activated. Use this same email when the private app opens.`,
      action: 'Return to Inked Draw',
    },
    missingRequest: {
      label: 'Email Verified',
      title: 'Request not found',
      body: `${activationEmail || 'This email'} is verified, but no matching early access request was found in the ledger. Return to the site and submit the form again with this same email.`,
      action: 'Request Access',
    },
    syncError: {
      label: 'Email Verified',
      title: 'Ledger sync needs review',
      body: `${activationEmail || 'This email'} is verified, but the request status could not be updated automatically. ${activationErrorDetail || 'Return to the site and try the latest activation link again.'}`,
      action: 'Return to Inked Draw',
    },
    missing: {
      label: 'Link Needs Refresh',
      title: 'No active session found',
      body: 'Open the latest activation email on this device. If the link has expired, return to the site and request a fresh early access email.',
      action: 'Request a New Link',
    },
    error: {
      label: 'Activation Fault',
      title: 'We could not verify that link',
      body: `Your request may still be recorded. ${activationErrorDetail || 'Return to the site and request a new activation email using the same address.'}`,
      action: 'Try Again',
    },
  };

  const content = copyByState[activationState];

  return (
    <div className="min-h-screen bg-primary text-ivory relative overflow-hidden flex items-center justify-center px-6 py-16">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_10%,rgba(201,168,76,0.35),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.12),transparent_28%)]" />
      <div className="noise-overlay" />

      <main className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto mb-10 w-24 h-24 rounded-full border border-accent/30 bg-black/30 flex items-center justify-center shadow-[0_0_60px_rgba(201,168,76,0.14)]">
          {activationState === 'checking' ? (
            <div className="w-9 h-9 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
          ) : activationState === 'active' ? (
            <Check size={34} className="text-accent" />
          ) : (
            <Shield size={34} className="text-accent" />
          )}
        </div>

        <div className="text-accent font-mono text-[10px] uppercase tracking-[0.45em] mb-6 font-bold">
          {content.label}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
          {content.title}
        </h1>
        <p className="text-ivory/60 text-base md:text-lg leading-relaxed font-medium max-w-xl mx-auto mb-10">
          {content.body}
        </p>

        {activationState === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10 text-left">
            {[
              'Keep your queue reference from the request screen.',
              'Use this verified email for private app access.',
              'Watch for the opening notice when your tier is released.'
            ].map((step, index) => (
              <div key={step} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-accent font-mono text-[10px] mb-3">0{index + 1}</div>
                <p className="text-ivory/55 text-sm leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        )}

        {content.action && (
          <button
            onClick={() => { window.location.href = '/'; }}
            className="btn-premium group bg-accent text-primary px-10 py-4 text-[10px] uppercase tracking-widest font-bold mx-auto"
          >
            <span className="relative z-10 flex items-center gap-3">
              {content.action}
              <ArrowRight size={14} />
            </span>
            <span className="absolute inset-0 bg-ivory translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
          </button>
        )}
      </main>
    </div>
  );
};

const ReturnToTopButton = ({ onReturnToTop }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 700);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={onReturnToTop}
      aria-label="Return to top"
      className={`fixed bottom-6 right-6 z-[120] h-14 w-14 rounded-full border border-accent/30 bg-primary/85 text-accent shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl flex items-center justify-center transition-all duration-500 hover:bg-accent hover:text-primary hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'
      }`}
    >
      <ArrowUp size={20} strokeWidth={2.2} />
    </button>
  );
};

// --- Request Access Modal Component ---

const RequestAccessModal = ({ isOpen, onClose, prefilledTier }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [collectionSize, setCollectionSize] = useState("");
  const [favoriteLounge, setFavoriteLounge] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [systemLogs, setSystemLogs] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [activationEmailStatus, setActivationEmailStatus] = useState("idle");

  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Sync prefilled tier
  useEffect(() => {
    if (prefilledTier) {
      setCollectionSize(prefilledTier);
    } else {
      setCollectionSize("Lounge Regular");
    }
  }, [prefilledTier, isOpen]);

  // GSAP animations for modal entry/exit
  useEffect(() => {
    if (isOpen) {
      setFullName("");
      setEmail("");
      setFavoriteLounge("");
      setReason("");
      setStatus("idle");
      setErrorMessage("");
      setSystemLogs([]);
      setActivationEmailStatus("idle");

      let ctx = gsap.context(() => {
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.fromTo(modalRef.current, 
          { scale: 0.95, y: 40, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.95,
      y: 30,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in"
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulating terminal sequence logs for visual fidelity
    const logs = [
      "> INITIALIZING ENROLLMENT GATEWAY...",
      "> VALIDATING SECURITY CREDENTIALS...",
      "> ENCRYPTING PALATE LEDGER DATA...",
      "> CONNECTING TO SUPABASE LEDGER VAULT...",
      "> SECURING TRANSACTION SHA-256..."
    ];

    for (let i = 0; i < logs.length; i++) {
      setSystemLogs(prev => [...prev, logs[i]]);
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    try {
      const requestedEmail = normalizeEmail(email);

      const { error } = await supabase
        .from('access_requests')
        .insert([
          {
            full_name: fullName.trim(),
            email: requestedEmail,
            collection_size: collectionSize,
            favorite_lounge: favoriteLounge.trim(),
            reason: reason.trim(),
            status: 'pending'
          }
        ]);

      if (error) throw error;

      setSystemLogs(prev => [...prev, "> DISPATCHING ACTIVATION INSTRUCTIONS..."]);

      const { error: activationError } = await supabase.auth.signInWithOtp({
        email: requestedEmail,
        options: {
          emailRedirectTo: getActivationRedirectUrl(),
          shouldCreateUser: true,
        },
      });

      if (activationError) {
        console.error("Activation email failed:", activationError);
        setActivationEmailStatus("failed");
        setErrorMessage(activationError.message || "Request received, but the activation email could not be sent.");
        setSystemLogs(prev => [...prev, "> REQUEST RECORDED. ACTIVATION EMAIL REQUIRES RETRY."]);
      } else {
        setActivationEmailStatus("sent");
        setSystemLogs(prev => [...prev, "> ACTIVATION INSTRUCTIONS SENT."]);
      }

      const randomId = Math.floor(1000 + Math.random() * 9000);
      setMemberId(`ID-2026-${randomId}`);
      
      setSystemLogs(prev => [...prev, "> DEPOSIT SUCCESSFUL. QUEUE POSITION SECURED."]);
      await new Promise(resolve => setTimeout(resolve, 300));
      setStatus("success");
    } catch (err) {
      console.error(err);
      setSystemLogs(prev => [...prev, `> ERROR: ${err.message || 'TRANSACTION FAILED'}`]);
      setErrorMessage(err.message || "Failed to submit request access. Please try again.");
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/80 backdrop-blur-2xl opacity-0"
      onClick={handleClose}
    >
      <div className="noise-overlay pointer-events-none" />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-primary border border-accent/25 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_60px_rgba(201,168,76,0.15)] overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ivory hover:text-accent hover:border-accent/30 transition-all duration-300 group hover:rotate-90 bg-primary/80 backdrop-blur-sm"
          aria-label="Close form"
        >
          <X size={16} />
        </button>

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-accent font-mono text-[9px] uppercase tracking-[0.4em] mb-2 font-bold animate-pulse">Enrollment Ledger</div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ivory leading-none">
                Request Early <span className="font-drama italic text-accent">Access</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="full-name" className="text-[9px] uppercase tracking-widest font-bold text-accent font-mono">Full Name</label>
                <input 
                  id="full-name"
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Daniel Vane"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-ivory placeholder-white/20 focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email-address" className="text-[9px] uppercase tracking-widest font-bold text-accent font-mono">Email Address</label>
                <input 
                  id="email-address"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. daniel@vane.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-ivory placeholder-white/20 focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="membership-tier" className="text-[9px] uppercase tracking-widest font-bold text-accent font-mono">Membership Tier</label>
                <select 
                  id="membership-tier"
                  value={collectionSize}
                  onChange={(e) => setCollectionSize(e.target.value)}
                  className="membership-tier-select w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-ivory focus:outline-none focus:border-accent transition-colors font-sans text-sm cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="Founding Circle">Founding Circle (01)</option>
                  <option value="Lounge Regular">Lounge Regular (02)</option>
                  <option value="Private Reserve">Private Reserve (03)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="primary-cigar-lounge" className="text-[9px] uppercase tracking-widest font-bold text-accent font-mono">Primary Cigar Lounge</label>
                <input 
                  id="primary-cigar-lounge"
                  type="text"
                  value={favoriteLounge}
                  onChange={(e) => setFavoriteLounge(e.target.value)}
                  placeholder="e.g. Ritz-Carlton Club, LA"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-ivory placeholder-white/20 focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="aficionado-profile" className="text-[9px] uppercase tracking-widest font-bold text-accent font-mono">Aficionado Profile</label>
              <textarea 
                id="aficionado-profile"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us about your collection or what you look for in a private cigar lounge..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-ivory placeholder-white/20 focus:outline-none focus:border-accent transition-colors font-sans text-sm resize-none"
              />
            </div>

            <button 
              type="submit" 
              className="w-full btn-premium bg-accent text-primary py-5 text-xs tracking-widest font-bold mt-4 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
            >
              <span className="relative z-10">Submit Enrollment Request</span>
              <span className="absolute inset-0 bg-ivory translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            </button>
          </form>
        )}

        {status === "submitting" && (
          <div className="py-12 flex flex-col items-center justify-center min-h-[350px] scanline-overlay">
            <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-8" />
            <div className="w-full max-w-md bg-black/40 rounded-2xl p-6 font-mono text-[10px] text-accent/80 border border-white/5 leading-relaxed">
              {systemLogs.map((log, index) => (
                <div key={index} className="animate-fade-in font-mono">{log}</div>
              ))}
              <span className="inline-block w-1.5 h-3 bg-accent animate-pulse ml-0.5" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(201,168,76,0.2)]">
              <Check size={28} className="text-accent" />
            </div>
            <div className="text-green-500 font-mono text-[9px] uppercase tracking-[0.4em] mb-3 font-bold flex items-center gap-1.5 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              {activationEmailStatus === "sent" ? "Instructions Sent" : "Enrollment Secured"}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ivory mb-4">
              {activationEmailStatus === "sent" ? "Check Your Email" : "Request Received"}
            </h2>
            <p className="text-ivory/60 text-sm max-w-md leading-relaxed mb-6 font-medium mx-auto">
              {activationEmailStatus === "sent"
                ? `Activation instructions were sent to ${email}. Open the secure link to verify this address and activate your early access profile.`
                : "Your request is recorded, but the activation email could not be sent automatically. Keep this reference ID and request a fresh link in a moment."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 w-full">
              {[
                'Open the activation email.',
                'Tap the secure access link.',
                'Use this email when the app opens.'
              ].map((step, index) => (
                <div key={step} className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 text-left">
                  <div className="text-accent font-mono text-[8px] uppercase tracking-widest mb-2">Step 0{index + 1}</div>
                  <p className="text-ivory/55 text-xs leading-relaxed font-medium">{step}</p>
                </div>
              ))}
            </div>

            {activationEmailStatus === "failed" && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8 max-w-md mx-auto text-left">
                <div className="text-red-300 font-mono text-[8px] uppercase tracking-widest mb-2">Activation Email Not Sent</div>
                <p className="text-red-100/75 text-xs leading-relaxed font-medium">
                  {errorMessage}
                </p>
              </div>
            )}
             
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-xs text-ivory/80 mb-8 max-w-xs w-full mx-auto">
              <div className="text-[8px] uppercase tracking-widest text-ivory/40 mb-1">Queue Reference ID</div>
              <div className="text-accent font-bold tracking-widest">{memberId}</div>
            </div>

            <button 
              onClick={handleClose} 
              className="btn-premium bg-white/10 text-ivory px-8 py-3.5 text-[10px] uppercase tracking-widest font-bold hover:bg-white/15 mx-auto"
            >
              <span className="relative z-10">Return to Society</span>
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="py-8 text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center mb-6 mx-auto">
              <X size={28} className="text-red-500" />
            </div>
            <div className="text-red-500 font-mono text-[9px] uppercase tracking-[0.4em] mb-3 font-bold">
              Database Fault
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ivory mb-4">Submission Failed</h2>
            <p className="text-ivory/60 text-sm max-w-sm leading-relaxed mb-8 font-medium mx-auto">
              {errorMessage}
            </p>
            
            <button 
              onClick={() => setStatus("idle")} 
              className="btn-premium bg-accent text-primary px-8 py-3.5 text-[10px] uppercase tracking-widest font-bold mx-auto"
            >
              <span className="relative z-10">Retry Submission</span>
              <span className="absolute inset-0 bg-ivory translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

function App() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [prefilledTier, setPrefilledTier] = useState("");
  const lenisRef = useRef(null);
  const isActivationRoute = typeof window !== 'undefined' && window.location.pathname === ACTIVATION_PATH;

  const openRequestModal = (tier = "") => {
    setPrefilledTier(tier);
    setIsRequestModalOpen(true);
  };

  const returnToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Sync scroll lock when modal state changes
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isRequestModalOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isRequestModalOpen]);

  if (isActivationRoute) {
    return <ActivationPage />;
  }

  return (
    <div className="selection:bg-accent selection:text-primary overflow-x-hidden">
      {/* Global Noise Overlay */}
      <div className="noise-overlay" />
      
      <Navbar onRequestAccess={() => openRequestModal()} onReturnToTop={returnToTop} />
      <main>
        <Hero onRequestAccess={() => openRequestModal()} />
        <GeoAuthority />
        <Features />
        <Philosophy />
        <Protocol />
        <Membership onRequestAccess={(tier) => openRequestModal(tier)} />
        <Testimonials />
        
        {/* Final CTA */}
        <section className="py-64 px-8 bg-ivory text-center relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-accent/20" />
           <div className="relative z-10 max-w-4xl mx-auto">
             <div className="text-accent font-mono text-[10px] uppercase tracking-[0.5em] mb-12 font-bold animate-pulse">Final Enrollment</div>
             <h2 className="text-6xl md:text-9xl font-bold tracking-tighter text-primary mb-12 leading-[0.8] text-balance">
                Never lose <br/>
                <span className="font-drama italic text-accent">another draw.</span>
             </h2>
             <button 
               onClick={() => openRequestModal()}
               className="btn-premium group bg-primary text-ivory px-16 py-6 text-sm mx-auto shadow-2xl"
             >
                <span className="relative z-10">Request Early Access</span>
                <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
             </button>
           </div>
        </section>
      </main>
      <Footer />
      <ReturnToTopButton onReturnToTop={returnToTop} />

      <RequestAccessModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        prefilledTier={prefilledTier}
      />
    </div>
  );
}

export default App;
