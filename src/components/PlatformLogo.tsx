interface PlatformLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlatformLogo({ size = "md", className = "" }: PlatformLogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <img
      src="/assets/tsa-logo.svg"
      alt="TSA Logo"
      className={`${sizeClasses[size]} rounded-full bg-white p-0.5 ${className}`}
    />
  );
}
