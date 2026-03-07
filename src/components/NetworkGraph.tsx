import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulsePhase: number;
  label?: string;
  isHub: boolean;
  activationGlow: number;
}

interface Wavefront {
  nodeIdx: number;
  arrivalTime: number;
}

interface Cascade {
  wavefronts: Wavefront[];
  visited: Set<number>;
  startTime: number;
  active: boolean;
}

const LABELS = [
  'Client A', 'Meeting', 'Follow-up', 'Email', 'Contract',
  'Investor', 'Pitch Deck', 'Demo', 'Partner', 'Deal',
  'Task', 'Intro', 'Note', 'Call', 'Deadline',
  'Client B', 'Revenue', 'Feedback', 'Schedule', 'Action Item',
];

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 55;
    const HUB_COUNT = 20;
    const CONNECTION_DIST = 300;
    const nodes: Node[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const isHub = i < HUB_COUNT;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: isHub ? (Math.random() * 4 + 6) : (Math.random() * 2 + 1.5),
        opacity: isHub ? (Math.random() * 0.2 + 0.6) : (Math.random() * 0.3 + 0.2),
        pulsePhase: Math.random() * Math.PI * 2,
        label: isHub ? LABELS[i % LABELS.length] : undefined,
        isHub,
        activationGlow: 0,
      });
    }

    // Get ALL connected hub neighbors for branching spread
    const getNeighborHubs = (nodeIdx: number): number[] => {
      const neighbors: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === nodeIdx || !nodes[j].isHub) continue;
        const dx = nodes[nodeIdx].x - nodes[j].x;
        const dy = nodes[nodeIdx].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < CONNECTION_DIST) {
          neighbors.push(j);
        }
      }
      return neighbors;
    };

    // Active cascades
    const cascades: Cascade[] = [];
    let cascadeTimer = 0;
    let time = 0;

    // Active traveling pulses for rendering
    interface TravelingPulse {
      fromX: number; fromY: number;
      toX: number; toY: number;
      startTime: number;
      duration: number;
    }
    const pulses: TravelingPulse[] = [];

    // Spawn a viral cascade from a random hub
    const spawnCascade = () => {
      const startIdx = Math.floor(Math.random() * HUB_COUNT);
      const cascade: Cascade = {
        wavefronts: [{ nodeIdx: startIdx, arrivalTime: time }],
        visited: new Set([startIdx]),
        startTime: time,
        active: true,
      };
      cascades.push(cascade);
    };

    const SPREAD_DELAY = 0.8; // time between waves
    const PULSE_TRAVEL_TIME = 0.6; // how fast the pulse visually travels

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016; // ~60fps
      cascadeTimer += 0.016;

      // Spawn new cascade every ~4 seconds
      if (cascadeTimer > 4) {
        spawnCascade();
        cascadeTimer = 0;
      }

      // Decay all activation glows
      for (const node of nodes) {
        node.activationGlow *= 0.96;
      }

      // Process cascades — viral BFS spread
      for (const cascade of cascades) {
        if (!cascade.active) continue;

        const newWavefronts: Wavefront[] = [];

        for (const wf of cascade.wavefronts) {
          // When this wavefront's time arrives, spread to ALL neighbors
          if (time >= wf.arrivalTime) {
            // Activate this node
            nodes[wf.nodeIdx].activationGlow = 1;

            // Spread to ALL unvisited neighbors (viral: 1→many)
            const neighbors = getNeighborHubs(wf.nodeIdx);
            for (const n of neighbors) {
              if (!cascade.visited.has(n)) {
                cascade.visited.add(n);
                const arrival = wf.arrivalTime + SPREAD_DELAY;
                newWavefronts.push({ nodeIdx: n, arrivalTime: arrival });

                // Create traveling pulse visual
                pulses.push({
                  fromX: nodes[wf.nodeIdx].x,
                  fromY: nodes[wf.nodeIdx].y,
                  toX: nodes[n].x,
                  toY: nodes[n].y,
                  startTime: wf.arrivalTime,
                  duration: PULSE_TRAVEL_TIME,
                });
              }
            }
          } else {
            // Not yet arrived, keep in queue
            newWavefronts.push(wf);
          }
        }

        cascade.wavefronts = newWavefronts;

        // Deactivate if no more wavefronts
        if (cascade.wavefronts.length === 0) {
          cascade.active = false;
        }
      }

      // Remove old cascades
      while (cascades.length > 6) {
        cascades.shift();
      }

      // Clean old pulses
      while (pulses.length > 0 && time - pulses[0].startTime > pulses[0].duration + 0.5) {
        pulses.shift();
      }

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -30) node.vx = Math.abs(node.vx);
        if (node.x > width + 30) node.vx = -Math.abs(node.vx);
        if (node.y < -30) node.vy = Math.abs(node.vy);
        if (node.y > height + 30) node.vy = -Math.abs(node.vy);
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const strength = 1 - dist / CONNECTION_DIST;
            const bothHubs = nodes[i].isHub && nodes[j].isHub;
            const activation = Math.max(nodes[i].activationGlow, nodes[j].activationGlow);
            const baseAlpha = strength * (bothHubs ? 0.25 : 0.08);
            const alpha = baseAlpha + activation * 0.35;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            if (activation > 0.3) {
              ctx.strokeStyle = `rgba(50, 200, 255, ${alpha})`;
              ctx.lineWidth = bothHubs ? 2 : 0.8;
            } else {
              ctx.strokeStyle = `rgba(60, 120, 200, ${baseAlpha})`;
              ctx.lineWidth = bothHubs ? 1 : 0.4;
            }
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(time * 2.5 + node.pulsePhase) * 0.2 + 0.8;
        const alpha = node.opacity * pulse;
        const glow = node.activationGlow;

        if (node.isHub) {
          // Shockwave ring when activated
          if (glow > 0.5) {
            const rippleR = node.radius * (2 + (1 - glow) * 12);
            ctx.beginPath();
            ctx.arc(node.x, node.y, rippleR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(50, 220, 255, ${glow * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Outer glow
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glow > 0.2
            ? `rgba(40, 180, 255, ${alpha * 0.1 + glow * 0.15})`
            : `rgba(50, 120, 255, ${alpha * 0.07})`;
          ctx.fill();

          // Inner glow
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = glow > 0.2
            ? `rgba(70, 210, 255, ${alpha * 0.2 + glow * 0.2})`
            : `rgba(70, 140, 255, ${alpha * 0.12})`;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = glow > 0.2
            ? `rgba(100, 230, 255, ${Math.min(alpha + glow * 0.6, 1)})`
            : `rgba(100, 160, 255, ${alpha * 0.85})`;
          ctx.fill();
          ctx.strokeStyle = glow > 0.2
            ? `rgba(150, 240, 255, ${Math.min(0.8 + glow * 0.2, 1)})`
            : `rgba(130, 180, 255, ${alpha * 0.4})`;
          ctx.lineWidth = glow > 0.2 ? 2 : 1;
          ctx.stroke();

          // Label
          if (node.label) {
            ctx.font = `${glow > 0.3 ? 'bold ' : ''}11px "Inter", sans-serif`;
            ctx.fillStyle = glow > 0.2
              ? `rgba(200, 240, 255, ${Math.min(alpha * 0.9 + glow * 0.5, 1)})`
              : `rgba(140, 185, 230, ${alpha * 0.6})`;
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + node.radius + 16);
          }
        } else {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = glow > 0.2
            ? `rgba(70, 210, 255, ${alpha * 0.8})`
            : `rgba(80, 140, 210, ${alpha * 0.4})`;
          ctx.fill();
        }
      }

      // Draw traveling pulses
      for (const p of pulses) {
        const elapsed = time - p.startTime;
        const t = Math.min(elapsed / p.duration, 1);
        if (t < 0 || t > 1) continue;

        const px = p.fromX + (p.toX - p.fromX) * t;
        const py = p.fromY + (p.toY - p.fromY) * t;
        const fadeIn = t < 0.1 ? t / 0.1 : 1;
        const fadeOut = t > 0.8 ? (1 - t) / 0.2 : 1;
        const brightness = fadeIn * fadeOut;

        // Trail glow
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50, 200, 255, ${0.12 * brightness})`;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(130, 230, 255, ${0.8 * brightness})`;
        ctx.fill();

        // White center
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * brightness})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initial cascade on load for immediate impact
    setTimeout(() => spawnCascade(), 500);

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
