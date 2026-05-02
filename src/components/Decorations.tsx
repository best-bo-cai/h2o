import { cn } from "@/lib/utils"

interface DecoProps {
  className?: string
}

export function DecoCircle({ className }: DecoProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full opacity-15 pointer-events-none",
        className
      )}
    />
  )
}

export function DecoWave({ className }: DecoProps) {
  return (
    <svg
      className={cn("absolute opacity-8 pointer-events-none text-primary", className)}
      viewBox="0 0 1440 200"
      fill="currentColor"
      preserveAspectRatio="none"
    >
      <path d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,138.7C672,149,768,139,864,122.7C960,107,1056,85,1152,80C1248,75,1344,85,1392,90.7L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z" />
    </svg>
  )
}

export function DecoTriangle({ className }: DecoProps) {
  return (
    <div
      className={cn("absolute opacity-12 pointer-events-none text-accent", className)}
      style={{
        width: 0,
        height: 0,
        borderLeft: "40px solid transparent",
        borderRight: "40px solid transparent",
        borderBottom: "70px solid currentColor",
      }}
    />
  )
}

export function DecoDots({ className }: DecoProps) {
  return (
    <svg
      className={cn("absolute opacity-10 pointer-events-none text-muted-foreground", className)}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="currentColor"
    >
      <circle cx="8" cy="8" r="3" />
      <circle cx="28" cy="8" r="3" />
      <circle cx="48" cy="8" r="3" />
      <circle cx="68" cy="8" r="3" />
      <circle cx="8" cy="28" r="3" />
      <circle cx="28" cy="28" r="3" />
      <circle cx="48" cy="28" r="3" />
      <circle cx="68" cy="28" r="3" />
      <circle cx="8" cy="48" r="3" />
      <circle cx="28" cy="48" r="3" />
      <circle cx="48" cy="48" r="3" />
      <circle cx="68" cy="48" r="3" />
      <circle cx="8" cy="68" r="3" />
      <circle cx="28" cy="68" r="3" />
      <circle cx="48" cy="68" r="3" />
      <circle cx="68" cy="68" r="3" />
    </svg>
  )
}
