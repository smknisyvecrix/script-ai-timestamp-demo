import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingCart, Search, User, Shield, FileText, CheckCircle, ArrowLeft, Bell, X } from "lucide-react";

export const Route = createFileRoute("/app/agreement/")({
  component: AgreementHomePage,
});

// 模拟商品数据
const products = [
  { id: 1, name: "智能手表 Pro", price: 1299, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop" },
  { id: 2, name: "无线蓝牙耳机", price: 599, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop" },
  { id: 3, name: "便携充电宝", price: 199, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop" },
  { id: 4, name: "机械键盘", price: 899, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&h=300&fit=crop" },
];

// 通知公告数据
interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const NOTICES: Notice[] = [
  {
    id: "notice-1",
    title: "平台服务协议更新通知",
    content: `尊敬的用户：

为了给您提供更优质的服务，我们对《用户服务协议》进行了更新，主要变更内容如下：

1. 优化了用户隐私保护条款，明确数据收集和使用范围
2. 增加了可信时间戳®️认证相关说明，保障您的合法权益
3. 完善了争议解决机制，提供更便捷的客服渠道

本次更新将于2026年7月15日正式生效，请您仔细阅读新版协议内容。如有疑问，请联系客服咨询。

感谢您的支持与理解！

优选商城运营团队
2026年7月6日`,
    createdAt: "2026-07-06T10:00:00Z",
  },
  {
    id: "notice-2",
    title: "系统维护公告",
    content: `尊敬的用户：

为了提升系统性能和服务质量，我们将于2026年7月10日凌晨2:00-6:00进行系统维护升级。

维护期间可能出现以下情况：
- 部分功能暂时无法使用
- 页面加载速度可能变慢
- 订单提交可能延迟处理

建议您提前安排好购物计划，避免在维护期间进行重要操作。维护完成后，系统将恢复正常服务。

给您带来的不便，敬请谅解！

优选商城技术团队
2026年7月5日`,
    createdAt: "2026-07-05T15:30:00Z",
  },
];

function AgreementHomePage() {
  const [showNoticeModal, setShowNoticeModal] = useState<Notice | null>(null);
  const [confirmedNotices, setConfirmedNotices] = useState<string[]>([]);

  // 不加载localStorage，每次刷新页面重置确认状态，便于多次演示

  const handleConfirmNotice = (noticeId: string) => {
    const updated = [...confirmedNotices, noticeId];
    setConfirmedNotices(updated);
    // 不持久化到localStorage，刷新页面后可重新确认，便于多次演示
    setShowNoticeModal(null);
  };

  const unconfirmedCount = NOTICES.filter(n => !confirmedNotices.includes(n.id)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/platform" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>返回平台</span>
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gray-900">格式协议见证服务演示平台</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索商品..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/app/agreement/login" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
              <User className="h-5 w-5" />
              <span>登录/注册</span>
            </Link>
            <Link to="/app/agreement/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
              <Shield className="h-5 w-5" />
              <span>个人中心</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 通知公告栏 */}
      {NOTICES.length > 0 && (
        <section className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-800">
                <Bell className="h-5 w-5" />
                <span className="font-medium">您有 {unconfirmedCount} 条未读通知</span>
              </div>
              <div className="flex gap-2">
                {NOTICES.slice(0, 2).map((notice) => (
                  <button
                    key={notice.id}
                    onClick={() => setShowNoticeModal(notice)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      confirmedNotices.includes(notice.id)
                        ? "bg-gray-100 text-gray-600"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    {notice.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Banner区域 */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">品质生活，从这里开始</h1>
            <p className="text-lg opacity-90 mb-6">精选优质商品，为您提供安全可靠的购物体验</p>
            <button className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors">
              立即选购
            </button>
          </div>
        </div>
      </section>

      {/* 协议见证标识 */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">本平台所有用户协议均经过可信时间戳®️认证，保障您的合法权益</span>
          </div>
        </div>
      </section>

      {/* 商品列表 */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">热门商品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">¥{product.price}</span>
                  <button className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                    加入购物车
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <FileText className="h-4 w-4" />
            <span>© 2026 优选商城 - 所有用户协议均受可信时间戳®️保护</span>
          </div>
        </div>
      </footer>

      {/* 通知详情弹窗 */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-900">{showNoticeModal.title}</h3>
              </div>
              <button
                onClick={() => setShowNoticeModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 通知内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {showNoticeModal.content}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                发布时间：{new Date(showNoticeModal.createdAt).toLocaleString("zh-CN")}
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {!confirmedNotices.includes(showNoticeModal.id) ? (
                <button
                  onClick={() => handleConfirmNotice(showNoticeModal.id)}
                  className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  我已阅读并确认
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">已确认</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
