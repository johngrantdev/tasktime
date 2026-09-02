interface themeToggleProps {
  className: string;
}

export function ThemeToggle({ className }: themeToggleProps) {
  return (
    <div className={className} onClick={toggleTheme}>
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
