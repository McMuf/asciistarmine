const CHARS = ['*', '.', 'o', '+', '#'];
const PARTICLE_COUNT_PER_1000PX = 10;

export function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    seedParticles();
  }

  function makeParticle(fresh) {
    const speed = 0.3 + Math.random() * 0.9;
    return {
      x: fresh ? canvas.width + Math.random() * 100 : Math.random() * canvas.width,
      y: fresh ? Math.random() * canvas.height - canvas.height : Math.random() * canvas.height,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      speed,
      size: 10 + speed * 8,
      alpha: 0.08 + Math.random() * 0.18
    };
  }

  function seedParticles() {
    const areaUnits = (canvas.width * canvas.height) / (1000 * 1000);
    const count = Math.max(20, Math.round(areaUnits * PARTICLE_COUNT_PER_1000PX));
    particles = Array.from({ length: count }, () => makeParticle(false));
  }

  function step() {
    ctx.fillStyle = '#0b0d0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#4d6b52';
      ctx.font = `${p.size}px monospace`;
      ctx.fillText(p.char, p.x, p.y);

      p.x -= p.speed;
      p.y += p.speed * 0.6;

      if (p.x < -20 || p.y > canvas.height + 20) {
        Object.assign(p, makeParticle(true));
      }
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(step);
}
