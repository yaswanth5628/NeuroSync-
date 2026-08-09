export default function AuthFooter() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border">
      <div className="flex items-center gap-5 text-xs text-muted-foreground">
        <button className="hover:text-foreground transition-colors">Privacy Policy</button>
        <button className="hover:text-foreground transition-colors">Terms of Service</button>
        <button className="hover:text-foreground transition-colors">Support</button>
      </div>
      <p className="text-xs text-muted-foreground">Version 1.0.0</p>
    </footer>
  );
}