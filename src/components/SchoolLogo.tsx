import type { School } from '../data/schools'

/** Stroke icon shared with the canvas textures (same path data). */
export function SchoolLogo({
  school,
  size = 24,
  className,
  strokeWidth = 1.8,
}: {
  school: Pick<School, 'logo' | 'short'>
  size?: number
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={school.logo} />
    </svg>
  )
}
