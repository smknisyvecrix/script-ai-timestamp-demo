import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/app/certificate")({
  component: CertificatePage,
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
  id: "cert-002",
  certificateNumber: "TSA-2026-001235",
  scriptTitle: "都市情感剧：遇见未来",
  contentHash: "SHA256:e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4",
  timestamp: "2026-06-25 16:20:15.456",
  issuedAt: "2026-06-25",
  validUntil: "长期有效",
  status: "verified" as const,
  type: "process" as const,
  stage: "修改阶段",
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

function CertificatePage() {
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
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/app/certificates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回证书列表
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">可信时间戳认证证书</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 证书主体 */}
        <Card className="overflow-hidden">
          {/* 证书头部 */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mb-1 text-xl font-bold">可信时间戳认证证书</h2>
            <p className="text-sm text-muted-foreground">Trusted Timestamp Authentication Certificate</p>
          </div>

          {/* 证书内容 */}
          <div className="p-6 space-y-4">
            {/* 证书编号 */}
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="text-sm text-muted-foreground">证书编号</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {mockCertificate.certificateNumber}
              </Badge>
            </div>

            {/* 作品信息 */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base">认证作品信息</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">作品名称</span>
                  <p className="font-medium mt-0.5">{mockCertificate.scriptTitle}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">认证类型</span>
                  <Badge variant={mockCertificate.type === "stage" ? "default" : "secondary"} className="mt-0.5 text-xs">
                    {mockCertificate.type === "stage" ? "阶段证书" : "过程证书"}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">当前阶段</span>
                  <p className="font-medium mt-0.5">{mockCertificate.stage}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">认证状态</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-600 font-medium text-sm">已验证</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 可信时间戳信息 */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base">可信时间戳信息</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground">认证时间</span>
                    <p className="font-medium mt-0.5">{mockCertificate.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground">内容哈希值</span>
                    <p className="font-mono text-xs mt-0.5 break-all text-muted-foreground">{mockCertificate.contentHash}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 有效期 */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">签发日期</span>
                  <p className="font-medium mt-0.5">{mockCertificate.issuedAt}</p>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">有效期至</span>
                  <p className="font-medium mt-0.5 text-primary">{mockCertificate.validUntil}</p>
                </div>
              </div>
            </div>

            {/* 认证机构 */}
            <div className="text-center pt-3 border-t">
              <p className="text-xs text-muted-foreground">认证机构</p>
              <p className="font-semibold text-sm mt-0.5">{mockCertificate.issuer}</p>
            </div>
          </div>

          {/* Tabs切换：证书预览 / 查看原文 */}
          <div className="border-t">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6 pt-4">
                <TabsList>
                  <TabsTrigger value="preview">
                    <Eye className="mr-2 h-4 w-4" />
                    证书预览
                  </TabsTrigger>
                  <TabsTrigger value="original">
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
                    className="text-xs"
                  >
                    中文证书
                  </Button>
                  <Button
                    variant={previewLang === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewLang("en")}
                    className="text-xs"
                  >
                    English Certificate
                  </Button>
                </div>

                {/* 缩略图预览 */}
                <div 
                  className="rounded-lg overflow-hidden border bg-gray-100 cursor-pointer hover:shadow-lg transition-shadow mx-auto max-w-md"
                  onClick={() => setShowFullImage(currentPreviewUrl)}
                >
                  <img
                    src={currentPreviewUrl}
                    alt={previewLang === "cn" ? "中文证书预览" : "英文证书预览"}
                    className="w-full h-auto object-contain max-h-[350px]"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  点击图片可查看完整证书
                </p>
              </TabsContent>

              <TabsContent value="original" className="p-6">
                {mockCertificate.type === "stage" ? (
                  // 阶段证书 - 显示剧本原文
                  <>
                    <Card className="p-4 bg-muted/50">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {mockCertificate.originalContent}
                      </pre>
                    </Card>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={handleDownloadOriginal}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      下载原文
                    </Button>
                  </>
                ) : (
                  // 过程证书 - 显示创作过程轨迹
                  <>
                    <Card className="p-4 bg-muted/50">
                      <h4 className="font-medium text-sm mb-3">创作过程记录</h4>
                      <div className="space-y-3">
                        {mockCertificate.processLog.map((log, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                              <span className="ml-2 font-medium text-xs">{getActivityLabel(log.type)}</span>
                              <p className="text-xs mt-0.5">{log.content || log.prompt}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
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
          <div className="border-t p-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(mockCertificate.pdfUrl, "_blank")}
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              下载PDF证书
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open("https://v.tsa.cn", "_blank")}
            >
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              证书验证
            </Button>
          </div>
        </Card>

        {/* 关于可信时间戳说明 */}
        <Card className="mt-6 p-6">
          <h3 className="font-semibold mb-3">关于可信时间戳</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>由联合信任可信时间戳服务中心签发，精确到毫秒级，具有法律效力</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>通过密码学技术保证数据完整性，任何篡改都会被发现</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>12万+裁判文书采信，可用于版权纠纷、知识产权保护等法律场景</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
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
