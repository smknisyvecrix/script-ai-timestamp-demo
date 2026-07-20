import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  CircleDashed,
  Dice5,
  FileCode2,
  LayoutDashboard,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
  Sparkles,
  TimerReset,
  type LucideIcon,
} from "lucide-react";
import { PlatformLogo } from "@/components/PlatformLogo";

export const Route = createFileRoute("/")({
  component: InternalLaunchPage,
});

type LaunchApp = {
  title: string;
  subtitle: string;
  description: string;
  status: string;
  href?: string;
  disabled?: boolean;
  icon: LucideIcon;
  accent: string;
  meta: string[];
};

const launchApps: LaunchApp[] = [
  {
    title: "Demo 演示",
    subtitle: "可信时间戳产品演示中心",
    description:
      "进入管理员或试用账号登录流程，体验 AI 剧本创作、协议见证、行为轨迹回溯等完整演示模块。",
    status: "已上线",
    href: "/demo-login",
    icon: MonitorCheck,
    accent: "from-blue-500 to-cyan-400",
    meta: ["账号登录", "演示管理", "自动部署"],
  },
  {
    title: "内部骰子游戏",
    subtitle: "源码接入中",
    description:
      "预留给你上传的 ZIP 游戏源码。接入后会作为独立内部应用展示，并保持统一入口体验。",
    status: "待接入",
    disabled: true,
    icon: Dice5,
    accent: "from-amber-400 to-orange-500",
    meta: ["ZIP 源码", "独立路由", "待发布"],
  },
  {
    title: "其他内部应用",
    subtitle: "应用目录扩展位",
    description:
      "后续可继续添加工具、小游戏、运营看板或客户演示项目，统一从这里进入。",
    status: "待添加",
    disabled: true,
    icon: Boxes,
    accent: "from-emerald-400 to-teal-500",
    meta: ["可扩展", "分类管理", "统一入口"],
  },
];

const highlights = [
  { label: "Cloudflare Pages", value: "在线部署", icon: LayoutDashboard },
  { label: "GitHub", value: "源码托管", icon: FileCode2 },
  { label: "HTTPS", value: "安全访问", icon: LockKeyhole },
  { label: "Demo Hub", value: "统一入口", icon: ShieldCheck },
];

function InternalLaunchPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#08111f] text-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.24),transparent_42%),linear-gradient(180deg,rgba(8,17,31,0)_0%,#08111f_72%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <PlatformLogo size="sm" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">TSA Internal Demo Hub</p>
              <p className="text-xs text-slate-400">内部应用入口</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200 sm:flex">
            <CircleDashed className="h-3.5 w-3.5" />
            tsa-demo.pages.dev
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
          <section className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-300/20 bg-blue-300/10 px-3 py-2 text-sm text-blue-100">
              <Sparkles className="h-4 w-4 text-cyan-200" />
              内部演示与工具统一入口
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              选择要进入的内部应用
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              当前页面用于承载多个内部项目。你可以先进入现有 Demo 演示，后续骰子游戏和更多应用会逐步接入到同一个入口。
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_48px_rgba(2,6,23,0.28)] backdrop-blur"
                  >
                    <Icon className="mb-3 h-5 w-5 text-cyan-200" />
                    <p className="text-sm font-medium text-white">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4">
            {launchApps.map((app, index) => (
              <LaunchCard key={app.title} app={app} index={index} />
            ))}
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Demo applications are hosted by GitHub and Cloudflare Pages.</span>
          <span className="flex items-center gap-2">
            <TimerReset className="h-3.5 w-3.5" />
            New commits will trigger automatic deployment.
          </span>
        </footer>
      </section>
    </main>
  );
}

function LaunchCard({ app, index }: { app: LaunchApp; index: number }) {
  const Icon = app.icon;
  const content = (
    <div
      className={`group relative overflow-hidden rounded-lg border p-5 transition-all duration-300 ${
        app.disabled
          ? "border-white/10 bg-white/[0.035]"
          : "border-blue-300/30 bg-white/[0.07] shadow-[0_24px_80px_rgba(37,99,235,0.18)] hover:-translate-y-0.5 hover:border-cyan-200/60"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`rounded-lg bg-gradient-to-br ${app.accent} p-[1px]`}>
            <div className="rounded-[7px] bg-[#0b1424] p-3">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-white">{app.title}</h2>
              <span
                className={`rounded-md px-2 py-1 text-xs ${
                  app.disabled
                    ? "bg-slate-500/15 text-slate-300"
                    : "bg-emerald-400/15 text-emerald-200"
                }`}
              >
                {app.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-cyan-100/80">{app.subtitle}</p>
          </div>
        </div>
        {!app.disabled && (
          <ArrowRight className="mt-2 h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
        )}
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{app.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {app.meta.map((item) => (
          <span key={item} className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${app.accent}`}
          style={{ width: app.disabled ? "42%" : index === 0 ? "100%" : "64%" }}
        />
      </div>
    </div>
  );

  if (!app.href || app.disabled) {
    return <div aria-disabled="true">{content}</div>;
  }

  return (
    <a href={app.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
      {content}
    </a>
  );
}
