import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, Clock, FileText, Eye, Download, ExternalLink, X, Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  CERTIFICATE_DOCUMENT_URL,
  CERTIFICATE_PREVIEW_CN_URL,
  CERTIFICATE_PREVIEW_EN_URL,
} from "@/lib/demoAssets";

export const Route = createFileRoute("/app/certificates-detail")({
  component: ScriptCertificatesPage,
});

// ===== 剧本1: 都市情感剧：遇见未来 =====
const scripts = [
  {
    id: "1",
    title: "都市情感剧：遇见未来",
    stageCerts: [
      { id: "s1-c001", certNo: "TSA-2026-001234", type: "stage" as const, stage: "初稿阶段", timestamp: "2026-06-20 14:35:28", hash: "SHA256:a3f8b2c9...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 第一幕：相遇\n\n场景：咖啡馆\n时间：下午3点\n\n【李明坐在窗边，看着窗外的雨】\n\n李明：（自言自语）她怎么还没来...\n\n【门铃响起，张薇推门而入】\n\n张薇：抱歉，路上堵车了。\n\n李明：没关系，我也刚到不久。" },
      { id: "s1-c002", certNo: "TSA-2026-001235", type: "stage" as const, stage: "修改阶段", timestamp: "2026-06-25 16:20:15", hash: "SHA256:b4g9c3d0...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 第二幕：冲突\n\n场景：办公室\n时间：晚上8点\n\n【李明正在加班，张薇突然进来】\n\n张薇：你还在工作？\n\n李明：这个项目明天就要交了。" },
      { id: "s1-c003", certNo: "TSA-2026-001237", type: "stage" as const, stage: "定稿阶段", timestamp: "2026-06-28 09:45:12", hash: "SHA256:d6i2e5f8...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 第三幕：和解\n\n场景：公园长椅\n时间：黄昏\n\n【夕阳西下，两人并肩而坐】\n\n李明：其实我一直想跟你说...\n\n张薇：说什么？\n\n李明：谢谢你一直陪着我。" },
    ],
    processCerts: [
      { id: "s1-p001", certNo: "TSA-2026-001236", type: "process" as const, stage: "大纲阶段", timestamp: "2026-06-22 10:15:30", hash: "SHA256:c5h0d4e1...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, processLog: [{ time: "14:30:00", action: "manual", content: "输入故事大纲：都市背景下的爱情故事" }, { time: "14:32:15", action: "ai", content: "生成主要角色设定 - 李明和张薇的角色档案" }, { time: "14:35:28", action: "manual", content: "调整角色性格：李明更加内敛，张薇更加活泼" }, { time: "14:45:00", action: "timestamp", content: "申请大纲阶段可信时间戳认证" }] },
      { id: "s1-p002", certNo: "TSA-2026-001239", type: "process" as const, stage: "初稿阶段", timestamp: "2026-06-26 11:30:45", hash: "SHA256:e7j3f6g9...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, processLog: [{ time: "09:15:00", action: "ai", content: "生成第一幕开场对话 - 咖啡馆相遇场景" }, { time: "09:20:30", action: "manual", content: "修改对话节奏，增加停顿和眼神交流描写" }, { time: "09:25:45", action: "ai", content: "优化环境描写，增加雨天氛围 - 雨声、雾气、咖啡香气" }, { time: "09:30:00", action: "timestamp", content: "申请初稿创作过程可信时间戳认证" }] },
    ],
  },
  {
    id: "2",
    title: "悬疑推理：迷雾重重",
    stageCerts: [
      { id: "s2-c001", certNo: "TSA-2026-002001", type: "stage" as const, stage: "大纲阶段", timestamp: "2026-06-18 15:20:30", hash: "SHA256:f8k4g7h0...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 故事大纲\n\n一桩离奇的密室杀人案，死者是知名企业家王建国。警方介入调查，发现现场有多处疑点：门锁完好但窗户微开、死者手中紧握着一枚陌生的钥匙、墙上的时钟停在凌晨2:17..." },
      { id: "s2-c002", certNo: "TSA-2026-002004", type: "stage" as const, stage: "初稿阶段", timestamp: "2026-06-22 11:30:00", hash: "SHA256:g0n7j1k4...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 第一章：案发\n\n雨夜，别墅区。警笛声划破寂静。刑警队长陈刚推开房门，一股血腥味扑面而来..." },
    ],
    processCerts: [
      { id: "s2-p001", certNo: "TSA-2026-002002", type: "process" as const, stage: "构思阶段", timestamp: "2026-06-20 10:45:15", hash: "SHA256:g9l5h8i1...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, processLog: [{ time: "10:30:00", action: "ai", content: "生成悬疑故事的三个开头方案" }, { time: "10:35:15", action: "manual", content: "选择第二个方案：雨夜中的神秘电话" }, { time: "10:40:00", action: "ai", content: "设计侦探角色 - 陈刚的性格和背景" }, { time: "10:45:15", action: "timestamp", content: "申请构思阶段可信时间戳认证" }] },
      { id: "s2-p002", certNo: "TSA-2026-002003", type: "process" as const, stage: "初稿阶段", timestamp: "2026-06-23 14:30:00", hash: "SHA256:h0m6i9j2...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, processLog: [{ time: "14:15:00", action: "ai", content: "生成案发现场描写" }, { time: "14:20:30", action: "manual", content: "增加法医鉴定细节" }, { time: "14:25:00", action: "ai", content: "设计嫌疑人列表和动机" }, { time: "14:30:00", action: "timestamp", content: "申请初稿创作过程可信时间戳认证" }] },
    ],
  },
  {
    id: "3",
    title: "科幻冒险：星际穿越",
    stageCerts: [
      { id: "s3-c001", certNo: "TSA-2026-003001", type: "stage" as const, stage: "构思阶段", timestamp: "2026-06-15 09:30:00", hash: "SHA256:h0m6i9j2...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 故事背景\n\n公元2150年，人类已经实现了星际旅行。地球资源枯竭，一支探险队前往遥远的星系寻找新的家园。他们乘坐'探索者号'飞船，配备了最先进的曲速引擎和人工智能导航系统..." },
      { id: "s3-c002", certNo: "TSA-2026-003002", type: "stage" as const, stage: "大纲阶段", timestamp: "2026-06-18 14:15:30", hash: "SHA256:i1n7j0k3...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 剧情大纲\n\n第一章：出发 - 地球最后的希望\n第二章：黑洞边缘 - 时空扭曲的考验\n第三章：异星文明 - 与外星智慧的第一次接触\n第四章：生死抉择 - 牺牲还是撤退\n第五章：归途 - 带着新家园的希望返回" },
      { id: "s3-c003", certNo: "TSA-2026-003003", type: "stage" as const, stage: "初稿阶段", timestamp: "2026-06-22 16:45:00", hash: "SHA256:j2o8k1l4...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 第一章：出发\n\n2150年6月1日，地球联合航天中心。\n\n指挥官李昂站在发射台前，望着即将启程的'探索者号'飞船。这艘长达三百米的巨型飞船承载着人类最后的希望。船员们来自世界各地，他们是各自领域最顶尖的专家..." },
      { id: "s3-c004", certNo: "TSA-2026-003004", type: "stage" as const, stage: "修改阶段", timestamp: "2026-06-25 11:20:45", hash: "SHA256:k3p9l2m5...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 修改记录\n\n1. 增加了飞船内部结构描写 - 生活区、指挥舱、引擎室\n2. 优化了人物对话，使其更加自然流畅\n3. 添加了科学顾问审核的技术细节 - 曲速原理、虫洞理论\n4. 增强了情感线 - 李昂与女儿的视频通话场景" },
      { id: "s3-c005", certNo: "TSA-2026-003005", type: "stage" as const, stage: "定稿阶段", timestamp: "2026-06-28 15:30:00", hash: "SHA256:l4q0m3n6...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, original: "# 最终定稿\n\n经过三轮修改和科学顾问审核，本剧本已完成全部创作工作。全剧共五章，约3万字，包含完整的人物弧光和情节转折。准备进入影视制作阶段。" },
    ],
    processCerts: [
      { id: "s3-p001", certNo: "TSA-2026-003006", type: "process" as const, stage: "大纲阶段", timestamp: "2026-06-20 13:15:30", hash: "SHA256:m5r1n4o7...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, processLog: [{ time: "13:00:00", action: "ai", content: "生成科幻世界观设定 - 2150年的科技水平和社会结构" }, { time: "13:05:15", action: "manual", content: "调整科技水平设定，确保符合硬科幻标准" }, { time: "13:10:30", action: "ai", content: "设计三种不同形态的外星文明" }, { time: "13:15:30", action: "timestamp", content: "申请大纲阶段可信时间戳认证" }] },
      { id: "s3-p002", certNo: "TSA-2026-003007", type: "process" as const, stage: "初稿阶段", timestamp: "2026-06-23 10:30:00", hash: "SHA256:n6s2o5p8...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, processLog: [{ time: "10:15:00", action: "ai", content: "生成第一章开场场景 - 发射台前的壮观景象" }, { time: "10:20:30", action: "manual", content: "增加主角内心独白，展现对未知的恐惧与期待" }, { time: "10:25:45", action: "ai", content: "优化技术术语的使用 - 修正曲速引擎和虫洞的描述" }, { time: "10:30:00", action: "timestamp", content: "申请初稿创作过程可信时间戳认证" }] },
      { id: "s3-p003", certNo: "TSA-2026-003008", type: "process" as const, stage: "修改阶段", timestamp: "2026-06-26 15:45:00", hash: "SHA256:o7t3p6q9...", issuer: "联合信任时间戳服务中心", pdfUrl: CERTIFICATE_DOCUMENT_URL, previewCN: CERTIFICATE_PREVIEW_CN_URL, previewEN: CERTIFICATE_PREVIEW_EN_URL, processLog: [{ time: "15:30:00", action: "manual", content: "根据科学顾问意见修改物理定律描述" }, { time: "15:35:15", action: "ai", content: "重新生成黑洞穿越场景，增加视觉冲击力" }, { time: "15:40:30", action: "manual", content: "调整角色关系，增加团队冲突情节" }, { time: "15:45:00", action: "timestamp", content: "申请修改阶段可信时间戳认证" }] },
    ],
  },
];

type Cert = typeof scripts[0]["stageCerts"][0] | typeof scripts[0]["processCerts"][0];

// Draggable Modal
function DraggableModal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return;
    setDragging(true);
    setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onMouseMove as any);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      document.removeEventListener("mousemove", onMouseMove as any);
      document.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove as any);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl max-w-4xl w-full mx-4" style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, cursor: dragging ? "grabbing" : "default" }}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800 cursor-grab active:cursor-grabbing" onMouseDown={onMouseDown}>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function ScriptCertificatesPage() {
  const [selectedScriptId, setSelectedScriptId] = useState("1");
  const [tab, setTab] = useState("all");
  const [previewCert, setPreviewCert] = useState<Cert | null>(null);
  const [originalCert, setOriginalCert] = useState<Cert | null>(null);
  const [playbackCert, setPlaybackCert] = useState<Cert | null>(null);

  const currentScript = scripts.find(s => s.id === selectedScriptId) || scripts[0];
  const { stageCerts, processCerts } = currentScript;
  
  const allCerts = [...stageCerts, ...processCerts];
  const display = tab === "all" ? allCerts : tab === "stage" ? stageCerts : processCerts;

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-gray-800 bg-black px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/app/certificates" className="text-white hover:bg-gray-800 p-2 rounded-md inline-block">
            <ArrowLeft className="mr-2 h-4 w-4 inline" />返回剧本列表
          </Link>
          <div className="flex-1">
            <Select value={selectedScriptId} onValueChange={setSelectedScriptId}>
              <SelectTrigger className="w-full max-w-xs bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="选择剧本" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {scripts.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-white focus:bg-gray-800">{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-xl font-semibold text-white mb-6">{currentScript.title} - 证书列表</h2>
        
        <Tabs value={tab} onValueChange={setTab}>
          <div className="mb-6">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">全部 ({allCerts.length})</TabsTrigger>
              <TabsTrigger value="stage" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"><FileText className="mr-2 h-4 w-4" />阶段 ({stageCerts.length})</TabsTrigger>
              <TabsTrigger value="process" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"><Clock className="mr-2 h-4 w-4" />过程 ({processCerts.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={tab}>
            {display.length > 0 ? (
              <div className="rounded-lg border border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900 border-gray-800">
                      <TableHead className="text-white">证书编号</TableHead>
                      <TableHead className="text-white">类型</TableHead>
                      <TableHead className="text-white">阶段</TableHead>
                      <TableHead className="text-white">认证时间</TableHead>
                      <TableHead className="text-white text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {display.map((c) => (
                      <TableRow key={c.id} className="border-gray-800 hover:bg-gray-900/50">
                        <TableCell className="font-mono text-sm text-gray-300">{c.certNo}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${c.type === "stage" ? "bg-blue-600" : "bg-green-600"} text-white`}>
                            {c.type === "stage" ? "阶段证书" : "过程证书"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{c.stage}</TableCell>
                        <TableCell className="text-gray-400 text-sm">{c.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10 h-8 px-3" onClick={() => setPreviewCert(c)}><Eye className="mr-1.5 h-3.5 w-3.5" />预览</Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-8 px-3" onClick={() => window.open(c.pdfUrl, "_blank")}><Download className="mr-1.5 h-3.5 w-3.5" />下载</Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-8 px-3" onClick={() => setOriginalCert(c)}><FileText className="mr-1.5 h-3.5 w-3.5" />原文</Button>
                            {c.type === "process" && (
                              <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300 hover:bg-orange-600/10 h-8 px-3" onClick={() => setPlaybackCert(c)}><Play className="mr-1.5 h-3.5 w-3.5" />回放</Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-8 px-3" onClick={() => window.open("https://v.tsa.cn", "_blank")}><ExternalLink className="mr-1.5 h-3.5 w-3.5" />验证</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <Shield className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">暂无证书</h3>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* 预览弹窗 */}
      <DraggableModal isOpen={!!previewCert} onClose={() => setPreviewCert(null)} title="证书预览">
        {previewCert && (
          <div className="grid grid-cols-2 gap-4">
            <div><h4 className="text-sm text-gray-400 mb-2">中文证书</h4><img src={previewCert.previewCN} alt="中文" className="w-full rounded-lg border border-gray-700" /></div>
            <div><h4 className="text-sm text-gray-400 mb-2">英文证书</h4><img src={previewCert.previewEN} alt="英文" className="w-full rounded-lg border border-gray-700" /></div>
          </div>
        )}
      </DraggableModal>

      {/* 原文弹窗 */}
      <DraggableModal isOpen={!!originalCert} onClose={() => setOriginalCert(null)} title="查看原文">
        {originalCert && (
          <div>
            {originalCert.type === "stage" && originalCert.original ? (
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300 bg-gray-800/50 p-4 rounded-lg">{originalCert.original}</pre>
            ) : originalCert.type === "process" && originalCert.processLog ? (
              <div className="space-y-3">
                <h4 className="font-medium text-white">创作过程记录</h4>
                {originalCert.processLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Clock className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
                    <div><span className="text-xs text-gray-400">{log.time}</span><span className="ml-2 text-xs text-purple-400">{log.action}</span><p className="text-xs text-gray-300 mt-0.5">{log.content}</p></div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">暂无内容</p>}
          </div>
        )}
      </DraggableModal>

      {/* 轨迹回放弹窗 */}
      <DraggableModal isOpen={!!playbackCert} onClose={() => setPlaybackCert(null)} title="创作轨迹回放">
        {playbackCert && (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center"><Play className="h-12 w-12 text-gray-600 mx-auto mb-2" /><p className="text-gray-400 text-sm">轨迹回放视频预览</p><p className="text-gray-500 text-xs mt-1">（演示模式）</p></div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h4 className="font-medium text-white mb-3">关联证书</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">编号</span><span className="text-white font-mono">{playbackCert.certNo}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">时间</span><span className="text-white">{playbackCert.timestamp}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">机构</span><span className="text-white">{playbackCert.issuer}</span></div>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full border-gray-700 text-gray-300" onClick={() => window.open(playbackCert.pdfUrl, "_blank")}><Download className="mr-2 h-3.5 w-3.5" />下载证书</Button>
            </div>
          </div>
        )}
      </DraggableModal>
    </div>
  );
}
