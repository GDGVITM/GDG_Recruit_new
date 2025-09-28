interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <img
        src="/GDG-Sticker-Brackets.gif"
        alt="GDG Logo"
        className="w-15 h-12"
      />
      <div className="flex flex-col">
        <span className="text-lg font-bold text-foreground">
          GDG Recruitment
        </span>
        <span className="text-xs text-muted-foreground">2025-26</span>
      </div>
    </div>
  );
};
