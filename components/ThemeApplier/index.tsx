'use client';

import { useEffect, useState } from 'react';

export default function ThemeApplier() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedTheme = localStorage?.getItem('theme');
      if (!storedTheme) {
        const htmlTag = document.querySelector('html');
        const themeAttribute = htmlTag?.getAttribute('data-theme');
        if (themeAttribute) {
          localStorage?.setItem('theme', themeAttribute);
          storedTheme = themeAttribute;
        } else {
          storedTheme = 'light';
          localStorage?.setItem('theme', 'light');
        }
      }
      setTheme(storedTheme);

      const updateTheme = (event: CustomEvent) => {
        const newTheme = event.detail;
        const themeColor = newTheme === 'dark' ? '#1e1e1e' : '#fff';
        const metaThemeColor = document.querySelector(
          'meta[name="theme-color"]'
        );

        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', themeColor);
        } else {
          const newMeta = document.createElement('meta');
          newMeta.name = 'theme-color';
          newMeta.content = themeColor;
          document.head.appendChild(newMeta);
        }
      };

      window.addEventListener('themeChanged', updateTheme as EventListener);

      // Initial theme setup
      const themeColor = storedTheme === 'dark' ? '#1e1e1e' : '#fff';
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');

      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', themeColor);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'theme-color';
        newMeta.content = themeColor;
        document.head.appendChild(newMeta);
      }

      // Check if the app is opened on an Apple web app
      const isAppleWebApp =
        (window.navigator as any).standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches;

      if (isAppleWebApp) {
        // Apply special PWA attribute
        document.documentElement.setAttribute('data-apple-web-app', 'true');
      }

      return () => {
        window.removeEventListener(
          'themeChanged',
          updateTheme as EventListener
        );
      };
    }
  }, []);

  return null; // This component doesn't render anything visually
}
