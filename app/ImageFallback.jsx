'use client';
import { useEffect } from 'react';

// When Vercel's image optimizer refuses a request (on the free plan it answers
// 402 once the monthly transformation quota is used up), load the original
// file directly instead of leaving a broken image. The originals in storage
// are web sized, so this only costs some extra bandwidth.
// data-fallback is "retrying" while the original loads and "failed" if that
// fails too, so components with their own onError (ImgBox) can tell the two apart.
export default function ImageFallback() {
  useEffect(() => {
    function handleFailedImage(img) {
      let url;
      try {
        url = new URL(img.currentSrc || img.src, window.location.href);
      } catch {
        return;
      }
      if (url.pathname !== '/_next/image') {
        if (img.dataset.fallback) img.dataset.fallback = 'failed';
        return;
      }
      const original = url.searchParams.get('url');
      if (!original) return;
      img.dataset.fallback = 'retrying';
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.src = original;
    }

    // Image errors don't bubble, but a capture listener on the document still sees them.
    function onError(e) {
      if (e.target instanceof HTMLImageElement) handleFailedImage(e.target);
    }

    // Catch images that already failed while the page was loading.
    for (const img of document.images) {
      if (img.complete && img.naturalWidth === 0) handleFailedImage(img);
    }
    document.addEventListener('error', onError, true);
    return () => document.removeEventListener('error', onError, true);
  }, []);

  return null;
}
