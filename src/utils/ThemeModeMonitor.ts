export class ThemeModeMonitor {
  private static handleChange(event: MediaQueryListEvent): void {
    document.documentElement.setAttribute('data-bs-theme', event.matches ? 'dark' : 'light');
  }

  private static mediaQuery: MediaQueryList;
  private static changeHandler = (event: MediaQueryListEvent) => this.handleChange(event);

  public static MountMonitor(): void {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', this.changeHandler);
  }

  public static RemoveMonitor(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.changeHandler);
    }
  }

}