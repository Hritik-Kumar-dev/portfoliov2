import { GitHubCalendar } from 'react-github-calendar';
import { Header, Footer } from './components/layout';
import { Hero } from './components/sections/Hero';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { Blogs } from './components/sections/Blogs';
import { projects, skills, blogPosts, experiences } from './data';
import './App.css';

const GITHUB_USERNAME = 'Hritik-Kumar-dev';
const REPO_NAME = 'portfolio';

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header githubUsername={GITHUB_USERNAME} />

      <main>
        <Hero githubUsername={GITHUB_USERNAME} repoName={REPO_NAME} />
        <Projects projects={projects} experiences={experiences} />

        {/* GitHub Contributions */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">
            Contributions in the last year
          </p>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 opacity-80 hover:opacity-100 transition-opacity overflow-x-auto">
            <GitHubCalendar username={GITHUB_USERNAME} />
          </div>
        </section>

        <Skills skills={skills} />
        <Blogs blogs={blogPosts} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
