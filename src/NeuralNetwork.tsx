import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
};

type Packet = {
  a: number;
  b: number;
  t: number;
  speed: number;
  life: number;
};

function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const linkDist = () => Math.min(220, Math.max(140, width * 0.14));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((width * height) / 18000);
      nodes = Array.from({ length: Math.max(36, Math.min(count, 90)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.2 + Math.random() * 1.8,
        pulse: Math.random() * Math.PI * 2,
      }));

      packets = Array.from({ length: Math.floor(nodes.length * 0.55) }, () => ({
        a: Math.floor(Math.random() * nodes.length),
        b: Math.floor(Math.random() * nodes.length),
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        life: Math.random(),
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const maxDist = linkDist();

      for (const node of nodes) {
        if (!reduced) {
          node.x += node.vx;
          node.y += node.vy;
          node.pulse += 0.02;
        }
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDist) continue;
          const alpha = (1 - dist / maxDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(180, 200, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (const packet of packets) {
        if (!reduced) {
          packet.t += packet.speed;
          packet.life += 0.01;
          if (packet.t >= 1) {
            packet.t = 0;
            packet.a = Math.floor(Math.random() * nodes.length);
            let next = Math.floor(Math.random() * nodes.length);
            let tries = 0;
            while (tries < 12) {
              const dx = nodes[packet.a].x - nodes[next].x;
              const dy = nodes[packet.a].y - nodes[next].y;
              if (Math.hypot(dx, dy) < maxDist * 1.15) break;
              next = Math.floor(Math.random() * nodes.length);
              tries += 1;
            }
            packet.b = next;
            packet.speed = 0.003 + Math.random() * 0.007;
          }
        }

        const a = nodes[packet.a];
        const b = nodes[packet.b];
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (Math.hypot(dx, dy) > maxDist * 1.2) continue;

        const x = a.x + dx * packet.t;
        const y = a.y + dy * packet.t;
        const glow = 0.45 + Math.sin(packet.life) * 0.25;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 10);
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * glow})`);
        grad.addColorStop(0.35, `rgba(190, 210, 255, ${0.45 * glow})`);
        grad.addColorStop(1, "rgba(190, 210, 255, 0)");
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * glow})`;
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const node of nodes) {
        const pulse = 0.55 + Math.sin(node.pulse) * 0.35;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 6);
        glow.addColorStop(0, `rgba(220, 230, 255, ${0.35 * pulse})`);
        glow.addColorStop(1, "rgba(220, 230, 255, 0)");
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(node.x, node.y, node.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(235, 240, 255, ${0.55 + pulse * 0.35})`;
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="neural-network" ref={canvasRef} aria-hidden />;
}

export default NeuralNetwork;
