import { Adapter } from './interface';
import { RawSignal } from '../../memory/types';

const generateId = () => Math.random().toString(36).substring(2, 9);

export class GitHubRealAdapter implements Adapter {
  sourceName = 'github';

  async fetch(query: string): Promise<RawSignal[]> {
    try {
      // Basic search by query. We'll search for repositories matching the company name.
      const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=3`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return [];
      }

      // Aggregate signal from top repo
      const topRepo = data.items[0];
      
      return [
        {
          id: `gh-real-${generateId()}`,
          source: 'github',
          timestamp: new Date().toISOString(),
          payload: {
            topRepoName: topRepo.name,
            stars: topRepo.stargazers_count,
            language: topRepo.language,
            description: topRepo.description,
            owner: topRepo.owner.login
          },
          confidence: 0.85
        }
      ];
    } catch (error) {
      console.error("GitHub Adapter failed:", error);
      return [];
    }
  }
}

export class HackerNewsRealAdapter implements Adapter {
  sourceName = 'hn';

  async fetch(query: string): Promise<RawSignal[]> {
    try {
      const response = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=3`);
      
      if (!response.ok) {
        throw new Error(`HN API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.hits || data.hits.length === 0) {
        return [];
      }

      const topHit = data.hits[0];

      return [
        {
          id: `hn-real-${generateId()}`,
          source: 'hn',
          timestamp: new Date().toISOString(),
          payload: {
            title: topHit.title,
            points: topHit.points,
            num_comments: topHit.num_comments,
            author: topHit.author,
            url: topHit.url
          },
          confidence: 0.9
        }
      ];
    } catch (error) {
      console.error("HN Adapter failed:", error);
      return [];
    }
  }
}
