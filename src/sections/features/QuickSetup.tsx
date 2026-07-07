import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../../constants";
import { Terminal } from "../../components/Terminal";
import { TypewriterText } from "../../components/TypewriterText";

export const QuickSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress bar
  const progressWidth = interpolate(frame, [15, 55], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge scale-in
  const badgeScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12 },
  });

  // Secondary caption
  const captionOpacity = interpolate(frame, [60, 70], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Done text
  const doneOpacity = interpolate(frame, [70, 82], [0, 1], {
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
      }}
    >
      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          fontFamily,
          fontSize: 20,
          color: COLORS.green,
          opacity: 0.6,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Setup
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <Terminal title="bash — claude" width={780} height={300} enterFrame={0}>
          {/* Your agent runs these */}
          <div>
            <span style={{ color: COLORS.green, fontSize: 14, fontWeight: 600 }}>
              # Install via plugin marketplace
            </span>
          </div>
          <div style={{ marginTop: 6 }}>
            <span style={{ color: "#888" }}>$ </span>
            <TypewriterText
              text="claude plugin marketplace add ChanMeng666/echook"
              startFrame={5}
              speed={1.6}
              fontSize={16}
              showCursor={false}
            />
          </div>
          {frame > 28 && (
            <div style={{ marginTop: 6 }}>
              <span style={{ color: "#888" }}>$ </span>
              <TypewriterText
                text="claude plugin install audio-hooks@chanmeng-audio-hooks"
                startFrame={28}
                speed={1.6}
                fontSize={16}
                showCursor={false}
              />
            </div>
          )}

          {/* The one human step */}
          {frame > 52 && (
            <div style={{ marginTop: 16 }}>
              <span style={{ color: "#666", fontSize: 13 }}>
                # once, in the Claude Code REPL:
              </span>
            </div>
          )}
          {frame > 56 && (
            <div style={{ marginTop: 4 }}>
              <span style={{ color: "#888" }}>&gt; </span>
              <TypewriterText
                text="/reload-plugins"
                startFrame={56}
                speed={1.5}
                fontSize={16}
                showCursor={false}
              />
            </div>
          )}

          {/* Progress bar */}
          {frame > 15 && (
            <div
              style={{
                marginTop: 20,
                width: "100%",
                height: 6,
                backgroundColor: COLORS.lightGray,
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  width: `${progressWidth}%`,
                  height: "100%",
                  backgroundColor: COLORS.green,
                  borderRadius: 3,
                  boxShadow: `0 0 10px ${COLORS.green}88`,
                }}
              />
            </div>
          )}
        </Terminal>

        {/* AI-operated badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              transform: `scale(${badgeScale})`,
              width: 130,
              height: 130,
              borderRadius: "50%",
              border: `3px solid ${COLORS.green}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              color: COLORS.green,
              textShadow: COLORS.greenGlow,
              gap: 2,
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>1</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>command</span>
          </div>

          <div
            style={{
              opacity: captionOpacity,
              fontFamily,
              fontSize: 16,
              color: COLORS.white,
              maxWidth: 180,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Then plain English forever
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontFamily,
          fontSize: 32,
          fontWeight: 700,
          color: COLORS.white,
          opacity: doneOpacity,
        }}
      >
        Point your agent at it.{" "}
        <span style={{ color: COLORS.green }}>Speak plain English.</span>
      </div>
    </div>
  );
};
