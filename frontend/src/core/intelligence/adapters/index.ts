import { PitchDeckSyntheticAdapter, LinkedInSyntheticAdapter } from './synthetic';
import { GitHubRealAdapter, HackerNewsRealAdapter } from './real';
import { Adapter } from './interface';

// Phase 2: Mix of real and synthetic adapters.
// GitHub and HackerNews hit live APIs.
// PitchDecks and LinkedIn remain synthetic (due to ToS/paywalls).
export const activeAdapters: Adapter[] = [
  new GitHubRealAdapter(),
  new HackerNewsRealAdapter(),
  new PitchDeckSyntheticAdapter(),
  new LinkedInSyntheticAdapter()
];
