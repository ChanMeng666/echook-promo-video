import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, fontFamily } from "../constants";
import { PlatformIcon } from "../components/PlatformIcon";
import { CounterNumber } from "../components/CounterNumber";

const platforms = ["claudeCode", "cursor", "codex"];

export const CrossPlatform: React.FC = () => {
  const frame = useCurrentFrame();

  // Platform icons row slides up
  const rowY = interpolate(frame, [60, 80], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Connecting line (frame 120-180)
  const lineWidth = interpolate(frame, [120, 160], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bottomTextOpacity = interpolate(frame, [140, 160], [0, 1], {
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
      {/* Editor icons */}
      <div
        style={{
          display: "flex",
          gap: 100,
          transform: `translateY(${rowY}px)`,
        }}
      >
        {platforms.map((platform, i) => (
          <PlatformIcon
            key={platform}
            platform={platform}
            enterFrame={i * 8}
            size={160}
          />
        ))}
      </div>

      {/* Connecting line */}
      {frame >= 120 && (
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "10%",
            width: `${lineWidth * 0.8}%`,
            height: 2,
            backgroundColor: COLORS.green,
            opacity: 0.3,
            boxShadow: COLORS.greenGlowSm,
          }}
        />
      )}

      {/* Animated counters (frame 60-120) */}
      {frame >= 60 && (
        <div
          style={{
            display: "flex",
            gap: 80,
            marginTop: 80,
          }}
        >
          <CounterNumber
            target={3}
            startFrame={60}
            duration={20}
            label="AI Editors"
          />
          <CounterNumber
            target={39}
            startFrame={70}
            duration={25}
            label="Hook Events"
          />
          <CounterNumber
            target={2}
            startFrame={80}
            duration={15}
            label="Audio Sets"
          />
          <CounterNumber
            target={4}
            startFrame={85}
            duration={20}
            label="Channels"
          />
        </div>
      )}

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontFamily,
          fontSize: 36,
          fontWeight: 700,
          color: COLORS.white,
          opacity: bottomTextOpacity,
        }}
      >
        Works everywhere{" "}
        <span style={{ color: COLORS.green }}>you code.</span>
      </div>
    </div>
  );
};
