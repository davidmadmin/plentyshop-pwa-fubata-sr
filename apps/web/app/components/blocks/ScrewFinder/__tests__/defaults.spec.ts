import { describe, expect, it } from 'vitest';
import { resolveScrewFinderContent } from '../defaults';

describe('Screw Finder defaults', () => {
  it('should apply complete defaults to missing content', () => {
    const content = resolveScrewFinderContent();

    expect(content.sourceCategoryPath).toBe('/schrauben');
    expect(content.paths.beginner).toBe(true);
    expect(content.paths.professional).toBe(true);
    expect(content.resultCount).toBe(3);
    expect(content.layout.fullWidth).toBe(true);
    expect(content.appearance.accentColor).toBe('rgb(var(--colors-2-secondary-500))');
  });

  it('should preserve configured content and reject invalid result counts', () => {
    expect(resolveScrewFinderContent({ text: { title: 'Custom' }, resultCount: 2 }).text.title).toBe('Custom');
    expect(resolveScrewFinderContent({ resultCount: 7 }).resultCount).toBe(3);
  });
});
