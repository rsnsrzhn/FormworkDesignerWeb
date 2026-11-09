export function Icon({
  name,
  size = 22,
}: {
  name:
    | 'arrow'
    | 'check'
    | 'grid'
    | 'ruler'
    | 'layers'
    | 'sheet'
    | 'close'
    | 'menu'
    | 'play';
  size?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    ruler: (
      <>
        <path d="m3 16 13-13 5 5L8 21zM7 12l3 3m1-7 3 3m1-7 3 3" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5" />
      </>
    ),
    sheet: (
      <>
        <path d="M14 2H5v20h14V7zM14 2v6h5M8 12h8M8 16h8" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    play: <path d="m9 5 11 7-11 7z" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
