// Bridge @react-three/fiber v8's global JSX augmentation to React.JSX
// (R3F v8 uses `declare global { namespace JSX {...} }` but react-jsx uses React.JSX)
import type { ThreeElements } from '@react-three/fiber';
import type { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import type * as THREE from 'three';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      meshLineGeometry: {
        ref?: React.Ref<MeshLineGeometry>;
        [key: string]: unknown;
      };
      meshLineMaterial: {
        ref?: React.Ref<MeshLineMaterial>;
        color?: string | THREE.Color;
        depthTest?: boolean;
        resolution?: [number, number];
        useMap?: boolean;
        map?: THREE.Texture;
        repeat?: [number, number];
        lineWidth?: number;
        [key: string]: unknown;
      };
    }
  }
}

declare module 'react/jsx-dev-runtime' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      meshLineGeometry: {
        ref?: React.Ref<MeshLineGeometry>;
        [key: string]: unknown;
      };
      meshLineMaterial: {
        ref?: React.Ref<MeshLineMaterial>;
        color?: string | THREE.Color;
        depthTest?: boolean;
        resolution?: [number, number];
        useMap?: boolean;
        map?: THREE.Texture;
        repeat?: [number, number];
        lineWidth?: number;
        [key: string]: unknown;
      };
    }
  }
}
