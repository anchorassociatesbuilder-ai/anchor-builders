import React from 'react';
import Link from 'next/link';
import { SITE_DATA } from '../src/data';
import {
  Reveal, ImgBox, Hero, ClientMarquee, CTABlock, QuoteBlock,
} from '../src/components';
import HomeFeatured from './HomeFeatured';
import { getFeaturedProjects, getServiceCovers, getActiveHeroSlides } from '../lib/queries';
import { SITE_URL, SITE_NAME } from '../lib/site';
import { balancedSpanClass } from '../src/grid';

export const dynamic = 'force-dynamic';

// Structured data for Google: the company logo (shown in search and the
// knowledge panel; it keeps its navy square so it reads on Google's white
// background) and the site name shown above search results.
const STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-square.png`,
    email: 'anchorassociates.builders@gmail.com',
    telephone: '+92 334 7999336',
    address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Anchor Builders',
    url: `${SITE_URL}/`,
  },
];

export default async function HomePage() {
  const [featured, covers, heroSlides] = await Promise.all([
    getFeaturedProjects(6),
    getServiceCovers(),
    getActiveHeroSlides(),
  ]);

  // Admin-managed hero slides (min 2) take over; otherwise the static fallback.
  const fallbackHeroFrames = [
    { src: '/featured/07.jpg', caption: 'PARC-AZRC Umerkot' },
    { src: '/featured/15.jpg', caption: 'NUML Canopies' },
    { src: '/featured/13.jpg', caption: 'Maze Isolation Facility NARC' },
    { src: '/featured/05.jpg', caption: 'Residential Villas Kingdom Valley' },
  ];
  const heroFrames = heroSlides.length >= 2
    ? heroSlides.map((s) => ({ src: s.image_url, caption: s.caption || '' }))
    : fallbackHeroFrames;

  // Show 6 featured services on home (full list lives on /services)
  const featuredServices = SITE_DATA.SERVICES.slice(0, 6);

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <Hero
        frames={heroFrames}
        title="A proud tradition of service"
      />

      {/* Intro / proud tradition */}
      <section className="section">
        <div className="container-wide">
          <div className="sec-head sec-center">
            <div className="sh-l">
              <span className="eyebrow"><span className="dot"></span>OUR APPROACH</span>
            </div>
            <div className="sh-r">
              <h2 className="hd-1">A name built not on the size of our firm, but on the <i>consistency</i> of our work.</h2>
              <p className="lede">With a proven legacy of government and institutional delivery, our approach to every project is rooted in understanding exactly what the client needs — and finishing only when that need has been exceeded. That commitment has been the foundation of every project we have completed and every relationship we have built over the past decade and a half.</p>
              <Link href="/about" className="link-arrow" style={{ marginTop: 16 }}>Read our story</Link>
            </div>
          </div>
        </div>

        {/* Editorial split image */}
        <div className="container-wide" style={{ marginTop: 48 }}>
          <div className="home-editorial-grid">
            <Reveal mode="image"><ImgBox src={SITE_DATA.IMG.archD} ratio="r-169" /></Reveal>
            <div className="home-editorial-col">
              <Reveal mode="image" delay={120}><ImgBox src={SITE_DATA.IMG.constB} ratio="r-43" sizes="(max-width: 900px) 100vw, (max-width: 1280px) 42vw, 33vw" /></Reveal>
              <Reveal mode="image" delay={240}><ImgBox src={SITE_DATA.IMG.intB} ratio="r-43" sizes="(max-width: 900px) 100vw, (max-width: 1280px) 42vw, 33vw" /></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 0 96px' }}>
        <div className="container-wide">
          <div className="stats">
            <div className="stat"><div className="n">15<span className="u">+</span></div><div className="l">Years of service</div></div>
            <div className="stat"><div className="n">150<span className="u">+</span></div><div className="l">Projects delivered</div></div>
            <div className="stat"><div className="n">50<span className="u">+</span></div><div className="l">Clients served</div></div>
            <div className="stat"><div className="n">C-2</div><div className="l">PEC registered</div></div>
          </div>
        </div>
      </section>

      {/* Why Choose Anchor — differentiators */}
      <section className="section dark">
        <div className="container-wide">
          <div className="sec-head sec-center">
            <div className="sh-l"><span className="eyebrow dark"><span className="dot"></span>WHY ANCHOR</span></div>
            <div className="sh-r">
              <h2 className="hd-1" style={{ color: 'var(--on-dark)' }}>What sets us apart, on every site.</h2>
              <p className="lede" style={{ color: 'rgba(236,232,223,0.7)', marginTop: 16 }}>From category registration to research-grade builds, the combination of capabilities below is what brings government bodies, universities and private developers back to Anchor — project after project.</p>
            </div>
          </div>

          <div className="diff-grid">
            {SITE_DATA.DIFFERENTIATORS.map((d, i) => (
              <Reveal key={d.k} delay={(i % 3) * 80} className={`diff-card ${balancedSpanClass(i, SITE_DATA.DIFFERENTIATORS.length)}`}>
                <span className="diff-num">— {d.k}</span>
                <h3 className="diff-title">{d.t}</h3>
                <p className="diff-body">{d.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section warm">
        <div className="container-wide">
          <div className="sec-head sec-center">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>SERVICES</span></div>
            <div className="sh-r">
              <h2 className="hd-1">A wide range of services, under one delivery team.</h2>
              <p className="lede" style={{ marginTop: 16 }}>From the first estimate to final handover — civil, MEP, prefab, interiors, soundproofing, studios, shades, research facilities, and pre-construction design. The technical capability and site-level discipline to ensure every project reaches its full potential.</p>
              <Link href="/services" className="link-arrow" style={{ marginTop: 20 }}>View all services</Link>
            </div>
          </div>
          <div className="svc-grid">
            {featuredServices.map((s) => (
              <Reveal key={s.id}>
                <Link href={`/services/${s.id}`} className="svc-card">
                  <ImgBox src={covers[s.id] || s.hero} ratio="r-169" label={s.name} />
                  <span className="num">— {s.number}</span>
                  <div className="meta-row"><h3>{s.name}</h3><span className="arrow">↗</span></div>
                  <p>{s.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {featured.length > 0 && (
        <section className="section dark">
          <div className="container-wide">
            <div className="sec-head sec-center">
              <div className="sh-l"><span className="eyebrow dark"><span className="dot"></span>SELECTED WORK</span></div>
              <div className="sh-r">
                <h2 className="hd-1" style={{ color: 'var(--on-dark)' }}>We take pride in<br/>the projects we've done.</h2>
                <p className="lede" style={{ color: 'rgba(236,232,223,0.7)', marginTop: 16 }}>From large-scale civil works to highly specialist builds, every project is an institution's investment in its own future — and we treat it accordingly.</p>
                <Link href="/projects" className="link-arrow" style={{ color: 'var(--on-dark)', marginTop: 20 }}>View all projects</Link>
              </div>
            </div>
          </div>

          <HomeFeatured items={featured} />
        </section>
      )}

      {/* Client marquee + preview */}
      <section className="section">
        <div className="container-wide">
          <div className="sec-head sec-center">
            <div className="sh-l"><span className="eyebrow"><span className="dot"></span>OUR CLIENTS</span></div>
            <div className="sh-r">
              <h2 className="hd-1">Trusted across <i>government,</i> retainer and private.</h2>
              <Link href="/clients" className="link-arrow" style={{ marginTop: 20 }}>All clients</Link>
            </div>
          </div>
        </div>
        <ClientMarquee />
      </section>

      {/* Testimonial */}
      <section className="section warm">
        <div className="container-narrow">
          <QuoteBlock quote={SITE_DATA.TESTIMONIALS[1].quote} who={SITE_DATA.TESTIMONIALS[1].who} />
        </div>
      </section>

      <CTABlock />
    </main>
  );
}
