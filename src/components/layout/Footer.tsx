export default function Footer() {
  return (
    <footer className="flex items-center justify-center bg-gray-100 py-4 text-sm text-gray-600">
      © {new Date().getFullYear()} LoanFlix. All rights reserved.
    </footer>
  );
}
