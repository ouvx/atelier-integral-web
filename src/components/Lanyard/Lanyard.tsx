import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
  useRopeJoint,
  useSphericalJoint
} from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import cardGlb from './card.glb';
import lanyardPng from './lanyard.png';
import logoSvgUrl from '../../assets/logo.svg';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

useGLTF.preload(cardGlb);

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };

// Runtime-extended RigidBody with lerped translation for rope smoothing
type LerpedRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 };

function useLogoTexture(): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      try {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#fffaf1';
        ctx.fillRect(0, 0, size, size);
        const pad = Math.round(size * 0.14);
        ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
        const t = new THREE.CanvasTexture(canvas);
        t.colorSpace = THREE.SRGBColorSpace;
        t.needsUpdate = true;
        setTex(t);
      } catch (_) { /* SVG canvas draw may fail in some browsers */ }
    };
    img.src = logoSvgUrl;
  }, []);
  return tex;
}

const SEG_PROPS = {
  type: 'dynamic' as const,
  canSleep: true,
  colliders: false as const,
  angularDamping: 4,
  linearDamping: 4
};

interface BandProps {
  isMobile?: boolean;
  lowQuality?: boolean;
}

function Band({ isMobile = false, lowQuality = false }: BandProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bandRef = useRef<any>(null);
  const fixed = useRef<LerpedRigidBody>(null);
  const j1 = useRef<LerpedRigidBody>(null);
  const j2 = useRef<LerpedRigidBody>(null);
  const j3 = useRef<LerpedRigidBody>(null);
  const card = useRef<LerpedRigidBody>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ]),
    []
  );

  const { nodes, materials } = useGLTF(cardGlb) as ReturnType<typeof useGLTF> & {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshStandardMaterial>;
  };
  const lanyardTex = useTexture(lanyardPng);
  const logoTex = useLogoTexture();

  const cardMap = useMemo(() => {
    const baseMap = materials?.base?.map;
    if (!baseMap) return null;
    if (!logoTex?.image) return baseMap;

    const baseImg = baseMap.image as HTMLImageElement | HTMLCanvasElement;
    const W = (baseImg as HTMLCanvasElement).width;
    const H = (baseImg as HTMLCanvasElement).height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;

    ctx.drawImage(baseImg, 0, 0, W, H);

    const rect = FRONT_UV_RECT;
    const rx = rect.x * W;
    const ry = rect.y * H;
    const rw = rect.w * W;
    const rh = rect.h * H;
    const img = logoTex.image as HTMLImageElement;
    const scale = Math.min(rw / img.width, rh / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = rx + (rw - dw) / 2;
    const dy = ry + (rh - dh) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [materials?.base?.map, logoTex]);

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = ''; };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z
      });
    }

    if (fixed.current) {
      [j1, j2].forEach((r) => {
        if (!r.current) return;
        if (!r.current.lerped) {
          r.current.lerped = new THREE.Vector3().copy(r.current.translation() as THREE.Vector3);
        }
        const dist = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation() as THREE.Vector3)));
        r.current.lerped.lerp(r.current.translation() as THREE.Vector3, delta * (0 + dist * (50 - 0)));
      });

      if (bandRef.current && j3.current && j2.current && j1.current) {
        curve.points[0].copy(j3.current.translation() as THREE.Vector3);
        curve.points[1].copy(j2.current.lerped!);
        curve.points[2].copy(j1.current.lerped!);
        curve.points[3].copy(fixed.current.translation() as THREE.Vector3);
        bandRef.current.geometry.setPoints(curve.getPoints(lowQuality ? 16 : 32));
      }

      if (card.current) {
        ang.copy(card.current.angvel() as THREE.Vector3);
        rot.copy(card.current.rotation() as unknown as THREE.Vector3);
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
      }
    }
  });

  curve.curveType = 'chordal';
  lanyardTex.wrapS = THREE.RepeatWrapping;
  lanyardTex.wrapT = THREE.RepeatWrapping;
  lanyardTex.repeat.set(1, 1);

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...SEG_PROPS} type="fixed" />
        <RigidBody ref={j1} {...SEG_PROPS} position={[0.5, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j2} {...SEG_PROPS} position={[1, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j3} {...SEG_PROPS} position={[1.5, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          {...SEG_PROPS}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          position={[2, 0, 0]}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation() as THREE.Vector3)));
            }}
          >
            {nodes.card?.geometry && (
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardMap}
                  map-anisotropy={16}
                  clearcoat={lowQuality ? 0 : 1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              </mesh>
            )}
            {nodes.clip?.geometry && (
              <mesh
                geometry={nodes.clip.geometry}
                material={materials.metal}
                material-roughness={0.3}
              />
            )}
            {nodes.clamp?.geometry && (
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            )}
          </group>
        </RigidBody>
      </group>

      <mesh ref={bandRef}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={lanyardTex}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

interface SceneProps {
  isMobile: boolean;
  lowQuality: boolean;
}

function Scene({ isMobile, lowQuality }: SceneProps) {
  return (
    <>
      <ambientLight intensity={Math.PI} />
      <Physics interpolate gravity={[0, -40, 0]} timeStep={lowQuality ? 1 / 30 : 1 / 60}>
        <Band isMobile={isMobile} lowQuality={lowQuality} />
      </Physics>
      <Environment blur={0.75}>
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </>
  );
}

export default function Lanyard() {
  const isWindows = /Windows/i.test(`${navigator.userAgent} ${navigator.platform}`);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const lowQuality = isMobile || isWindows;

  return (
    <div className="lanyard-canvas-wrap">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 20 }}
        dpr={[1, lowQuality ? 1 : 2]}
        gl={{ alpha: true, antialias: !lowQuality }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} lowQuality={lowQuality} />
        </Suspense>
      </Canvas>
    </div>
  );
}
