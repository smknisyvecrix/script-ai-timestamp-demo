import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";

export const Route = createFileRoute("/app/agreement/login")({
  component: AgreementLoginPage,
});

// 模拟协议数据
const agreements = [
  {
    id: "user-agreement",
    title: "《用户注册与使用协议》",
    content: `
# 用户注册与使用协议

## 第一条 总则
1.1 本协议是您（以下简称"用户"）与优选商城（以下简称"平台"）之间关于用户使用本平台服务所订立的协议。

1.2 用户在注册成为本平台用户前，应当仔细阅读本协议的全部内容，特别是免除或者限制平台责任的条款、对用户权利进行限制的条款、约定争议解决方式和司法管辖的条款等。

## 第二条 账号注册
2.1 用户应当按照平台要求提供真实、准确、完整的个人信息进行注册。

2.2 用户应妥善保管自己的账号和密码，因用户保管不善导致的损失由用户自行承担。

2.3 用户不得将账号转让、出借或以其他形式提供给他人使用。

## 第三条 用户权利与义务
3.1 用户有权在遵守本协议的前提下使用平台提供的各项服务。

3.2 用户应当遵守国家法律法规，不得利用平台从事违法违规活动。

3.3 用户应当尊重知识产权，不得侵犯他人的合法权益。

## 第四条 隐私保护
4.1 平台将按照《隐私保护协议》的规定收集、使用和保护用户的个人信息。

4.2 用户同意平台在必要范围内收集和使用其个人信息以提供服务。

## 第五条 免责声明
5.1 平台不对因不可抗力、网络故障等原因导致的服务中断承担责任。

5.2 平台不对用户因使用本服务而产生的间接损失承担责任。

## 第六条 协议变更
6.1 平台有权根据需要修改本协议内容，修改后的协议将在平台上公布。

6.2 用户继续使用平台服务即视为接受修改后的协议。

## 第七条 法律适用与争议解决
7.1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。

7.2 因本协议引起的或与本协议有关的任何争议，双方应友好协商解决；协商不成的，任何一方均可向平台所在地有管辖权的人民法院提起诉讼。

**最后更新日期：2026年7月6日**
    `,
  },
  {
    id: "privacy-policy",
    title: "《隐私保护协议》",
    content: `
# 隐私保护协议

## 第一条 信息收集
1.1 我们收集的信息包括：
- 注册信息：用户名、密码、邮箱、手机号
- 交易信息：订单记录、支付信息、收货地址
- 设备信息：IP地址、浏览器类型、操作系统
- 行为信息：浏览记录、搜索记录、点击行为

1.2 我们仅在以下情况下收集您的信息：
- 为您提供服务所必需
- 履行法定义务
- 经您明确同意

## 第二条 信息使用
2.1 我们使用您的信息用于：
- 提供和改进服务
- 处理订单和支付
- 发送服务通知
- 安全防护和风险控制

2.2 我们不会将您的信息用于以下用途：
- 未经同意的营销推广
- 出售或出租给第三方
- 超出收集目的的其他用途

## 第三条 信息共享
3.1 我们仅在以下情况下共享您的信息：
- 获得您的明确同意
- 为完成交易必需的第三方（如支付机构、物流公司）
- 法律法规要求或司法机关要求

3.2 我们会与第三方签订保密协议，要求其保护您的信息安全。

## 第四条 信息安全
4.1 我们采取以下措施保护您的信息：
- 数据加密存储和传输
- 访问权限控制
- 安全审计和监控
- 定期安全评估

4.2 尽管我们采取了合理的安全措施，但互联网环境并非绝对安全，我们无法保证信息的绝对安全。

## 第五条 用户权利
5.1 您有权：
- 访问和查看您的个人信息
- 更正不准确的信息
- 删除不再需要的信息
- 撤回同意
- 注销账号

5.2 您可以通过以下方式行使权利：
- 在个人中心中管理您的信息
- 联系客服协助处理

## 第六条 Cookie使用
6.1 我们使用Cookie来：
- 记住您的登录状态
- 分析网站使用情况
- 提供个性化服务

6.2 您可以通过浏览器设置管理Cookie。

## 第七条 未成年人保护
7.1 我们特别重视未成年人的个人信息保护。

7.2 未成年人应在监护人指导下使用我们的服务。

7.3 如果我们发现收集了未成年人的信息而未获得监护人同意，将尽快删除。

## 第八条 协议更新
8.1 我们可能适时修订本隐私政策。

8.2 重大变更时，我们将通过显著方式通知您。

8.3 您继续使用服务即表示接受更新后的隐私政策。

**最后更新日期：2026年7月6日**
    `,
  },
];

function AgreementLoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToUserAgreement, setAgreedToUserAgreement] = useState(false);
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false);
  const [error, setError] = useState("");
  const [showAgreementModal, setShowAgreementModal] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (!agreedToUserAgreement || !agreedToPrivacyPolicy) {
      setError("请阅读并同意用户协议和隐私保护协议");
      return;
    }

    // 模拟登录/注册成功
    localStorage.setItem("agreementUserEmail", email);
    localStorage.setItem("agreementUserAgreements", JSON.stringify([
      { id: "user-agreement", agreedAt: new Date().toISOString() },
      { id: "privacy-policy", agreedAt: new Date().toISOString() },
    ]));

    navigate({ to: "/app/agreement/profile" });
  };

  const getAgreementContent = (id: string) => {
    return agreements.find((a) => a.id === id)?.content || "";
  };

  const getAgreementTitle = (id: string) => {
    return agreements.find((a) => a.id === id)?.title || "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回按钮 */}
        <Link to="/app/agreement" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>返回首页</span>
        </Link>

        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "用户登录" : "用户注册"}
          </h1>
          <p className="text-gray-500">
            {isLogin ? "欢迎回来，请登录您的账号" : "创建新账号，开始购物体验"}
          </p>
        </div>

        {/* 登录/注册表单 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="请输入邮箱地址"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="请再次输入密码"
                  required
                />
              </div>
            )}

            {/* 协议勾选框 */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToUserAgreement}
                  onChange={(e) => setAgreedToUserAgreement(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  我已阅读并接受{" "}
                  <button
                    type="button"
                    onClick={() => setShowAgreementModal("user-agreement")}
                    className="text-primary hover:underline"
                  >
                    《用户注册与使用协议》
                  </button>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToPrivacyPolicy}
                  onChange={(e) => setAgreedToPrivacyPolicy(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  我已阅读并接受{" "}
                  <button
                    type="button"
                    onClick={() => setShowAgreementModal("privacy-policy")}
                    className="text-primary hover:underline"
                  >
                    《隐私保护协议》
                  </button>
                </span>
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              {isLogin ? "登录" : "注册"}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "还没有账号？立即注册" : "已有账号？立即登录"}
            </button>
          </div>
        </div>
      </div>

      {/* 协议详情弹窗 */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {getAgreementTitle(showAgreementModal)}
              </h3>
              <button
                onClick={() => setShowAgreementModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 协议内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {getAgreementContent(showAgreementModal)}
                </pre>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowAgreementModal(null)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                我已阅读
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
