import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2, Power, PowerOff, Calendar, FileText, X } from "lucide-react";
import {
  createTrialAccount,
  deleteTrialAccount,
  getTrialAccountStorageMode,
  listTrialAccounts,
  setTrialAccountDisabled,
  setTrialAccountExpiry,
  type TrialAccount,
} from "@/lib/trialAccounts";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

// 更新日志类型
interface ChangelogItem {
  type: "feature" | "optimize" | "fix";
  text: string;
}

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  items: ChangelogItem[];
}

const defaultChangelog: ChangelogEntry[] = [
  {
    id: "1",
    version: "v1.3.0",
    date: "2026-07-06",
    title: "平台LOGO统一与UI优化",
    items: [
      { type: "feature", text: "登录页和平台选择页统一使用TSA官方LOGO（联合信任时间戳服务中心圆形徽标）" },
      { type: "optimize", text: "创建PlatformLogo共享组件，支持sm/md/lg三种尺寸复用" },
      { type: "fix", text: "修复CDN图片URL过期导致LOGO显示为白色圆形的问题" },
      { type: "optimize", text: "更新日志日期格式改为中文显示（如'2026年7月6日'）" },
    ],
  },
  {
    id: "2",
    version: "v1.2.5",
    date: "2026-07-06",
    title: "管理员后台更新日志功能迁移",
    items: [
      { type: "feature", text: "将更新日志从剧本平台移到管理员后台，支持新增和删除操作" },
      { type: "feature", text: "实现Tab切换模式，整合试用账户管理和更新日志管理" },
      { type: "optimize", text: "移除剧本平台Header中的'更新日志'导航项" },
    ],
  },
  {
    id: "3",
    version: "v1.2.0",
    date: "2026-07-06",
    title: "路由跳转与登录功能修复",
    items: [
      { type: "fix", text: "修复剧本平台登录页跳转到演示平台登录页的问题（/scripts → /app/scripts）" },
      { type: "fix", text: "修复Header Logo点击跳转到演示平台登录页的问题（/ → /app）" },
      { type: "fix", text: "修复新建试用账户无法登录的问题（数据源从supabase改为localStorage）" },
    ],
  },
  {
    id: "4",
    version: "v1.1.0",
    date: "2026-07-06",
    title: "演示平台扩展与UI对齐",
    items: [
      { type: "feature", text: "新增8个AI演示平台：漫剧、小说、素材、课程、音乐、协议见证、行为回溯" },
      { type: "optimize", text: "除剧本平台外其他平台显示'敬请期待'按钮" },
      { type: "fix", text: "统一所有平台卡片的图标和按钮底部对齐" },
    ],
  },
];

function getIconColor(type: string) {
  switch (type) {
    case "feature": return "text-green-500";
    case "optimize": return "text-blue-500";
    case "fix": return "text-yellow-500";
    default: return "text-gray-500";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "feature": return "新增";
    case "optimize": return "优化";
    case "fix": return "修复";
    default: return type;
  }
}

function AdminPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ email: string; type: "admin" | "trial" } | null>(null);
  const [accounts, setAccounts] = useState<TrialAccount[]>([]);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAccount, setNewAccount] = useState({ email: "", password: "", days: 30 });
  const [activeTab, setActiveTab] = useState<"accounts" | "changelog">("accounts");
  const [showAddChangelog, setShowAddChangelog] = useState(false);
  const [newChangelog, setNewChangelog] = useState({ version: "", date: new Date().toISOString().split("T")[0], title: "", items: [{ type: "feature" as const, text: "" }] });
  const storageMode = getTrialAccountStorageMode();

  useEffect(() => {
    const email = localStorage.getItem("platformEmail");
    const type = localStorage.getItem("platformUserType") as "admin" | "trial";

    if (!email || type !== "admin") {
      navigate({ to: "/" });
      return;
    }

    setUserInfo({ email, type });
    loadAccounts();
    loadChangelog();
    setIsLoading(false);
  }, [navigate]);

  const loadAccounts = async () => {
    try {
      setAccounts(await listTrialAccounts());
    } catch (err) {
      console.error("加载账号异常:", err);
    }
  };

  const saveAccounts = (updatedAccounts: TrialAccount[]) => {
    setAccounts(updatedAccounts);
  };

  const loadChangelog = () => {
    // 始终使用最新的默认数据，确保显示今日真实更新记录
    setChangelog(defaultChangelog);
    localStorage.setItem("adminChangelog", JSON.stringify(defaultChangelog));
  };

  const saveChangelog = (updated: ChangelogEntry[]) => {
    setChangelog(updated);
    localStorage.setItem("adminChangelog", JSON.stringify(updated));
  };

  const handleCreateAccount = async () => {
    if (!newAccount.email || !newAccount.password) {
      alert("请填写邮箱和密码");
      return;
    }

    try {
      const accountData = {
        email: newAccount.email,
        password: newAccount.password,
        expiry: new Date(Date.now() + newAccount.days * 24 * 60 * 60 * 1000).toISOString(),
        disabled: false,
      };

      const inserted = await createTrialAccount(accountData);
      setAccounts([inserted, ...accounts]);
      setNewAccount({ email: "", password: "", days: 30 });
      setShowCreateForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "创建账号时发生错误");
      console.error(err);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (confirm("确定要删除此账户吗？")) {
      try {
        await deleteTrialAccount(id);
        setAccounts(accounts.filter((a) => a.id !== id));
      } catch (err) {
        alert("删除账号时发生错误");
        console.error(err);
      }
    }
  };

  const handleToggleDisabled = async (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    try {
      const updatedAccount = await setTrialAccountDisabled(account, !account.disabled);
      setAccounts(accounts.map((a) =>
        a.id === id ? updatedAccount : a
      ));
    } catch (err) {
      alert("操作账号时发生错误");
      console.error(err);
    }
  };

  const handleExtend = async (id: string, days: number) => {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    try {
      const currentExpiry = new Date(account.expiry);
      const isExpired = currentExpiry < new Date();
      const baseDate = isExpired ? new Date() : currentExpiry;
      const newExpiry = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

      const updatedAccount = await setTrialAccountExpiry(account, newExpiry);
      setAccounts(accounts.map((a) => {
        if (a.id === id) {
          return updatedAccount;
        }
        return a;
      }));
    } catch (err) {
      alert("延期账号时发生错误");
      console.error(err);
    }
  };

  const handleAddChangelog = () => {
    if (!newChangelog.version || !newChangelog.title) {
      alert("请填写版本号和标题");
      return;
    }

    const validItems = newChangelog.items.filter((item) => item.text.trim());
    if (validItems.length === 0) {
      alert("请至少添加一条更新内容");
      return;
    }

    const entry: ChangelogEntry = {
      id: Date.now().toString(),
      version: newChangelog.version,
      date: newChangelog.date,
      title: newChangelog.title,
      items: validItems,
    };

    const updated = [entry, ...changelog];
    saveChangelog(updated);
    setNewChangelog({ version: "", date: new Date().toISOString().split("T")[0], title: "", items: [{ type: "feature", text: "" }] });
    setShowAddChangelog(false);
  };

  const handleDeleteChangelog = (id: string) => {
    if (confirm("确定要删除此条更新日志吗？")) {
      const updated = changelog.filter((c) => c.id !== id);
      saveChangelog(updated);
    }
  };

  const addChangelogItem = () => {
    setNewChangelog({
      ...newChangelog,
      items: [...newChangelog.items, { type: "feature", text: "" }],
    });
  };

  const updateChangelogItem = (index: number, field: keyof ChangelogItem, value: string) => {
    const updated = [...newChangelog.items];
    updated[index] = { ...updated[index], [field]: value };
    setNewChangelog({ ...newChangelog, items: updated });
  };

  const removeChangelogItem = (index: number) => {
    if (newChangelog.items.length > 1) {
      const updated = newChangelog.items.filter((_, i) => i !== index);
      setNewChangelog({ ...newChangelog, items: updated });
    }
  };

  if (isLoading) return null;
  if (!userInfo) return null;

  const isExpired = (expiry: string) => new Date(expiry) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/platform" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">管理员后台</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "accounts" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            试用账户管理
          </button>
          <button
            onClick={() => setActiveTab("changelog")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "changelog" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            更新日志管理
          </button>
        </div>

        {/* 试用账户管理 */}
        {activeTab === "accounts" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">账户列表 ({accounts.length})</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                创建账户
              </button>
            </div>

            <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/40 px-4 py-3 text-sm text-gray-300">
              账号数据模式：
              <span className={storageMode === "supabase" ? "text-green-400" : "text-yellow-400"}>
                {storageMode === "supabase" ? " Supabase 云端同步" : " 本地浏览器 Demo"}
              </span>
              {storageMode === "local" && (
                <span className="ml-2 text-gray-400">配置 Supabase 环境变量后可跨设备共享试用账号。</span>
              )}
            </div>

            {showCreateForm && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">创建新账户</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">邮箱</label>
                    <input
                      type="email"
                      value={newAccount.email}
                      onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">密码</label>
                    <input
                      type="password"
                      value={newAccount.password}
                      onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="至少6位"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">有效期（天）</label>
                    <input
                      type="number"
                      value={newAccount.days}
                      onChange={(e) => setNewAccount({ ...newAccount, days: parseInt(e.target.value) || 30 })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      min="1"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCreateAccount} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">确认创建</button>
                  <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">取消</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {accounts.map((account) => {
                const expired = isExpired(account.expiry);
                return (
                  <div key={account.id} className={`bg-gray-800/50 border rounded-xl p-4 ${account.disabled ? "border-red-700 opacity-60" : expired ? "border-yellow-700" : "border-gray-700"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-medium">{account.email}</h3>
                          {account.disabled && <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-xs rounded">已停用</span>}
                          {expired && !account.disabled && <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 text-xs rounded">已过期</span>}
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>密码: {account.password}</p>
                          <p>有效期至: {new Date(account.expiry).toLocaleDateString("zh-CN")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleDisabled(account.id)} className={`p-2 rounded-lg transition-colors ${account.disabled ? "bg-green-600/20 text-green-400 hover:bg-green-600/30" : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"}`} title={account.disabled ? "启用" : "停用"}>
                          {account.disabled ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                        </button>
                        <button onClick={() => handleExtend(account.id, 30)} className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg transition-colors" title="续展30天">
                          <Calendar className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteAccount(account.id)} className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors" title="删除">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {accounts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p>暂无试用账户</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* 更新日志管理 */}
        {activeTab === "changelog" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">更新日志 ({changelog.length})</h2>
              <button
                onClick={() => setShowAddChangelog(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                新增更新
              </button>
            </div>

            {showAddChangelog && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">新增更新日志</h3>
                  <button onClick={() => setShowAddChangelog(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">版本号</label>
                    <input
                      type="text"
                      value={newChangelog.version}
                      onChange={(e) => setNewChangelog({ ...newChangelog, version: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="如 v1.3.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">日期</label>
                    <input
                      type="date"
                      value={newChangelog.date}
                      onChange={(e) => setNewChangelog({ ...newChangelog, date: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">标题</label>
                    <input
                      type="text"
                      value={newChangelog.title}
                      onChange={(e) => setNewChangelog({ ...newChangelog, title: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="更新内容概述"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">更新内容</label>
                  {newChangelog.items.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <select
                        value={item.type}
                        onChange={(e) => updateChangelogItem(index, "type", e.target.value)}
                        className="px-2 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                      >
                        <option value="feature">新增</option>
                        <option value="optimize">优化</option>
                        <option value="fix">修复</option>
                      </select>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateChangelogItem(index, "text", e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        placeholder="描述更新内容"
                      />
                      {newChangelog.items.length > 1 && (
                        <button onClick={() => removeChangelogItem(index)} className="p-2 text-red-400 hover:text-red-300">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addChangelogItem} className="text-sm text-purple-400 hover:text-purple-300 mt-1">+ 添加更多</button>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleAddChangelog} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">确认添加</button>
                  <button onClick={() => setShowAddChangelog(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">取消</button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {changelog.map((entry) => (
                <div key={entry.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{entry.version}</span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(entry.date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                    <button onClick={() => handleDeleteChangelog(entry.id)} className="p-2 text-red-400 hover:text-red-300" title="删除">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{entry.title}</h3>
                  <ul className="space-y-2">
                    {entry.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FileText className={`h-4 w-4 mt-0.5 flex-shrink-0 ${getIconColor(item.type)}`} />
                        <div>
                          <span className={`text-xs font-medium mr-2 ${getIconColor(item.type)}`}>[{getTypeLabel(item.type)}]</span>
                          <span className="text-sm text-gray-300">{item.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {changelog.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p>暂无更新日志</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
