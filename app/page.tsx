import Navigation from '@/components/layout/navigation';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/pages/hero/herosSection';
import AboutSection from '@/components/pages/about/aboutSection';
import SkillsSection from '@/components/pages/skills/skillsSection';
import ProjectsSection from '@/components/pages/projects/projectsSection';
import ContactSection from '@/components/pages/contact/contactSection';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
