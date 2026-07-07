import React from "react";
import {
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { COLORS, fontFamily } from "../constants";
import { GreenGrid, ScanLine } from "../components/GreenGrid";
import { TypewriterText } from "../components/TypewriterText";

export const IntroLogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blinking cursor (frame 0-15)
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;
  const cursorOpacity =
    frame < 15
      ? cursorVisible
        ? 1
        : 0
      : interpolate(frame, [15, 30], [1, 0], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });

  // Logo animation (frame 30-75)
  const logoScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 200 },
    from: 0.8,
    to: 1,
  });

  const logoOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Particle burst (frame 60-90)
  const particleProgress = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const particleOpacity = interpolate(frame, [75, 95], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Grid fade in
  const gridOpacity = interpolate(frame, [15, 45], [0, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Version badge fade
  const versionOpacity = interpolate(frame, [95, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particles = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const distance = 120 + particleProgress * 250;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return { x, y, size: 4 + Math.random() * 4 };
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.black,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GreenGrid opacity={gridOpacity} />
      <ScanLine startFrame={15} duration={30} />

      {/* Blinking cursor at center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 48,
          color: COLORS.green,
          fontFamily: `"Courier New", monospace`,
          opacity: cursorOpacity,
          textShadow: COLORS.greenGlow,
        }}
      >
        _
      </div>

      {/* Logo */}
      <div
        style={{
          position: "relative",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        <Img
          src={staticFile("echook-logo.svg")}
          style={{
            width: 200,
            height: 200,
            filter: `drop-shadow(0 0 30px ${COLORS.green}66)`,
          }}
        />

        {/* Particle burst */}
        {frame >= 60 && frame <= 95 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
            }}
          >
            {particles.map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  backgroundColor: COLORS.green,
                  transform: `translate(${p.x}px, ${p.y}px)`,
                  opacity: particleOpacity,
                  boxShadow: `0 0 6px ${COLORS.green}`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Typewriter title */}
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <TypewriterText
          text="echook"
          startFrame={75}
          speed={3}
          fontSize={72}
          fontWeight={700}
        />
      </div>

      {/* Version badge */}
      <div
        style={{
          marginTop: 16,
          opacity: versionOpacity,
          padding: "6px 20px",
          border: `1px solid ${COLORS.green}66`,
          borderRadius: 20,
          fontFamily,
          fontSize: 18,
          color: COLORS.green,
          backgroundColor: `${COLORS.green}11`,
        }}
      >
        v6.3.3
      </div>
    </div>
  );
};
