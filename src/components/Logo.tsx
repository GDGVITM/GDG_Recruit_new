interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img src="/gdglogo.png" alt="GDG Logo" className="w-11 h-8" />
      <div className="flex flex-col">
        <span className="text-lg font-bold text-foreground">
          GDG Recruitment
        </span>
        <span className="text-xs text-muted-foreground">2025-2026</span>
      </div>
    </div>
  );
};
