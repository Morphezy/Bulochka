import "./index.css";
import { useRef, useEffect, useState } from "react";
import logo from "./logo.svg";
import react from "./react.svg";
import perf from "./perf.jpg";
import mus from "./mus.mp3";
import her1 from "./her/1.jpg";
import her2 from "./her/2.jpg";
import her3 from "./her/3.jpg";
import her4 from "./her/4.jpg";
import her5 from "./her/5.jpg";
import her6 from "./her/6.jpg";
import her7 from "./her/7.jpg";
import her8 from "./her/8.jpg";
import her9 from "./her/9.jpg";
import her10 from "./her/10.jpg";
import her11 from "./her/11.jpg";
import her12 from "./her/12.jpg";
import her13 from "./her/13.jpg";
import her14 from "./her/14.jpg";
import her15 from "./her/15.jpg";
import her16 from "./her/16.jpg";
import her17 from "./her/17.jpg";
import her18 from "./her/18.jpg";
import her19 from "./her/19.jpg";
import her20 from "./her/20.jpg";
import her21 from "./her/21.jpg";
import her22 from "./her/22.jpg";
import art1 from "./artworks/1.jpg";
import art2 from "./artworks/2.jpg";
import art3 from "./artworks/3.jpg";
import art4 from "./artworks/4.jpg";
import art5 from "./artworks/5.jpg";
import art6 from "./artworks/6.jpg";
import art7 from "./artworks/7.jpg";
import art8 from "./artworks/8.jpg";

const slides = [
  {
    title: "Слайд 1",
    subtitle: "Тёплые облака",
    description: "Мягкие булочки, как в сказке.",
    from: "#6b023b",
    to: "#000000",
  },
  {
    title: "Слайд 2",
    subtitle: "Нежный вкус",
    description: "Каждый кусочек пропитан атмосферой.",
    from: "#8a034d",
    to: "#30001f",
  },
  {
    title: "Слайд 3",
    subtitle: "Сказочный уют",
    description: "Идеальное сочетание аромата и тепла.",
    from: "#3a001f",
    to: "#000000",
  },
];

// image lists (imported so bundler includes them)
const herImages = [
  her1, her2, her3, her4, her5, her6, her7, her8, her9, her10, her11, her12,
  her13, her14, her15, her16, her17, her18, her19, her20, her21, her22,
];

const artworkImages = [art1, art2, art3, art4, art5, art6, art7, art8];

export function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const rafRef = useRef<number | null>(null);

  const [herActive, setHerActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(mus);
    audioRef.current.preload = "auto";
    audioRef.current.volume = 0.75;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isPhone = typeof navigator !== "undefined" && mobileRegex.test(navigator.userAgent);
    const smallScreen = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(isPhone || smallScreen);
  }, []);

  const playMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(mus);
      audioRef.current.preload = "auto";
      audioRef.current.volume = 0.5;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // ignore autoplay prevention; playback is user-initiated
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setHerActive((c) => (c + 1) % herImages.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Hearts state for click effect on the perf image
  const [hearts, setHearts] = useState<
    { id: number; startX: number; startY: number; targetX: number; targetY: number; size: number }[]
  >([]);
  const heartId = useRef(0);
  const perfRef = useRef<HTMLDivElement>(null);

  // spawn hearts that fly from bottom to middle of perf.jpg
  const onLoveClick = () => {
    const spawnCount = 12;
    if (!perfRef.current) return;

    const perfRect = perfRef.current.getBoundingClientRect();

    // spawn position: anywhere on the perf image
    const startXBase = perfRect.left;
    const maxStartX = perfRect.left + perfRect.width;
    const minStartY = perfRect.top;
    const maxStartY = perfRect.top + perfRect.height;

    // target: center of perf image
    const targetX = perfRect.left + perfRect.width / 2;
    const targetY = perfRect.top + perfRect.height / 2;

    const newHearts: { id: number; startX: number; startY: number; targetX: number; targetY: number; size: number }[] = [];
    for (let i = 0; i < spawnCount; i++) {
      const id = ++heartId.current;
      const size = 20 + Math.floor(Math.random() * 36); // px
      const startX = startXBase + Math.random() * (maxStartX - startXBase);
      const startY = minStartY + Math.random() * (maxStartY - minStartY);
      newHearts.push({ id, startX, startY, targetX, targetY, size });
      // schedule removal per heart
      setTimeout(() => {
        setHearts((h) => h.filter((x) => x.id !== id));
      }, 1200 + Math.floor(Math.random() * 300));
    }
    setHearts((h) => [...h, ...newHearts]);
  };

  const scrollToGallery = (e: any) => {
    e?.preventDefault();
    playMusic();
    const target = document.getElementById("gallery");
    if (!target) return;
    target.classList.add("revealed");

    const start = window.scrollY || window.pageYOffset;
    const targetY = target.getBoundingClientRect().top + start;
    const distance = targetY - start;
    const duration = 900;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, Math.round(start + distance * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
  };

  const prevSlide = () =>
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);

  const nextSlide = () =>
    setActiveSlide((current) => (current + 1) % slides.length);

  const prevHer = () => setHerActive((c) => (c - 1 + herImages.length) % herImages.length);
  const nextHer = () => setHerActive((c) => (c + 1) % herImages.length);

  if (isMobile) {
    return (
      <main className="min-h-screen w-screen flex items-center justify-center px-6 text-center bg-black text-white">
        <h1 className="text-3xl sm:text-5xl font-semibold px-4">
          я же сказал, что с телефона нельзя
        </h1>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen w-screen flex flex-col items-center justify-center px-6 text-center relative z-10 overflow-hidden">
        <h1 className="text-[clamp(5rem,10vw,12rem)] font-serif font-semibold tracking-tight leading-none mb-8">
          BULOCHKA
        </h1>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img src={logo} className="floating-bun bun1" alt="" />
          <img src={logo} className="floating-bun bun2" alt="" />
          <img src={logo} className="floating-bun bun3" alt="" />
          <img src={logo} className="floating-bun bun4" alt="" />
          <img src={logo} className="floating-bun bun5" alt="" />
          <img src={logo} className="floating-bun bun6" alt="" />
        </div>
        <a
          href="#gallery"
          onClick={scrollToGallery}
          className="w-full max-w-[50rem] px-10 py-5 rounded-2xl border border-black border-radius-4 bg-gray-200 text-black text-3xl font-semibold shadow-lg transition duration-500 ease-in-out hover:bg-black hover:text-white"
        >
          Start admiring
        </a>
      </main>

      <section id="gallery" className="w-screen px-6 py-16">
        <div className="mx-auto max-w-[90rem]">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">SWAGIEST IN UKRAINE</p>
            <h2 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
              BULOCHKA - GODDES HERSELF
            </h2>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5/10 shadow-2xl backdrop-blur-xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${herActive * 100}%)` }}
            >
              {herImages.map((img, index) => (
                <div key={index} className="min-h-[60vh] flex-shrink-0 w-full px-0 py-0 text-center">
                  <img src={img} alt={`her-${index}`} className="w-full h-[60vh] object-cover" />
                </div>
              ))}
            </div>

            <button
              onClick={prevHer}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-3 text-2xl text-white transition hover:bg-white/10 sm:left-8"
              aria-label="Previous her image"
            >
              ‹
            </button>
            <button
              onClick={nextHer}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-3 text-2xl text-white transition hover:bg-white/10 sm:right-8"
              aria-label="Next her image"
            >
              ›
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            {herImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setHerActive(index)}
                className={`h-3 w-3 rounded-full transition ${
                  herActive === index ? "bg-white" : "bg-white/30"
                }`}
                aria-label={`Her slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      

      <section className="w-screen px-6 py-16">
        <div className="mx-auto max-w-[90rem]">
          <div className="flex flex-col gap-6 lg:mx-auto lg:w-[90%]">
            <div className="text-center">
              <p className="text-4xl font-semibold text-white">MAA GIRRLLL</p>
            </div>

            <div ref={perfRef} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
              <img
                src={perf}
                alt="Big preview"
                className="h-[1200px] w-full object-cover cursor-pointer"
                onClick={onLoveClick}
              />
            </div>

            <div className="text-center">
              <p className="text-5xl font-black uppercase tracking-[0.2em] text-white">SHES A FUCKING PERFECTION!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-screen px-6 py-16">
        <div className="mx-auto max-w-[90rem]">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            <div className="flex flex-col gap-8">
              <div className="lg:w-[640px] w-full">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-10 text-left shadow-2xl min-h-[280px]">
                  <h3 className="text-5xl font-semibold text-white">EXECUTIVE SUMMARY & VISUAL SPECIFICATIONS</h3>
                  <ul className="mt-6 text-3xl text-white/80 space-y-4 list-disc list-inside">
                    <li>Honorable mention: her absolutely freakin' stunning brown eyes</li>
                    <li>Her presence is fucking massive.</li>
                    <li>With SAINT dyed blonde hair that looks absolutely phenomenal. It gives off major main-character energy, perfectly framing her face and matching her overall killer aesthetic.</li>
                    <li>She sports this low-key devious, mischievous smile that is both incredibly captivating and slightly dangerous. It's the kind of smirk that literally melts my brains.</li>
                    <li>Her style is unmatched. She's not out here wearing basic-ass fast fashion; her outfits are deeply curated and stylish as fuck. An absolute queen, blending edgy alternative energy with high-tier street fashion. 10/10 drip.</li> 

                  </ul>
                </div>
              </div>
              <div className="lg:w-[640px] w-full">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-10 text-left shadow-2xl min-h-[280px]">
                  <h3 className="text-5xl font-semibold text-white">CORE CAPABILITIES & TALENT MATRIX</h3>
                  <ul className="mt-6 text-3xl text-white/80 space-y-4 list-disc list-inside">
                    <li>Her drawing skills are genuinely insane. She doesn’t just doodle; she creates absolute masterpieces. Her artistic vision, execution, and attention to detail are out of this world.</li>
                    <li>When it comes to the kitchen, she is a fucking wizard. It doesn't matter what the ingredients are... she can cook literally anything and turn it into a Michelin-star-level feast. Whether it's a complex gourmet dinner or some late-night comfort food, her cooking is so delicious it’ll make you want to cry. An absolute culinary prodigy.</li>
                    <li>She is incredibly skilled at doing nails. This isn't just a basic manicure; it's precise, creative, and highly technical work. She can turn a set of nails into a literal canvas, showcasing her insane attention to detail and flawless taste.</li>


                  </ul>
                </div>
              </div>
            </div>
            <div className="lg:w-[640px] w-full lg:mt-128">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-10 text-left shadow-2xl min-h-[280px]">
                <h3 className="text-5xl font-semibold text-white">PERSONALITY & CHARM</h3>
                <ul className="mt-6 text-3xl text-white/80 space-y-4 list-disc list-inside">
                  <li>She is incredibly witty. Her sense of humor is sharp as fuck, and she can keep up with any conversation at lightning speed.</li>
                  <li>Her energy is absolutely contagious. Being around her feels like you're in a constant state of excitement.</li>
                  <li>She possesses an unspoken, effortless charm that makes her an absolute magnet for people. Everyone instinctively wants to be around her,</li>
                  <li>It’s not just about being pretty or nice; it's a rare, high frequency aura. She attracts attention without even trying, pulling people into her orbit because her energy is just that infectious and cool. You can't fake this kind of charisma she was just born with it.</li>
                  
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTWORKS infinite carousel */}
      <section className="w-screen px-6 py-12 overflow-hidden bg-transparent">
        <div className="mx-auto max-w-[90rem]">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-semibold text-white">ARTWORKS GALLERY</h2>
          </div>
          <div className="relative overflow-hidden">
            <div className="art-carousel flex gap-8">
              {[...artworkImages, ...artworkImages].map((src, idx) => (
                <div key={idx} className="flex-shrink-0 w-[320px] h-[320px] rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={src} alt={`art-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      

        {/* Hearts overlay flying from perf image */}
        <div className="hearts-root fixed inset-0 pointer-events-none z-50">
          {hearts.map((heart) => {
            const deltaX = heart.targetX - heart.startX;
            const deltaY = heart.targetY - heart.startY;
            return (
              <span
                key={heart.id}
                className="heart-flying"
                style={{
                  left: `${heart.startX}px`,
                  top: `${heart.startY}px`,
                  fontSize: `${heart.size}px`,
                  ["--endX" as any]: `${deltaX}px`,
                  ["--endY" as any]: `${deltaY}px`,
                }}
              >
                ❤️
              </span>
            );
          })}
        </div>

      <footer className="w-screen px-6 py-12 border-t border-white/10">
        <div className="mx-auto max-w-[90rem] text-center">
          <p className="text-lg text-white/70">Developed with love and SWAG by Morph</p>
        </div>
      </footer>
    </>
  );
}

export default App;
