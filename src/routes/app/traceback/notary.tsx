import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/traceback/Sidebar";
import { Header } from "@/components/traceback/Header";
import { Search, Filter, Eye, Download, Share2, ChevronRight, X, CheckCircle2, Loader2, FileCheck } from "lucide-react";

export const Route = createFileRoute("/app/traceback/notary")({
  component: NotaryPage,
});

// ==================== 模拟数据 ====================

interface NotaryRecord {
  id: string;
  shortId: string;
  userId: string;
  type: string;
  startTime: string;
  notaryStatus: "applied" | "applying" | "not_applied";
  hasCertificate: boolean;
}

const notaryData: NotaryRecord[] = [
  { id: "9cfa3c19...", shortId: "9cfa3c19...", userId: "user_aqh0qb", type: "注册流程", startTime: "2026/04/18 16:15:40", notaryStatus: "applied", hasCertificate: true },
  { id: "a64f5221...", shortId: "a64f5221...", userId: "user_mjbflkf", type: "购买流程", startTime: "2026/04/13 11:26:59", notaryStatus: "applied", hasCertificate: false },
  { id: "771b9ebd...", shortId: "771b9ebd...", userId: "user_e91z7j", type: "支付流程", startTime: "2026/04/17 15:41:58", notaryStatus: "applied", hasCertificate: true },
  { id: "b56ecf55...", shortId: "b56ecf55...", userId: "user_c0deyk", type: "浏览流程", startTime: "2026/04/06 07:56:54", notaryStatus: "applied", hasCertificate: false },
  { id: "c2c7e061...", shortId: "c2c7e061...", userId: "user_yebohr", type: "浏览流程", startTime: "2026/05/03 03:02:07", notaryStatus: "applied", hasCertificate: true },
  { id: "e3b74593...", shortId: "e3b74593...", userId: "user_osvpzm", type: "购买流程", startTime: "2026/05/04 11:53:47", notaryStatus: "applying", hasCertificate: false },
  { id: "b0eb9946...", shortId: "b0eb9946...", userId: "user_dgfr0x", type: "登录流程", startTime: "2026/04/09 11:45:19", notaryStatus: "applying", hasCertificate: false },
  { id: "3f5791c4...", shortId: "3f5791c4...", userId: "user_93y499", type: "支付流程", startTime: "2026/04/25 11:36:16", notaryStatus: "applying", hasCertificate: false },
  { id: "a164a68f...", shortId: "a164a68f...", userId: "user_nzkwxm", type: "注册流程", startTime: "2026/04/13 19:38:37", notaryStatus: "not_applied", hasCertificate: false },
  { id: "3508e9c6...", shortId: "3508e9c6...", userId: "user_3e0oxq", type: "购买流程", startTime: "2026/04/19 09:17:29", notaryStatus: "not_applied", hasCertificate: false },
];

type StatusFilter = "all" | "applied" | "applying" | "not_applied";
type TypeFilter = "all" | "register" | "purchase" | "payment" | "browse" | "login";

// ==================== 申请公证弹窗 ====================

function NotaryApplyModal({
  selectedRecords,
  onClose,
  onSuccess
}: {
  selectedRecords: NotaryRecord[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [formData, setFormData] = useState({
    applicantName: "",
    applicantIdType: "personal" as "personal" | "enterprise",
    idNumber: "",
    creditCode: "",
    purpose: "",
    needPaper: false,
  });

  const handleSubmit = () => {
    if (!formData.applicantName.trim()) {
      alert("请填写申请人姓名");
      return;
    }
    if (!formData.purpose.trim()) {
      alert("请填写公证用途");
      return;
    }

    setStep("processing");

    // 模拟3秒处理过程
    setTimeout(() => {
      setStep("success");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[560px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">申请公证书</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === "form" && (
            <div className="space-y-5">
              {/* 选中的轨迹列表 */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-900 mb-2">已选择 {selectedRecords.length} 条轨迹记录</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedRecords.map(record => (
                    <div key={record.id} className="text-xs text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {record.userId} - {record.type}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">申请人姓名</label>
                <input
                  type="text"
                  placeholder="请输入申请人姓名"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">申请人类型</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, applicantIdType: "personal" })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      formData.applicantIdType === "personal"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    个人
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, applicantIdType: "enterprise" })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      formData.applicantIdType === "enterprise"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    企业
                  </button>
                </div>
              </div>

              {formData.applicantIdType === "personal" ? (
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
                <label className="block text-sm font-medium text-gray-700 mb-2">公证用途</label>
                <textarea
                  placeholder="请说明公证用途，如：司法诉讼、合同纠纷、证据保全等"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="needPaper"
                  checked={formData.needPaper}
                  onChange={(e) => setFormData({ ...formData, needPaper: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="needPaper" className="text-sm text-gray-700">需要纸质公证书（邮寄到付）</label>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileCheck className="h-4 w-4" />
                提交公证申请
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 text-center">
              <div className="animate-spin mx-auto mb-4">
                <Loader2 className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">正在提交申请...</p>
              <p className="text-sm text-gray-500">公证处正在处理您的申请</p>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">申请成功</h3>
                <p className="text-sm text-gray-500">
                  已成功提交 {selectedRecords.length} 条轨迹的公证申请
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2">
                <p className="text-gray-600">• 公证处将在3-5个工作日内审核</p>
                <p className="text-gray-600">• 审核结果将通过短信通知</p>
                {formData.needPaper && <p className="text-gray-600">• 纸质公证书将邮寄到您填写的地址</p>}
              </div>
              <button
                onClick={onSuccess}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                完成
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== 主页面组件 ====================

function NotaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showNotaryModal, setShowNotaryModal] = useState(false);

  const filteredData = notaryData.filter(record => {
    const matchesSearch = !searchTerm || record.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.notaryStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCount = selectedIds.length;
  const selectedRecords = notaryData.filter(r => selectedIds.includes(r.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(r => r.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56">
        <Header title="公证申请" subtitle="选择轨迹记录申请公证服务" />

        <div className="p-6 max-w-6xl mx-auto">
          {/* 搜索和筛选区域 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索用户ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white">
                <Filter className="h-4 w-4" />
                高级筛选
              </button>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
              >
                <option value="all">全部类型</option>
                <option value="register">注册流程</option>
                <option value="purchase">购买流程</option>
                <option value="payment">支付流程</option>
                <option value="browse">浏览流程</option>
                <option value="login">登录流程</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
              >
                <option value="all">全部状态</option>
                <option value="applied">已申请</option>
                <option value="applying">申请中</option>
                <option value="not_applied">未申请</option>
              </select>
              <button
                onClick={() => selectedCount > 0 && setShowNotaryModal(true)}
                disabled={selectedCount === 0}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  selectedCount > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                申请公证 ({selectedCount})
              </button>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">轨迹ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">用户ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">类型</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">开始时间</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">公证状态</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">纸质公证书</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(record.id)}
                        onChange={() => toggleSelect(record.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{record.shortId}</td>
                    <td className="px-6 py-4 text-gray-900">{record.userId}</td>
                    <td className="px-6 py-4 text-gray-600">{record.type}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{record.startTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.notaryStatus === "applied" ? "bg-green-100 text-green-700" :
                        record.notaryStatus === "applying" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {record.notaryStatus === "applied" ? "已申请" :
                         record.notaryStatus === "applying" ? "申请中" :
                         "未申请"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.hasCertificate ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          已上传
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {record.notaryStatus === "applied" ? (
                          <>
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="查看">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="下载">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors" title="分享">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                            查看详情
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 申请公证弹窗 */}
        {showNotaryModal && selectedRecords.length > 0 && (
          <NotaryApplyModal
            selectedRecords={selectedRecords}
            onClose={() => setShowNotaryModal(false)}
            onSuccess={() => {
              setShowNotaryModal(false);
              setSelectedIds([]);
            }}
          />
        )}
      </main>
    </div>
  );
}
