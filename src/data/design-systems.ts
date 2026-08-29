export type System = {
  slug: string;
  name: string;
  tag: "Free" | "Premium";
  desc: string;
  meta: string;
  gradient: string;
  externalUrl?: string;
  image?: string;
};

export const SYSTEMS: System[] = [
  { slug: "halo",           name: "Halo",           tag: "Free",    desc: "A modern, minimal dark system pairing an architectural near-black canvas with precise typography and a tight palette of vibrant signal colors.", meta: "5 files · 12 components · 2 fonts · 10 colors", gradient: "linear-gradient(135deg,#0b0f1a 0%,#141a2b 55%,#1e2749 100%)", externalUrl: "https://linear.app/", image: "/thumbnails/halo.png" },
  { slug: "aether",         name: "Aether",         tag: "Premium", desc: "An editorial dark system where brutalist grids and oversized italic serifs collide with prismatic chromatic glass.", meta: "5 files · 1 logo · 8 components · 3 fonts · 9 colors", gradient: "linear-gradient(135deg,#0e0b1a 0%,#2a1e5e 45%,#7a3fbf 100%)", externalUrl: "/design/aether" },
  { slug: "chamfer",        name: "Chamfer",        tag: "Premium", desc: "A warm paper-and-ink interface system where every corner is cut at 45°. Layered stationery, notched tabs, serif headlines.", meta: "5 files · 1 logo · 2 fonts · 7 colors", gradient: "linear-gradient(135deg,#f5efe3 0%,#e5d9c1 60%,#c9a97a 100%)", externalUrl: "/design/chamfer" },
  { slug: "meadowlark",     name: "Meadowlark",     tag: "Premium", desc: "A light, breathable system built around botanical illustrations and warm cream surfaces with a coral-teal-marigold palette.", meta: "5 files · 1 logo · 2 fonts · 8 colors", gradient: "linear-gradient(135deg,#fff4e6 0%,#ffd1a3 45%,#ff8f6a 100%)", externalUrl: "https://stripe.com/", image: "/thumbnails/meadowlark.png" },
  { slug: "raster-sentinel",name: "Raster Sentinel",tag: "Premium", desc: "A hard-edged dark system for machine intelligence and security. Ink-black panels, dithered bitmap imagery, ultramarine strike color.", meta: "5 files · 1 logo · 2 fonts · 6 colors", gradient: "linear-gradient(135deg,#050505 0%,#0e1226 55%,#1e37ff 100%)", externalUrl: "https://vercel.com/", image: "/thumbnails/raster-sentinel.png" },
  { slug: "meridian",       name: "Meridian",       tag: "Premium", desc: "An editorial system for frontier AI, pairing warm paper surfaces and high-contrast serif display type with a pastel spectrum moment.", meta: "5 files · 1 logo · 2 fonts · 8 colors", gradient: "linear-gradient(135deg,#f8f2ea 0%,#f2d7de 55%,#cdb4e5 100%)", externalUrl: "https://www.framer.com/", image: "/thumbnails/meridian.png" },
  { slug: "forge",          name: "Forge",          tag: "Premium", desc: "An industrial-grade dark system where ember-orange ignition heats a graphite-black workspace, tuned for dense technical surfaces.", meta: "5 files · 8 components · 3 fonts · 8 colors", gradient: "linear-gradient(135deg,#0a0908 0%,#1c1712 55%,#e0621b 100%)", externalUrl: "https://railway.app/", image: "/thumbnails/forge.png" },
  { slug: "boldface",       name: "Boldface",       tag: "Premium", desc: "An editorial dark-mode system for design-led studios. Heavy display sans with elegant serif italic, deep cocoa stage, tomato accent.", meta: "5 files · 1 logo · 2 fonts · 8 colors", gradient: "linear-gradient(135deg,#1a1210 0%,#2a1a17 55%,#e64b32 100%)", externalUrl: "https://resend.com/", image: "/thumbnails/boldface.png" },
  { slug: "cirrus",         name: "Cirrus",         tag: "Premium", desc: "A minimalist, light-as-air SaaS system built around a cloudy sky background, pill controls, and a single italic serif accent.", meta: "5 files · 1 logo · 12 components · 3 fonts · 9 colors", gradient: "linear-gradient(135deg,#eaf2fb 0%,#c9dcf3 55%,#9cb9e0 100%)", externalUrl: "https://www.raycast.com/", image: "/thumbnails/cirrus.png" },
  { slug: "cairn",          name: "Cairn",          tag: "Premium", desc: "A grounded, tactile system stacked from warm stone surfaces and monolithic type — quiet, deliberate, load-bearing.", meta: "5 files · 1 logo · 2 fonts · 7 colors", gradient: "linear-gradient(135deg,#2b2622 0%,#3f342c 55%,#8a6a4f 100%)", externalUrl: "https://arc.net/", image: "/thumbnails/cairn.png" },
];

export function buildServiceSite(system: System) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${system.name} Studio — Design & Engineering Services</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root { --bg:#0a0a12; --fg:#f6f4ee; --muted:rgba(246,244,238,.62); --line:rgba(246,244,238,.10); --accent:#c4b5fd; }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  a{color:inherit}
  .wrap{max-width:1120px;margin:0 auto;padding:0 32px}

  .nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;position:sticky;top:0;background:rgba(10,10,18,.72);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);z-index:20}
  .brand{display:flex;align-items:center;gap:10px;font-weight:600;letter-spacing:-.01em;cursor:pointer}
  .mark{width:28px;height:28px;border-radius:8px;background:${system.gradient};box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 6px 14px -4px rgba(0,0,0,.5)}
  .menu{display:flex;gap:28px;font-size:14px;color:var(--muted)}
  .menu a{text-decoration:none;transition:color .2s;cursor:pointer} .menu a:hover{color:var(--fg)}
  .cta{padding:9px 16px;border-radius:999px;background:var(--fg);color:#0a0a12;font-size:13px;font-weight:600;text-decoration:none;border:0;cursor:pointer;font-family:inherit}
  .burger{display:none;background:transparent;border:1px solid var(--line);border-radius:8px;padding:8px 10px;color:var(--fg);cursor:pointer}

  .hero{padding:96px 0 72px;position:relative;overflow:hidden}
  .hero::before{content:"";position:absolute;inset:-20% -10% auto -10%;height:520px;background:${system.gradient};filter:blur(90px);opacity:.35;z-index:0}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border:1px solid var(--line);border-radius:999px;font-size:12px;color:var(--muted);position:relative;z-index:1}
  .eyebrow .dot{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 12px #4ade80;animation:pulse 2s infinite}
  @keyframes pulse{50%{opacity:.4}}
  h1{font-family:'Instrument Serif',serif;font-size:clamp(48px,7vw,92px);line-height:.98;letter-spacing:-.02em;margin:22px 0 20px;position:relative;z-index:1;max-width:900px}
  h1 em{font-style:italic;background:${system.gradient};-webkit-background-clip:text;background-clip:text;color:transparent}
  .lede{font-size:18px;color:var(--muted);max-width:560px;line-height:1.6;position:relative;z-index:1}
  .actions{display:flex;gap:12px;margin-top:32px;position:relative;z-index:1;flex-wrap:wrap}
  .btn{padding:14px 22px;border-radius:12px;font-size:14px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:transform .15s, box-shadow .2s;cursor:pointer;border:0;font-family:inherit}
  .btn:hover{transform:translateY(-1px)}
  .btn:active{transform:translateY(0) scale(.98)}
  .btn-primary{background:var(--fg);color:#0a0a12;box-shadow:0 10px 30px -8px rgba(255,255,255,.25)}
  .btn-ghost{border:1px solid var(--line);color:var(--fg);background:transparent}

  .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:56px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:80px}
  .metric .n{font-family:'Instrument Serif',serif;font-size:44px;letter-spacing:-.02em}
  .metric .l{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.14em;margin-top:6px}

  .section{padding:96px 0}
  .kicker{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.18em}
  .h2{font-family:'Instrument Serif',serif;font-size:clamp(36px,4.6vw,58px);letter-spacing:-.02em;margin:10px 0 32px;max-width:720px}

  .tabs{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;margin-bottom:36px}
  .tab{padding:8px 16px;border-radius:999px;font-size:13px;color:var(--muted);background:transparent;border:0;cursor:pointer;transition:all .2s;font-family:inherit}
  .tab.active{background:var(--fg);color:#0a0a12}

  .services{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .svc{padding:28px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));transition:transform .3s, border-color .3s;position:relative;overflow:hidden;cursor:pointer}
  .svc::after{content:"";position:absolute;inset:auto -30% -60% auto;width:220px;height:220px;background:${system.gradient};filter:blur(60px);opacity:0;transition:opacity .4s}
  .svc:hover{transform:translateY(-4px);border-color:rgba(246,244,238,.22)}
  .svc:hover::after{opacity:.35}
  .svc .ico{width:44px;height:44px;border-radius:12px;background:${system.gradient};display:grid;place-items:center;font-size:20px;margin-bottom:20px;position:relative}
  .svc h3{font-size:20px;letter-spacing:-.01em;margin-bottom:10px;position:relative}
  .svc p{color:var(--muted);font-size:14px;line-height:1.65;position:relative}
  .svc.hidden{display:none}

  .process{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
  .steps{display:flex;flex-direction:column;gap:2px}
  .step{padding:24px 0;border-top:1px solid var(--line);display:grid;grid-template-columns:60px 1fr;gap:20px}
  .step:last-child{border-bottom:1px solid var(--line)}
  .step .num{font-family:'Instrument Serif',serif;font-size:32px;color:var(--muted)}
  .step h4{font-size:18px;margin-bottom:6px}
  .step p{color:var(--muted);font-size:14px;line-height:1.6}

  .faq{max-width:720px;margin:0 auto}
  .qa{border-top:1px solid var(--line);padding:20px 0}
  .qa:last-child{border-bottom:1px solid var(--line)}
  .qa summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;font-size:17px;font-weight:500}
  .qa summary::-webkit-details-marker{display:none}
  .qa summary::after{content:"+";font-size:22px;color:var(--muted);transition:transform .3s}
  .qa[open] summary::after{transform:rotate(45deg)}
  .qa p{color:var(--muted);font-size:14px;line-height:1.7;margin-top:12px;max-width:560px}

  .cta-band{margin:0 32px 48px;padding:64px 48px;border-radius:28px;background:${system.gradient};position:relative;overflow:hidden;text-align:center}
  .cta-band h3{font-family:'Instrument Serif',serif;font-size:clamp(32px,4vw,52px);color:#0a0a12;letter-spacing:-.02em;max-width:640px;margin:0 auto 24px}
  .cta-band button{background:#0a0a12;color:var(--fg);padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;border:0;cursor:pointer;font-family:inherit}

  footer{padding:40px 32px;border-top:1px solid var(--line);display:flex;justify-content:space-between;color:var(--muted);font-size:13px;flex-wrap:wrap;gap:12px}
  footer a{text-decoration:none}
</style>
</head>
<body>
  <div class="nav">
    <div class="brand"><span class="mark"></span>${system.name} Studio</div>
    <div class="menu">
      <a href="#services">Services</a>
      <a href="#process">Process</a>
      <a href="#faq">FAQ</a>
    </div>
    <button class="cta" onclick="document.getElementById('cta').scrollIntoView({behavior:'smooth'})">Get Started</button>
  </div>

  <div class="wrap hero">
    <div class="eyebrow"><span class="dot"></span>Accepting new projects for Q3</div>
    <h1>We design & ship <em>high-conviction digital products</em>.</h1>
    <p class="lede">A specialized design & engineering partner for frontier technology companies. We build interfaces with taste, speed, and mathematical rigor.</p>
    <div class="actions">
      <a href="#services" class="btn btn-primary">Explore capabilities →</a>
      <a href="#process" class="btn btn-ghost">Our process</a>
    </div>

    <div class="metrics">
      <div class="metric"><div class="n">48h</div><div class="l">Sprint Kickoff</div></div>
      <div class="metric"><div class="n">99.8%</div><div class="l">Client Conviction</div></div>
      <div class="metric"><div class="n">$1.4B+</div><div class="l">Client Valuation</div></div>
      <div class="metric"><div class="n">14</div><div class="l">Industry Awards</div></div>
    </div>
  </div>

  <div class="wrap section" id="services">
    <div class="kicker">Core Practice</div>
    <h2 class="h2">Engineered for velocity and unmatched visual taste.</h2>
    <div class="services">
      <div class="svc">
        <div class="ico">✦</div>
        <h3>Design Systems</h3>
        <p>Comprehensive, tokenized component architectures built to scale from seed to IPO with zero drift.</p>
      </div>
      <div class="svc">
        <div class="ico">◈</div>
        <h3>AI Product UX</h3>
        <p>Latent space visualizations, streaming response choreography, and agentic workflows users trust.</p>
      </div>
      <div class="svc">
        <div class="ico">⬡</div>
        <h3>Fullstack Engineering</h3>
        <p>Production-ready React, Next.js, and TanStack Start implementations with 100/100 Lighthouse performance.</p>
      </div>
    </div>
  </div>

  <div class="cta-band" id="cta">
    <h3>Ready to build something unforgettable?</h3>
    <button onclick="alert('Thank you! Project intake opened for ' + '${system.name}' + ' system.')">Schedule a Discovery Call →</button>
  </div>

  <footer>
    <div>© 2026 ${system.name} Studio. All rights reserved.</div>
    <div>Built with <strong style="color:var(--fg)">Novix UI</strong></div>
  </footer>
</body>
</html>`;
}
