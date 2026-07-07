import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { COLORS, fontFamily } from "../constants";
import { GreenGrid } from "../components/GreenGrid";
import { TypewriterText } from "../components/TypewriterText";

export const SolutionReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade to black (frame 0-15)
  const fadeOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Circle clip-path expand (frame 15-45)
  const clipRadius = interpolate(frame, [15, 45], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo bounce (frame 30-60)
  const logoScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 8 },
  });

  // Badges (frame 60-90)
  const badges = ["39 Hook Events", "Status Line", "Webhooks"];
  const badgeScales = badges.map((_, i) =>
    spring({
      frame: frame - 60 - i * 8,
      fps,
      config: { damping: 10, mass: 0.5 },
    })
  );

  // Grid and subtitle (frame 90-150)
  const gridOpacity = interpolate(frame, [90, 110], [0, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [95, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
      {/* Green circle reveal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.black,
          clipPath: `circle(${clipRadius}% at 50% 50%)`,
        }}
      >
        <GreenGrid opacity={gridOpacity} />
      </div>

      {/* Content (appears after reveal) */}
      <div
        style={{
          opacity: fadeOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ transform: `scale(${logoScale})` }}>
          <Img
            src={staticFile("echook-logo.svg")}
            style={{
              width: 160,
              height: 160,
              filter: `drop-shadow(0 0 40px ${COLORS.green}88)`,
            }}
          />
        </div>

        {/* Typewriter tagline */}
        <div style={{ marginTop: 8 }}>
          <TypewriterText
            text="Never miss a beat from your AI agent."
            startFrame={35}
            speed={1.5}
            fontSize={38}
            fontWeight={600}
            color={COLORS.white}
            showCursor={false}
          />
        </div>

        {/* Floating badges */}
        <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
          {badges.map((badge, i) => (
            <div
              key={badge}
              style={{
                transform: `scale(${badgeScales[i]})`,
                padding: "12px 28px",
                borderRadius: 30,
                border: `2px solid ${COLORS.green}`,
                backgroundColor: `${COLORS.green}15`,
                fontFamily,
                fontSize: 20,
                fontWeight: 600,
                color: COLORS.green,
                boxShadow: COLORS.greenGlowSm,
              }}
            >
              {badge}
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 30,
            fontFamily,
            fontSize: 24,
            color: COLORS.white,
            opacity: subtitleOpacity * 0.7,
            fontWeight: 400,
          }}
        >
          For Claude Code, Cursor &amp; Codex CLI
        </div>
      </div>
    </div>
  );
};
