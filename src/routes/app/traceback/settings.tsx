import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/traceback/Sidebar";
import { Header } from "@/components/traceback/Header";
import { Search, Plus, Pencil, Trash2, User, Shield, Key, Building2, FileCheck, Clock, Bell } from "lucide-react";

export const Route = createFileRoute("/app/traceback/settings")({
  component: SettingsPage,
});

// ==================== 模拟数据 ====================

interface UserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "disabled";
}

const usersData: UserItem[] = [
  { id: "1", name: "系统管理员", username: "admin", email: "admin@company.com", phone: "13800138000", role: "管理员", status: "active" },
  { id: "2", name: "张三", username: "zhangsan", email: "zhangsan@company.com", phone: "13800138001", role: "普通用户", status: "active" },
  { id: "3", name: "李四", username: "lisi", email: "lisi@company.com", phone: "13800138002", role: "普通用户", status: "active" },
  { id: "4", name: "王五", username: "wangwu", email: "wangwu@company.com", phone: "13800138003", role: "普通用户", status: "disabled" },
  { id: "5", name: "赵六", username: "zhaoliu", email: "zhaoliu@company.com", phone: "13800138004", role: "普通用户", status: "active" },
  { id: "6", name: "孙七", username: "sunqi", email: "sunqi@company.com", phone: "13800138005", role: "普通用户", status: "active" },
];

type SettingsTab = "users" | "roles" | "permissions" | "org" | "notary" | "tsa" | "notifications";

const settingsTabs: { id: SettingsTab; label: string; icon: any }[] = [
  { id: "users", label: "用户管理", icon: User },
  { id: "roles", label: "角色设置", icon: Shield },
  { id: "permissions", label: "权限设置", icon: Key },
  { id: "org", label: "组织架构", icon: Building2 },
  { id: "notary", label: "公证处配置", icon: FileCheck },
  { id: "tsa", label: "TSA服务", icon: Clock },
  { id: "notifications", label: "通知设置", icon: Bell },
];

// ==================== 主页面组件 ====================

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("users");
  const [users, setUsers] = useState(usersData);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const filteredUsers = users.filter(user =>
    !searchTerm || user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56">
        <Header title="系统设置" subtitle="配置用户、角色、权限及系统参数" />

        <div className="p-6 max-w-6xl mx-auto">
          {/* Tab导航 */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 用户管理内容 */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-gray-900">用户管理</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索用户..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                    />
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Plus className="h-4 w-4" />
                  新增用户
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">用户</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">联系方式</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">角色</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.role}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {user.status === "active" ? "正常" : "禁用"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 其他Tab占位 */}
          {activeTab !== "users" && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {settingsTabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-gray-500">该功能模块正在开发中</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
