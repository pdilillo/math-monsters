let announcer: HTMLElement | null = null;

export const initAccessibility = (): void => {
  announcer = document.querySelector<HTMLElement>('#sr-status');
};

export const announce = (message: string): void => {
  if (!announcer) {
    return;
  }
  announcer.textContent = '';
  window.setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 20);
};
