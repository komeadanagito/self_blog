import React, { useEffect, useRef } from 'react';

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;

  #define PI 3.14159265359

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(noise(i), noise(i + vec2(1.0, 0.0)), f.x),
               mix(noise(i + vec2(0.0, 1.0)), noise(i + vec2(1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 pointer = (u_pointer * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);

    float t = u_time * 0.12;
    float field = 0.0;
    for (float i = 0.0; i < 4.0; i++) {
      float phase = t + i * 1.73;
      vec2 orbit = vec2(cos(phase * (0.7 + i * 0.08)), sin(phase * (0.6 + i * 0.11)));
      orbit *= 0.42 + i * 0.1;
      orbit += pointer * (0.08 + i * 0.012);
      field += (0.055 + i * 0.012) / max(length(p - orbit) - (0.13 + 0.035 * sin(phase * 1.4)), 0.012);
    }

    float ripples = sin((length(p - pointer * 0.14) * 15.0) - u_time * 0.7) * 0.5 + 0.5;
    float grain = valueNoise(gl_FragCoord.xy * 0.32 + u_time) - 0.5;
    float glow = smoothstep(0.2, 2.7, field);

    vec3 ink = vec3(0.015, 0.018, 0.028);
    vec3 blue = vec3(0.025, 0.27, 1.0);
    vec3 cyan = vec3(0.0, 0.95, 0.92);
    vec3 lime = vec3(0.61, 1.0, 0.06);
    vec3 color = mix(ink, blue, smoothstep(0.15, 1.25, field));
    color = mix(color, cyan, smoothstep(1.1, 2.0, field + ripples * 0.2));
    color = mix(color, lime, smoothstep(2.05, 3.0, field));
    color += grain * 0.035;
    color *= 0.72 + 0.35 * glow;

    float vignette = smoothstep(1.45, 0.25, length((uv - 0.5) * vec2(1.15, 0.9)));
    color *= 0.58 + vignette * 0.62;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export const AmbientShader: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false });
    if (!canvas || !gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const pointerUniform = gl.getUniformLocation(program, 'u_pointer');
    const time = gl.getUniformLocation(program, 'u_time');
    const pointer = { x: 0.5, y: 0.5 };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let visible = false;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    const start = () => {
      if (!running && visible && !document.hidden) {
        running = true;
        frame = requestAnimationFrame(render);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else { cancelAnimationFrame(frame); running = false; }
    });
    observer.observe(canvas);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('resize', resize);
    resize();

    const startedAt = performance.now();
    const render = (now: number) => {
      if (visible) {
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform2f(pointerUniform, pointer.x, pointer.y);
        gl.uniform1f(time, prefersReducedMotion ? 0 : (now - startedAt) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(render);
      else running = false;
    };
    const onVisibility = () => document.hidden ? (cancelAnimationFrame(frame), running = false) : start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', move);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className={`ambient-shader ${className}`} aria-label="Interactive generative color field" />;
};
