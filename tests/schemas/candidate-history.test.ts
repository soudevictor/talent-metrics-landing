import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadCandidateHistory,
  saveCandidateToHistory,
} from '@/components/playground/comparison-drawer';
import type { CandidateHistoryItem } from '@/types';

const STORAGE_KEY = 'talent_metrics_candidate_history';

function buildItem(overrides: Partial<CandidateHistoryItem> = {}): CandidateHistoryItem {
  return {
    id: 'candidate-1',
    candidateName: 'Maria Souza',
    jobTitle: 'Desenvolvedora Frontend',
    score: 88,
    analyzedAt: '2026-10-22T12:00:00.000Z',
    summary: 'Bom perfil técnico.',
    matchingPoints: ['React'],
    improvementPoints: ['Inglês'],
    matchPercentageByRole: { Frontend: 88 },
    ...overrides,
  };
}

describe('candidate history storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty array for malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json');
    expect(loadCandidateHistory()).toEqual([]);
  });

  it('returns an empty array for a non-array payload', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'nope' }));
    expect(loadCandidateHistory()).toEqual([]);
  });

  it('drops invalid items and keeps valid ones', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        buildItem({ id: 'valid-1' }),
        { id: 42, candidateName: null },
        buildItem({ id: 'valid-2', score: 61 }),
      ]),
    );

    expect(loadCandidateHistory()).toEqual([
      buildItem({ id: 'valid-1' }),
      buildItem({ id: 'valid-2', score: 61 }),
    ]);
  });

  it('caps the history at five items', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        Array.from({ length: 8 }, (_, index) =>
          buildItem({ id: `candidate-${index}` }),
        ),
      ),
    );

    const history = loadCandidateHistory();
    expect(history).toHaveLength(5);
    expect(history[0].id).toBe('candidate-0');
  });

  it('does not persist an invalid item', () => {
    saveCandidateToHistory({ id: 'broken' } as CandidateHistoryItem);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('saves a valid item and keeps the most recent first', () => {
    saveCandidateToHistory(buildItem({ id: 'first' }));
    saveCandidateToHistory(buildItem({ id: 'second', score: 70 }));

    const history = loadCandidateHistory();
    expect(history.map((item) => item.id)).toEqual(['second', 'first']);
  });
});
