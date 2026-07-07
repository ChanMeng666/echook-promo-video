import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { FaStar } from "react-icons/fa";
import { COLORS, fontFamily } from "../constants";
import { TypewriterBlock } from "../components/TypewriterText";
import { GlowText } from "../components/GlowText";

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blinking cursor (frame 0-30)
  const cursorOpacity = frame < 30 ? (Math.floor(frame / 15) % 2 === 0 ? 1 : 0) : 0;

  // Install commands (frame 30-75)
  const installOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // GitHub URL glow (frame 75-120)
  const urlOpacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo slide up (frame 120-150)
  const logoY = interpolate(frame, [120, 140], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Star badge
  const badgeScale = spring({
    frame: frame - 135,
    fps,
    config: { damping: 8, mass: 0.5 },
  });

  // Tagline (frame 150-180)
  const taglineOpacity = interpolate(frame, [150, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Credit (frame 180-210)
  const creditOpacity = interpolate(frame, [180, 195], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo pulse
  const logoPulse = frame > 180 ? 1 + Math.sin(frame * 0.1) * 0.03 : 1;

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
      {/* Initial blinking cursor */}
      {frame < 30 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 36,
            color: COLORS.green,
            fontFamily: `"Courier New", monospace`,
            opacity: cursorOpacity,
            textShadow: COLORS.greenGlow,
          }}
        >
          _
        </div>
      )}

      {/* Install commands */}
      {frame >= 25 && (
        <div
          style={{
            opacity: installOpacity,
            padding: "30px 50px",
            borderRadius: 12,
            border: `1px solid ${COLORS.lightGray}`,
            backgroundColor: COLORS.darkGray,
            marginBottom: 30,
          }}
        >
          <TypewriterBlock
            lines={[
              {
                text: "# tell your AI agent:",
                delay: 0,
                color: "#888",
              },
              {
                text: "> install echook for me",
                delay: 18,
                color: COLORS.green,
              },
            ]}
            startFrame={30}
            speed={1.2}
            fontSize={22}
          />
        </div>
      )}

      {/* GitHub URL with glow */}
      {frame >= 75 && (
        <div style={{ opacity: urlOpacity, marginBottom: 30 }}>
          <GlowText
            text="github.com/ChanMeng666/echook"
            fontSize={28}
            enterFrame={75}
          />
        </div>
      )}

      {/* Logo + Star badge */}
      {frame >= 120 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            transform: `translateY(${logoY}px) scale(${logoPulse})`,
            opacity: logoOpacity,
          }}
        >
          <Img
            src={staticFile("echook-logo.svg")}
            style={{
              width: 80,
              height: 80,
              filter: `drop-shadow(0 0 20px ${COLORS.green}66)`,
            }}
          />

          {/* Star on GitHub badge */}
          <div
            style={{
              transform: `scale(${badgeScale})`,
              padding: "10px 24px",
              borderRadius: 24,
              border: `2px solid ${COLORS.green}`,
              backgroundColor: `${COLORS.green}15`,
              fontFamily,
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.green,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: COLORS.greenGlowSm,
            }}
          >
            <FaStar /> Star on GitHub
          </div>
        </div>
      )}

      {/* Tagline */}
      {frame >= 150 && (
        <div
          style={{
            marginTop: 40,
            fontFamily,
            fontSize: 30,
            fontWeight: 600,
            color: COLORS.white,
            opacity: taglineOpacity,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Never miss a notification.{" "}
          <span style={{ color: COLORS.green }}>Never lose your place.</span>
        </div>
      )}

      {/* Credit */}
      {frame >= 180 && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontFamily,
            fontSize: 18,
            color: COLORS.white,
            opacity: creditOpacity,
          }}
        >
          by ChanMeng666
        </div>
      )}
    </div>
  );
};
