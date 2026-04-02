import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import EducationExperience from '@/components/EducationExperience';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <EducationExperience />
      <Contact />
    </>
  );
}
