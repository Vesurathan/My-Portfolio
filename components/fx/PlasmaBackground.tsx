'use client';

import { useEffect, useRef } from 'react';

/** WebGL domain-warped noise plasma in the blood palette; mouse-reactive. */
export default function PlasmaBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = (cv.getContext('webgl') || cv.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      cv.style.background = 'radial-gradient(circle at 50% 40%, #3a0713, transparent 70%)';
      return;
    }

    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;uniform vec2 R;uniform float T;uniform vec2 M;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);float a=h(i),b=h(i+vec2(1,0)),c=h(i+vec2(0,1)),d=h(i+vec2(1,1));vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
    void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=uv*3.;p.x*=R.x/R.y;float t=T*.09;
    vec2 m=(M/R)*3.;m.x*=R.x/R.y;
    vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
    vec2 r=vec2(fbm(p+2.*q+vec2(1.7,9.2)+.15*t),fbm(p+2.*q+vec2(8.3,2.8)-.12*t));
    float f=fbm(p+3.*r);float md=distance(p,m);float g=exp(-md*1.4)*.55;f+=g;
    vec3 col=mix(vec3(.02,.008,.015),vec3(.5,.05,.11),smoothstep(.34,.75,f));
    col=mix(col,vec3(1.,.09,.27),smoothstep(.66,.95,f));col+=vec3(1.,.1,.28)*g*.7;
    col*=1.-.6*pow(distance(uv,vec2(.5)),1.6);
    gl_FragColor=vec4(col,1.);}`;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      cv.style.background = 'radial-gradient(circle at 50% 40%, #3a0713, transparent 70%)';
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, 'R');
    const uT = gl.getUniformLocation(prog, 'T');
    const uM = gl.getUniformLocation(prog, 'M');

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let mo = [0, 0];
    const fit = () => {
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
      gl.viewport(0, 0, cv.width, cv.height);
      mo = [cv.width / 2, cv.height * 0.55];
    };
    fit();
    window.addEventListener('resize', fit);
    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mo = [(e.clientX - r.left) * dpr, (r.height - (e.clientY - r.top)) * dpr];
    };
    cv.addEventListener('mousemove', onMove);

    const start = performance.now();
    let raf = 0;
    const frame = () => {
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, (performance.now() - start) / 1000);
      gl.uniform2f(uM, mo[0], mo[1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
      cv.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
