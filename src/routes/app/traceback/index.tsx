import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/traceback/Sidebar";
import { Header } from "@/components/traceback/Header";
import { 
  TrendingUp,
  Shield,
  Video,
  Activity,
  CheckCircle2,
  BarChart3,
  FileText
} from "lucide-react";

export const Route = createFileRoute("/app/traceback/")({
  component: TracebackPage,
});

// ==================== 模拟数据 ====================

const statsData = {
  totalTraces: 20,
  certified: 0,
  notarized: 3,
  videosGenerated: 0,
};

const chartData = [
  { month: "1月", traces: 320, notarizations: 280, videos: 250 },
  { month: "2月", traces: 380, notarizations: 340, videos: 310 },
  { month: "3月", traces: 420, notarizations: 390, videos: 360 },
  { month: "4月", traces: 400, notarizations: 370, videos: 340 },
  { month: "5月", traces: 450, notarizations: 410, videos: 380 },
  { month: "6月", traces: 480, notarizations: 440, videos: 410 },
];

const recentTraces = [
  { id: 20, name: "用户注册流程-20", type: "注册流程", userId: "user_aqh0qb", status: "certified", date: "2026/5/6" },
  { id: 19, name: "用户购买流程-19", type: "购买流程", userId: "user_mjbflkf", status: "pending", date: "2026/5/6" },
  { id: 18, name: "用户支付流程-18", type: "支付流程", userId: "user_xyz123", status: "certified", date: "2026/5/5" },
  { id: 17, name: "用户登录流程-17", type: "登录流程", userId: "user_abc456", status: "pending", date: "2026/5/5" },
  { id: 16, name: "用户注销流程-16", type: "注销流程", userId: "user_def789", status: "pending", date: "2026/5/4" },
];

// ==================== 带刻度的柱状图组件 ====================

function BarChartWithAxis({ data, color, title }: { data: number[]; color: string; title: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...data);
  const yTicks = [0, 150, 300, 450, 600];
  const chartHeight = 200;

  return (
    <div className="border border-gray-200 rounded-lg p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-green-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            环比: 11.6%
          </span>
          <span className="text-green-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            同比: 29.7%
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Y轴刻度 */}
        <div className="flex flex-col justify-between pr-2 text-xs text-gray-400" style={{ height: chartHeight }}>
          {[...yTicks].reverse().map(tick => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="flex-1 relative" style={{ height: chartHeight }}>
          {/* 网格线 */}
          {yTicks.map(tick => (
            <div
              key={tick}
              className="absolute left-0 right-0 border-t border-dashed border-gray-100"
              style={{ bottom: `${(tick / 600) * 100}%` }}
            />
          ))}

          {/* 柱子 */}
          <div className="absolute inset-0 flex items-end gap-2 px-2">
            {data.map((value, index) => {
              const heightPercent = max > 0 ? (value / 600) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 relative group"
                  style={{ height: '100%' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={`w-full rounded-t ${color} absolute bottom-0 transition-all cursor-pointer`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap z-10">
                      <div className="font-medium text-gray-900">{["1月", "2月", "3月", "4月", "5月", "6月"][index]}</div>
                      <div className="text-gray-500">current: {value}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X轴标签 */}
      <div className="flex gap-2 px-2 mt-2 ml-8">
        {["1月", "2月", "3月", "4月", "5月", "6月"].map((month, index) => (
          <div key={index} className="flex-1 text-center text-xs text-gray-500">{month}</div>
        ))}
      </div>
    </div>
  );
}

// ==================== 主页面组件 ====================

function TracebackPage() {
  const [chartPeriod, setChartPeriod] = useState<"month" | "quarter" | "year">("month");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-56">
        <Header title="用户行为轨迹回溯系统" subtitle="User Behavior Trace Backtracking System" />

        {/* 内容区域 */}
        <div className="p-6 space-y-6">
          {/* 统计卡片 - 图标在右侧 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">轨迹总数</p>
                <p className="text-3xl font-bold text-gray-900">{statsData.totalTraces}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">已认证</p>
                <p className="text-3xl font-bold text-gray-900">{statsData.certified}</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">已公证</p>
                <p className="text-3xl font-bold text-gray-900">{statsData.notarized}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">生成视频</p>
                <p className="text-3xl font-bold text-gray-900">{statsData.videosGenerated}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* 数据统计趋势 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">数据统计趋势</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartPeriod("month")}
                  className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                    chartPeriod === "month"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  月度
                </button>
                <button
                  onClick={() => setChartPeriod("quarter")}
                  className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                    chartPeriod === "quarter"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  季度
                </button>
                <button
                  onClick={() => setChartPeriod("year")}
                  className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                    chartPeriod === "year"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  年度
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <BarChartWithAxis 
                data={chartData.map(d => d.traces)} 
                color="bg-blue-500" 
                title="轨迹认证数量"
              />
              <BarChartWithAxis 
                data={chartData.map(d => d.notarizations)} 
                color="bg-green-500" 
                title="出具公证数量"
              />
              <BarChartWithAxis 
                data={chartData.map(d => d.videos)} 
                color="bg-purple-500" 
                title="生成视频数量"
              />
            </div>
          </div>

          {/* 底部两列布局 */}
          <div className="grid grid-cols-3 gap-6">
            {/* 最近轨迹 */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">最近轨迹</h2>
              <div className="space-y-3">
                {recentTraces.map((trace) => (
                  <div 
                    key={trace.id} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{trace.name}</span>
                          {trace.status === "certified" && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full border border-yellow-200 flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              已申请公证
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {trace.type} · {trace.userId}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{trace.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">快捷操作</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">查看轨迹管理</span>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">申请时间戳认证</span>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">生成轨迹视频</span>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">申请公证</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
