export const CircularProgress = ({
  value,
  diameter,
  color,
  strokeWidth,
}: {
  value: number;
  diameter: number;
  color: string;
  strokeWidth: number;
}) => {
  const radius = diameter / 2 - strokeWidth / 2;
  const cxy = diameter / 2;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray * (1 - value);

  return (
    <svg
      width={diameter}
      height={diameter}
      viewBox={`0 0 ${diameter} ${diameter}`}
      style={{ transform: "rotate(-90deg)", display: "block" }}
    >
      <circle
        r={radius}
        cx={cxy}
        cy={cxy}
        fill="transparent"
        stroke="#2B2B2B"
        strokeWidth={`${strokeWidth}px`}
      ></circle>
      <circle
        r={radius}
        cx={cxy}
        cy={cxy}
        fill="transparent"
        stroke={`${color}`}
        strokeWidth={`${strokeWidth}px`}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      ></circle>
    </svg>
  );
};
