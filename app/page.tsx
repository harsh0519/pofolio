'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { revealElements, createParallax, splitTextReveal } from '@/lib/animations';
import PremiumButton from '@/components/common/PremiumButton';
import SpotifyShowcase from '@/components/common/SpotifyShowcase';
import SkillsSection from '@/components/common/SkillsSection';

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const [showHeroScene, setShowHeroScene] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const mainText = titleRef.current.querySelector<HTMLElement>('#txt');
        if (mainText) {
          splitTextReveal(mainText, { type: 'chars', stagger: 0.05, delay: 0.5 });
        }
      }

      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, { opacity: 0, y: 50, filter: 'blur(10px)', duration: 1.2, delay: 1.5, ease: 'power3.out' });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, { opacity: 0, y: 50, rotationX: -90, transformPerspective: 1000, stagger: 0.2, delay: 2, duration: 1, ease: 'power4.out' });
      }

      if (heroRef.current) {
        const heroEl = heroRef.current as HTMLElement;
        const glitchEls = Array.from(heroEl.querySelectorAll<HTMLElement>('.glitch'));
        const top = heroEl.querySelector<HTMLElement>('.top');
        const bottom = heroEl.querySelector<HTMLElement>('.bottom');
        const mainTxt = heroEl.querySelector<HTMLElement>('#txt');

        if ((glitchEls.length || top || bottom) && mainTxt) {
          const gTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
          gTl.set([top, bottom], { autoAlpha: 0, visibility: 'hidden' }, 0);
          gTl.to([top, bottom], { duration: 0.1, skewX: 70, ease: 'power4.inOut' })
            .to([top, bottom], { duration: 0.04, skewX: 0, ease: 'power4.inOut' })
            .to([top, bottom], { duration: 0.04, autoAlpha: 0 })
            .to([top, bottom], { duration: 0.04, autoAlpha: 1 })
            .to([top, bottom], { duration: 0.04, x: -12 })
            .to([top, bottom], { duration: 0.04, x: 0 })
            .add('split', 0)
            .set([top, bottom], { autoAlpha: 1, visibility: 'visible' }, 'split')
            .set([top, bottom], { willChange: 'transform, opacity' }, 'split')
            .to(top, { duration: 0.4, x: -30, ease: 'power4.inOut' }, 'split')
            .to(bottom, { duration: 0.4, x: 30, ease: 'power4.inOut' }, 'split')
            .call(() => { top && top.classList.add('redShadow'); bottom && bottom.classList.add('redShadow'); }, undefined, 'split')
            .to(mainTxt, { duration: 0, scale: 1.1 }, 'split')
            .to(mainTxt, { duration: 0, scale: 1 }, 'split+=0.02')
            .call(() => { top && top.classList.remove('redShadow'); bottom && bottom.classList.remove('redShadow'); }, undefined, '+=0.09')
            .call(() => { top && top.classList.add('greenShadow'); bottom && bottom.classList.add('greenShadow'); }, undefined, 'split')
            .call(() => { top && top.classList.remove('greenShadow'); bottom && bottom.classList.remove('greenShadow'); }, undefined, 'split+=0.01')
            .to([top, bottom], { duration: 0.2, x: 0, ease: 'power4.inOut' })
            .to([top, bottom], { duration: 0.02, scaleY: 1.1, ease: 'power4.inOut' })
            .to([top, bottom], { duration: 0.04, scaleY: 1, ease: 'power4.inOut' })
            .set([top, bottom], { clearProps: 'willChange' }, '+=0')
            .set([top, bottom], { autoAlpha: 0, visibility: 'hidden' }, '+=0.01');
        }
      }

      gsap.utils.toArray<HTMLElement>('.parallax-section').forEach((section) => {
        const content = section.querySelector('.parallax-content');
        if (content) gsap.to(content, { y: -100, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 } });
      });

      gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
        gsap.from(card, { opacity: 0, y: 150, rotationY: -15, scale: 0.8, transformPerspective: 1000, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 50%', toggleActions: 'play none none reverse', scrub: 1 } });
      });

      gsap.utils.toArray<HTMLElement>('.page-transition').forEach((element) => {
        gsap.from(element, { opacity: 0, y: 100, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none reverse' } });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Hide hero Scene3D after ~100vh scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight; // 100vh

      if (scrollY > threshold) {
        setShowHeroScene(false);
      } else {
        setShowHeroScene(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main ref={heroRef} className="bg-transparent relative">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {showHeroScene && (
          <div
            ref={heroSceneRef}
            className="absolute inset-0 opacity-70 animate-fadeIn"
            style={{
              animation: 'fadeIn 0.8s ease-in-out forwards'
            }}
          >
            <Scene3D />
          </div>
        )}

        <div className="absolute inset-0 from-transparent via-black/50 to-black pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="mb-8">
            <div ref={titleRef} className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6 text-white relative w-full tracking-tight leading-tight drop-shadow-[0_12px_30px_rgba(0,0,0,0.7)] px-4 sm:px-0 whitespace-normal md:whitespace-nowrap" style={{ perspective: '1000px', overflow: 'hidden', textAlign: 'center' }} aria-hidden={false}>
              <span id="txt" className="inline-block">HARSH KUMAR MEHTA</span>
              <div className="glitch-wrap absolute inset-0 pointer-events-none overflow-hidden">
                <span className="glitch top inline-block">HARSH KUMAR MEHTA</span>
                <span className="glitch bottom inline-block">HARSH KUMAR MEHTA</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6 justify-center items-center flex-wrap mt-6">
            <PremiumButton href="/projects" className='p-3 w-[250px]'>View Projects <FiArrowRight className="w-5 h-5" /></PremiumButton>
            <PremiumButton href="/contact" className='p-3 w-[250px]'>Get in Touch</PremiumButton>
          </div>

          <div className="mt-16 flex gap-6 justify-center">
            {[{ icon: FiGithub, href: 'https://github.com' }, { icon: FiLinkedin, href: 'https://linkedin.com' }, { icon: FiMail, href: 'mailto:hello@example.com' }].map((social, i) => (
              <a key={i} href={social.href} className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110" target="_blank" rel="noopener noreferrer">
                <span className="flex h-12 w-12 items-center justify-center rounded-full  to-transparent shadow-md text-white"><social.icon className="w-5 h-5" /></span>
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-400/30 rounded-full flex justify-center bg-black/40">
            <div className="w-1 h-3 bg-amber-300 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>
      <section className="parallax-section relative py-20 sm:py-28 lg:py-32 overflow-hidden">
        <div className="parallax-content">
          <SkillsSection />
        </div>
      </section>
      <section className="parallax-section relative py-20 sm:py-28 lg:py-32 overflow-hidden mt-[-300px]">
        <div className="parallax-content text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">Let's Create Something<br /><span className="text-white">Amazing Together</span></h2>
          <Link href="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-xl">Start a Project <FiArrowRight /></Link>
        </div>
        <div className="parallax-content container mx-auto px-6">
          <div className="grid md:grid-cols-1 gap-16 items-center">
            <div className="page-transition relative">
              <SpotifyShowcase />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

