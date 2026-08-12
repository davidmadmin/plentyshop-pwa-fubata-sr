import { describe, expect, it } from 'vitest';
import { createDefault, getBlocksList, resolveScrewFinderContent } from '../defaults';
import type { ScrewFinderContent } from '../types';

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

  it('should register localized editor catalogue templates', () => {
    const catalogue = getBlocksList();
    const variation = catalogue['screw-finder']?.variations[0];

    expect(variation?.template.en.name).toBe('ScrewFinder');
    expect((variation?.template.en.content as ScrewFinderContent).text?.title).toBe('Which screw fits your project?');
    expect((variation?.template.de.content as ScrewFinderContent).text?.title).toBe(
      'Welche Schraube passt zu Ihrem Projekt?',
    );
  });

  it('should create independent default block content', () => {
    const first = createDefault();
    const second = createDefault();

    expect(first.name).toBe('ScrewFinder');
    expect(first.meta.uuid).not.toBe(second.meta.uuid);
    expect(first.content).not.toBe(second.content);
  });
});
