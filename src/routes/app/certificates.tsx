import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/app/certificates")({
  component: CertificatesPage,
});

const mockScripts = [
  { id: "1", title: "都市情感剧：遇见未来", certificateCount: 3 },
  { id: "2", title: "悬疑推理：迷雾重重", certificateCount: 2 },
  { id: "3", title: "科幻冒险：星际穿越", certificateCount: 5 },
];

function ScriptCard({ script }: { script: typeof mockScripts[0] }) {
  return (
    <Link to="/app/certificates-detail" className="block">
      <div className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-purple-500 transition-all duration-300 cursor-pointer">
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white group-hover:text-purple-400 transition-colors">{script.title}</h3>
              <p className="text-sm text-gray-400">{script.certificateCount} 个证书</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CertificatesPage() {
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-gray-800 bg-black px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/app/scripts" className="text-white hover:bg-gray-800 p-2 rounded-md inline-block">
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            返回剧本列表
          </Link>
          <h1 className="text-lg font-semibold text-white">我的证书</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-xl font-semibold text-white mb-4">剧本列表</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockScripts.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      </main>
    </div>
  );
}
