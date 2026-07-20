import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Download, ArrowLeft, Clock, FileText, CheckCircle, Eye, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  CERTIFICATE_DOCUMENT_URL,
  CERTIFICATE_PREVIEW_CN_URL,
  CERTIFICATE_PREVIEW_EN_URL,
} from "@/lib/demoAssets";

export const Route = createFileRoute("/app/certificate-single")({
  component: CertificateSinglePage,
});

// Mock certificate data - stage certificate
const mockStageCertificate = {
  id: "cert-001",
  certificateNumber: "TSA-2026-001234",
  scriptTitle: "都市情感剧：遇见未来",
  contentHash: "SHA256:a3f8b2c9d1e4f7a6b5c8d2e1f4a7b6c9d2e1f4a7b6c9d2e1f4a7b6c9d2e1",
  timestamp: "2026-06-20 14:35:28.123",
  issuedAt: "2026-06-20",
  validUntil: "长期有效",
  status: "verified" as const,
  type: "stage" as const,
  stage: "初稿阶段",
  issuer: "联合信任可信时间戳服务中心",
  pdfUrl: CERTIFICATE_DOCUMENT_URL,
  previewImageUrlCN: CERTIFICATE_PREVIEW_CN_URL,
  previewImageUrlEN: CERTIFICATE_PREVIEW_EN_URL,
  originalContent: "# 第一幕：相遇\n\n场景：咖啡馆\n时间：下午3点\n\n【李明坐在窗边，看着窗外的雨】\n\n李明：（自言自语）她怎么还没来...\n\n【门铃响起，张薇推门而入】\n\n张薇：抱歉，路上堵车了。\n\n李明：没关系，我也刚到不久。",
  processLog: [] as Array<{ id: string; type: string; content?: string; prompt?: string; result?: string; timestamp: string; stage: string; certNumber?: string }>,
};

// Mock certificate data - process certificate
const mockProcessCertificate = {
  id: "cert-003",
  certificateNumber: "TSA-2026-001236",
  scriptTitle: "都市情感剧：遇见未来",
  contentHash: "SHA256:c5h0d4e1f6g9b8d7e0f3g6a9c8d1e4f7a0b9c2d5e8f1a4b7c0d3e6f9a2b5",
  timestamp: "2026-06-22 10:15:30.789",
  issuedAt: "2026-06-22",
  validUntil: "长期有效",
  status: "verified" as const,
  type: "process" as const,
  stage: "大纲阶段",
  issuer: "联合信任可信时间戳服务中心",
  pdfUrl: CERTIFICATE_DOCUMENT_URL,
  previewImageUrlCN: CERTIFICATE_PREVIEW_CN_URL,
  previewImageUrlEN: CERTIFICATE_PREVIEW_EN_URL,
  originalContent: "",
  processLog: [
    { id: "1", type: "manual", content: "输入开场白对话", timestamp: "14:32:15", stage: "draft" },
    { id: "2", type: "ai", prompt: "生成一段浪漫的相遇对话", result: "生成了3段对话建议", timestamp: "14:35:28", stage: "draft" },
    { id: "3", type: "manual", content: "修改角色名字从'小王'改为'李明'", timestamp: "14:38:42", stage: "draft" },
    { id: "4", type: "ai", prompt: "优化场景描述，增加氛围感", result: "增加了雨天和咖啡馆的环境描写", timestamp: "14:42:10", stage: "draft" },
    { id: "5", type: "timestamp", content: "申请初稿阶段可信时间戳认证", certNumber: "TSA-2026-001", timestamp: "14:45:00", stage: "draft" },
  ],
};

// Use stage certificate for demonstration
const mockCertificate = mockStageCertificate;

// Helper function to get activity label based on type
function getActivityLabel(type: string): string {
  switch (type) {
    case "manual":
      return "手动编辑";
    case "ai":
      return "AI生成";
    case "timestamp":
      return "可信时间戳认证";
    default:
      return type;
  }
}

function CertificateSinglePage() {
  const search = useSearch({ from: "/app/certificate-single" }) as { certId?: string };
  const certId = search?.certId || "unknown";
  
  const [activeTab, setActiveTab] = useState("preview");
  const [showFullImage, setShowFullImage] = useState<string | null>(null);
  const [previewLang, setPreviewLang] = useState<"cn" | "en">("cn");

  const currentPreviewUrl = previewLang === "cn" ? mockCertificate.previewImageUrlCN : mockCertificate.previewImageUrlEN;

  // Download original content (for stage certificate)
  const handleDownloadOriginal = () => {
    const blob = new Blob([mockCertificate.originalContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mockCertificate.scriptTitle}_原文.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download process log (for process certificate)
  const handleDownloadProcess = () => {
    const content = mockCertificate.processLog.map(log =>
      `[${log.timestamp}] ${getActivityLabel(log.type)}: ${log.content || log.prompt}`
    ).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mockCertificate.scriptTitle}_创作过程.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* 顶部导航 */}
      <header className="border-b border-gray-800 bg-black px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <a href="/certificates-detail?scriptId=1" className="text-white hover:bg-gray-800 p-2 rounded-md inline-block">
            <ArrowLeft className="mr-2 h-4 w-4 inline" />
            返回证书列表
          </a>
          <h1 className="text-lg font-semibold text-white">可信时间戳认证证书</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 证书主体 */}
        <Card className="overflow-hidden bg-gray-900 border-gray-800">
          {/* 证书头部 */}
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-600/10 p-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-1 text-xl font-bold text-white">可信时间戳认证证书</h2>
            <p className="text-sm text-gray-400">Trusted Timestamp Authentication Certificate</p>
          </div>

          {/* 证书内容 */}
          <div className="p-6 space-y-4">
            {/* 证书编号 */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <span className="text-sm text-gray-400">证书编号</span>
              <Badge variant="secondary" className="font-mono text-xs bg-gray-800 text-gray-300">
                {mockCertificate.certificateNumber}
              </Badge>
            </div>

            {/* 作品信息 */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base text-white">认证作品信息</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">作品名称</span>
                  <p className="font-medium mt-0.5 text-white">{mockCertificate.scriptTitle}</p>
                </div>
                <div>
                  <span className="text-gray-400">认证类型</span>
                  <Badge variant={mockCertificate.type === "stage" ? "default" : "secondary"} className="mt-0.5 text-xs bg-purple-600 text-white">
                    {mockCertificate.type === "stage" ? "阶段证书" : "过程证书"}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-400">当前阶段</span>
                  <p className="font-medium mt-0.5 text-white">{mockCertificate.stage}</p>
                </div>
                <div>
                  <span className="text-gray-400">认证状态</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-400 font-medium text-sm">已验证</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 可信时间戳信息 */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base text-white">可信时间戳信息</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-400">认证时间</span>
                    <p className="font-medium mt-0.5 text-white">{mockCertificate.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-3.5 w-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-400">内容哈希值</span>
                    <p className="font-mono text-xs mt-0.5 break-all text-gray-400">{mockCertificate.contentHash}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 有效期 */}
            <div className="rounded-lg bg-gray-800/50 p-3">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-400">签发日期</span>
                  <p className="font-medium mt-0.5 text-white">{mockCertificate.issuedAt}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400">有效期至</span>
                  <p className="font-medium mt-0.5 text-purple-400">{mockCertificate.validUntil}</p>
                </div>
              </div>
            </div>

            {/* 认证机构 */}
            <div className="text-center pt-3 border-t border-gray-800">
              <p className="text-xs text-gray-400">认证机构</p>
              <p className="font-semibold text-sm mt-0.5 text-white">{mockCertificate.issuer}</p>
            </div>
          </div>

          {/* Tabs切换：证书预览 / 查看原文 */}
          <div className="border-t border-gray-800">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6 pt-4">
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="preview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Eye className="mr-2 h-4 w-4" />
                    证书预览
                  </TabsTrigger>
                  <TabsTrigger value="original" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <FileText className="mr-2 h-4 w-4" />
                    {mockCertificate.type === "stage" ? "查看原文" : "创作过程"}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="p-6">
                {/* 语言切换 */}
                <div className="flex justify-center mb-4 gap-2">
                  <Button
                    variant={previewLang === "cn" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewLang("cn")}
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                  >
                    中文证书
                  </Button>
                  <Button
                    variant={previewLang === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewLang("en")}
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                  >
                    English Certificate
                  </Button>
                </div>

                {/* 缩略图预览 */}
                <div 
                  className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800 cursor-pointer hover:shadow-lg transition-shadow mx-auto max-w-md"
                  onClick={() => setShowFullImage(currentPreviewUrl)}
                >
                  <img
                    src={currentPreviewUrl}
                    alt={previewLang === "cn" ? "中文证书预览" : "英文证书预览"}
                    className="w-full h-auto object-contain max-h-[350px]"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  点击图片可查看完整证书
                </p>
              </TabsContent>

              <TabsContent value="original" className="p-6">
                {mockCertificate.type === "stage" ? (
                  // 阶段证书 - 显示剧本原文
                  <>
                    <Card className="p-4 bg-gray-800/50 border-gray-700">
                      <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300">
                        {mockCertificate.originalContent}
                      </pre>
                    </Card>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={handleDownloadOriginal}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      下载原文
                    </Button>
                  </>
                ) : (
                  // 过程证书 - 显示创作过程轨迹
                  <>
                    <Card className="p-4 bg-gray-800/50 border-gray-700">
                      <h4 className="font-medium text-sm mb-3 text-white">创作过程记录</h4>
                      <div className="space-y-3">
                        {mockCertificate.processLog.map((log, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-gray-400">{log.timestamp}</span>
                              <span className="ml-2 font-medium text-xs text-purple-400">{getActivityLabel(log.type)}</span>
                              <p className="text-xs mt-0.5 text-gray-300">{log.content || log.prompt}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={handleDownloadProcess}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      下载创作过程
                    </Button>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* 操作按钮 */}
          <div className="border-t border-gray-800 p-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => window.open(mockCertificate.pdfUrl, "_blank")}
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              下载PDF证书
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => window.open("https://v.tsa.cn", "_blank")}
            >
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              证书验证
            </Button>
          </div>
        </Card>

        {/* 关于可信时间戳说明 */}
        <Card className="mt-6 p-6 bg-gray-900 border-gray-800">
          <h3 className="font-semibold mb-3 text-white">关于可信时间戳</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>由联合信任可信时间戳服务中心签发，精确到毫秒级，具有法律效力</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>通过密码学技术保证数据完整性，任何篡改都会被发现</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>12万+裁判文书采信，可用于版权纠纷、知识产权保护等法律场景</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>快速认证（1分钟获取证书），低成本（仅10元），全流程覆盖</span>
            </li>
          </ul>
        </Card>
      </main>

      {/* 全屏图片查看器 */}
      {showFullImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowFullImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowFullImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={showFullImage}
            alt="证书完整预览"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
