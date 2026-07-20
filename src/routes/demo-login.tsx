import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield, User, KeyRound, X } from "lucide-react";
import { listTrialAccounts } from "@/lib/trialAccounts";

export const Route = createFileRoute("/demo-login")({
  component: PlatformLoginPage,
});

// 预设的管理员账户（不显示给用户）
const ADMIN_ACCOUNTS = [
  { email: "liugang@tsa.cn", password: "admin@" },
];

function PlatformLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<"admin" | "trial">("admin");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (loginType === "admin") {
      // 管理员登录
      const admin = ADMIN_ACCOUNTS.find(
        (a) => a.email === email && a.password === password
      );
      if (admin) {
        localStorage.setItem("platformEmail", email);
        localStorage.setItem("platformUserType", "admin");
        localStorage.removeItem("platformTrialExpiry"); // 清除试用账户的过期时间
        navigate({ to: "/platform" });
      } else {
        setError("管理员账号或密码错误");
      }
    } else {
      // 试用账户登录 - 优先使用 Supabase，未配置时使用本地 Demo 数据
      handleTrialLogin();
    }
  };

  const handleTrialLogin = async () => {
    try {
      const accounts = await listTrialAccounts();

      if (!accounts || accounts.length === 0) {
        setError("暂无可用试用账户，请联系管理员创建");
        return;
      }

      const account = accounts.find(
        (a: any) => a.email === email && a.password === password
      );

      if (!account) {
        setError("试用账号或密码错误");
        return;
      }

      // 检查是否被停用
      if (account.disabled) {
        setError("该账户已被停用，请联系管理员");
        return;
      }

      // 检查是否过期
      if (new Date(account.expiry) < new Date()) {
        setError("试用账户已过期，请联系管理员");
        return;
      }

      localStorage.setItem("platformEmail", email);
      localStorage.setItem("platformUserType", "trial");
      localStorage.setItem("platformTrialExpiry", account.expiry);
      navigate({ to: "/platform" });
    } catch (err) {
      console.error("登录异常:", err);
      setError("登录时发生错误，请稍后重试");
    }
  };

  const handleForgotPassword = () => {
    setForgotError("");
    setForgotSuccess(false);

    // 验证邮箱后缀
    if (!forgotEmail.endsWith("@tsa.cn")) {
      setForgotError("请使用 @tsa.cn 后缀的企业邮箱");
      return;
    }

    // 模拟发送邮件（实际项目中应调用 Edge Function）
    setTimeout(() => {
      setForgotSuccess(true);
      setForgotEmail("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/assets/tsa-logo.svg"
            alt="TSA Logo"
            className="w-20 h-20 mx-auto rounded-full mb-4 bg-white p-1"
          />
          <h1 className="text-2xl font-bold text-white">演示平台登录</h1>
          <p className="text-gray-400 mt-2">Demo Platform Login</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          {/* 登录类型切换 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setLoginType("admin"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                loginType === "admin"
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Shield className="inline h-4 w-4 mr-1" />
              管理员
            </button>
            <button
              onClick={() => { setLoginType("trial"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                loginType === "trial"
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <User className="inline h-4 w-4 mr-1" />
              试用账户
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder={loginType === "admin" ? "请输入管理员邮箱" : "请输入试用邮箱"}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              登录
            </button>
          </form>

          {/* 提示信息 */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            {loginType === "admin" ? (
              <div className="text-xs text-gray-400 space-y-2">
                <p className="text-purple-400">请使用企业邮箱登录</p>
                <button
                  onClick={() => setShowForgotModal(true)}
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <KeyRound className="h-3 w-3" />
                  忘记管理员账号？
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                <p>试用账户需由管理员创建</p>
                <p className="mt-1">请联系管理员获取试用账号</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 忘记密码弹窗 */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => { setShowForgotModal(false); setForgotError(""); setForgotSuccess(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold text-white mb-4">找回管理员账号</h3>

            {!forgotSuccess ? (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  请输入您的企业邮箱（@tsa.cn），我们将把管理员账号信息发送至该邮箱
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">
                      企业邮箱
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => { setForgotEmail(e.target.value); setForgotError(""); }}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 outline-none"
                      placeholder="yourname@tsa.cn"
                    />
                  </div>

                  {forgotError && (
                    <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
                      {forgotError}
                    </div>
                  )}

                  <button
                    onClick={handleForgotPassword}
                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    发送账号信息
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-600/20 flex items-center justify-center mb-4">
                  <KeyRound className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-white font-medium mb-2">邮件已发送</p>
                <p className="text-sm text-gray-400">
                  请查收您的邮箱，管理员账号信息已发送至该邮箱
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  关闭
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
