import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/traceback/Sidebar";
import { Header } from "@/components/traceback/Header";
import { Monitor, Smartphone, Globe, Pencil, Trash2, Plus, X, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/traceback/config")({
  component: ConfigPage,
});

// ==================== 模拟数据 ====================

interface Config {
  id: string;
  name: string;
  description: string;
  platform: "pc" | "mobile" | "universal";
  type: string;
  autoCertify: boolean;
  status: "enabled" | "disabled";
}

const configsData: Config[] = [
  { id: "1", name: "用户注册流程", description: "PC端用户注册完整流程", platform: "pc", type: "注册流程", autoCertify: true, status: "enabled" },
  { id: "2", name: "移动端登录流程", description: "移动端用户登录流程", platform: "mobile", type: "登录流程", autoCertify: false, status: "enabled" },
  { id: "3", name: "支付流程", description: "通用支付流程配置", platform: "universal", type: "支付流程", autoCertify: true, status: "enabled" },
];

const platformIcons: Record<string, any> = {
  pc: Monitor,
  mobile: Smartphone,
  universal: Globe,
};

const platformLabels: Record<string, string> = {
  pc: "PC端",
  mobile: "移动端",
  universal: "通用",
};

// ==================== 新增/编辑配置弹窗 ====================

function ConfigModal({
  config,
  onClose,
  onSave
}: {
  config?: Config | null;
  onClose: () => void;
  onSave: (data: Omit<Config, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: config?.name || "",
    description: config?.description || "",
    platform: config?.platform || "pc" as "pc" | "mobile" | "universal",
    type: config?.type || "注册流程",
    autoCertify: config?.autoCertify ?? true,
    status: config?.status || "enabled" as "enabled" | "disabled",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("请填写配置名称");
      return;
    }
    if (!formData.description.trim()) {
      alert("请填写配置描述");
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
            {config ? "编辑配置" : "新增配置"}
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
                {config ? "修改成功" : "新增成功"}
              </h3>
              <p className="text-sm text-gray-500">配置已保存</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">配置名称</label>
                <input
                  type="text"
                  placeholder="请输入配置名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">配置描述</label>
                <textarea
                  placeholder="请输入配置描述"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">平台类型</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["pc", "mobile", "universal"] as const).map((platform) => {
                    const Icon = platformIcons[platform];
                    return (
                      <button
                        key={platform}
                        onClick={() => setFormData({ ...formData, platform })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-sm font-medium transition-colors ${
                          formData.platform === platform
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{platformLabels[platform]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">轨迹类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="注册流程">注册流程</option>
                  <option value="登录流程">登录流程</option>
                  <option value="购买流程">购买流程</option>
                  <option value="支付流程">支付流程</option>
                  <option value="浏览流程">浏览流程</option>
                  <option value="注销流程">注销流程</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">自动认证</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, autoCertify: true })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      formData.autoCertify
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    是
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, autoCertify: false })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      !formData.autoCertify
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    否
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, status: "enabled" })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      formData.status === "enabled"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    启用
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, status: "disabled" })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      formData.status === "disabled"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    禁用
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {config ? "保存修改" : "新增配置"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== 节点配置弹窗 ====================

function NodeConfigModal({ configName, onClose }: { configName: string; onClose: () => void }) {
  const [nodes, setNodes] = useState([
    { id: "1", name: "访问页面", type: "page", required: true },
    { id: "2", name: "点击按钮", type: "click", required: true },
    { id: "3", name: "完成操作", type: "page", required: false },
  ]);
  const [showAddNode, setShowAddNode] = useState(false);

  const handleAddNode = () => {
    const newNode = {
      id: String(nodes.length + 1),
      name: `新节点${nodes.length + 1}`,
      type: "page" as "page" | "click",
      required: false,
    };
    setNodes([...nodes, newNode]);
    setShowAddNode(false);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[560px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">节点配置</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-900 mb-1">配置名称</p>
            <p className="font-medium text-gray-900">{configName}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">行为节点列表</p>
              <button
                onClick={() => setShowAddNode(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                + 添加节点
              </button>
            </div>

            {nodes.map((node, index) => (
              <div key={node.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{node.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">类型: {node.type === "page" ? "页面访问" : "点击事件"}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  node.required ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {node.required ? "必选" : "可选"}
                </span>
                <button
                  onClick={() => handleDeleteNode(node.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 主页面组件 ====================

function ConfigPage() {
  const [configs, setConfigs] = useState(configsData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [nodeConfigName, setNodeConfigName] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个配置吗？")) {
      setConfigs(configs.filter(c => c.id !== id));
    }
  };

  const handleSave = (data: Omit<Config, 'id'>) => {
    if (editingConfig) {
      // 编辑模式
      setConfigs(configs.map(c =>
        c.id === editingConfig.id ? { ...c, ...data } : c
      ));
      setEditingConfig(null);
    } else {
      // 新增模式
      const newConfig: Config = {
        ...data,
        id: String(Date.now()),
      };
      setConfigs([...configs, newConfig]);
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56">
        <Header title="轨迹配置" subtitle="配置PC端/移动端用户行为流程及认证节点" />

        <div className="p-6 max-w-6xl mx-auto">
          {/* 新增按钮 */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              新增配置
            </button>
          </div>

          {/* 配置表格 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">配置名称</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">平台</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">类型</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">自动认证</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {configs.map((config) => {
                  const PlatformIcon = platformIcons[config.platform];

                  return (
                    <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{config.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{config.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <PlatformIcon className="h-4 w-4" />
                          <span>{platformLabels[config.platform]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{config.type}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          config.autoCertify
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {config.autoCertify ? "是" : "否"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          config.status === "enabled"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {config.status === "enabled" ? "启用" : "禁用"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setNodeConfigName(config.name)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            节点
                          </button>
                          <button
                            onClick={() => setEditingConfig(config)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(config.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
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
        </div>
      </main>

      {/* 新增配置弹窗 */}
      {showAddModal && (
        <ConfigModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />
      )}

      {/* 编辑配置弹窗 */}
      {editingConfig && (
        <ConfigModal
          config={editingConfig}
          onClose={() => setEditingConfig(null)}
          onSave={handleSave}
        />
      )}

      {/* 节点配置弹窗 */}
      {nodeConfigName && (
        <NodeConfigModal
          configName={nodeConfigName}
          onClose={() => setNodeConfigName(null)}
        />
      )}
    </div>
  );
}
