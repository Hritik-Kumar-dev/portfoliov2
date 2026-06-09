import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch GitHub repository star count
 * @param owner - GitHub username
 * @param repo - Repository name
 * @returns Star count or null if not loaded
 */
export const useGitHubStars = (owner: string, repo: string): number | null => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`
        );
        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
      }
    };

    fetchStars();
  }, [owner, repo]);

  return stars;
};
