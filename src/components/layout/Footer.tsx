export default function Footer() {
  return (
    <footer className="flex items-center justify-center bg-surface py-4 text-sm text-muted border-t border-border">
      © {new Date().getFullYear()} CreditKuber. All rights reserved.
    </footer>
  );
}
