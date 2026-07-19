import { Adapter } from './interface';
import { RawSignal } from '../../memory/types';

const generateId = () => Math.random().toString(36).substring(2, 9);

export class GitHubSyntheticAdapter implements Adapter {
  sourceName = 'github';
  
  async fetch(query: string): Promise<RawSignal[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: `gh-${generateId()}`,
        source: 'github',
        timestamp: new Date().toISOString(),
        payload: {
          repos: 15,
          stars: 450,
          topLanguages: ['TypeScript', 'Rust'],
          recentCommits: 120,
          knownFor: 'High-performance API tooling'
        },
        confidence: 1.0
      }
    ];
  }
}

export class HackerNewsSyntheticAdapter implements Adapter {
  sourceName = 'hn';
  
  async fetch(query: string): Promise<RawSignal[]> {
    return [
      {
        id: `hn-${generateId()}`,
        source: 'hn',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        payload: {
          karma: 1200,
          showHnPosts: 2,
          topPostPoints: 340,
          recentCommentSentiment: 'positive'
        },
        confidence: 0.95
      }
    ];
  }
}

export class PitchDeckSyntheticAdapter implements Adapter {
  sourceName = 'pitch_deck';
  
  async fetch(query: string): Promise<RawSignal[]> {
    return [
      {
        id: `deck-${generateId()}`,
        source: 'pitch_deck',
        timestamp: new Date().toISOString(),
        payload: {
          claims: [
            "We have $50K ARR",
            "Growing 20% MoM",
            "Team previously built at Stripe"
          ],
          marketSize: "15B TAM",
          traction: "12 Enterprise Pilots"
        },
        confidence: 0.8
      }
    ];
  }
}

export class LinkedInSyntheticAdapter implements Adapter {
  sourceName = 'linkedin';
  
  async fetch(query: string): Promise<RawSignal[]> {
    // Seeded contradiction example: claims Stripe, but LI shows different history
    return [
      {
        id: `li-${generateId()}`,
        source: 'linkedin',
        timestamp: new Date().toISOString(),
        payload: {
          currentRole: 'Founder',
          pastRoles: ['Senior Engineer at Square', 'Intern at Google'],
          education: 'State University',
          note: 'No record of Stripe employment found.'
        },
        confidence: 0.9
      }
    ];
  }
}

export const syntheticAdapters = [
  new GitHubSyntheticAdapter(),
  new HackerNewsSyntheticAdapter(),
  new PitchDeckSyntheticAdapter(),
  new LinkedInSyntheticAdapter()
];
