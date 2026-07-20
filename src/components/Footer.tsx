import { Shield, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 平台信息 */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              版权接口演示平台
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI辅助剧本创作平台，集成可信时间戳技术，为您的原创作品提供权威版权保护。
            </p>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">联系我们</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>400-XXX-XXXX</span>
              </div>
            </div>
          </div>

          {/* 版权说明 */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">版权保护</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>本平台采用国家授时中心可信时间戳技术，为创作者提供权威、不可篡改的版权认证服务。</p>
            </div>
          </div>
        </div>

        {/* 底部版权条 */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 版权接口演示平台-剧本创作平台. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
