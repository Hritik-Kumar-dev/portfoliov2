import React, { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Code, ExternalLink, MapPin, Star, Shield, ChevronDown } from 'lucide-react';

const PortfolioHero: React.FC = () => {
  // Replace 'Hritik-Kumar-dev' with your actual GitHub username
  const githubUsername = "Hritik-Kumar-dev";
  // Replace 'portfolio' with your actual repository name
  const repoName = "portfolio";
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${githubUsername}/${repoName}`
        );
        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error('Failed to fetch stars:', error);
      }
    };

    fetchStars();
  }, [githubUsername, repoName]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight">algora</div>
        
        <div className="flex items-center gap-6">
          {/* GitHub Star Button */}
          <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-md hover:bg-[#1c2128] cursor-pointer transition">
            <Code size={18} />
            <span className="text-sm font-medium">Star</span>
            <span className="bg-[#30363d] px-2 py-0.5 rounded text-xs">
              {stars !== null ? stars : '...'}
            </span>
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
          </div>

          {/* Mini Profile Switcher */}
          <div className="flex items-center gap-3 bg-[#161b22] p-1 pr-3 rounded-full border border-[#30363d] cursor-pointer">
            <img 
              src="https://avatars.githubusercontent.com/u/215129051?v=4" 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold">Hritik Kumar</span>
              <span className="text-[10px] text-gray-400">@{githubUsername}</span>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </div>
        </div>
      </nav>

      {/* Main Hero Card Container */}
      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-8 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* Left Section: User Info */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="relative">
                <img 
                  src="https://github.com/Hritik-Kumar-dev.png" 
                  alt="Hritik Kumar" 
                  className="w-24 h-24 rounded-full border-2 border-[#30363d] object-cover shadow-2xl"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Hritik Kumar</h1>
                <p className="text-gray-400 text-sm">@{githubUsername}</p>
                
                <div className="flex items-center gap-4 mt-3 text-gray-400">
                  <Code size={18} className="hover:text-white cursor-pointer transition" />
                  <ExternalLink size={18} className="hover:text-white cursor-pointer transition" />
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin size={16} />
                    <span>Azamgarh, Uttar Pradesh, Ind</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: GitHub Contribution Graph */}
            <div className="flex-1 w-full overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                     <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        Contributions in the last year
                     </p>
                </div>
              
              <div className="github-chart-container opacity-80 hover:opacity-100 transition-opacity">
                {/* <GitHubCalendar 
                  username={Hritik-Kumar-dev}
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  theme={{
                    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                  }}
                /> */}

                <GitHubCalendar username="Hritik-kumar-dev" />
              </div>
            </div>
          </div>

          {/* Privacy Footer inside Card */}
          <div className="mt-12 pt-6 border-t border-[#30363d] flex items-center gap-2 text-gray-500 text-sm">
            <Shield size={18} className="text-green-600" />
            <span>Your personal details and preferences are not publicly visible.</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioHero;