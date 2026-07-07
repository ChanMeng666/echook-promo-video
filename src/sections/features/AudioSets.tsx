import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { FaMicrophone, FaBell, FaVolumeUp } from "react-icons/fa";
import { COLORS, fontFamily } from "../../constants";
import { SoundWave } from "../../components/SoundWave";

/** Small "playing" badge shown on a theme card while its sample sound plays. */
const PlayingBadge: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: "absolute",
      top: 14,
      right: 14,
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "5px 12px",
      borderRadius: 20,
      backgroundColor: COLORS.green,
      opacity,
      boxShadow: COLORS.greenGlowSm,
    }}
  >
    <FaVolumeUp style={{ fontSize: 12, color: COLORS.black }} />
    <span style={{ fontFamily, fontSize: 12, fontWeight: 700, color: COLORS.black }}>
      playing
    </span>
  </div>
);

export const AudioSets: React.FC = () => {
  const frame = useCurrentFrame();

  const splitProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftSlide = interpolate(frame, [5, 25], [200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightSlide = interpolate(frame, [5, 25], [-200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bottomTextOpacity = interpolate(frame, [40, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Now playing" emphasis for each theme, synced to the real audio samples
  // placed in PromoVideo.tsx (voice @ global 960, chime @ global 1008).
  // Sub-scene local frame 0 == global 930, so voice ≈ local 30, chime ≈ local 78.
  const voicePulse = interpolate(frame, [28, 34, 66, 74], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chimePulse = interpolate(frame, [76, 82, 134, 142], [0, 1, 1, 0], {
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
        Audio Sets
      </div>

      {/* Split screen */}
      <div
        style={{
          display: "flex",
          gap: 60,
          alignItems: "center",
        }}
      >
        {/* ElevenLabs Voice */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            transform: `translateX(${leftSlide}px)`,
            opacity: splitProgress,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 500,
              height: 300,
              borderRadius: 16,
              border: `2px solid ${COLORS.green}`,
              backgroundColor: `${COLORS.green}08`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: 30,
              transform: `scale(${1 + voicePulse * 0.04})`,
              boxShadow: `0 0 ${voicePulse * 45}px ${COLORS.green}66`,
            }}
          >
            <PlayingBadge opacity={voicePulse} />
            <span
              style={{
                fontFamily,
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.green,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <FaMicrophone /> ElevenLabs Voice
            </span>
            <SoundWave barCount={25} width={350} height={100} />
            <span
              style={{
                fontFamily,
                fontSize: 16,
                color: COLORS.white,
                opacity: 0.6,
              }}
            >
              Says "Task completed" — Jessica voice
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 2,
            height: 250,
            backgroundColor: COLORS.green,
            opacity: splitProgress * 0.4,
            boxShadow: COLORS.greenGlowSm,
          }}
        />

        {/* UI Chimes */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            transform: `translateX(${rightSlide}px)`,
            opacity: splitProgress,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 500,
              height: 300,
              borderRadius: 16,
              border: `2px solid ${COLORS.green}`,
              backgroundColor: `${COLORS.green}08`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: 30,
              transform: `scale(${1 + chimePulse * 0.04})`,
              boxShadow: `0 0 ${chimePulse * 45}px ${COLORS.green}66`,
            }}
          >
            <PlayingBadge opacity={chimePulse} />
            <span
              style={{
                fontFamily,
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.green,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <FaBell /> UI Chimes
            </span>
            <SoundWave barCount={25} width={350} height={100} speed={0.2} color={`${COLORS.green}cc`} />
            <span
              style={{
                fontFamily,
                fontSize: 16,
                color: COLORS.white,
                opacity: 0.6,
              }}
            >
              Clean, minimal notification chime
            </span>
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
          opacity: bottomTextOpacity,
        }}
      >
        <span style={{ color: COLORS.green }}>Choose Your Sound.</span>
      </div>
    </div>
  );
};
