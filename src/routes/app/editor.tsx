import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Save,
  Sparkles,
  Shield,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  Circle,
  Type,
  Bot,
  MessageSquare,
  Trash2,
} from "lucide-react";
import type { Script } from "@/types";

export const Route = createFileRoute("/app/editor")({
  component: EditorPage,
  validateSearch: (search: Record<string, unknown>): { scriptId?: string } => {
    return {
      scriptId: typeof search.scriptId === "string" ? search.scriptId : undefined,
    };
  },
});

const STAGES = [
  { value: "idea", label: "构思阶段", icon: Circle },
  { value: "outline", label: "大纲阶段", icon: Circle },
  { value: "draft", label: "初稿阶段", icon: Circle },
  { value: "revise", label: "修改阶段", icon: Circle },
  { value: "final", label: "定稿阶段", icon: Circle },
];

// 活动记录类型
interface ActivityLog {
  id: string;
  type: "manual" | "ai" | "timestamp";
  content?: string;
  prompt?: string;
  result?: string;
  timestamp: string;
  stage: string;
  certNumber?: string;
}

// 从 localStorage 加载剧本数据（包括预设剧本）
function loadScriptData(scriptId: string): { title: string; content: string; stage: string } | null {
  // 先尝试从 userScripts 中查找
  const saved = localStorage.getItem("userScripts");
  let scriptTitle = "";

  if (saved) {
    try {
      const scripts: Script[] = JSON.parse(saved);
      const script = scripts.find((s) => s.id === scriptId);
      if (script) {
        scriptTitle = script.title;
      }
    } catch {}
  }

  // 如果没找到，检查是否是预设剧本
  if (!scriptTitle) {
    // 预设剧本标题映射
    const presetTitles: Record<string, string> = {
      "1": "都市情感剧：遇见未来",
      "2": "悬疑推理：迷雾重重",
      "3": "科幻冒险：星际穿越",
    };
    scriptTitle = presetTitles[scriptId] || "";
  }

  if (!scriptTitle) return null;

  // 从 localStorage 加载该剧本的内容和阶段
  const content = localStorage.getItem(`script_content_${scriptId}`) || "";
  const stage = localStorage.getItem(`script_stage_${scriptId}`) || "idea";

  return {
    title: scriptTitle,
    content,
    stage,
  };
}

// 保存剧本内容到 localStorage
function saveScriptContent(scriptId: string, content: string, stage: string) {
  localStorage.setItem(`script_content_${scriptId}`, content);
  localStorage.setItem(`script_stage_${scriptId}`, stage);
  
  // 更新剧本的 updatedAt
  const saved = localStorage.getItem("userScripts");
  if (saved) {
    try {
      const scripts: Script[] = JSON.parse(saved);
      const updatedScripts = scripts.map((s) =>
        s.id === scriptId
          ? { ...s, updatedAt: new Date().toISOString().split("T")[0] }
          : s
      );
      localStorage.setItem("userScripts", JSON.stringify(updatedScripts));
    } catch {}
  }
}

// 加载活动轨迹
function loadActivityLog(scriptId: string): ActivityLog[] {
  const saved = localStorage.getItem(`script_activity_${scriptId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

// 保存活动轨迹
function saveActivityLog(scriptId: string, logs: ActivityLog[]) {
  localStorage.setItem(`script_activity_${scriptId}`, JSON.stringify(logs));
}

// 添加活动记录
function addActivityLog(scriptId: string, log: Omit<ActivityLog, "id" | "timestamp">) {
  const logs = loadActivityLog(scriptId);
  const newLog: ActivityLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
  };
  const updatedLogs = [newLog, ...logs];
  saveActivityLog(scriptId, updatedLogs);
  return updatedLogs;
}

// 获取已认证的阶段（包括预设剧本）
function getCertifiedStages(scriptId: string): Record<string, boolean> {
  // 预设剧本的认证阶段映射
  const presetCerts: Record<string, Record<string, boolean>> = {
    "1": { "idea": true, "draft": true, "final": true },
    "2": { "outline": true, "draft": true },
    "3": { "idea": true, "outline": true, "draft": true, "revise": true, "final": true },
  };

  // 先检查预设剧本
  if (presetCerts[scriptId]) {
    return presetCerts[scriptId];
  }

  // 再检查用户创建的剧本
  const saved = localStorage.getItem("userScripts");
  if (!saved) return {};

  try {
    const scripts: Script[] = JSON.parse(saved);
    const script = scripts.find((s) => s.id === scriptId);
    if (!script || !script.timestampCertificates) return {};

    const certified: Record<string, boolean> = {};
    script.timestampCertificates.forEach((cert) => {
      // 根据证书编号推断阶段
      if (cert.certificateNumber.includes("001")) certified["idea"] = true;
      if (cert.certificateNumber.includes("002")) certified["outline"] = true;
      if (cert.certificateNumber.includes("003")) certified["draft"] = true;
      if (cert.certificateNumber.includes("004")) certified["revise"] = true;
      if (cert.certificateNumber.includes("005")) certified["final"] = true;
    });
    return certified;
  } catch {
    return {};
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "manual":
      return <Type className="h-4 w-4 text-blue-500" />;
    case "ai":
      return <Bot className="h-4 w-4 text-purple-500" />;
    case "timestamp":
      return <Shield className="h-4 w-4 text-green-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />;
  }
}

function getActivityLabel(type: string) {
  switch (type) {
    case "manual":
      return "手动编辑";
    case "ai":
      return "AI生成";
    case "timestamp":
      return "时间戳认证";
    default:
      return "其他操作";
  }
}

// AI 生成演示内容
const aiDemoContents = [
  "【场景：夜晚的城市天台】\n\n主角A：（望着星空）你说，如果我们能穿越时间会怎样？\n\n主角B：（微笑）那我会回到第一次遇见你的那天。\n\n主角A：为什么？\n\n主角B：因为那一刻，我知道我找到了余生想要守护的人。",
  "【场景：古老的图书馆】\n\n侦探：（翻阅泛黄的书页）这里的记载...和案发现场完全吻合。\n\n助手：您是说，凶手故意留下了线索？\n\n侦探：不，是受害者自己在生命最后时刻，为我们指明了方向。",
  "【场景：太空站控制室】\n\n指挥官：所有系统正常，准备进入跃迁状态。\n\n飞行员：收到！能量充能 98%...99%...100%！\n\n【飞船周围空间开始扭曲，星光拉长成线】\n\n指挥官：跃迁启动！",
];

function EditorPage() {
  const { scriptId } = Route.useSearch();
  
  // 从 localStorage 加载剧本数据
  const [title, setTitle] = useState("未命名剧本");
  const [content, setContent] = useState("");
  const [stage, setStage] = useState("idea");
  const [showTimestampModal, setShowTimestampModal] = useState(false);
  const [timestampStep, setTimestampStep] = useState<"form" | "waiting" | "success">("form");
  const [fileName, setFileName] = useState("");
  const [ownerType, setOwnerType] = useState<"personal" | "enterprise">("personal");
  const [ownerName, setOwnerName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [creditCode, setCreditCode] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [certifiedStages, setCertifiedStages] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState("");

  // 加载剧本数据
  useEffect(() => {
    if (scriptId) {
      const data = loadScriptData(scriptId);
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setStage(data.stage);
        setLastSavedContent(data.content);
      }
      
      // 加载活动轨迹
      const logs = loadActivityLog(scriptId);
      setActivityLogs(logs);
      
      // 加载已认证阶段
      const certs = getCertifiedStages(scriptId);
      setCertifiedStages(certs);
    }
    setIsLoaded(true);
  }, [scriptId]);

  // 自动保存（防抖）
  useEffect(() => {
    if (!isLoaded || !scriptId) return;
    
    const timer = setTimeout(() => {
      // 只有内容变化时才保存
      if (content !== lastSavedContent) {
        saveScriptContent(scriptId, content, stage);
        setLastSavedContent(content);
        
        // 记录手动编辑活动
        if (content.length > lastSavedContent.length || content.length < lastSavedContent.length) {
          const newLogs = addActivityLog(scriptId, {
            type: "manual",
            content: content.length > lastSavedContent.length ? "添加了新内容" : "修改了内容",
            stage,
          });
          setActivityLogs(newLogs);
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [content, stage, isLoaded, scriptId, lastSavedContent]);

  const handleApplyTimestamp = () => {
    // 预设文件名称
    const stageLabel = STAGES.find((s) => s.value === stage)?.label || "";
    setFileName(`${title} - ${stageLabel}`);
    setTimestampStep("form");
    setShowTimestampModal(true);
  };

  const handleSubmitTimestamp = () => {
    if (!ownerName.trim()) {
      alert("请填写权利人名称");
      return;
    }
    if (ownerType === "personal" && !idNumber.trim()) {
      alert("请填写身份证号");
      return;
    }
    if (ownerType === "enterprise" && !creditCode.trim()) {
      alert("请填写统一社会信用代码");
      return;
    }

    // 进入等待状态
    setTimestampStep("waiting");

    // 模拟5秒认证过程
    setTimeout(() => {
      const newCertNumber = `TSA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      setCertNumber(newCertNumber);
      setTimestampStep("success");

      // 记录时间戳认证活动
      if (scriptId) {
        const newLogs = addActivityLog(scriptId, {
          type: "timestamp",
          content: `申请${STAGES.find((s) => s.value === stage)?.label}可信时间戳®️认证`,
          certNumber: newCertNumber,
          stage,
        });
        setActivityLogs(newLogs);

        // 更新已认证阶段
        setCertifiedStages((prev) => ({ ...prev, [stage]: true }));

        // 更新剧本的证书列表
        const saved = localStorage.getItem("userScripts");
        if (saved) {
          try {
            const scripts: Script[] = JSON.parse(saved);
            const updatedScripts = scripts.map((s) => {
              if (s.id === scriptId) {
                const newCert = {
                  id: `cert-${Date.now()}`,
                  scriptId,
                  certificateNumber: newCertNumber,
                  timestamp: new Date().toISOString().split("T")[0],
                  contentHash: `SHA256:${Math.random().toString(36).substring(7)}`,
                  status: "verified" as const,
                  issuedAt: new Date().toISOString().split("T")[0],
                  validUntil: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                };
                return {
                  ...s,
                  timestampCertificates: [...(s.timestampCertificates || []), newCert],
                };
              }
              return s;
            });
            localStorage.setItem("userScripts", JSON.stringify(updatedScripts));
          } catch {}
        }
      }
    }, 5000);
  };

  const handleCompleteStage = () => {
    const currentStageIndex = STAGES.findIndex((s) => s.value === stage);
    // 标记当前阶段为已完成，进入下一阶段
    if (currentStageIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentStageIndex + 1].value;
      setStage(nextStage);
      if (scriptId) {
        saveScriptContent(scriptId, content, nextStage);
      }
    }
    setShowCompletionModal(false);
  };

  const handleCompleteAndApplyTimestamp = () => {
    const currentStageIndex = STAGES.findIndex((s) => s.value === stage);
    // 标记当前阶段为已完成，进入下一阶段
    if (currentStageIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentStageIndex + 1].value;
      setStage(nextStage);
      if (scriptId) {
        saveScriptContent(scriptId, content, nextStage);
      }
    }
    setShowCompletionModal(false);
    // 弹出时间戳认证弹窗
    setTimeout(() => {
      setShowTimestampModal(true);
    }, 300);
  };

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // 模拟 AI 生成延迟
    setTimeout(() => {
      // 随机选择一个演示内容
      const randomContent = aiDemoContents[Math.floor(Math.random() * aiDemoContents.length)];
      const newContent = content + "\n\n" + randomContent;
      setContent(newContent);
      setLastSavedContent(newContent);
      
      // 记录 AI 生成活动
      if (scriptId) {
        const newLogs = addActivityLog(scriptId, {
          type: "ai",
          prompt: aiPrompt,
          result: "生成了新的剧本内容",
          stage,
        });
        setActivityLogs(newLogs);
      }
      
      setIsGenerating(false);
      setShowAIModal(false);
      setAiPrompt("");
    }, 1500);
  };

  const currentStageIndex = STAGES.findIndex((s) => s.value === stage);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部工具栏 */}
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app/scripts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 min-w-[200px]"
                placeholder="输入剧本标题"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAIModal(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI辅助
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (scriptId) {
                  saveScriptContent(scriptId, content, stage);
                  setLastSavedContent(content);
                }
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              暂存
            </Button>
            <Button
              onClick={() => setShowCompletionModal(true)}
              variant="default"
              size="sm"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              完成该阶段
            </Button>
          </div>
        </div>
      </header>

      {/* 三栏布局 */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* 左侧：创作阶段导航 */}
        <aside className="w-64 border-r bg-card p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4 text-sm text-muted-foreground">创作阶段</h3>
          <div className="space-y-2">
            {STAGES.map((s, index) => {
              const isActive = s.value === stage;
              const isCompleted = index < currentStageIndex;
              const isCertified = certifiedStages[s.value];
              const Icon = s.icon;

              return (
                <button
                  key={s.value}
                  onClick={() => {
                    setStage(s.value);
                    if (scriptId) {
                      saveScriptContent(scriptId, content, s.value);
                    }
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isCompleted
                      ? "bg-secondary hover:bg-secondary/80"
                      : "hover:bg-muted"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <Icon className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm">{s.label}</span>
                  <div className="ml-auto flex items-center gap-1">
                    {isCertified && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                        <Shield className="h-3 w-3 mr-1" />
                        已认证
                      </Badge>
                    )}
                    {isActive && !isCertified && (
                      <Badge variant="secondary" className="text-xs">
                        进行中
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 当前阶段提示 */}
          <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
            <h4 className="font-medium text-sm mb-2">当前阶段提示</h4>
            <p className="text-xs text-muted-foreground">
              {stage === "idea" && "记录灵感，构思故事框架和核心创意"}
              {stage === "outline" && "梳理剧情结构，规划章节和关键情节"}
              {stage === "draft" && "开始正式创作，完成初稿内容"}
              {stage === "revise" && "润色文字，优化对话和场景描写"}
              {stage === "final" && "最终校对，准备发布或提交"}
            </p>
          </Card>
        </aside>

        {/* 中间：剧本内容编辑区 */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Card className="p-6 h-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                剧本内容 - {STAGES.find((s) => s.value === stage)?.label}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>自动保存中</span>
              </div>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[calc(100vh-200px)] resize-none font-mono text-base leading-relaxed"
              placeholder="开始创作你的剧本..."
            />
          </Card>
        </main>

        {/* 右侧：操作轨迹记录 */}
        <aside className="w-80 border-l bg-card p-4 overflow-hidden flex flex-col">
          <h3 className="font-semibold mb-4 text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            创作轨迹
          </h3>
          
          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-4">
              {activityLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  暂无创作记录
                </div>
              ) : (
                activityLogs.map((log) => (
                  <Card key={log.id} className="p-3">
                    <div className="flex items-start gap-2">
                      {getActivityIcon(log.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{getActivityLabel(log.type)}</span>
                          <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">
                          {log.type === "ai" ? log.prompt : log.content}
                        </p>
                        {log.type === "timestamp" && log.certNumber && (
                          <Badge variant="outline" className="mt-2 text-xs border-green-500 text-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            {log.certNumber}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* 申请时间戳按钮 */}
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={handleApplyTimestamp}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 py-3"
            >
              <Shield className="mr-2 h-5 w-5" />
              创作轨迹认证
            </Button>
          </div>
        </aside>
      </div>

      {/* AI 辅助生成弹窗 */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI 辅助生成
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              描述你想要生成的内容，AI 将为你创作相应的剧本片段。
            </p>
            <div className="space-y-3 mb-6">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="例如：生成一段浪漫的相遇对话、写一个悬疑的开场..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none h-24"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowAIModal(false); setAiPrompt(""); }}
              >
                取消
              </Button>
              <Button
                className="flex-1"
                onClick={handleAIGenerate}
                disabled={!aiPrompt.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    开始生成
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 时间戳认证弹窗 */}
      {showTimestampModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg p-6">
            {/* 表单步骤 */}
            {timestampStep === "form" && (
              <>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  申请可信时间戳®️认证
                </h3>

                <div className="space-y-4 mb-6">
                  {/* 文件名称 */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">文件名称</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="请输入文件名称"
                    />
                  </div>

                  {/* 权利人类型 */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">权利人类型</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setOwnerType("personal")}
                        className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                          ownerType === "personal"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        个人
                      </button>
                      <button
                        onClick={() => setOwnerType("enterprise")}
                        className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                          ownerType === "enterprise"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        企业/机构
                      </button>
                    </div>
                  </div>

                  {/* 权利人名称 */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      权利人名称{ownerType === "personal" ? "（姓名）" : "（企业/机构名称）"}
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder={ownerType === "personal" ? "请输入姓名" : "请输入企业/机构名称"}
                    />
                  </div>

                  {/* 身份证号 / 统一信用代码 */}
                  {ownerType === "personal" ? (
                    <div>
                      <label className="text-sm font-medium mb-1 block">身份证号</label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="请输入18位身份证号"
                        maxLength={18}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-medium mb-1 block">统一社会信用代码</label>
                      <input
                        type="text"
                        value={creditCode}
                        onChange={(e) => setCreditCode(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="请输入18位统一社会信用代码"
                        maxLength={18}
                      />
                    </div>
                  )}

                  {/* 权利声明 */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">权利声明</label>
                    <div className="p-3 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground leading-relaxed">
                      本作品/文件已经申请可信时间戳认证，「{ownerName || "权利人名称"}」拥有该作品的著作权（包括但不限于发表权、署名权、修改权、保护作品完整权、复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权）和法律授予的其他权利，未经授权，任何单位和个人禁止以任何方式使用本作品/文件。
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTimestampModal(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={handleSubmitTimestamp}
                  >
                    提交申请
                  </Button>
                </div>
              </>
            )}

            {/* 等待认证步骤 */}
            {timestampStep === "waiting" && (
              <div className="text-center py-8">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                  <Shield className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">正在认证中...</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  联合信任时间戳服务中心正在为您生成数字证书
                </p>
                <div className="text-xs text-muted-foreground">
                  预计需要 5 秒，请勿关闭页面
                </div>
              </div>
            )}

            {/* 认证成功步骤 */}
            {timestampStep === "success" && (
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">认证成功！</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  您的作品已成功获得可信时间戳®️认证
                </p>

                <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">证书编号</span>
                      <span className="font-mono text-primary">{certNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">文件名称</span>
                      <span>{fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">权利人</span>
                      <span>{ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">认证时间</span>
                      <span>{new Date().toLocaleString("zh-CN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">有效期</span>
                      <span>10年</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowTimestampModal(false);
                      setTimestampStep("form");
                      setOwnerName("");
                      setIdNumber("");
                      setCreditCode("");
                      setCertNumber("");
                    }}
                  >
                    关闭
                  </Button>
                  <Link to="/app/certificates-detail" search={{ scriptId }}>
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      查看证书
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 完成阶段提示弹窗 */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">完成当前阶段</h3>
            <p className="text-sm text-muted-foreground mb-4">
              确定要完成"{STAGES.find((s) => s.value === stage)?.label}"吗？完成后将自动进入下一阶段。
            </p>

            {/* 时间戳价值说明 */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                为什么要申请可信时间戳®️认证？
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>版权保护：</strong>为当前阶段的创作内容生成唯一数字指纹，证明原创性和创作时间</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>法律效力：</strong>联合信任时间戳服务中心颁发的证书具有司法认可效力</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>不可篡改：</strong>基于区块链技术，一旦认证无法被修改或伪造</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>维权证据：</strong>发生版权纠纷时，时间戳证书可作为强有力的法律证据</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCompleteStage}
              >
                仅保存，暂不认证
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleCompleteAndApplyTimestamp}
              >
                <Shield className="mr-2 h-4 w-4" />
                完成并申请认证
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
