import { Routes, Route } from 'react-router-dom';
import { GitHubCalendar } from 'react-github-calendar';
import { Header, Footer } from './components/layout';
import { Hero } from './components/sections/Hero';
import { ExperienceSection } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { Blogs } from './components/sections/Blogs';
import { Contact } from './components/sections/Contact/Contact';
import { FloatingDock } from './components/ui/FloatingDock';
import { AllProjects } from './pages/AllProjects';
import { ProjectDetail } from './pages/ProjectDetail';
import { AllExperiences } from './pages/AllExperiences';
import { AllBlogs } from './pages/AllBlogs';
import { projects, skills, blogPosts, experiences } from './data';

const GITHUB_USERNAME = 'Hritik-Kumar-dev';

const calTheme = {
  dark: ['#1a1a1a', '#2a2a2a', '#444444', '#777777', '#aaaaaa'],
};

function HomePage() {
  return (
    <div className="min-h-screen bg-page text-page">
      <Header githubUsername={GITHUB_USERNAME} />
      <FloatingDock />
      <main className="flex flex-col gap-0">
        <section id="home">
          <Hero githubUsername={GITHUB_USERNAME} repoName="portfolio" />
        </section>
        <section id="experience">
          <ExperienceSection experiences={experiences} />
        </section>
        <section id="projects">
          <Projects projects={projects} />
        </section>

        {/* GitHub Contributions */}
        <section className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-3">
            Contributions in the last year
          </p>
          <div className="bg-surface border border-surface rounded-xl p-5 overflow-x-auto">
            <GitHubCalendar
              username={GITHUB_USERNAME}
              theme={calTheme}
              blockSize={13}
              blockMargin={4}
              fontSize={12}
              colorScheme="dark"
            />
          </div>
        </section>

        <section id="skills">
          <Skills skills={skills} />
        </section>
        <section id="blogs">
          <Blogs blogs={blogPosts} />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<AllProjects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/experience" element={<AllExperiences />} />
      <Route path="/blogs" element={<AllBlogs />} />
    </Routes>
  );
}

export default App;
