import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/certificates-test")({
  component: TestPage,
});

function TestPage() {
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-gray-800 bg-black px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <a href="/certificates" className="text-white hover:bg-gray-800 p-2 rounded-md inline-block">
            ← 返回剧本列表
          </a>
          <h1 className="text-lg font-semibold text-white">测试页面</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-white">这是一个测试页面，用于验证路由是否正常工作</p>
      </main>
    </div>
  );
}
