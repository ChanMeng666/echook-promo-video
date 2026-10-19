<div align="center">

# echook, the first film

**The first promo film for [echook](https://github.com/ChanMeng666/echook), made when the product was still called claude-code-audio-hooks: an 89-second film made in code with Remotion, with generated voice and sound effects and a Suno score.**

</div>

## The film

### echook, the first film



https://github.com/user-attachments/assets/643bae51-f060-49d9-975a-7d4acf91614f



▶ Watch on YouTube: https://youtu.be/rwcbV4FpHho

## How it's made

- **React scenes on a timeline.** Nine sections in `src/sections/` are joined with `wipe`, `fade` and `slide` transitions from `@remotion/transitions` in a `TransitionSeries`.
- **Audio placed by frame.** Every voiceover and effect sits at an exact global frame in a `<Sequence>`; the background music ducks under them through multiplied `interpolate()` curves.
- **Sub-scenes that restart time.** Nested `<Sequence>`s reset `useCurrentFrame()`, so each sub-scene animates from frame 0.
- **Generated voice and effects.** `scripts/generate-audio.mjs` calls the ElevenLabs text-to-speech and sound-generation APIs; the score was made with Suno.
- **One place for pacing and colour.** Durations and brand colours live in `src/constants.ts`.

## Make your own

Needs Node 18+.

```bash
npm install
npm run dev       # Remotion Studio
npm run render    # out/promo-video.mp4
```

All the audio is committed in `public/`. To regenerate it, copy `.env.example` to `.env`, add your own ElevenLabs API key and run `npm run generate-audio`; bring your own music as `public/bgm.mp3`.

## Licence

- Code: [MIT](LICENSE).
- The film, the voiceovers, effects and music, the screen recording and screenshot made by Chan Meng: [CC BY 4.0](LICENSE-MEDIA.md).
- Excluded, under their own terms: echook's logo and product sound samples (from [echook](https://github.com/ChanMeng666/echook), MIT), the Inter font (SIL Open Font License), the icons from react-icons and the brand marks they draw (their own licences and owners), the vendored Remotion agent skill in `.agent/`, `.agents/`, `.claude/`, `.cursor/` and `.gemini/` (Remotion's terms), and npm libraries such as Remotion (their own licences).

More detail: [docs/overview.md](docs/overview.md)
