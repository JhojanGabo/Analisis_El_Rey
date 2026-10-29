import { useEffect, useRef } from 'react';

// ============================================================
// Hook: Efectos de canvas – Cielo vino
// Port de effects.js del proyecto kate-universo,
// adaptado con la paleta vino/dorado del sistema POS
// ============================================================

const PALETTE = ['#a855f7', '#c4b5fd', '#ddd6fe', '#e879f9', '#f3eefe', '#ffffff'];

function glowSprite(rgb: string, size = 64): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0,    `rgba(${rgb},0.9)`);
  gr.addColorStop(0.35, `rgba(${rgb},0.25)`);
  gr.addColorStop(1,    `rgba(${rgb},0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  return c;
}

const SPR = {
  purple:  glowSprite('139,26,47'),
  lilac:  glowSprite('201,168,76'),
  white: glowSprite('255,255,255'),
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function useCanvasEffects() {
  const bgRef  = useRef<HTMLCanvasElement>(null);
  const fxRef  = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    const fx = fxRef.current;
    if (!bg || !fx) return;

    const bctx = bg.getContext('2d')!;
    const fctx = fx.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, DPR = 1;
    let animId = 0;

    // --- Resize ---
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      for (const c of [bg!, fx!]) {
        c.width  = Math.round(W * DPR);
        c.height = Math.round(H * DPR);
        c.style.width  = W + 'px';
        c.style.height = H + 'px';
      }
      bctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // --- Estrellas ---
    const area    = Math.max(W * H, 300000);
    const STAR_N  = Math.round(Math.min(160, Math.max(60, area / 10000)));
    const DUST_N  = Math.round(Math.min(36, Math.max(18, area / 32000)));

    const stars = Array.from({ length: STAR_N }, () => {
      const big = Math.random() < 0.06;
      return {
        x: Math.random(), y: Math.random(),
        r: big ? rand(1.1, 1.8) : rand(0.25, 1.1),
        depth: rand(0.2, 1), ph: rand(0, 6.28), sp: rand(0.5, 2.0),
        big, tint: pick(['#ffffff', '#f3eefe', '#ddd6fe', '#e879f9']),
      };
    });

    const dust = Array.from({ length: DUST_N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: rand(-0.004, 0.004), vy: rand(-0.012, -0.003),
      s: rand(10, 32), a: rand(0.1, 0.32),
      purple: Math.random() < 0.5, ph: rand(0, 6.28),
    }));

    // --- Estrellas fugaces ---
    const shooters: {
      x: number; y: number; vx: number; vy: number;
      life: number; max: number; len: number;
    }[] = [];
    let nextShoot = 3;
    let shootEvery = 9;

    function shoot() {
      const fromLeft = Math.random() < 0.5;
      const speed = rand(650, 950);
      const ang   = rand(0.35, 0.6);
      shooters.push({
        x: fromLeft ? rand(0, W * 0.5) : rand(W * 0.5, W),
        y: rand(0, H * 0.35),
        vx: (fromLeft ? 1 : -1) * Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        life: 0, max: rand(0.8, 1.3), len: rand(100, 180),
      });
    }

    // --- Partículas ---
    interface Part {
      kind: 'heart' | 'spark'; x: number; y: number;
      vx: number; vy: number; g: number; drag: number;
      life: number; max: number; size: number;
      rot: number; vr: number; color: string;
    }
    const parts: Part[] = [];
    const MAX_PARTS = 420;

    const heartP = new Path2D();
    heartP.moveTo(0, 0.55);
    heartP.bezierCurveTo(-1.0, -0.15, -0.6, -0.95, 0, -0.38);
    heartP.bezierCurveTo(0.6, -0.95, 1.0, -0.15, 0, 0.55);
    heartP.closePath();

    const sparkP = new Path2D();
    sparkP.moveTo(0, -1); sparkP.quadraticCurveTo(0, 0, 1, 0);
    sparkP.quadraticCurveTo(0, 0, 0, 1); sparkP.quadraticCurveTo(0, 0, -1, 0);
    sparkP.quadraticCurveTo(0, 0, 0, -1); sparkP.closePath();

    function addPart(p: Part) {
      if (parts.length >= MAX_PARTS) parts.shift();
      parts.push(p);
    }

    function burst(x: number, y: number, o: {
      n?: number; power?: number; kinds?: ('heart' | 'spark')[];
      size?: number; gravity?: number; color?: string;
    } = {}) {
      const n = reduce ? Math.ceil((o.n ?? 8) / 3) : (o.n ?? 8);
      const power = o.power ?? 1;
      const kinds = o.kinds ?? ['heart', 'spark'];
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(60, 240) * power;
        addPart({
          kind: pick(kinds), x, y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - rand(20, 80) * power,
          g: o.gravity ?? 140, drag: 0.985,
          life: 0, max: rand(0.9, 1.6),
          size: rand(4, 10) * (o.size ?? 1),
          rot: rand(-0.6, 0.6), vr: rand(-2, 2),
          color: o.color ?? pick(PALETTE),
        });
      }
    }

    // Exposición global para uso en componentes
    (window as any).FX = { burst, shoot,
      setShootRate(sec: number) {
        shootEvery = Math.max(1.5, sec);
        nextShoot  = Math.min(nextShoot, shootEvery);
      },
    };

    // Partículas al click
    const onPointer = (e: PointerEvent) => {
      burst(e.clientX, e.clientY, { n: 7, power: 0.65, size: 0.8, gravity: 115 });
    };
    window.addEventListener('pointerdown', onPointer, { passive: true });

    // --- Paralaje ---
    let px = 0, py = 0, tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / W - 0.5) * 2;
      ty = (e.clientY / H - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let last = performance.now();
    let fxWasDrawn = false;

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;

      // --- Fondo ---
      bctx.clearRect(0, 0, W, H);

      // Polvo
      for (const d of dust) {
        d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); }
        if (d.x < -0.05) d.x = 1.05; else if (d.x > 1.05) d.x = -0.05;
        const a = d.a * (0.65 + 0.35 * Math.sin(t * 0.7 + d.ph));
        bctx.globalAlpha = a;
        bctx.drawImage(
          d.purple ? SPR.purple : SPR.lilac,
          d.x * W - d.s / 2 + px * 10,
          d.y * H - d.s / 2 + py * 10,
          d.s, d.s,
        );
      }

      // Estrellas
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.sp + s.ph);
        const a = reduce ? 0.7 : 0.22 + 0.78 * tw;
        const x = s.x * W + px * s.depth * 12;
        const y = s.y * H + py * s.depth * 12;
        bctx.globalAlpha = a;
        if (s.big) {
          const g = 12 + 6 * tw;
          bctx.drawImage(SPR.white, x - g / 2, y - g / 2, g, g);
        }
        bctx.fillStyle = s.tint;
        bctx.beginPath();
        bctx.arc(x, y, s.r, 0, 6.2832);
        bctx.fill();
      }
      bctx.globalAlpha = 1;

      // Estrellas fugaces
      if (!reduce) {
        nextShoot -= dt;
        if (nextShoot <= 0) { shoot(); nextShoot = rand(shootEvery * 0.6, shootEvery * 1.4); }
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
        const k = s.life / s.max;
        if (k >= 1 || s.x < -200 || s.x > W + 200 || s.y > H + 200) { shooters.splice(i, 1); continue; }
        const fade = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85;
        const mag = Math.hypot(s.vx, s.vy);
        const tx2 = s.x - (s.vx / mag) * s.len;
        const ty2 = s.y - (s.vy / mag) * s.len;
        const g = bctx.createLinearGradient(s.x, s.y, tx2, ty2);
        g.addColorStop(0, `rgba(243,238,254,${0.9 * fade})`);
        g.addColorStop(0.3, `rgba(196,181,253,${0.45 * fade})`);
        g.addColorStop(1, 'rgba(124,58,237,0)');
        bctx.strokeStyle = g;
        bctx.lineWidth = 1.6; bctx.lineCap = 'round';
        bctx.beginPath(); bctx.moveTo(s.x, s.y); bctx.lineTo(tx2, ty2); bctx.stroke();
        bctx.globalAlpha = fade;
        bctx.drawImage(SPR.white, s.x - 9, s.y - 9, 18, 18);
        bctx.globalAlpha = 1;
      }

      // --- Partículas (capa fx) ---
      if (parts.length) {
        fctx.clearRect(0, 0, W, H);
        fxWasDrawn = true;
        fctx.globalCompositeOperation = 'lighter';
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.life += dt;
          if (p.life >= p.max) { parts.splice(i, 1); continue; }
          p.vy += p.g * dt; p.vx *= p.drag; p.vy *= p.drag;
          p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
          const k     = p.life / p.max;
          const alpha = k < 0.12 ? k / 0.12 : Math.pow(1 - (k - 0.12) / 0.88, 1.3);
          const sz    = p.size * (0.7 + 0.3 * (1 - k));
          fctx.globalAlpha = alpha * 0.5;
          const h = sz * 4;
          fctx.drawImage(SPR.purple, p.x - h / 2, p.y - h / 2, h, h);
          fctx.save();
          fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.scale(sz, sz);
          fctx.globalAlpha = alpha;
          fctx.fillStyle = p.color;
          fctx.fill(p.kind === 'heart' ? heartP : sparkP);
          fctx.restore();
        }
        fctx.globalCompositeOperation = 'source-over';
        fctx.globalAlpha = 1;
      } else if (fxWasDrawn) {
        fctx.clearRect(0, 0, W, H);
        fxWasDrawn = false;
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('pointermove', onMove);
      delete (window as any).FX;
    };
  }, []);

  return { bgRef, fxRef };
}
