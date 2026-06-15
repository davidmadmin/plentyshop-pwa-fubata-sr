import { describe, expect, it } from 'vitest';
import { getBeginnerGuidance } from '../beginner-guidance';

describe('Screw Finder beginner guidance', () => {
  it('should retain only meaningful interior and structural choices', () => {
    expect(getBeginnerGuidance('interior').demands).toEqual(['light', 'general']);
    expect(getBeginnerGuidance('structural')).toEqual({
      headPreferences: ['flush', 'clamping', 'any'],
      demands: ['general', 'heavy'],
    });
  });

  it('should skip application questions that have no meaningful choice', () => {
    expect(getBeginnerGuidance('drywall')).toEqual({
      headPreferences: [],
      demands: [],
    });
    expect(getBeginnerGuidance('roofing').headPreferences).toEqual([]);
    expect(getBeginnerGuidance('roofing').demands).toEqual(['light', 'general', 'heavy']);
  });

  it('should use conservative terrace and window choices', () => {
    expect(getBeginnerGuidance('terrace').headPreferences).toEqual(['flush', 'concealed', 'any']);
    expect(getBeginnerGuidance('window').headPreferences).toEqual(['flush', 'low-profile', 'any']);
  });
});
