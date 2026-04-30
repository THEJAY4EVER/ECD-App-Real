export function Logo({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      width={size}
      height={size}
      alt="Masuka Junior School"
      className={`object-contain ${className}`}
      data-testid="logo"
    />
  );
}
