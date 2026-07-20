import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/traceback/Sidebar";
import { Header } from "@/components/traceback/Header";
import {
  Plus, Pencil, Trash2, Play, Pause, RefreshCw, Link2,
  Database, Building2, Users, DollarSign, Settings, FileText,
  CheckCircle2, Clock, AlertCircle, X
} from "lucide-react";

export const Route = createFileRoute("/app/traceback/api")({
  component: ApiIntegrationPage,
});

// ==================== 模拟数据 ====================

interface SystemIntegration {
  id: string;
  name: string;
  type: string;
  typeIcon: any;
  apiUrl: string;
  authMethod: string;
  syncInterval: string;
  status: "success" | "idle" | "failed" | "disabled";
  lastSync: string;
}

const integrationsData: SystemIntegration[] = [
  { id: "1", name: "广告投放平台", type: "广告系统", typeIcon: Link2, apiUrl: "https://ad.platform.com/api/v1", authMethod: "OAuth 2.0", syncInterval: "60分钟", status: "success", lastSync: "2026/5/6 00:25:07" },
  { id: "2", name: "CRM客户系统", type: "CRM系统", typeIcon: Database, apiUrl: "https://crm.sales.com/api/v3", authMethod: "Bearer Token", syncInterval: "120分钟", status: "idle", lastSync: "2026/5/5 21:25:07" },
  { id: "3", name: "ERP资源系统", type: "ERP系统", typeIcon: Building2, apiUrl: "https://erp.internal.com/api", authMethod: "Basic Auth", syncInterval: "180分钟", status: "idle", lastSync: "从未同步" },
  { id: "4", name: "HR人事系统", type: "HR系统", typeIcon: Users, apiUrl: "https://hr.company.com/api/v1", authMethod: "API Key", syncInterval: "240分钟", status: "failed", lastSync: "2026/5/5 01:25:07" },
  { id: "5", name: "财务管理系统", type: "财务系统", typeIcon: DollarSign, apiUrl: "https://finance.corp.com/api/v2", authMethod: "OAuth 2.0", syncInterval: "360分钟", status: "success", lastSync: "2026/5/6 00:55:07" },
  { id: "6", name: "数据仓库", type: "自定义", typeIcon: Settings, apiUrl: "https://data.warehouse.com/api", authMethod: "Bearer Token", syncInterval: "720分钟", status: "idle", lastSync: "从未同步" },
  { id: "7", name: "企业OA系统", type: "OA系统", typeIcon: FileText, apiUrl: "https://oa.company.com/api/v2", authMethod: "API Key", syncInterval: "30分钟", status: "success", lastSync: "2026/5/6 05:51:15" },
];

type TabType = "integrations" | "logs";

// ==================== 新增/编辑集成弹窗 ====================

function IntegrationModal({
  integration,
  onClose,
  onSave
}: {
  integration?: SystemIntegration | null;
  onClose: () => void;
  onSave: (data: Omit<SystemIntegration, 'id' | 'typeIcon'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: integration?.name || "",
    type: integration?.type || "广告系统",
    apiUrl: integration?.apiUrl || "",
    authMethod: integration?.authMethod || "OAuth 2.0",
    syncInterval: integration?.syncInterval || "60分钟",
    status: integration?.status || "idle" as "success" | "idle" | "failed" | "disabled",
    lastSync: integration?.lastSync || "从未同步",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("请填写系统名称");
      return;
    }
    if (!formData.apiUrl.trim()) {
      alert("请填写API地址");
      return;
    }

    onSave(formData);
    setShowSuccess(true);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[560px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {integration ? "编辑集成" : "新增集成"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {showSuccess ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {integration ? "修改成功" : "新增成功"}
              </h3>
              <p className="text-sm text-gray-500">集成配置已保存</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">系统名称</label>
                <input
                  type="text"
                  placeholder="请输入系统名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">系统类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="广告系统">广告系统</option>
                  <option value="CRM系统">CRM系统</option>
                  <option value="ERP系统">ERP系统</option>
                  <option value="HR系统">HR系统</option>
                  <option value="财务系统">财务系统</option>
                  <option value="OA系统">OA系统</option>
                  <option value="自定义">自定义</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API地址</label>
                <input
                  type="text"
                  placeholder="https://example.com/api/v1"
                  value={formData.apiUrl}
                  onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">认证方式</label>
                <select
                  value={formData.authMethod}
                  onChange={(e) => setFormData({ ...formData, authMethod: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="OAuth 2.0">OAuth 2.0</option>
                  <option value="Bearer Token">Bearer Token</option>
                  <option value="Basic Auth">Basic Auth</option>
                  <option value="API Key">API Key</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">同步间隔</label>
                <select
                  value={formData.syncInterval}
                  onChange={(e) => setFormData({ ...formData, syncInterval: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="30分钟">30分钟</option>
                  <option value="60分钟">60分钟</option>
                  <option value="120分钟">120分钟</option>
                  <option value="180分钟">180分钟</option>
                  <option value="240分钟">240分钟</option>
                  <option value="360分钟">360分钟</option>
                  <option value="720分钟">720分钟</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">初始状态</label>
                <div className="grid grid-cols-2 gap-3">
                  {([["idle", "空闲"], ["success", "成功"], ["failed", "失败"], ["disabled", "已停用"]] as const).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setFormData({ ...formData, status: value })}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        formData.status === value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {integration ? "保存修改" : "新增集成"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== 主页面组件 ====================

function ApiIntegrationPage() {
  const [activeTab, setActiveTab] = useState<TabType>("integrations");
  const [integrations, setIntegrations] = useState(integrationsData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<SystemIntegration | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个集成吗？")) {
      setIntegrations(integrations.filter(i => i.id !== id));
    }
  };

  const handleSave = (data: Omit<SystemIntegration, 'id' | 'typeIcon'>) => {
    const typeIconMap: Record<string, any> = {
      "广告系统": Link2,
      "CRM系统": Database,
      "ERP系统": Building2,
      "HR系统": Users,
      "财务系统": DollarSign,
      "OA系统": FileText,
      "自定义": Settings,
    };

    if (editingIntegration) {
      setIntegrations(integrations.map(i =>
        i.id === editingIntegration.id ? { ...i, ...data, typeIcon: typeIconMap[data.type] || Settings } : i
      ));
      setEditingIntegration(null);
    } else {
      const newIntegration: SystemIntegration = {
        ...data,
        id: String(Date.now()),
        typeIcon: typeIconMap[data.type] || Settings,
        lastSync: "从未同步",
      };
      setIntegrations([...integrations, newIntegration]);
      setShowAddModal(false);
    }
  };

  const runningCount = integrations.filter(i => i.status !== "disabled").length;
  const disabledCount = integrations.filter(i => i.status === "disabled").length;
  const successToday = integrations.filter(i => i.status === "success").length;
  const pendingCount = integrations.filter(i => i.status === "idle").length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56">
        <Header title="API集成配置" subtitle="配置与现有系统（OA、广告系统等）的API对接及数据同步" />

        <div className="p-6 max-w-6xl mx-auto">
          {/* Tab切换 */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("integrations")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "integrations"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              集成列表
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "logs"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              同步日志
            </button>
          </div>

          {activeTab === "integrations" && (
            <>
              {/* 系统对接配置表格 */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">系统对接配置</h2>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    新增集成
                  </button>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">系统名称</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">系统类型</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">API地址</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">认证方式</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">同步间隔</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">最后同步</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {integrations.map((integration) => {
                      const TypeIcon = integration.typeIcon;

                      return (
                        <tr key={integration.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{integration.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <TypeIcon className="h-4 w-4" />
                              <span>{integration.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">{integration.apiUrl}</td>
                          <td className="px-6 py-4 text-gray-600">{integration.authMethod}</td>
                          <td className="px-6 py-4 text-gray-600">{integration.syncInterval}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              integration.status === "success" ? "bg-green-100 text-green-700" :
                              integration.status === "failed" ? "bg-red-100 text-red-700" :
                              integration.status === "disabled" ? "bg-gray-100 text-gray-600" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {integration.status === "success" ? "成功" :
                               integration.status === "failed" ? "失败" :
                               integration.status === "disabled" ? "已停用" :
                               "空闲"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{integration.lastSync}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="测试连接">
                                <Link2 className="h-4 w-4" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="同步">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="启动">
                                <Play className="h-4 w-4" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-yellow-600 transition-colors" title="暂停">
                                <Pause className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingIntegration(integration)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                title="编辑"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(integration.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                title="删除"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 统计卡片 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Link2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">已配置系统</p>
                      <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{runningCount} 运行中</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{disabledCount} 已停用</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">今日同步成功</p>
                      <p className="text-2xl font-bold text-gray-900">{successToday}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">最近24小时同步记录</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">待同步数据</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">等待下次自动同步</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "logs" && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">同步日志</h3>
              <p className="text-gray-500">暂无同步日志记录</p>
            </div>
          )}
        </div>
      </main>

      {/* 新增集成弹窗 */}
      {showAddModal && (
        <IntegrationModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />
      )}

      {/* 编辑集成弹窗 */}
      {editingIntegration && (
        <IntegrationModal
          integration={editingIntegration}
          onClose={() => setEditingIntegration(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
