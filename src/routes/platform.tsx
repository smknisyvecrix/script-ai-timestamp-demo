import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, ExternalLink, Clock, Shield } from "lucide-react";
import { PlatformLogo } from "@/components/PlatformLogo";

export const Route = createFileRoute("/platform")({
  component: PlatformPage,
});

// 演示平台数据
const demoPlatforms = [
  {
    id: "script-creator",
    name: "AI剧本创作平台 - 演示",
    description: "AI辅助剧本创作，支持五阶段创作流程，集成可信时间戳®️认证保护原创版权",
    icon: "📝",
    path: "/app",
    features: ["多阶段创作认证", "成品认证", "创作轨迹认证", "可信时间戳认证", "证书管理"],
  },
  {
    id: "agreement-witness",
    name: "用户格式协议见证服务 - 演示",
    description: "提供电子协议签署过程的第三方见证与存证服务",
    icon: "📋",
    path: "/app/agreement",
    features: ["协议模板", "在线签署", "见证存证", "司法效力"],
  },
  {
    id: "behavior-traceback",
    name: "用户行为轨迹回溯 - 演示",
    description: "完整记录用户操作轨迹，支持全过程回溯与审计",
    icon: "🔍",
    path: "/app/traceback",
    features: ["操作记录", "轨迹回放", "异常检测", "审计报告"],
  },
  {
    id: "comic-creator",
    name: "AI漫剧平台 - 演示",
    description: "AI驱动漫画与短剧创作，从分镜到成稿一站式生成",
    icon: "🎨",
    path: "/app/comic",
    features: ["智能分镜", "角色生成", "剧情编排", "批量出图"],
  },
  {
    id: "novel-creator",
    name: "AI小说平台 - 演示",
    description: "AI辅助长篇小说创作，支持大纲规划与章节续写",
    icon: "📖",
    path: "/app/novel",
    features: ["大纲生成", "角色设定", "章节续写", "世界观构建"],
  },
  {
    id: "material-creator",
    name: "AI素材创作平台 - 演示",
    description: "AI生成设计素材、图标、背景图等创意资源",
    icon: "✨",
    path: "/app/material",
    features: ["图标生成", "背景纹理", "UI组件", "矢量素材"],
  },
  {
    id: "course-creator",
    name: "AI课程课件平台 - 演示",
    description: "AI自动生成课程大纲、PPT课件与教学材料",
    icon: "🎓",
    path: "/app/course",
    features: ["大纲规划", "PPT生成", "习题出题", "教案编写"],
  },
  {
    id: "music-creator",
    name: "AI音乐平台 - 演示",
    description: "AI辅助音乐创作，支持旋律生成、编曲与混音",
    icon: "🎵",
    path: "/app/music",
    features: ["旋律生成", "智能编曲", "歌词创作", "音频混音"],
  },
];

function PlatformPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ email: string; type: "admin" | "trial"; expiry?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("platformEmail");
    const type = localStorage.getItem("platformUserType") as "admin" | "trial";
    const expiry = localStorage.getItem("platformTrialExpiry");

    if (email && type) {
      setUserInfo({ email, type, expiry: expiry || undefined });
    } else {
      navigate({ to: "/" });
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("platformEmail");
    localStorage.removeItem("platformUserType");
    localStorage.removeItem("platformTrialExpiry");
    navigate({ to: "/" });
  };

  if (isLoading) return null;
  if (!userInfo) return null;

  const isAdmin = userInfo.type === "admin";
  const isExpired = userInfo.expiry && new Date(userInfo.expiry) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlatformLogo size="sm" />
            <div>
              <h1 className="text-lg font-bold text-white">演示平台管理中心</h1>
              <p className="text-xs text-gray-400">Demo Platform Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-white font-medium">{userInfo.email}</div>
              <div className="flex items-center gap-2 text-xs">
                {isAdmin ? (
                  <span className="text-purple-400 flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    管理员
                  </span>
                ) : (
                  <span className={`flex items-center gap-1 ${isExpired ? "text-red-400" : "text-green-400"}`}>
                    <Clock className="h-3 w-3" />
                    {isExpired ? "已过期" : `试用至 ${userInfo.expiry}`}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">欢迎使用演示平台</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">以下是可用的演示项目，点击即可进入体验完整功能</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {demoPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{platform.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{platform.name}</h3>
                  <p className="text-sm text-gray-400">{platform.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-auto">
                {platform.features.map((feature) => (
                  <span key={feature} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md">
                    {feature}
                  </span>
                ))}
              </div>

              {(platform.id === "script-creator" || platform.id === "agreement-witness" || platform.id === "behavior-traceback") ? (
                <Link
                  to={platform.path as any}
                  className="flex items-center justify-center gap-2 w-full py-3 mt-6 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors group-hover:shadow-lg group-hover:shadow-primary/20"
                >
                  <span>进入演示</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ) : (
                <div className="w-full py-3 mt-6 bg-gray-700/50 text-gray-400 rounded-lg font-medium text-center cursor-not-allowed">
                  敬请期待
                </div>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                管理员功能
              </h3>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Shield className="h-4 w-4" />
                管理试用账户
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
