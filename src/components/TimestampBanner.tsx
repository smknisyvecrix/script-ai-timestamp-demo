import { Shield, Clock, Award, Smartphone, Monitor } from "lucide-react";

export function TimestampBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 py-16">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <a
          href="https://bd.tsa.cn/dist/evd?code=315728"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="bg-card border border-primary/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 animate-pulse-glow">
            {/* 标题区域 */}
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                可信时间戳认证服务
              </h3>
              <p className="text-lg text-primary font-medium">
                让每一个原创和数据资产都得到证明
              </p>
            </div>

            {/* 核心价值 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">全流程覆盖</h4>
                <p className="text-sm text-muted-foreground">
                  从创意开始到作品完成，随时随地申请可信时间戳认证
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">司法认可</h4>
                <p className="text-sm text-muted-foreground">
                  让您拥有司法/行政认可的原创和数据资产证明
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">法律保护</h4>
                <p className="text-sm text-muted-foreground">
                  用法律保护您的智慧成果
                </p>
              </div>
            </div>

            {/* 电子取证服务 */}
            <div className="border-t pt-6">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-lg mb-2">电子取证服务</h4>
                <p className="text-sm text-muted-foreground">
                  司法普遍认可的电子取证服务，覆盖线上线下所有侵权场景
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                  <Monitor className="w-4 h-4 text-primary" />
                  <span className="text-sm">PC端取证</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <span className="text-sm">移动端取证</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm">侵权行为证据固定</span>
                </div>
              </div>
            </div>

            {/* CTA按钮 */}
            <div className="mt-8 text-center">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                了解详情
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
