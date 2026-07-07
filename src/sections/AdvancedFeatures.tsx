import React from "react";
import {
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import {
  FaSlack,
  FaDiscord,
  FaMicrosoft,
  FaBell,
} from "react-icons/fa";
import { COLORS, fontFamily } from "../constants";

const SUB_SCENE_DURATION = 180;

// Context-window states mirror the product's status-line color coding.
const YELLOW = "#FFC400";

/* ── Sub-scene A: Status Line ── */
const StatusLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Screenshot scale-in
  const imgScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15 },
  });

  // Screenshot glow pulse
  const glowPulse = Math.sin(frame * 0.08) * 0.4 + 0.6;

  const textOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chipsOpacity = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const states = [
    { color: COLORS.green, label: "Safe", range: "< 50%" },
    { color: YELLOW, label: "Watch", range: "50–80%" },
    { color: COLORS.red, label: "Compact", range: "> 80%" },
  ];

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
        Status Line
      </div>

      {/* Vertical stack: wide screenshot on top, text + states below */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
        }}
      >
        {/* Real status-line screenshot (wide strip, as seen in the terminal) */}
        <div
          style={{
            transform: `scale(${Math.min(imgScale, 1)})`,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 ${34 * glowPulse}px ${COLORS.green}44`,
          }}
        >
          <Img
            src={staticFile("statusline-context-monitor.png")}
            style={{
              width: 1180,
              height: "auto",
              display: "block",
              borderRadius: 12,
              border: `2px solid ${COLORS.green}44`,
            }}
          />
        </div>

        {/* Heading */}
        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.white,
            opacity: textOpacity,
            textAlign: "center",
          }}
        >
          Never lose your <span style={{ color: COLORS.green }}>place.</span>
        </div>

        {/* Body */}
        <div
          style={{
            fontFamily,
            fontSize: 18,
            color: COLORS.white,
            opacity: textOpacity * 0.6,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          A live status line pins context-window usage, quota, and git state to your terminal.
        </div>

        {/* Context-state indicators + segment count */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            opacity: chipsOpacity,
          }}
        >
          {states.map((state, i) => {
            const scale = spring({
              frame: frame - 85 - i * 8,
              fps,
              config: { damping: 10, mass: 0.5 },
            });
            return (
              <div
                key={state.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transform: `scale(${scale})`,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: state.color,
                    boxShadow: `0 0 14px ${state.color}aa`,
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily,
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.white,
                      opacity: 0.9,
                    }}
                  >
                    {state.label}
                  </span>
                  <span
                    style={{
                      fontFamily,
                      fontSize: 12,
                      color: COLORS.white,
                      opacity: 0.5,
                    }}
                  >
                    {state.range}
                  </span>
                </div>
              </div>
            );
          })}

          <div
            style={{
              fontFamily,
              fontSize: 14,
              color: COLORS.green,
              letterSpacing: 1,
              borderLeft: `1px solid ${COLORS.green}44`,
              paddingLeft: 40,
            }}
          >
            29 customizable segments
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Sub-scene B: Webhooks ── */
const Webhooks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const services = [
    { icon: <FaSlack />, label: "Slack", color: "#E01E5A" },
    { icon: <FaDiscord />, label: "Discord", color: "#5865F2" },
    { icon: <FaMicrosoft />, label: "Teams", color: "#6264A7" },
    { icon: <FaBell />, label: "ntfy.sh", color: COLORS.green },
  ];

  const textOpacity = interpolate(frame, [50, 65], [0, 1], {
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
        Webhooks
      </div>

      <div style={{ display: "flex", gap: 50 }}>
        {services.map((svc, i) => {
          const scale = spring({
            frame: frame - 10 - i * 10,
            fps,
            config: { damping: 10, mass: 0.6 },
          });

          const labelOpacity = interpolate(frame, [15 + i * 10, 25 + i * 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={svc.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transform: `scale(${scale})`,
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 20,
                  border: `2px solid ${svc.color}88`,
                  backgroundColor: `${svc.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  color: svc.color,
                  boxShadow: `0 0 20px ${svc.color}33`,
                }}
              >
                {svc.icon}
              </div>
              <span
                style={{
                  fontFamily,
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.white,
                  opacity: labelOpacity,
                }}
              >
                {svc.label}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 50,
          fontFamily,
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.white,
          opacity: textOpacity,
          textAlign: "center",
        }}
      >
        Get notified anywhere.{" "}
        <span style={{ color: COLORS.green }}>Even on your phone.</span>
      </div>
    </div>
  );
};

/* ── Main AdvancedFeatures orchestrator (Status Line + Webhooks) ── */
export const AdvancedFeatures: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Sequence durationInFrames={SUB_SCENE_DURATION}>
        <StatusLine />
      </Sequence>
      <Sequence from={SUB_SCENE_DURATION} durationInFrames={SUB_SCENE_DURATION}>
        <Webhooks />
      </Sequence>
    </div>
  );
};
