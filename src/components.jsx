'use client';
/* Anchor — Shared components: Nav, Footer, Hero, Reveal, ProjectCard, Swiper */
import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_DATA } from './data';
import { Magnetic, VelocityMarquee } from './animations';

// ---------- Reveal-on-scroll wrapper ----------
function Reveal({ children, as: Tag = 'div', className = '', delay = 0, mode = 'normal' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setVis(true); io.unobserve(el); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  const cls = mode === 'image' ? 'reveal-img' : 'reveal';
  return <Tag ref={ref} className={`${cls}${vis ? ' in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>;
}

// ---------- Navigation ----------
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/clients', label: 'Clients' },
  { href: '/contact', label: 'Contact' },
];

function Nav({ transparent = true, auth = null }) {
  const pathname = usePathname() || '/';
  const [solid, setSolid] = useState(!transparent);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!transparent) { setSolid(true); return; }
    const h = () => setSolid(window.scrollY > 60);
    h(); window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [transparent]);

  // Active = exact match for root, prefix match for other top-level routes
  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <header className={`nav${solid ? ' solid' : ''}`}>
        <Link className="nav-logo" href="/">
          <span className="mark">A</span>
          <span className="name">Anchor</span>
        </Link>
        <nav className="nav-center">
          {NAV_ITEMS.map(it => (
            <Link key={it.href} href={it.href} className={isActive(it.href) ? 'active' : ''}>{it.label}</Link>
          ))}
        </nav>
        <div className="nav-right">
          <span className="nav-time">EST. 2010 · ISB</span>
          <Link className="cta" href="/contact"><span>Get a quote ↗</span></Link>
          <NavAuth auth={auth} />
          <button className={`nav-burger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu"><span></span></button>
        </div>
      </header>
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <nav>
          {NAV_ITEMS.map((it, i) => (
            <Link key={it.href} href={it.href} onClick={() => setOpen(false)}>
              <span>{it.label}</span><span className="num">0{i+1}</span>
            </Link>
          ))}
        </nav>
        <div className="mm-foot">
          <NavAuth auth={auth} mobile onAfter={() => setOpen(false)} />
          <span>+92 334 7999336</span>
          <span>anchorassociates.builders@gmail.com</span>
          <span>Islamabad, Pakistan</span>
        </div>
      </div>
    </>
  );
}

// Nav auth: sign in link, admin link, or log out button.
function NavAuth({ auth, mobile = false, onAfter }) {
  if (!auth) {
    return (
      <Link
        href="/login"
        className={mobile ? 'mm-auth-link' : 'cta nav-auth'}
        onClick={onAfter}
      >
        <span>Sign in ↗</span>
      </Link>
    );
  }
  return (
    <span className={mobile ? 'mm-auth-group' : 'nav-auth-group'}>
      {auth.role === 'admin' && (
        <Link
          href="/admin"
          className={mobile ? 'mm-auth-link' : 'cta nav-auth'}
          onClick={onAfter}
        >
          <span>Admin panel ↗</span>
        </Link>
      )}
      <form action="/auth/signout" method="post" style={{ display: 'inline' }}>
        <button
          type="submit"
          className={mobile ? 'mm-auth-link' : 'cta nav-auth nav-auth-ghost'}
          onClick={onAfter}
        >
          <span>Log out</span>
        </button>
      </form>
    </span>
  );
}

// ---------- Footer ----------
function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="container-wide">
        <div className="ft-top">
          <div className="ft-brand">
            <h2 className="hd-2">Building together,<br/>since 2010.</h2>
            <p>Anchor Associates &amp; Builders is a C-2 PEC registered construction and contracting firm based in Islamabad, delivering projects nationwide across civil, MEP, prefab, agricultural and specialty work.</p>
          </div>
          <div className="ft-col">
            <h5>Site</h5>
            <ul>
              {NAV_ITEMS.map(i => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}
            </ul>
          </div>
          <div className="ft-col">
            <h5>Office</h5>
            <ul>
              <li>Anchor Associates &amp; Builders</li>
              <li>Islamabad, Pakistan</li>
              <li style={{opacity: 0.6}}>PEC Registered · Cat. C-2</li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="tel:+923347999336">+92 334 7999336</a></li>
              <li><a href="tel:+923325966556">+92 332 5966556</a></li>
              <li><a href="mailto:anchorassociates.builders@gmail.com">anchorassociates.<br/>builders@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          <span>© 2026 Anchor Associates &amp; Builders. All rights reserved.</span>
          <div className="socials">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Facebook</a>
          </div>
          <span>Built with intention.</span>
        </div>
      </div>
    </footer>
  );
}

// ---------- Image box (next/image with placeholder) ----------
function ImgBox({ src, ratio = 'r-43', alt = '', className = '', label = '', priority = false, sizes }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <div className={`img-box ${ratio} ${className}`}>
      {(!loaded || err) && <div className="ph">{label || '— image —'}</div>}
      {src && !err && (
        <Image
          src={src}
          alt={alt || label}
          fill
          sizes={sizes || '(max-width: 800px) 100vw, (max-width: 1280px) 50vw, 33vw'}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            // ImageFallback (app/ImageFallback.jsx) is retrying with the original file.
            if (e.currentTarget.dataset.fallback !== 'retrying') setErr(true);
          }}
          className="img-box-img"
        />
      )}
    </div>
  );
}

// ---------- Project card ----------
function ProjectCard({ project, ratio = 'r-43', href }) {
  const cat = SITE_DATA.byId(SITE_DATA.CATEGORIES, project.categoryId);
  return (
    <Link
      href={href || '/projects'}
      className="proj-card"
      data-cursor="view"
      data-cursor-label="View"
    >
      <ImgBox src={project.hero} ratio={ratio} label={project.name} alt={project.name} />
      <div className="cat">{cat?.name}</div>
      <div className="meta">
        <div className="nm">{project.name}</div>
        <div className="loc">{project.location} · {project.year}</div>
      </div>
    </Link>
  );
}

// ---------- Horizontal swiper ----------
function HorizontalSwiper({ items, renderItem, label = 'Related projects' }) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const update = useCallback(() => {
    const t = trackRef.current; if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    const p = max > 0 ? t.scrollLeft / max : 0;
    setProgress(p);
    setCanL(t.scrollLeft > 4);
    setCanR(t.scrollLeft < max - 4);
  }, []);

  useEffect(() => { update(); }, [update, items]);

  const scrollBy = (dir) => {
    const t = trackRef.current; if (!t) return;
    const card = t.querySelector('.swiper-card');
    const w = card ? card.offsetWidth + 28 : 400;
    t.scrollBy({ left: dir * w * 1.5, behavior: 'smooth' });
  };

  // Drag-to-scroll
  useEffect(() => {
    const t = trackRef.current; if (!t) return;
    let isDown = false, startX = 0, startScroll = 0, moved = false;
    const down = (e) => {
      isDown = true; moved = false;
      startX = (e.touches ? e.touches[0].pageX : e.pageX) - t.offsetLeft;
      startScroll = t.scrollLeft;
    };
    const move = (e) => {
      if (!isDown) return;
      const x = (e.touches ? e.touches[0].pageX : e.pageX) - t.offsetLeft;
      const walk = (x - startX);
      if (Math.abs(walk) > 4) moved = true;
      t.scrollLeft = startScroll - walk;
    };
    const up = () => { isDown = false; };
    const click = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };
    t.addEventListener('mousedown', down);
    t.addEventListener('mousemove', move);
    t.addEventListener('mouseup', up);
    t.addEventListener('mouseleave', up);
    t.addEventListener('click', click, true);
    t.addEventListener('scroll', update, { passive: true });
    return () => {
      t.removeEventListener('mousedown', down);
      t.removeEventListener('mousemove', move);
      t.removeEventListener('mouseup', up);
      t.removeEventListener('mouseleave', up);
      t.removeEventListener('click', click, true);
      t.removeEventListener('scroll', update);
    };
  }, [update]);

  return (
    <div className="swiper-wrap">
      <div className="swiper-track" ref={trackRef} data-cursor="drag" data-cursor-label="Drag">
        {items.map((it, i) => (
          <div className="swiper-card" key={it.id || i}>{renderItem(it, i)}</div>
        ))}
        <div style={{ flex: '0 0 1px' }}></div>
      </div>
      <div className="swiper-controls">
        <span className="eyebrow">{label}</span>
        <div className="progress"><span style={{ width: `${Math.max(20, progress * 100)}%`, left: `${progress * (100 - Math.max(20, progress * 100))}%` }}></span></div>
        <div className="arrows">
          <button className="arr-btn" onClick={() => scrollBy(-1)} disabled={!canL} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
          <button className="arr-btn" onClick={() => scrollBy(1)} disabled={!canR} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Hero (cinematic with cycling images) ----------
function Hero({ frames, eyebrow, title, sub }) {
  const [active, setActive] = useState(0);
  // Only the first (LCP) frame loads on initial paint. The remaining rotating
  // frames mount shortly after, well before the first 5.5s rotation — so they
  // don't compete with the hero LCP image for bandwidth, while timing,
  // animation and the crossfade behaviour stay exactly the same.
  const [showRest, setShowRest] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % frames.length), 5500);
    return () => clearInterval(t);
  }, [frames.length]);
  useEffect(() => {
    const t = setTimeout(() => setShowRest(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <section className="hero">
      <div className="hero-media">
        {frames.map((f, i) => (
          <div key={i} className={`frame${i === active ? ' active' : ''}`}>
            {(i === 0 || showRest) && (
              <Image
                src={f.src}
                alt={f.caption || ''}
                fill
                sizes="100vw"
                priority={i === 0}
                className="hero-frame-img"
              />
            )}
          </div>
        ))}
      </div>
      <div className="hero-inner">
        <div className="hero-top">
          <span className="eyebrow dark"><span className="dot"></span>{eyebrow}</span>
          <span className="eyebrow dark">EST. 2010 · PEC C-2 · ISLAMABAD</span>
        </div>
        <div className="hero-mid">
          <h1 className="hd-display">{title}</h1>
          {sub && (
            <p className="hero-sub lede">{sub}</p>
          )}
          <div className="hero-ctas">
            <Magnetic strength={0.4}><Link href="/projects" className="btn btn-on-dark" data-cursor="hover"><span>See the work</span><span className="arr"></span></Link></Magnetic>
            <Magnetic strength={0.4}><Link href="/contact" className="btn btn-ghost-dark" data-cursor="hover"><span>Start a project</span><span className="arr"></span></Link></Magnetic>
          </div>
        </div>
        <div className="hero-foot">
          <div className="hero-counter"><b>0{active + 1}</b> / 0{frames.length} &nbsp; — &nbsp; {frames[active].caption}</div>
          <div className="hero-meta">SCROLL TO EXPLORE ↓</div>
        </div>
      </div>
      <div className="scroll-cue"></div>
    </section>
  );
}

// ---------- Marquee ----------
function ClientMarquee({ dark = false }) {
  const items = SITE_DATA.CLIENTS.slice(0, 12);
  return <VelocityMarquee items={items} dark={dark} />;
}

// ---------- CTA Block ----------
function CTABlock() {
  return (
    <section className="cta-block">
      <Reveal>
        <div className="eyebrow dark" style={{ marginBottom: 32 }}><span className="dot"></span>READY TO BUILD?</div>
        <h2 className="hd-display">Let's build something <i>that lasts.</i></h2>
        <div className="ctas">
          <Magnetic strength={0.4}><Link href="/contact" className="btn btn-on-dark" data-cursor="hover"><span>Start a conversation</span><span className="arr"></span></Link></Magnetic>
          <Magnetic strength={0.4}><Link href="/projects" className="btn btn-ghost-dark" data-cursor="hover"><span>Browse projects</span><span className="arr"></span></Link></Magnetic>
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Quote / Testimonial ----------
function QuoteBlock({ quote, who }) {
  return (
    <Reveal as="div" className="quote-block">
      <div className="mark">"</div>
      <p className="q">{quote}</p>
      <div className="att">— {who}</div>
    </Reveal>
  );
}

export {
  Reveal, NAV_ITEMS,
  Nav, SiteFooter, ImgBox, ProjectCard, HorizontalSwiper, Hero, ClientMarquee, CTABlock, QuoteBlock,
};
