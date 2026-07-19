import { RawSignal } from '../../memory/types';

export interface Adapter {
  sourceName: string;
  fetch(query: string): Promise<RawSignal[]>;
}
