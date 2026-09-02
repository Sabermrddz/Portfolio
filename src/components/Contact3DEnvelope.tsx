import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";

type SceneState = "idle" | "typing" | "sending" | "success";

function EnvelopeModel({ state }: { state: SceneState }) {
  const groupRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Mesh>(null);
  const paperRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  const paperUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const flapGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.73, 0.47);
    shape.lineTo(0.73, 0.47);
    shape.lineTo(0, -0.015);
    shape.lineTo(-0.73, 0.47);
    const geo = new THREE.ShapeGeometry(shape);
    geo.translate(0, -0.47, 0);
    return geo;
  }, []);

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf4f1ea,
        roughness: 0.78,
        metalness: 0.05,
      }),
    []
  );
  const flapMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xe9e2d4,
        roughness: 0.86,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((st) => {
    const t = st.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.22) * 0.13;
      groupRef.current.rotation.x = Math.sin(t * 0.31 + 0.6) * 0.04;
      groupRef.current.rotation.z = Math.sin(t * 0.18) * 0.025;
    }

    let flapTarget = 0.05;
    let paperY = 0.14;
    let paperZ = 0.01;
    let glowOpacity = 0.07;
    let beamOpacity = 0;
    let beamX = 0;

    if (state === "idle") {
      flapTarget = 0.06;
      paperY = 0.14;
      glowOpacity = 0.06 + Math.sin(t * 0.8) * 0.015;
    } else if (state === "typing") {
      flapTarget = 0.85;
      paperY = 0.36;
      paperZ = 0.02;
      glowOpacity = 0.11;
    } else if (state === "sending") {
      flapTarget = -0.18;
      paperY = 0.1;
      glowOpacity = 0.16;
      beamOpacity = 0.55 + Math.sin(t * 18) * 0.12;
      beamX = Math.sin(t * 6) * 0.02;
    } else if (state === "success") {
      flapTarget = 1.18;
      paperY = 0.56 + Math.sin(t * 1.1) * 0.015;
      paperZ = 0.055;
      glowOpacity = 0.14;
    }

    if (flapRef.current) {
      flapRef.current.rotation.x = THREE.MathUtils.lerp(flapRef.current.rotation.x, flapTarget, 0.06);
    }
    if (paperRef.current) {
      paperRef.current.position.y = THREE.MathUtils.lerp(paperRef.current.position.y, paperY, 0.07);
      paperRef.current.position.z = THREE.MathUtils.lerp(paperRef.current.position.z, paperZ, 0.07);
      if (state === "success") {
        paperRef.current.rotation.z = Math.sin(t * 0.9) * 0.02;
      } else {
        paperRef.current.rotation.z = THREE.MathUtils.lerp(paperRef.current.rotation.z, 0, 0.08);
      }
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, glowOpacity, 0.05);
      glowRef.current.scale.setScalar(1 + Math.sin(t * 0.7) * 0.015);
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, beamOpacity, 0.12);
      beamRef.current.position.x = THREE.MathUtils.lerp(beamRef.current.position.x, beamX, 0.1);
      beamRef.current.scale.y = 1 + Math.sin(t * 20) * 0.04;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.14;
      const s = 1 + Math.sin(t * 0.9) * 0.012;
      ring1Ref.current.scale.setScalar(s);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.13 + Math.sin(t * 1.1) * 0.025;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.11;
      const s = 1 + Math.sin(t * 0.9 + 1.1) * 0.016;
      ring2Ref.current.scale.setScalar(s);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.07;
      const s = 1 + Math.sin(t * 0.9 + 2.2) * 0.01;
      ring3Ref.current.scale.setScalar(s);
    }

    paperUniforms.uTime.value = t;

    st.camera.position.x = Math.sin(t * 0.08) * 0.12;
    st.camera.position.y = 0.15 + Math.cos(t * 0.11) * 0.04;
    st.camera.lookAt(0, 0.06, 0);
  });

  return (
    <>
      <ambientLight intensity={0.92} />
      <directionalLight position={[2.2, 3.2, 2]} intensity={1.25} />
      <pointLight position={[-1.8, 1.2, 1.6]} intensity={1.35} color="#a78bfa" />
      <pointLight position={[1.9, -0.3, 1.5]} intensity={1.0} color="#fbbf24" />
      <pointLight position={[0, 1.6, -1.9]} intensity={0.85} color="#ffffff" />

      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.55} floatingRange={[-0.055, 0.055]}>
        <group ref={groupRef}>
          <mesh material={bodyMat} position={[0, 0.06, 0.04]}>
            <boxGeometry args={[1.46, 0.94, 0.07]} />
          </mesh>

          <mesh ref={glowRef} position={[0, 0.06, -0.11]}>
            <planeGeometry args={[2.05, 1.34]} />
            <meshBasicMaterial color="#a78bfa" transparent opacity={0.07} depthWrite={false} />
          </mesh>

          <mesh ref={paperRef} position={[0, 0.14, 0.016]}>
            <planeGeometry args={[1.08, 0.68]} />
            <shaderMaterial
              transparent
              uniforms={paperUniforms}
              vertexShader={`
                varying vec2 vUv;
                void main(){
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
                }
              `}
              fragmentShader={`
                uniform float uTime;
                varying vec2 vUv;
                void main(){
                  vec3 paper = vec3(1.0);
                  float scan = sin((vUv.y* 220. - uTime* 18.)) * 0.015;
                  float sheen = smoothstep(0.0, 0.8, vUv.y) * 0.03 * sin(uTime*1.7 + vUv.x*8.);
                  vec3 col = paper + scan + sheen;
                  float lines = step(0.97, sin(vUv.y* 48.)) * 0.06;
                  col -= lines * vec3(0.08,0.07,0.05);
                  float alpha = 0.98 - smoothstep(0.82,1., length(vUv-0.5)*1.6)*0.12;
                  gl_FragColor = vec4(col, alpha);
                }
              `}
            />
          </mesh>

          <mesh ref={flapRef} geometry={flapGeometry} material={flapMat} position={[0, 0.53, 0.076]} />

          <mesh position={[0, 0.06, 0.076]}>
            <planeGeometry args={[1.46, 0.94]} />
            <meshBasicMaterial transparent opacity={0.035} color="#ffffff" depthWrite={false} />
          </mesh>
        </group>
      </Float>

      <mesh ref={ring1Ref} position={[0, 0.06, 0]} rotation={[Math.PI / 2.22, 0, 0]}>
        <torusGeometry args={[1.31, 0.009, 14, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.13} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0.06, 0]} rotation={[Math.PI / 2.05, 0.2, 0]}>
        <torusGeometry args={[1.51, 0.0045, 12, 128]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.14} />
      </mesh>
      <mesh ref={ring3Ref} position={[0, 0.06, 0]} rotation={[Math.PI / 1.95, -0.18, 0]}>
        <torusGeometry args={[1.67, 0.0025, 10, 128]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.09} />
      </mesh>

      <mesh ref={beamRef} position={[0, 0.06, 0.11]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 2.9, 16, 1, true]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0} depthWrite={false} />
      </mesh>

      <ContactShadows position={[0, -0.68, 0]} opacity={0.28} scale={3.4} blur={2.6} far={1.4} color="#000000" />
      <Sparkles count={48} scale={[3.2, 1.6, 2.2]} size={1.15} speed={0.28} noise={0.22} color="#a78bfa" />
      <Sparkles count={28} scale={[3.4, 1.7, 2.4]} size={0.7} speed={0.18} noise={0.18} color="#f4f1ea" />
    </>
  );
}

export default function Contact3DEnvelope({
  state = "idle",
  reducedMotion = false,
}: {
  state?: SceneState;
  reducedMotion?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[1.05rem] border border-white/[0.06] bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(167,139,250,0.09),transparent_62%),radial-gradient(ellipse_70%_55%_at_88%_92%,rgba(251,191,36,0.07),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.008))] backdrop-blur-[2px]"
      style={{ height: "clamp(280px, 36vw, 400px)" }}
      aria-label="3D envelope portal"
      role="img"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 3.38], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
          gl.setClearColor(0x000000, 0);
        }}
        style={{ display: "block" }}
      >
        {!reducedMotion ? <EnvelopeModel state={state} /> : <group></group>}
        {reducedMotion && (
          <>
            <ambientLight intensity={0.9} />
            <directionalLight position={[2, 2, 2]} intensity={1} />
            <mesh position={[0, 0.06, 0.04]}>
              <boxGeometry args={[1.46, 0.94, 0.07]} />
              <meshStandardMaterial color="#f4f1ea" />
            </mesh>
          </>
        )}
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 88% 68% at 50% 42%, transparent 42%, rgba(5,5,7,0.55) 88%), linear-gradient(180deg, rgba(167,139,250,0.04), transparent 55%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.22]" />

      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/[0.08] bg-void/60 px-2.5 py-1.5 backdrop-blur-md sm:left-4 sm:top-4">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
        </span>
        <span className="font-mono text-[0.52rem] font-semibold tracking-[0.18em] text-paper/80">
          {state === "idle" && "STANDBY • READY"}
          {state === "typing" && "COMPOSING • ENCRYPTING"}
          {state === "sending" && "TRANSMITTING • SEALED"}
          {state === "success" && "DELIVERED • ✓"}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/[0.07] bg-void/55 px-3 py-1.5 backdrop-blur-md">
        <span className="h-1 w-1 rounded-full bg-paper/60" />
        <span className="font-mono text-[0.5rem] tracking-[0.18em] text-paper/60">DRAG TO ORBIT • AUTO ANIMATED</span>
      </div>

      <p className="sr-only">3D envelope — changes with form interaction: idle, typing, sending, success</p>
    </div>
  );
}
