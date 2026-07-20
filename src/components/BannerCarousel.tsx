import { useState, useEffect } from "react";
import { Shield, Clock, Award, Smartphone, Monitor, PenTool, Sparkles, Users } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "AI智能剧本创作",
    subtitle: "让创意快速落地成专业剧本",
    description: "从灵感构思到完整剧本，AI全程辅助创作。提供剧情建议、角色塑造、对白优化，让你的创作更高效",
    icon: Sparkles,
    features: [
      { icon: PenTool, label: "结构化创作流程" },
      { icon: Users, label: "多人协作编辑" },
      { icon: Award, label: "专业格式导出" },
    ],
    ctaText: "开始创作",
    ctaLink: "/login",
    bgGradient: "from-primary/20 via-primary/5 to-accent/10",
  },
  {
    id: 2,
    title: "可信时间戳认证服务",
    subtitle: "让每一个原创和数据资产都得到证明",
    description: "所有创作都是有价值的。从创意开始到作品完成，随时随地申请可信时间戳认证，让您拥有司法/行政认可的原创和数据资产证明，用法律保护您的智慧成果",
    icon: Shield,
    features: [
      { icon: Clock, label: "全流程覆盖" },
      { icon: Award, label: "司法认可" },
      { icon: Shield, label: "法律保护" },
    ],
    extraSection: {
      title: "电子取证服务",
      description: "司法普遍认可的电子取证服务，覆盖线上线下所有侵权场景",
      items: [
        { icon: Monitor, label: "PC端取证" },
        { icon: Smartphone, label: "移动端取证" },
        { icon: Shield, label: "侵权行为证据固定" },
      ],
    },
    ctaText: "了解详情",
    ctaLink: "https://bd.tsa.cn/dist/evd?code=315728",
    isExternal: true,
    bgGradient: "from-blue-900/40 via-slate-900/60 to-indigo-900/40",
  },
  {
    id: 3,
    title: "全流程版权保护",
    subtitle: "从创意到成品的完整证据链",
    description: "在创作的每个关键节点自动固化证据链，形成可视化创作轨迹。截至2026年1月，全国超12万件司法裁判文书认可可信时间戳作为电子证据",
    icon: Award,
    features: [
      { icon: Clock, label: "1分钟快速出证" },
      { icon: Shield, label: "内容不可篡改" },
      { icon: Award, label: "12万+司法采信" },
    ],
    ctaText: "查看证书",
    ctaLink: "/certificates",
    bgGradient: "from-emerald-900/30 via-teal-900/20 to-cyan-900/30",
  },
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = banners[currentIndex];
  const Icon = currentBanner.icon;

  const CTAComponent = currentBanner.isExternal ? "a" : "button";
  const ctaProps = currentBanner.isExternal
    ? { href: currentBanner.ctaLink, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <section className="relative py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Banner卡片 */}
        <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${currentBanner.bgGradient} p-8 md:p-12 shadow-xl transition-all duration-500`}>
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            {/* 标题区域 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {currentBanner.title}
              </h3>
              <p className="text-lg text-primary font-medium">
                {currentBanner.subtitle}
              </p>
            </div>

            {/* 描述 */}
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {currentBanner.description}
            </p>

            {/* 特性标签 */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {currentBanner.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50">
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* 电子取证服务（仅第二个banner显示） */}
            {currentBanner.extraSection && (
              <div className="border-t border-border/30 pt-6 mb-8">
                <div className="text-center mb-4">
                  <h4 className="font-semibold text-lg mb-2">{currentBanner.extraSection.title}</h4>
                  <p className="text-sm text-muted-foreground">{currentBanner.extraSection.description}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {currentBanner.extraSection.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA按钮 */}
            <div className="text-center">
              <CTAComponent
                {...ctaProps}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {currentBanner.ctaText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </CTAComponent>
            </div>
          </div>
        </div>

        {/* 轮播指示器 */}
        <div className="flex justify-center gap-2 mt-6">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
              }`}
              aria-label={`切换到第${index + 1}个banner`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
