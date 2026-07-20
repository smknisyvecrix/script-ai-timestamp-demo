import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Sparkles, Shield, Zap, FileText, Bot } from "lucide-react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/app/changelog")({
  component: ChangelogPage,
});

const changelogData = [
  {
    version: "v1.2.0",
    date: "2026-07-03",
    title: "时间戳认证流程优化",
    items: [
      { type: "feature" as const, icon: Shield, text: "新增完整的时间戳认证申请流程：文件名称预设、权利人信息填写、权利声明展示" },
      { type: "feature" as const, icon: Shield, text: "支持个人和企业两种权利人类型，分别需要身份证号或统一信用代码" },
      { type: "feature" as const, icon: Zap, text: "添加5秒认证等待动画，提升用户体验" },
      { type: "feature" as const, icon: FileText, text: "认证成功后显示证书详情，并提供快捷入口查看证书" },
      { type: "optimize" as const, icon: Sparkles, text: "优化完成阶段弹窗，增加时间戳价值说明，引导用户申请认证" },
    ],
  },
  {
    version: "v1.1.0",
    date: "2026-07-02",
    title: "剧本管理与编辑器增强",
    items: [
      { type: "feature" as const, icon: FileText, text: "预设3个完整剧本（都市情感剧、悬疑推理、科幻冒险），包含丰富的内容和创作轨迹" },
      { type: "feature" as const, icon: FileText, text: "支持删除用户创建的剧本，预设剧本不可删除" },
      { type: "feature" as const, icon: Bot, text: "实现AI辅助生成功能，输入提示词即可生成剧本内容片段" },
      { type: "feature" as const, icon: FileText, text: "真实记录创作轨迹，包括手动编辑、AI生成、时间戳认证等操作" },
      { type: "optimize" as const, icon: Sparkles, text: "优化编辑器数据持久化，自动保存内容和阶段进度" },
      { type: "optimize" as const, icon: Sparkles, text: "修复预设剧本加载问题，确保进入编辑器时正确显示内容" },
    ],
  },
  {
    version: "v1.0.0",
    date: "2026-07-01",
    title: "初始版本发布",
    items: [
      { type: "feature" as const, icon: Shield, text: "实现可信时间戳®️认证核心功能" },
      { type: "feature" as const, icon: FileText, text: "五阶段创作流程：构思、大纲、初稿、修改、定稿" },
      { type: "feature" as const, icon: FileText, text: "三栏布局编辑器：阶段导航、内容编辑、操作轨迹" },
      { type: "feature" as const, icon: Shield, text: "证书管理页面：按剧本分组，支持预览、下载、查看原文" },
      { type: "feature" as const, icon: FileText, text: "用户登录注册功能" },
    ],
  },
];

function getIconColor(type: string) {
  switch (type) {
    case "feature":
      return "text-green-500";
    case "optimize":
      return "text-blue-500";
    case "fix":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "feature":
      return "新增";
    case "optimize":
      return "优化";
    case "fix":
      return "修复";
    default:
      return type;
  }
}

function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 返回按钮 */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>返回首页</span>
        </Link>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">更新日志</h1>
          <p className="text-muted-foreground">记录产品的重要功能新增和优化</p>
        </div>

        {/* 更新列表 */}
        <div className="space-y-8">
          {changelogData.map((release) => (
            <div key={release.version} className="border border-border rounded-xl p-6">
              {/* 版本信息 */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {release.version}
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{release.date}</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">{release.title}</h2>
              
              {/* 更新项列表 */}
              <ul className="space-y-3">
                {release.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 ${getIconColor(item.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <span className={`text-xs font-medium mr-2 ${getIconColor(item.type)}`}>
                          [{getTypeLabel(item.type)}]
                        </span>
                        <span className="text-sm text-foreground">{item.text}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
