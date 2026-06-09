import { Routes, Route } from 'react-router-dom';
import { GitHubCalendar } from 'react-github-calendar';
import { Header, Footer } from './components/layout';
import { Hero } from './components/sections/Hero';
import { ExperienceSection } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { Blogs } from './components/sections/Blogs';
import { FloatingDock } from './components/ui/FloatingDock';
import { AllProjects } from './pages/AllProjects';
import { ProjectDetail } from './pages/ProjectDetail';
import { AllExperiences } from './pages/AllExperiences';
import { AllBlogs } from './pages/AllBlogs';
import { projects, skills, blogPosts, experiences } from './data';
import './App.css';

const GITHUB_USERNAME = 'Hritik-Kumar-dev';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header githubUsername={GITHUB_USERNAME} />
      <FloatingDock />
      <main>
        <section id="home">
          <Hero githubUsername={GITHUB_USERNAME} repoName="portfolio" />
        </section>
        <section id="experience">
          <ExperienceSection experiences={experiences} />
        </section>
        <section id="projects">
          <Projects projects={projects} />
        </section>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">
            Contributions in the last year
          </p>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 opacity-80 hover:opacity-100 transition-opacity overflow-x-auto">
            <GitHubCalendar username={GITHUB_USERNAME} />
          </div>
        </section>
        <section id="skills">
          <Skills skills={skills} />
        </section>
        <section id="blogs">
          <Blogs blogs={blogPosts} />
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
