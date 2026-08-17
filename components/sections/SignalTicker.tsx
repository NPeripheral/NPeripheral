import { Marquee } from "@/components/motion/Marquee";

const phrases = [
  "Appear",
  "Be seen",
  "Be remembered",
  "Be chosen",
  "Appear",
  "Stop being scrolled past",
];

/**
 * A thin ember band between chapters. It exists to break the ink before the
 * cream arrives — a colour transition you feel rather than read.
 */
export function SignalTicker() {
  return (
    <div className="ground-ember relative overflow-hidden py-4">
      <Marquee
        items={phrases.map((phrase) => (
          <span key={phrase} className="type-label whitespace-nowrap">
            {phrase}
          </span>
        ))}
        separator={<span className="mx-8 opacity-60 md:mx-12">✳</span>}
      />
    </div>
  );
}
