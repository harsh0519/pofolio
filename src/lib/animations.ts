import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 *  animation utilities
 */

// Smooth reveal animation with stagger
export const revealElements = (
  elements: gsap.TweenTarget,
  options: {
    delay?: number;
    stagger?: number;
    duration?: number;
    y?: number;
    trigger?: gsap.DOMTarget;
  } = {}
) => {
  const { delay = 0, stagger = 0.1, duration = 1.2, y = 100, trigger } = options;

  const animation = gsap.from(elements, {
    y,
    opacity: 0,
    duration,
    stagger,
    delay,
    ease: 'power4.out',
    clearProps: 'all',
  });

  if (trigger) {
    ScrollTrigger.create({
      trigger,
      start: 'top 80%',
      animation,
      once: true,
    });
  }

  return animation;
};

// Parallax effect
export const createParallax = (
  element: gsap.TweenTarget,
  options: {
    speed?: number;
    trigger?: gsap.DOMTarget;
    start?: string;
    end?: string;
  } = {}
) => {
  const { speed = 0.5, trigger, start = 'top bottom', end = 'bottom top' } = options;

  return gsap.to(element, {
    y: () => -(window.innerHeight * speed),
    ease: 'none',
    scrollTrigger: {
      trigger: (trigger as gsap.DOMTarget) || (element as gsap.DOMTarget),
      start,
      end,
      scrub: true,
    },
  });
};

// Split text reveal with character animation (custom implementation)
export const splitTextReveal = (
  element: gsap.TweenTarget,
  options: {
    type?: 'chars' | 'words' | 'lines';
    stagger?: number;
    duration?: number;
    delay?: number;
  } = {}
) => {
  const { type = 'chars', stagger = 0.03, duration = 0.8, delay = 0 } = options;

  if (typeof element === 'string') {
    const el = document.querySelector(element);
    if (!el) return;
    element = el;
  }

  const el = element as HTMLElement;
  const text = el.textContent || '';

  // Split text into spans
  if (type === 'chars') {
    el.innerHTML = text
      .split('')
      .map((char) => `<span style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');
  } else if (type === 'words') {
    el.innerHTML = text
      .split(' ')
      .map((word) => `<span style="display: inline-block;">${word}&nbsp;</span>`)
      .join('');
  }

  const children = el.children;

  return gsap.from(children, {
    opacity: 0,
    y: 100,
    rotationX: -90,
    transformOrigin: '0% 50% -50',
    stagger,
    duration,
    delay,
    ease: 'back.out(1.7)',
  });
};

// Magnetic button effect
export const magneticEffect = (
  button: HTMLElement,
  options: { strength?: number } = {}
) => {
  const { strength = 0.3 } = options;
  let hover = false;

  const handleMouseMove = (e: MouseEvent) => {
    if (!hover) return;

    const { left, top, width, height } = button.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(button, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = () => {
    hover = true;
  };

  const handleMouseLeave = () => {
    hover = false;
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseenter', handleMouseEnter);
  button.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseenter', handleMouseEnter);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Image reveal with clip-path
export const imageReveal = (
  image: gsap.TweenTarget,
  options: {
    trigger?: gsap.DOMTarget;
    direction?: 'left' | 'right' | 'top' | 'bottom';
  } = {}
) => {
  const { trigger, direction = 'left' } = options;

  const clipPaths = {
    left: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
    right: ['inset(0 0 0 100%)', 'inset(0 0% 0 0%)'],
    top: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
    bottom: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
  };

  return gsap.fromTo(
    image,
    {
      clipPath: clipPaths[direction][0],
    },
    {
      clipPath: clipPaths[direction][1],
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: (trigger as gsap.DOMTarget) || (image as gsap.DOMTarget),
        start: 'top 80%',
        once: true,
      },
    }
  );
};

// Horizontal scroll section
export const horizontalScroll = (
  container: HTMLElement,
  options: {
    trigger?: gsap.DOMTarget;
    speed?: number;
  } = {}
) => {
  const { trigger, speed = 1 } = options;
  const sections = gsap.utils.toArray(container.children);

  return gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: (trigger as gsap.DOMTarget) || (container as gsap.DOMTarget),
      pin: true,
      scrub: speed,
      snap: 1 / (sections.length - 1),
      end: () => `+=${container.offsetWidth}`,
    },
  });
};

// 3D card tilt effect
export const cardTilt = (card: HTMLElement, options: { intensity?: number } = {}) => {
  const { intensity = 15 } = options;

  const handleMouseMove = (e: MouseEvent) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const percentX = (e.clientX - centerX) / (width / 2);
    const percentY = (e.clientY - centerY) / (height / 2);

    const rotateY = percentX * intensity;
    const rotateX = -percentY * intensity;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    card.removeEventListener('mousemove', handleMouseMove);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Page transition animations
export const pageTransitionIn = () => {
  return gsap.from('.page-transition', {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.1,
  });
};

export const pageTransitionOut = () => {
  return gsap.to('.page-transition', {
    y: -100,
    opacity: 0,
    duration: 0.5,
    ease: 'power4.in',
  });
};

// Smooth scroll to element
export const smoothScrollTo = (target: string | HTMLElement, offset = 0) => {
  gsap.to(window, {
    duration: 1.5,
    scrollTo: {
      y: target,
      offsetY: offset,
    },
    ease: 'power4.inOut',
  });
};
