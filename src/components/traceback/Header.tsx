import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Link to="/platform" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>
      {subtitle && (
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      )}
    </header>
  );
}
