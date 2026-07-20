import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/traceback/Sidebar";
import { Header } from "@/components/traceback/Header";
import { Search, Filter, ChevronDown, Eye, Activity, Clock, Shield, CheckCircle2, Loader2, X } from "lucide-react";

export const Route = createFileRoute("/app/traceback/tracks")({
  component: TracksPage,
});

// ==================== 模拟数据 ====================

interface Track {
  id: string;
  name: string;
  shortId: string;
  userId: string;
  type: string;
  ip: string;
  createdAt: string;
  status: "certified" | "pending" | "failed";
}

const tracksData: Track[] = [
  { id: "9cfa3c19-a6f9-438b-baf2-9facbe9fbeba", name: "用户注册流程-20", shortId: "9cfa3c19-a6f...", userId: "user_aqh0qb", type: "注册流程", ip: "192.168.246.83", createdAt: "2026/5/6 00:40:54", status: "pending" },
  { id: "a64f5221-9a7b-4c3d-8e2f-1b5a6c7d8e9f", name: "用户购买流程-19", shortId: "a64f5221-9a7...", userId: "user_mjbflkf", type: "购买流程", ip: "192.168.194.245", createdAt: "2026/5/6 00:40:54", status: "certified" },
  { id: "771b9ebd-0f9a-4b2c-8d3e-4f5a6b7c8d9e", name: "用户支付流程-18", shortId: "771b9ebd-0f9...", userId: "user_e91z7j", type: "支付流程", ip: "192.168.35.224", createdAt: "2026/5/6 00:40:54", status: "certified" },
  { id: "b56ecf55-1a2b-4c3d-8e4f-5a6b7c8d9e0f", name: "用户浏览流程-17", shortId: "b56ecf55-1a2...", userId: "user_c0deyk", type: "浏览流程", ip: "192.168.100.50", createdAt: "2026/5/5 15:30:22", status: "certified" },
  { id: "c2c7e061-2b3c-4d5e-8f6a-7b8c9d0e1f2a", name: "用户登录流程-16", shortId: "c2c7e061-2b3...", userId: "user_yebohr", type: "登录流程", ip: "192.168.200.100", createdAt: "2026/5/5 10:15:30", status: "certified" },
  { id: "e3b74593-3c4d-5e6f-8a7b-9c0d1e2f3a4b", name: "用户购买流程-15", shortId: "e3b74593-3c4...", userId: "user_osvpzm", type: "购买流程", ip: "192.168.50.75", createdAt: "2026/5/4 11:53:47", status: "pending" },
  { id: "b0eb9946-4d5e-6f7a-8b9c-0d1e2f3a4b5c", name: "用户登录流程-14", shortId: "b0eb9946-4d5...", userId: "user_dgfr0x", type: "登录流程", ip: "192.168.150.25", createdAt: "2026/5/4 09:20:15", status: "pending" },
  { id: "3f5791c4-5e6f-7a8b-9c0d-1e2f3a4b5c6d", name: "用户支付流程-13", shortId: "3f5791c4-5e6...", userId: "user_93y499", type: "支付流程", ip: "192.168.75.150", createdAt: "2026/5/3 16:45:30", status: "pending" },
];

type StatusFilter = "all" | "certified" | "pending" | "failed";

// ==================== 可信时间戳认证弹窗 ====================

function TimestampAuthModal({ track, onClose, onSuccess }: { track: Track; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [formData, setFormData] = useState({
    fileName: `${track.name}-${track.type}`,
    ownerType: "personal" as "personal" | "enterprise",
    idNumber: "",
    creditCode: "",
    declaration: "",
  });
  const [certificateInfo, setCertificateInfo] = useState<any>(null);

  const handleSubmit = () => {
    if (!formData.declaration.trim()) {
      alert("请填写权利声明");
      return;
    }
    setStep("processing");

    // 模拟5秒认证过程
    setTimeout(() => {
      const certId = `TSA-${Date.now().toString(36).toUpperCase()}`;
      const now = new Date();
      const expireDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());

      setCertificateInfo({
        certId,
        fileName: formData.fileName,
        ownerName: formData.ownerType === "personal" ? `个人(${formData.idNumber})` : `企业(${formData.creditCode})`,
        authTime: now.toLocaleString("zh-CN"),
        expireTime: expireDate.toLocaleDateString("zh-CN"),
        hash: `SHA256:${Math.random().toString(36).substring(2, 15)}...`,
      });
      setStep("success");
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[560px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">申请可信时间戳®️认证</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === "form" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文件名称</label>
                <input
                  type="text"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">权利人类型</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, ownerType: "personal" })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      formData.ownerType === "personal"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    个人
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, ownerType: "enterprise" })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      formData.ownerType === "enterprise"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    企业
                  </button>
                </div>
              </div>

              {formData.ownerType === "personal" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">身份证号</label>
                  <input
                    type="text"
                    placeholder="请输入身份证号码"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">统一信用代码</label>
                  <input
                    type="text"
                    placeholder="请输入统一社会信用代码"
                    value={formData.creditCode}
                    onChange={(e) => setFormData({ ...formData, creditCode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  权利声明（{formData.ownerType === "personal" ? "个人" : "企业"}）
                </label>
                <textarea
                  placeholder={`本人/本企业声明对"${formData.fileName}"拥有完整权利...`}
                  value={formData.declaration}
                  onChange={(e) => setFormData({ ...formData, declaration: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Shield className="h-4 w-4" />
                提交认证申请
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 text-center">
              <div className="animate-spin mx-auto mb-4">
                <Loader2 className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">正在认证中...</p>
              <p className="text-sm text-gray-500">联合信任时间戳服务中心正在处理您的申请</p>
            </div>
          )}

          {step === "success" && certificateInfo && (
            <div className="space-y-5">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">认证成功</h3>
                <p className="text-sm text-gray-500">您的轨迹已获得可信时间戳®️认证</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">证书编号</span>
                  <span className="text-gray-900 font-mono">{certificateInfo.certId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">文件名称</span>
                  <span className="text-gray-900">{certificateInfo.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">权利人</span>
                  <span className="text-gray-900">{certificateInfo.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">认证时间</span>
                  <span className="text-gray-900">{certificateInfo.authTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">有效期</span>
                  <span className="text-gray-900">{certificateInfo.expireTime}（10年）</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">内容哈希</span>
                  <span className="text-gray-900 font-mono text-xs">{certificateInfo.hash}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onSuccess}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  查看证书
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== 生成视频弹窗（轨迹回放预览）====================

function GenerateVideoModal({ track, onClose }: { track: Track; onClose: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const nodes = [
    { step: 1, action: "访问页面", time: "2026/4/18 16:15:40", type: "page" },
    { step: 2, action: "点击按钮", time: "2026/4/18 16:16:40", type: "click" },
    { step: 3, action: "完成操作", time: "2026/4/18 16:17:40", type: "page" },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);

    // 模拟生成过程，然后显示预览
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);

      // 自动播放轨迹回放动画
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setCurrentStep(step);
        setProgress((step / nodes.length) * 100);

        if (step >= nodes.length) {
          clearInterval(interval);
        }
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    setShowPreview(false);
    setCurrentStep(0);
    setProgress(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[640px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">生成轨迹视频</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!showPreview ? (
            <>
              {/* 生成前状态 */}
              <div className="space-y-5">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-900 mb-1">轨迹名称</p>
                  <p className="font-medium text-gray-900">{track.name}</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>• 将自动生成包含所有行为节点的可视化视频</p>
                  <p>• 视频时长约 30-60 秒</p>
                  <p>• 支持 MP4 格式下载和分享</p>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4" />
                      开始生成视频
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 轨迹回放预览 */}
              <div className="space-y-6">
                {/* 视频预览区域 */}
                <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative">
                  {/* 模拟视频画面 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                        <Activity className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-white text-lg font-medium">轨迹回放中...</p>
                      <p className="text-gray-400 text-sm mt-1">{track.name}</p>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* 当前步骤信息 */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-900 font-medium">当前节点</span>
                    <span className="text-sm text-blue-700">{currentStep}/{nodes.length}</span>
                  </div>
                  {currentStep > 0 && currentStep <= nodes.length ? (
                    <div>
                      <p className="font-medium text-gray-900">{nodes[currentStep - 1].action}</p>
                      <p className="text-sm text-gray-500 mt-1">{nodes[currentStep - 1].time}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">等待开始...</p>
                  )}
                </div>

                {/* 时间轴预览 */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">行为节点时间轴</p>
                  <div className="space-y-2">
                    {nodes.map((node, index) => (
                      <div
                        key={node.step}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          index + 1 === currentStep
                            ? "bg-blue-50 border-2 border-blue-500"
                            : index + 1 < currentStep
                            ? "bg-green-50 border-2 border-green-500"
                            : "bg-gray-50 border-2 border-gray-200"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index + 1 === currentStep
                            ? "bg-blue-600 text-white"
                            : index + 1 < currentStep
                            ? "bg-green-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}>
                          {index + 1 < currentStep ? "✓" : node.step}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            index + 1 <= currentStep ? "text-gray-900" : "text-gray-400"
                          }`}>
                            {node.action}
                          </p>
                          <p className="text-xs text-gray-500">{node.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          index + 1 <= currentStep
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {node.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setCurrentStep(0);
                      setProgress(0);
                      // 重新播放
                      let step = 0;
                      const interval = setInterval(() => {
                        step++;
                        setCurrentStep(step);
                        setProgress((step / nodes.length) * 100);
                        if (step >= nodes.length) {
                          clearInterval(interval);
                        }
                      }, 1500);
                    }}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    重新播放
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== 详情抽屉组件 ====================

function DetailDrawer({
  track,
  onClose,
  onShowTimestampAuth,
  onShowGenerateVideo
}: {
  track: Track;
  onClose: () => void;
  onShowTimestampAuth: () => void;
  onShowGenerateVideo: () => void;
}) {
  const nodes = [
    { step: 1, action: "访问页面", time: "2026/4/18 16:15:40", type: "page" },
    { step: 2, action: "点击按钮", time: "2026/4/18 16:16:40", type: "click" },
    { step: 3, action: "完成操作", time: "2026/4/18 16:17:40", type: "page" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-[480px] bg-white h-full overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">轨迹详情</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">基本信息</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">轨迹ID</span>
                <span className="text-gray-900 font-mono text-xs">{track.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">用户ID</span>
                <span className="text-gray-900">{track.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">轨迹类型</span>
                <span className="text-gray-900">{track.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">状态</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  track.status === "certified" ? "bg-green-100 text-green-700" :
                  track.status === "pending" ? "bg-blue-100 text-blue-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {track.status === "certified" ? "已认证" : track.status === "pending" ? "进行中" : "认证失败"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IP地址</span>
                <span className="text-gray-900">{track.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">创建时间</span>
                <span className="text-gray-900">{track.createdAt}</span>
              </div>
            </div>
          </div>

          {/* 行为节点时间轴 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">行为节点时间轴</h3>
            <div className="space-y-0">
              {nodes.map((node, index) => (
                <div key={node.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                      {node.step}
                    </div>
                    {index < nodes.length - 1 && (
                      <div className="w-0.5 h-12 bg-blue-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{node.action}</span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{node.type}</span>
                    </div>
                    <span className="text-xs text-gray-500">{node.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3 pt-4 border-t">
            <button
              onClick={onShowGenerateVideo}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Activity className="h-4 w-4" />
              生成视频
            </button>
            <button
              onClick={onShowTimestampAuth}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Clock className="h-4 w-4" />
              申请认证
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 主页面组件 ====================

function TracksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [trackId, setTrackId] = useState("");
  const [userId, setUserId] = useState("");
  const [trackType, setTrackType] = useState("all");
  const [showTimestampAuth, setShowTimestampAuth] = useState(false);
  const [showGenerateVideo, setShowGenerateVideo] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const filteredTracks = tracksData.filter(track => {
    const matchesSearch = !searchTerm || track.name.toLowerCase().includes(searchTerm.toLowerCase()) || track.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || track.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: tracksData.length,
    certified: tracksData.filter(t => t.status === "certified").length,
    pending: tracksData.filter(t => t.status === "pending").length,
    failed: tracksData.filter(t => t.status === "failed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56">
        <Header title="轨迹列表" subtitle="查看和管理用户行为轨迹记录" />

        <div className="p-6 max-w-6xl mx-auto">
          {/* 搜索和筛选区域 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索用户ID或轨迹名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                />
              </div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white"
              >
                <Filter className="h-4 w-4" />
                高级搜索
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              </button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
              >
                <option value="all">全部状态</option>
                <option value="certified">已认证</option>
                <option value="pending">进行中</option>
                <option value="failed">认证失败</option>
              </select>
            </div>

            {/* 高级搜索 */}
            {showAdvanced && (
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">轨迹ID</label>
                  <input
                    type="text"
                    placeholder="输入轨迹ID"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">用户ID</label>
                  <input
                    type="text"
                    placeholder="输入用户ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">轨迹类型</label>
                  <select
                    value={trackType}
                    onChange={(e) => setTrackType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <option value="all">全部类型</option>
                    <option value="register">注册流程</option>
                    <option value="purchase">购买流程</option>
                    <option value="payment">支付流程</option>
                    <option value="browse">浏览流程</option>
                    <option value="login">登录流程</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">时间范围</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
              </div>
            )}

            {/* 快速筛选 */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">快速筛选</span>
              <div className="flex gap-2">
                {(["all", "certified", "pending", "failed"] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                      statusFilter === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" ? `全部 (${counts.all})` :
                     status === "certified" ? `已认证 (${counts.certified})` :
                     status === "pending" ? `进行中 (${counts.pending})` :
                     `认证失败 (${counts.failed})`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 轨迹卡片列表 */}
          <div className="space-y-4">
            {filteredTracks.map((track) => (
              <div key={track.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{track.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          track.status === "certified" ? "bg-green-100 text-green-700" :
                          track.status === "pending" ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {track.status === "certified" ? "已认证" : track.status === "pending" ? "进行中" : "认证失败"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{track.shortId}</p>
                      <div className="grid grid-cols-4 gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">用户ID</span>
                          <p className="text-gray-900 mt-0.5">{track.userId}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">类型</span>
                          <p className="text-gray-900 mt-0.5">{track.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">IP地址</span>
                          <p className="text-gray-900 mt-0.5">{track.ip}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">创建时间</span>
                          <p className="text-gray-900 mt-0.5">{track.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTrack(track)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 详情抽屉 */}
        {selectedTrack && (
          <DetailDrawer
            track={selectedTrack}
            onClose={() => setSelectedTrack(null)}
            onShowTimestampAuth={() => setShowTimestampAuth(true)}
            onShowGenerateVideo={() => setShowGenerateVideo(true)}
          />
        )}

        {/* 可信时间戳认证弹窗 */}
        {showTimestampAuth && selectedTrack && (
          <TimestampAuthModal
            track={selectedTrack}
            onClose={() => setShowTimestampAuth(false)}
            onSuccess={() => {
              setAuthSuccess(true);
              setShowTimestampAuth(false);
            }}
          />
        )}

        {/* 生成视频弹窗 */}
        {showGenerateVideo && selectedTrack && (
          <GenerateVideoModal
            track={selectedTrack}
            onClose={() => setShowGenerateVideo(false)}
          />
        )}
      </main>
    </div>
  );
}
