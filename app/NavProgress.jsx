'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Fill curve, compared to a steady bar that takes EXPECTED_MS to fill: the
// first 80% goes twice as fast (done at 40% of the time), then the last 20%
// starts at a third of steady speed and keeps slowing, so the bar waits just
// short of 100% until the new page has actually arrived.
const EXPECTED_MS = 800;          // typical click to new page time on this site
const FAST_END = 80;              // percent reached by the end of the fast part
const FAST_MS = EXPECTED_MS * 0.4;
const SLOW_MS = EXPECTED_MS * 0.6;
const SHOW_AFTER_MS = 100;        // skip the bar for near instant (cached) pages
const GIVE_UP_MS = 10000;         // hide it if a click never became a navigation

function progressAt(ms) {
  if (ms <= FAST_MS) return (ms / FAST_MS) * FAST_END;
  const slow = 100 - (100 - FAST_END) * Math.exp(-(ms - FAST_MS) / SLOW_MS);
  return Math.min(slow, 99);
}

// Top loading bar for page changes. The App Router has no navigation events,
// so a click on an internal link starts the bar and the URL change that
// follows (pathname or query) finishes it.
export default function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const barRef = useRef(null);
  const finishRef = useRef(() => {});

  useEffect(() => {
    const bar = barRef.current;
    let run = null; // { startedAt, raf } while a page is loading

    function tick() {
      const ms = performance.now() - run.startedAt;
      if (ms > GIVE_UP_MS) return finish();
      if (ms >= SHOW_AFTER_MS) bar.style.opacity = '1';
      bar.style.transform = `scaleX(${progressAt(ms) / 100})`;
      run.raf = requestAnimationFrame(tick);
    }

    function start() {
      if (run) return; // already loading; the coming URL change finishes it
      bar.style.transition = 'opacity .1s linear';
      bar.style.opacity = '0';
      bar.style.transform = 'scaleX(0)';
      run = { startedAt: performance.now(), raf: requestAnimationFrame(tick) };
    }

    function finish() {
      if (!run) return;
      cancelAnimationFrame(run.raf);
      run = null;
      if (bar.style.opacity !== '1') return; // finished before it was shown
      bar.style.transition = 'transform .15s ease-out, opacity .25s ease .15s';
      bar.style.transform = 'scaleX(1)';
      bar.style.opacity = '0';
    }

    function onClick(e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download')) return;
      if (link.target && link.target !== '_self') return;
      if (link.origin !== window.location.origin) return;
      // Same URL or just a #hash jump: Next.js won't load a new page.
      if (link.pathname === window.location.pathname && link.search === window.location.search) return;
      start();
    }

    finishRef.current = finish;
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      if (run) cancelAnimationFrame(run.raf);
    };
  }, []);

  useEffect(() => {
    finishRef.current();
  }, [pathname, search]);

  return <div ref={barRef} className="nav-progress" aria-hidden="true" />;
}
