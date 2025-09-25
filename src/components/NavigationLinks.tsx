interface NavigationLinksProps {
  className?: string;
}

export const NavigationLinks = ({ className = "" }: NavigationLinksProps) => {
  const baseClassName =
    "text-foreground hover:text-google-blue transition-colors";
  const linkClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <>
      <a href="#home" className={linkClassName}>
        Home
      </a>
      <a href="#opportunities" className={linkClassName}>
        Opportunities
      </a>
      <a href="#about" className={linkClassName}>
        About GDG
      </a>
    </>
  );
};
