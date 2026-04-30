import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { Skill, SKILLS } from "../data/skills";
import { useKeyboardSounds } from "./utils/use-keyboard-sounds";

const SKILL_LIST = Object.values(SKILLS);
const COLS = 5;
const ROWS = 5;
const SPACING = 1.05;
const KEYCAP_SIZE: [number, number, number] = [0.95, 0.55, 0.95];
const NATURAL_Y = 0;
const DROP_FROM_Y = 6;

// Imperative texture loading: skip Suspense so a single bad URL doesn't
// black-out the whole scene. Each texture resolves independently; failures
// just leave the keycap blank-topped instead of breaking the render.
function useSkillTextures() {
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>(() =>
    Array(SKILL_LIST.length).fill(null)
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const created: THREE.Texture[] = [];

    SKILL_LIST.forEach((skill, i) => {
      loader.load(
        skill.icon,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          created.push(tex);
          setTextures((prev) => {
            const next = prev.slice();
            next[i] = tex;
            return next;
          });
        },
        undefined,
        () => {
          // load failed; leave the slot null
        }
      );
    });

    return () => {
      created.forEach((t) => t.dispose());
    };
  }, []);

  return textures;
}

type KeycapProps = {
  skill: Skill;
  texture: THREE.Texture | null;
  index: number;
  hovered: boolean;
  pressed: boolean;
  animateIn: boolean;
  onHover: (s: Skill) => void;
  onUnhover: (s: Skill) => void;
  onPress: (s: Skill) => void;
};

function Keycap({
  skill,
  texture,
  index,
  hovered,
  pressed,
  animateIn,
  onHover,
  onUnhover,
  onPress,
}: KeycapProps) {
  const groupRef = useRef<THREE.Group>(null);
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const x = (col - (COLS - 1) / 2) * SPACING;
  const z = (row - (ROWS - 1) / 2) * SPACING;

  useEffect(() => {
    if (!groupRef.current) return;
    if (animateIn) {
      gsap.fromTo(
        groupRef.current.position,
        { y: NATURAL_Y + DROP_FROM_Y },
        {
          y: NATURAL_Y,
          duration: 0.6,
          delay: index * 0.04,
          ease: "bounce.out",
        }
      );
    }
  }, [animateIn, index]);

  useFrame(() => {
    if (!groupRef.current) return;
    const lift = hovered && !pressed ? 0.25 : 0;
    const depress = pressed ? -0.08 : 0;
    const targetY = NATURAL_Y + lift + depress;
    groupRef.current.position.y +=
      (targetY - groupRef.current.position.y) * 0.2;
  });

  return (
    <group
      ref={groupRef}
      position={[x, NATURAL_Y + DROP_FROM_Y, z]}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onHover(skill);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        onUnhover(skill);
        document.body.style.cursor = "auto";
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPress(skill);
      }}
    >
      <RoundedBox
        args={KEYCAP_SIZE}
        radius={0.08}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={skill.color}
          metalness={0.25}
          roughness={0.45}
        />
      </RoundedBox>
      {texture && (
        <mesh
          position={[0, KEYCAP_SIZE[1] / 2 + 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.62, 0.62]} />
          <meshBasicMaterial map={texture} transparent />
        </mesh>
      )}
    </group>
  );
}

type SceneProps = {
  hoveredName: string | null;
  pressedName: string | null;
  animateIn: boolean;
  onHover: (s: Skill) => void;
  onUnhover: (s: Skill) => void;
  onPress: (s: Skill) => void;
};

function Scene({
  hoveredName,
  pressedName,
  animateIn,
  onHover,
  onUnhover,
  onPress,
}: SceneProps) {
  const textures = useSkillTextures();
  const { size } = useThree();
  // Shrink the keyboard for narrow viewports so all 5 columns stay on screen.
  // size.width is the canvas pixel width.
  const responsiveScale =
    size.width < 480 ? 0.36 : size.width < 768 ? 0.45 : 0.6;

  return (
    <group
      rotation={[Math.PI / 6, Math.PI / 10, 0]}
      position={[0, -0.3, 0]}
      scale={responsiveScale}
    >
      <RoundedBox
        args={[COLS * SPACING + 0.6, 0.55, ROWS * SPACING + 0.6]}
        position={[0, -0.45, 0]}
        radius={0.18}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#19191c"
          metalness={0.55}
          roughness={0.45}
        />
      </RoundedBox>
      {SKILL_LIST.map((skill, i) => (
        <Keycap
          key={skill.name}
          skill={skill}
          texture={textures[i]}
          index={i}
          hovered={hoveredName === skill.name}
          pressed={pressedName === skill.name}
          animateIn={animateIn}
          onHover={onHover}
          onUnhover={onUnhover}
          onPress={onPress}
        />
      ))}
    </group>
  );
}

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [pressedSkill, setPressedSkill] = useState<Skill | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const { playPressSound } = useKeyboardSounds();
  const pressTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateIn(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const onHover = (skill: Skill) => {
    setHoveredSkill((prev) => (prev?.name === skill.name ? prev : skill));
    playPressSound();
  };
  const onUnhover = (skill: Skill) => {
    setHoveredSkill((prev) => (prev?.name === skill.name ? null : prev));
  };
  const onPress = (skill: Skill) => {
    playPressSound();
    setPressedSkill(skill);
    if (pressTimeoutRef.current) window.clearTimeout(pressTimeoutRef.current);
    pressTimeoutRef.current = window.setTimeout(
      () => setPressedSkill(null),
      200
    );
  };

  return (
    <div className="techstack" ref={sectionRef}>
      <div className="techstack-header">
        <h2>Tech Stack</h2>
        <p className="techstack-hint">(hover a key)</p>
      </div>
      {hoveredSkill && (
        <div className="techstack-tooltip" key={hoveredSkill.name}>
          <h3 style={{ color: hoveredSkill.color }}>{hoveredSkill.label}</h3>
          <p>{hoveredSkill.shortDescription}</p>
        </div>
      )}
      <div className="techstack-canvas">
        <Canvas
          shadows
          camera={{ position: [0, 5, 6.5], fov: 30 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[5, 9, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />
          <pointLight
            position={[-5, 5, -5]}
            intensity={0.35}
            color="#aaccff"
          />
          <Scene
            hoveredName={hoveredSkill?.name ?? null}
            pressedName={pressedSkill?.name ?? null}
            animateIn={animateIn}
            onHover={onHover}
            onUnhover={onUnhover}
            onPress={onPress}
          />
          <Environment preset="city" />
        </Canvas>
      </div>
    </div>
  );
};

export default TechStack;
