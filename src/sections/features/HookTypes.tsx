import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import {
  FaBell,
  FaCheckCircle,
  FaUserFriends,
  FaShieldAlt,
  FaBan,
  FaPlusCircle,
  FaPlus,
} from "react-icons/fa";
import { COLORS, fontFamily } from "../../constants";

const essentialHooks: { name: string; icon: React.ReactNode }[] = [
  { name: "Notification", icon: <FaBell /> },
  { name: "Stop", icon: <FaCheckCircle /> },
  { name: "SubagentStop", icon: <FaUserFriends /> },
  { name: "Permission", icon: <FaShieldAlt /> },
  { name: "PermissionDenied", icon: <FaBan /> },
  { name: "TaskCreated", icon: <FaPlusCircle /> },
];

const optionalHookNames = [
  "TaskCompleted", "SessionStart", "SessionEnd",
  "PreToolUse", "PostToolUse", "PostToolUseFailure",
  "UserPromptSubmit", "SubagentStart", "PreCompact",
  "PostCompact", "StopFailure", "TeammateIdle",
  "ConfigChange", "InstructionsLoaded",
  "WorktreeCreate", "WorktreeRemove",
  "Elicitation", "ElicitationResult",
  "CwdChanged", "FileChanged", "Setup",
  "UserPromptExpansion", "PostToolBatch", "MessageDisplay",
  "ShellBefore", "ShellAfter", "McpBefore", "McpAfter",
  "FileRead", "AgentResponse", "AgentThinking",
  "WorkspaceOpen", "TabFileEdit",
];

export const HookTypes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Essential label
  const labelOpacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Optional hooks reveal
  const optionalOpacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Plus icon scale
  const plusScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 8, mass: 0.5 },
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
        Hook Types
      </div>

      {/* Essential hooks row */}
      <div
        style={{
          opacity: labelOpacity,
          fontFamily,
          fontSize: 16,
          color: COLORS.green,
          marginBottom: 16,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        6 Enabled by Default
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
          maxWidth: 720,
          marginBottom: 30,
        }}
      >
        {essentialHooks.map((hook, i) => {
          const scale = spring({
            frame: frame - 10 - i * 5,
            fps,
            config: { damping: 10, mass: 0.5 },
          });

          return (
            <div
              key={hook.name}
              style={{
                width: 220,
                height: 80,
                borderRadius: 12,
                border: `2px solid ${COLORS.green}`,
                backgroundColor: `${COLORS.green}15`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 16px",
                transform: `scale(${scale})`,
                boxShadow: COLORS.greenGlowSm,
              }}
            >
              <span style={{ fontSize: 22, color: COLORS.green, display: "flex" }}>
                {hook.icon}
              </span>
              <span
                style={{
                  fontFamily,
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.white,
                }}
              >
                {hook.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Plus icon + "18 Optional" */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          transform: `scale(${plusScale})`,
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 24, color: COLORS.green, display: "flex" }}>
          <FaPlus />
        </span>
        <span
          style={{
            fontFamily,
            fontSize: 20,
            fontWeight: 600,
            color: COLORS.white,
          }}
        >
          33 Optional Hooks
        </span>
      </div>

      {/* Optional hooks compact grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          maxWidth: 900,
          justifyContent: "center",
          opacity: optionalOpacity,
        }}
      >
        {optionalHookNames.map((name) => (
          <div
            key={name}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: `1px solid ${COLORS.green}44`,
              backgroundColor: `${COLORS.green}08`,
              fontFamily,
              fontSize: 13,
              color: `${COLORS.green}cc`,
              fontWeight: 500,
            }}
          >
            {name}
          </div>
        ))}
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
          opacity: interpolate(frame, [55, 65], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: COLORS.green }}>39</span> Hook Events. Complete Lifecycle Coverage.
      </div>
    </div>
  );
};
