import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Sparkles, Crown, ArrowLeft, Zap } from "lucide-react";

export const Route = createFileRoute("/app/pricing")({
  component: PricingPage,
});

const plans = [
  {
    name: "免费版",
    price: "¥0",
    period: "",
    description: "适合初次体验剧本创作",
    icon: Sparkles,
    color: "gray",
    features: [
      "AI智能创作基础功能",
      "3个剧本项目",
      "基础梗概大纲",
      "人物设定管理",
      "1次/月 可信时间戳认证",
      "社区支持",
    ],
    ctaText: "当前版本",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "专业版",
    price: "¥99",
    period: "/月",
    description: "适合专业编剧和创作团队",
    icon: Zap,
    color: "blue",
    features: [
      "AI智能创作高级功能",
      "无限剧本项目",
      "高级梗概大纲+节拍卡片",
      "人物关系图谱",
      "剧本医生诊断报告",
      "10次/月 可信时间戳认证",
      "优先客服支持",
      "导出PDF/Word格式",
    ],
    ctaText: "立即升级",
    ctaVariant: "default" as const,
    popular: true,
  },
  {
    name: "企业版",
    price: "¥299",
    period: "/月",
    description: "适合影视公司和制作团队",
    icon: Crown,
    color: "purple",
    features: [
      "所有专业版功能",
      "团队协作（最多10人）",
      "项目管理看板",
      "版本历史回溯",
      "自定义模板库",
      "50次/月 可信时间戳认证",
      "专属客户经理",
      "API接口访问",
      "私有化部署选项",
    ],
    ctaText: "联系销售",
    ctaVariant: "default" as const,
    popular: false,
  },
];

const colorMap: Record<string, string> = {
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
};

const borderColorMap: Record<string, string> = {
  gray: "border-gray-200",
  blue: "border-blue-500",
  purple: "border-purple-500",
};

function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* 顶部导航 */}
      <header className="border-b border-gray-800 bg-black px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-white">会员权益</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4 inline-block relative">
            选择适合你的方案
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
              <path d="M2 8C40 4 80 10 120 6C160 2 180 8 198 4" stroke="#facc15" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6">
            每个方案都包含可信时间戳®️认证权益，保护你的每一部作品
          </p>
        </div>

        {/* 套餐卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative p-8 bg-gray-900 border-2 ${borderColorMap[plan.color]} ${
                  plan.popular ? "scale-105 shadow-2xl shadow-blue-500/20" : ""
                }`}
              >
                {/* 热门推荐标签 */}
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1">
                    最受欢迎
                  </Badge>
                )}

                {/* 图标和名称 */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${colorMap[plan.color]} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* 价格 */}
                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                {/* 功能列表 */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 ${plan.color === "gray" ? "text-gray-400" : "text-green-400"} flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA按钮 */}
                <Button 
                  className={`w-full ${
                    plan.ctaVariant === "outline" 
                      ? "border-gray-600 text-white hover:bg-gray-800" 
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                  variant={plan.ctaVariant}
                >
                  {plan.ctaText}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* 可信时间戳认证说明 */}
        <Card className="p-8 bg-gray-900 border border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">关于可信时间戳®️认证权益</h3>
              <p className="text-gray-400 text-sm">每个会员套餐都包含不同额度的认证次数</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-white mb-2">什么是可信时间戳？</h4>
              <p className="text-sm text-gray-400">
                由联合信任时间戳服务中心签发，证明电子数据在某个时间点已存在的法律凭证
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-white mb-2">司法认可吗？</h4>
              <p className="text-sm text-gray-400">
                截至2026年1月，全国超12万件裁判文书采信，具有强法律效力
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-white mb-2">如何使用？</h4>
              <p className="text-sm text-gray-400">
                在编辑器中点击「申请可信时间戳认证」按钮，系统自动扣除对应次数
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
