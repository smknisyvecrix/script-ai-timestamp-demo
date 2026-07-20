import { useLocation, useNavigate } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  List, 
  Settings, 
  Link2, 
  FileCheck, 
  User,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { path: "/app/traceback/", label: "仪表盘", icon: LayoutDashboard },
  { path: "/app/traceback/tracks", label: "轨迹列表", icon: List },
  { path: "/app/traceback/config", label: "轨迹配置", icon: Settings },
  { path: "/app/traceback/api", label: "API集成", icon: Link2 },
  { path: "/app/traceback/notary", label: "公证申请", icon: FileCheck },
  { path: "/app/traceback/settings", label: "系统设置", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  return (
    <aside className="w-56 bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col fixed h-full z-20">
      {/* Logo区域 */}
      <div className="p-5 border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">
            UBTB
          </div>
          <div>
            <div className="font-semibold text-sm">UBTB</div>
            <div className="text-xs text-blue-200">User Behavior Trace Backtra</div>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
                          (item.path !== "/app/traceback/" && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-white/20 text-white font-medium"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* 用户信息 */}
      <div className="p-4 border-t border-blue-500/30">
        <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium">晓旭</div>
            <div className="text-xs text-blue-200">产品经理</div>
            <div className="text-xs text-blue-200">管理员</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
