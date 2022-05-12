import { useState } from "react";
import { useInterval } from "../reactUtils";

type ProgressBarProps = {
  progressTrackers: readonly number[];
  durationSeconds: number | undefined;
};

export function ProgressBar(props: ProgressBarProps) {
  const [now, setNow] = useState(Date.now());
  useInterval(async () => {
    setNow(Date.now());
  }, 100);
  const countByTick: { [key: number]: number } = {};
  props.progressTrackers.map((n) => {
    const progress = (now - n) / 1000;
    n = (100 * progress) / (props.durationSeconds || 1);
    countByTick[n] = (countByTick[n] || 0) + 1;
  });
  return (
    <svg width="150" viewBox="0 0 100 20">
      <rect width="100" height="20" fill="#ccc" stroke="#aaa" />
      {Object.entries(countByTick).map(([n, count]) => {
        return (
          <rect
            key={n}
            width={Math.min(20, count ** 0.5)}
            height="20"
            y="0"
            x={n.toString()}
            fill="#222222"
          />
        );
      })}
    </svg>
  );
}
