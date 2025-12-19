import { describe, it, expect } from 'vitest';
import { slugLang, langColor } from '../js/lang.js';

describe('Language Utilities', () => {
  describe('slugLang', () => {
    it('should handle common language name variations', () => {
      expect(slugLang('C#')).toBe('csharp');
      expect(slugLang('c#')).toBe('csharp');
      expect(slugLang('C++')).toBe('cpp');
      expect(slugLang('c++')).toBe('cpp');
      expect(slugLang('F#')).toBe('fsharp');
      expect(slugLang('f#')).toBe('fsharp');
    });

    it('should normalize language names', () => {
      expect(slugLang('TypeScript')).toBe('typescript');
      expect(slugLang('JavaScript')).toBe('javascript');
      expect(slugLang('Python')).toBe('python');
      expect(slugLang('Go')).toBe('go');
    });

    it('should handle special characters', () => {
      expect(slugLang('Jupyter Notebook')).toBe('jupyter-notebook');
      expect(slugLang('Dockerfile')).toBe('dockerfile');
      expect(slugLang('Visual Basic')).toBe('visual-basic');
    });

    it('should handle multiple spaces and special chars', () => {
      expect(slugLang('C#   Script')).toBe('c-script');
      expect(slugLang('Python--3')).toBe('python-3');
      expect(slugLang('JavaScript//ES6')).toBe('javascript-es6');
    });

    it('should handle null and undefined', () => {
      expect(slugLang(null)).toBe('');
      expect(slugLang(undefined as any)).toBe('');
    });

    it('should handle empty strings', () => {
      expect(slugLang('')).toBe('');
      expect(slugLang('   ')).toBe('');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(slugLang('--test--')).toBe('test');
      expect(slugLang('/test/')).toBe('test');
      expect(slugLang('  test  ')).toBe('test');
    });

    it('should handle numbers', () => {
      expect(slugLang('HTML5')).toBe('html5');
      expect(slugLang('C')).toBe('c');
      expect(slugLang('Node.js')).toBe('node-js');
    });
  });

  describe('langColor', () => {
    it('should return known colors for popular languages', () => {
      expect(langColor('TypeScript')).toBe('#3178c6');
      expect(langColor('JavaScript')).toBe('#f1e05a');
      expect(langColor('Python')).toBe('#3572a5');
      expect(langColor('Go')).toBe('#00add8');
      expect(langColor('Rust')).toBe('#dea584');
      expect(langColor('HTML')).toBe('#e34c26');
      expect(langColor('CSS')).toBe('#563d7c');
    });

    it('should handle case insensitive language names', () => {
      expect(langColor('typescript')).toBe('#3178c6');
      expect(langColor('TYPESCRIPT')).toBe('#3178c6');
      expect(langColor('TypeScript')).toBe('#3178c6');
    });

    it('should handle language name variations', () => {
      expect(langColor('C#')).toBe('#178600');
      expect(langColor('c#')).toBe('#178600');
      expect(langColor('C++')).toBe('#f34b7d');
      expect(langColor('c++')).toBe('#f34b7d');
      expect(langColor('F#')).toBe('#b845fc');
      expect(langColor('f#')).toBe('#b845fc');
    });

    it('should return consistent colors for unknown languages', () => {
      const unknown1 = langColor('UnknownLanguage');
      const unknown2 = langColor('AnotherUnknown');
      
      expect(unknown1).toMatch(/^hsl\(\d+ 65% 52%\)$/);
      expect(unknown2).toMatch(/^hsl\(\d+ 65% 52%\)$/);
      expect(typeof unknown1).toBe('string');
      expect(typeof unknown2).toBe('string');
    });

    it('should return same color for same unknown language', () => {
      const color1 = langColor('MyCustomLanguage');
      const color2 = langColor('MyCustomLanguage');
      
      expect(color1).toBe(color2);
    });

    it('should handle null and undefined', () => {
      const nullColor = langColor(null);
      const undefinedColor = langColor(undefined as any);
      
      expect(langColor(undefined as any)).toMatch(/^hsl\(\d+ 65% 52%\)$/);
      expect(undefinedColor).toMatch(/^hsl\(\d+ 65% 52%\)$/);
    });

    it('should handle empty strings', () => {
      const emptyColor = langColor('');
      const spaceColor = langColor('   ');
      
      expect(emptyColor).toMatch(/^hsl\(\d+ 65% 52%\)$/);
      expect(spaceColor).toMatch(/^hsl\(\d+ 65% 52%\)$/);
    });

    it('should return different colors for different unknown languages', () => {
      const colors = new Set();
      
      // Test multiple different unknown languages
      for (let i = 0; i < 10; i++) {
        colors.add(langColor(`UnknownLang${i}`));
      }
      
      // Should have multiple different colors (not all the same)
      expect(colors.size).toBeGreaterThan(1);
    });

    it('should handle special language names', () => {
      expect(langColor('Jupyter Notebook')).toBe('#da5b0b');
      expect(langColor('Dockerfile')).toBe('#384d54');
      expect(langColor('Vue')).toBe('#41b883');
      expect(langColor('Svelte')).toBe('#ff3e00');
    });
  });
});
