import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/platform/admin")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/platform" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">试用账户管理</h1>
            <p className="text-xs text-gray-400">Trial Account Management</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">管理员后台</h2>
          <p className="text-gray-400">功能开发中...</p>
        </div>
      </main>
    </div>
  );
}
