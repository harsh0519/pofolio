'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiMail, FiMapPin, FiPhone, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const formRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form animation
      gsap.from('.contact-form', {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power4.out',
      });

      // Info cards animation
      gsap.utils.toArray<HTMLElement>('.info-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 1,
          delay: 0.5 + i * 0.1,
          ease: 'power4.out',
        });
      });
    }, formRef);

    // Particle background animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx2d.beginPath();
        ctx2d.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx2d.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White
        ctx2d.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx2d.beginPath();
            ctx2d.moveTo(p1.x, p1.y);
            ctx2d.lineTo(p2.x, p2.y);
            ctx2d.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`; // White
            ctx2d.lineWidth = 0.5;
            ctx2d.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ctx.revert();
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main
      ref={formRef}
      className="pt-20 bg-linear-to-b from-[#0A0A0F] via-[#13131A] to-[#1C1C24] min-h-screen relative overflow-hidden"
    >
      {/* Particle background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />

      {/* Hero Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              Get in <span className="text-white">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400">
              Have a project in mind? Let's create something amazing together
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="contact-form">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-white focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-white focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-white focus:outline-none transition-colors"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-white focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="info-card bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <FiMail className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <a
                  href="mailto:hello@example.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  hello@example.com
                </a>
              </div>

              <div className="info-card bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <FiMapPin className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Location</h3>
                <p className="text-gray-400">San Francisco, CA</p>
              </div>

              <div className="info-card bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <FiPhone className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </div>

              {/* Social Links */}
              <div className="info-card bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">Connect with Me</h3>
                <div className="flex gap-4">
                  {[
                    { icon: FiGithub, href: 'https://github.com' },
                    { icon: FiLinkedin, href: 'https://linkedin.com' },
                    { icon: FiTwitter, href: 'https://twitter.com' },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
