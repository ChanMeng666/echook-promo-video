import React from "react";
import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { DURATIONS, TOTAL_FRAMES } from "./constants";
import { IntroLogoReveal } from "./sections/IntroLogoReveal";
import { ProblemStatement } from "./sections/ProblemStatement";
import { SolutionReveal } from "./sections/SolutionReveal";
import { FeatureHighlights } from "./sections/FeatureHighlights";
import { AdvancedFeatures } from "./sections/AdvancedFeatures";
import { DemoShowcase } from "./sections/DemoShowcase";
import { Ecosystem } from "./sections/Ecosystem";
import { CrossPlatform } from "./sections/CrossPlatform";
import { CallToAction } from "./sections/CallToAction";

/*
 * ── Global timeline (effective frame positions with transition overlaps) ──
 *
 * Section 1 (Intro):             0 –  149
 * Section 2 (Problem):         130 –  339
 * Section 3 (Solution):        320 –  649
 * Section 4 (Features):        630 – 1229
 *   4A QuickSetup:             630 –  779
 *   4B HookTypes:              780 –  929
 *   4C AudioSets:              930 – 1079
 *   4D OpenSource:            1080 – 1229
 * Section 5 (AdvancedFeatures):1210 – 1569
 *   5A StatusLine:            1210 – 1389
 *   5B Webhooks:              1390 – 1569
 * Section 6 (Demo):          1550 – 1909
 * Section 7 (Ecosystem):     1890 – 2129
 * Section 8 (CrossPlatform): 2110 – 2379
 * Section 9 (CTA):           2360 – 2659
 */

/**
 * Background music with auto fade-in/out and ducking.
 */
const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [TOTAL_FRAMES - 45, TOTAL_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Duck during demo video (section 6: 1550-1909)
  const demoDuck = interpolate(
    frame,
    [1535, 1550, 1909, 1925],
    [1, 0.12, 0.12, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Duck during VO reveal (solution section, global 355–602, ~8.2s)
  const voRevealDuck = interpolate(
    frame,
    [345, 355, 605, 620],
    [1, 0.25, 0.25, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Duck during Audio Sets samples (voice @960, chime @1008)
  const audioSetsDuck = interpolate(
    frame,
    [950, 962, 1068, 1080],
    [1, 0.4, 0.4, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Duck during VO features (advanced features section, global 1260–1415)
  const voFeaturesDuck = interpolate(
    frame,
    [1250, 1260, 1415, 1430],
    [1, 0.25, 0.25, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Duck during CTA voiceover (global 2480–2642)
  const voCtaDuck = interpolate(
    frame,
    [2470, 2480, 2642, 2655],
    [1, 0.25, 0.25, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const volume = 0.3 * fadeIn * fadeOut * demoDuck * audioSetsDuck * voRevealDuck * voFeaturesDuck * voCtaDuck;

  return <Audio src={staticFile("bgm.mp3")} volume={volume} />;
};

export const PromoVideo: React.FC = () => {
  return (
    <>
      {/* ── Audio Layer ── */}
      <BackgroundMusic />

      {/* SFX: Intro scan line (Section 1, local frame 15) */}
      <Sequence from={15} durationInFrames={60}>
        <Audio src={staticFile("sfx-scan.mp3")} volume={0.5} />
      </Sequence>

      {/* SFX: Transition 1 whoosh (Intro→Problem, ~frame 130) */}
      <Sequence from={125} durationInFrames={30}>
        <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.35} />
      </Sequence>

      {/* SFX: Transition 2 whoosh (Problem→Solution, ~frame 320) */}
      <Sequence from={315} durationInFrames={30}>
        <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.35} />
      </Sequence>

      {/* SFX: Solution reveal dramatic impact */}
      <Sequence from={335} durationInFrames={75}>
        <Audio src={staticFile("sfx-reveal.mp3")} volume={0.6} />
      </Sequence>

      {/* VO: Solution reveal narration (~8.2s — needs full 250 frames) */}
      <Sequence from={355} durationInFrames={255}>
        <Audio src={staticFile("vo-reveal.mp3")} volume={0.85} />
      </Sequence>

      {/* SFX: Transition 3 whoosh (Solution→Features, ~frame 630) */}
      <Sequence from={625} durationInFrames={30}>
        <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.3} />
      </Sequence>

      {/* Audio Sets samples (Section 4C): real echook sounds so viewers hear
          the two themes back-to-back — voice first, then chime. */}
      <Sequence from={960} durationInFrames={45}>
        <Audio src={staticFile("sound-voice.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={1008} durationInFrames={66}>
        <Audio src={staticFile("sound-chime.mp3")} volume={0.75} />
      </Sequence>

      {/* SFX: Transition 4 whoosh (Features→AdvancedFeatures, ~frame 1210) */}
      <Sequence from={1205} durationInFrames={30}>
        <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.3} />
      </Sequence>

      {/* VO: Features narration (AdvancedFeatures section, global 1260, ~5.2s) */}
      <Sequence from={1260} durationInFrames={160}>
        <Audio src={staticFile("vo-features.mp3")} volume={0.85} />
      </Sequence>

      {/* SFX: Transition 5 whoosh (AdvancedFeatures→Demo, ~frame 1550) */}
      <Sequence from={1545} durationInFrames={30}>
        <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.3} />
      </Sequence>

      {/* Demo video section has its own audio (Section 6) */}

      {/* SFX: Transition 6 whoosh (Demo→Ecosystem, ~frame 1890) */}
      <Sequence from={1885} durationInFrames={30}>
        <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.3} />
      </Sequence>

      {/* SFX: Transition 7 whoosh (Ecosystem→CrossPlatform, ~frame 2110) */}
      <Sequence from={2105} durationInFrames={30}>
        <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.3} />
      </Sequence>

      {/* SFX: Success chime (Section 8 CrossPlatform, local frame 60 → global 2170) */}
      <Sequence from={2170} durationInFrames={45}>
        <Audio src={staticFile("sfx-success.mp3")} volume={0.4} />
      </Sequence>

      {/* SFX: Transition 8 whoosh (CrossPlatform→CTA, ~frame 2360) */}
      <Sequence from={2355} durationInFrames={30}>
        <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.3} />
      </Sequence>

      {/* VO: CTA narration (Section 9, local ~frame 120 → global 2480, ~5.4s) */}
      <Sequence from={2480} durationInFrames={165}>
        <Audio src={staticFile("vo-cta.mp3")} volume={0.9} />
      </Sequence>

      {/* ── Visual Layer ── */}
      <TransitionSeries>
        {/* Section 1: Intro / Logo Reveal */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.intro}>
          <IntroLogoReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: DURATIONS.transition1 })}
        />

        {/* Section 2: Problem Statement */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.problem}>
          <ProblemStatement />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: DURATIONS.transition2 })}
        />

        {/* Section 3: Solution Reveal */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.solution}>
          <SolutionReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: DURATIONS.transition3 })}
        />

        {/* Section 4: Feature Highlights */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.features}>
          <FeatureHighlights />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: DURATIONS.transition4 })}
        />

        {/* Section 5: Advanced Features (Status Line + Webhooks) */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.advancedFeatures}>
          <AdvancedFeatures />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: DURATIONS.transition5 })}
        />

        {/* Section 6: Demo Showcase */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.demo}>
          <DemoShowcase />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-top" })}
          timing={linearTiming({ durationInFrames: DURATIONS.transition6 })}
        />

        {/* Section 7: Ecosystem (Smart Matchers + Async + Snooze) */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.ecosystem}>
          <Ecosystem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: DURATIONS.transition7 })}
        />

        {/* Section 8: Cross-Platform & Stats */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.crossPlatform}>
          <CrossPlatform />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: DURATIONS.transition8 })}
        />

        {/* Section 9: Call to Action / Outro */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.callToAction}>
          <CallToAction />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
