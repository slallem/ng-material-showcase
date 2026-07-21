import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme-mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');

  readonly mode = signal<ThemeMode>(this.readStoredMode());
  readonly isDark = signal(this.computeIsDark(this.mode()));

  constructor() {
    this.media.addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.isDark.set(this.media.matches);
      }
    });

    effect(() => {
      const mode = this.mode();
      this.isDark.set(this.computeIsDark(mode));
      localStorage.setItem(STORAGE_KEY, mode);
    });

    effect(() => {
      document.body.classList.toggle('dark-theme', this.isDark());
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  private computeIsDark(mode: ThemeMode): boolean {
    return mode === 'dark' || (mode === 'system' && this.media.matches);
  }

  private readStoredMode(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
