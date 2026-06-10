// Safe localStorage wrapper for SSR compatibility
// Prevents 403 errors during Supabase Edge Function deployment

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('localStorage.getItem error:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('localStorage.setItem error:', error);
    }
  },

  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage.removeItem error:', error);
    }
  },

  clear: (): void => {
    if (!isBrowser) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('localStorage.clear error:', error);
    }
  }
};

// Safe window wrapper
export const safeWindow = {
  scrollTo: (x: number, y: number): void => {
    if (typeof window !== 'undefined') {
      window.scrollTo(x, y);
    }
  },

  addEventListener: (event: string, handler: any): void => {
    if (typeof window !== 'undefined') {
      window.addEventListener(event, handler);
    }
  },

  removeEventListener: (event: string, handler: any): void => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(event, handler);
    }
  },

  open: (url: string, target: string): void => {
    if (typeof window !== 'undefined') {
      window.open(url, target);
    }
  }
};

// Safe document wrapper
export const safeDocument = {
  querySelector: (selector: string): Element | null => {
    if (typeof document !== 'undefined') {
      return document.querySelector(selector);
    }
    return null;
  },

  scrollTop: {
    set: (value: number): void => {
      if (typeof document !== 'undefined') {
        document.documentElement.scrollTop = value;
        document.body.scrollTop = value;
      }
    }
  },

  classList: {
    add: (element: string, className: string): void => {
      if (typeof document !== 'undefined') {
        const el = element === 'documentElement' ? document.documentElement : document.body;
        el.classList.add(className);
      }
    },
    remove: (element: string, className: string): void => {
      if (typeof document !== 'undefined') {
        const el = element === 'documentElement' ? document.documentElement : document.body;
        el.classList.remove(className);
      }
    }
  }
};

export const isBrowserEnvironment = isBrowser;
