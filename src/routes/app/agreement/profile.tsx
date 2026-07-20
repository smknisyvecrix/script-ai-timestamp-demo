import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, FileText, Download, Eye, X, ShieldCheck, Bell, CheckCircle } from "lucide-react";
import { TSA_VERIFY_LOGO_URL } from "@/lib/demoAssets";

export const Route = createFileRoute("/app/agreement/profile")({
  component: AgreementProfilePage,
});

// TSA验证标识LOGO URL
const TSA_LOGO_URL = TSA_VERIFY_LOGO_URL;

// 协议数据
interface AgreementRecord {
  id: string;
  title: string;
  version: string;
  agreedAt: string;
  content: string;
}

// 通知公告数据
interface NoticeRecord {
  id: string;
  title: string;
  content: string;
  confirmedAt: string;
}

const AGREEMENT_CONTENTS: Record<string, string> = {
  "user-agreement": `用户注册与使用协议

第一条 总则
1.1 本协议是您（以下简称"用户"）与优选商城（以下简称"平台"）之间关于用户使用本平台服务所订立的协议。
1.2 用户在注册成为本平台用户前，应当仔细阅读本协议的全部内容。

第二条 账号注册
2.1 用户应当按照平台要求提供真实、准确、完整的个人信息进行注册。
2.2 用户应妥善保管自己的账号和密码，因用户保管不善导致的损失由用户自行承担。

第三条 用户权利与义务
3.1 用户有权在遵守本协议的前提下使用平台提供的各项服务。
3.2 用户应当遵守国家法律法规，不得利用平台从事违法违规活动。

第四条 隐私保护
4.1 平台将按照《隐私保护协议》的规定收集、使用和保护用户的个人信息。

第五条 免责声明
5.1 平台不对因不可抗力、网络故障等原因导致的服务中断承担责任。

第六条 协议变更
6.1 平台有权根据需要修改本协议内容，修改后的协议将在平台上公布。

第七条 法律适用与争议解决
7.1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。

最后更新日期：2026年7月6日`,
  "privacy-policy": `隐私保护协议

第一条 信息收集
1.1 我们收集的信息包括：注册信息、交易信息、设备信息、行为信息。
1.2 我们仅在为您提供服务所必需、履行法定义务或经您明确同意的情况下收集信息。

第二条 信息使用
2.1 我们使用您的信息用于：提供和改进服务、处理订单和支付、发送服务通知、安全防护。
2.2 我们不会将您的信息用于未经同意的营销推广或出售给第三方。

第三条 信息共享
3.1 我们仅在获得您的明确同意、为完成交易必需的第三方或法律法规要求时共享信息。

第四条 信息安全
4.1 我们采取数据加密、访问权限控制、安全审计等措施保护您的信息。

第五条 用户权利
5.1 您有权访问、更正、删除您的个人信息，撤回同意或注销账号。

第六条 Cookie使用
6.1 我们使用Cookie来记住登录状态、分析网站使用情况和提供个性化服务。

第七条 未成年人保护
7.1 未成年人应在监护人指导下使用我们的服务。

第八条 协议更新
8.1 我们可能适时修订本隐私政策，重大变更时将通过显著方式通知您。

最后更新日期：2026年7月6日`,
};

// 通知公告内容
const NOTICE_CONTENTS: Record<string, string> = {
  "notice-1": `尊敬的用户：

为了给您提供更优质的服务，我们对《用户服务协议》进行了更新，主要变更内容如下：

1. 优化了用户隐私保护条款，明确数据收集和使用范围
2. 增加了可信时间戳®️认证相关说明，保障您的合法权益
3. 完善了争议解决机制，提供更便捷的客服渠道

本次更新将于2026年7月15日正式生效，请您仔细阅读新版协议内容。如有疑问，请联系客服咨询。

感谢您的支持与理解！

优选商城运营团队
2026年7月6日`,
  "notice-2": `尊敬的用户：

为了提升系统性能和服务质量，我们将于2026年7月10日凌晨2:00-6:00进行系统维护升级。

维护期间可能出现以下情况：
- 部分功能暂时无法使用
- 页面加载速度可能变慢
- 订单提交可能延迟处理

建议您提前安排好购物计划，避免在维护期间进行重要操作。维护完成后，系统将恢复正常服务。

给您带来的不便，敬请谅解！

优选商城技术团队
2026年7月5日`,
};

function AgreementProfilePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ email: string } | null>(null);
  const [agreements, setAgreements] = useState<AgreementRecord[]>([]);
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [showDetailModal, setShowDetailModal] = useState<AgreementRecord | null>(null);
  const [showNoticeModal, setShowNoticeModal] = useState<NoticeRecord | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("agreementUserEmail");
    if (!email) {
      navigate({ to: "/app/agreement/login" });
      return;
    }
    setUserInfo({ email });

    // 加载已确认的协议
    const stored = localStorage.getItem("agreementUserAgreements");
    if (stored) {
      const agreedList = JSON.parse(stored);
      const records: AgreementRecord[] = agreedList.map((item: any) => ({
        id: item.id,
        title: item.id === "user-agreement" ? "用户服务协议" : "隐私保护协议",
        version: "v1.0",
        agreedAt: item.agreedAt,
        content: AGREEMENT_CONTENTS[item.id] || "",
      }));
      setAgreements(records);
    }

    // 加载已确认的通知
    const noticeStored = localStorage.getItem("agreementUserNotices");
    if (noticeStored) {
      const confirmedIds = JSON.parse(noticeStored);
      const noticeRecords: NoticeRecord[] = confirmedIds.map((id: string) => ({
        id,
        title: id === "notice-1" ? "平台服务协议更新通知" : "系统维护公告",
        content: NOTICE_CONTENTS[id] || "",
        confirmedAt: new Date().toISOString(),
      }));
      setNotices(noticeRecords);
    }
  }, [navigate]);

  const handleDownload = (agreement: AgreementRecord) => {
    // 模拟下载PDF
    const blob = new Blob([agreement.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agreement.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadNotice = (notice: NoticeRecord) => {
    const blob = new Blob([notice.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${notice.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/app/agreement" className="text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">个人中心</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{userInfo.email}</h2>
              <p className="text-sm text-gray-500 mt-1">普通会员</p>
            </div>
          </div>
        </div>

        {/* 协议管理 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">协议管理</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">您已确认的用户协议列表，所有协议均经过可信时间戳®️认证</p>
          </div>

          <div className="divide-y divide-gray-100">
            {agreements.map((agreement) => (
              <div key={agreement.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{agreement.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      确认时间：{new Date(agreement.agreedAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDetailModal(agreement)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    查看详情
                  </button>
                  <button
                    onClick={() => handleDownload(agreement)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    下载
                  </button>
                </div>
              </div>
            ))}
            {agreements.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无已确认的协议</p>
              </div>
            )}
          </div>
        </div>

        {/* 通知公告管理 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">通知公告管理</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">您已确认的平台通知和公告列表</p>
          </div>

          <div className="divide-y divide-gray-100">
            {notices.map((notice) => (
              <div key={notice.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{notice.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      确认时间：{new Date(notice.confirmedAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNoticeModal(notice)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    查看详情
                  </button>
                </div>
              </div>
            ))}
            {notices.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>暂无已确认的通知</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 协议详情弹窗 */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 - 三列标准版式 */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-start gap-8">
                {/* 左列：TSA可信时间戳认证圆形LOGO */}
                <img
                  src={TSA_LOGO_URL}
                  alt="可信时间戳®️认证"
                  className="w-24 h-24 rounded-full flex-shrink-0"
                />

                {/* 中列：标题+版本号 + 发布日期/生效日期 */}
                <div className="flex-1 text-center pt-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {showDetailModal.title}
                    <span className="ml-2 text-base font-normal text-gray-400">{showDetailModal.version}</span>
                  </h3>
                  <div className="space-y-1.5 text-sm inline-block text-left">
                    <div>
                      <span className="text-gray-600 inline-block w-20">发布日期：</span>
                      <span className="text-gray-900">{new Date(showDetailModal.agreedAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 inline-block w-20">生效日期：</span>
                      <span className="text-gray-900">{new Date(showDetailModal.agreedAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                {/* 右列：账户信息 + 认证标识 */}
                <div className="text-right space-y-1.5 flex-shrink-0 min-w-[260px] pt-2">
                  <div className="text-sm">
                    <span className="text-gray-600">账户：</span>
                    <span className="font-medium text-gray-900">{userInfo?.email}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">确认协议时间：</span>
                    <span className="font-medium text-gray-900">{new Date(showDetailModal.agreedAt).toLocaleString("zh-CN")}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">确认协议版本：</span>
                    <span className="font-medium text-gray-900">{showDetailModal.version}</span>
                  </div>

                  {/* 可信时间戳®️认证标识 */}
                  <div className="flex items-center justify-end gap-1.5 mt-2">
                    <img
                      src={TSA_LOGO_URL}
                      alt="已认证"
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs font-semibold text-blue-700">可信时间戳®️已认证</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 协议正文 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {showDetailModal.content}
                </pre>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => handleDownload(showDetailModal)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                下载协议
              </button>
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通知详情弹窗 */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 - 三列标准版式 */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-start gap-8">
                {/* 左列：TSA可信时间戳认证圆形LOGO */}
                <img
                  src={TSA_LOGO_URL}
                  alt="可信时间戳®️认证"
                  className="w-24 h-24 rounded-full flex-shrink-0"
                />

                {/* 中列：标题+版本号 + 发布日期/生效日期 */}
                <div className="flex-1 text-center pt-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {showNoticeModal.title}
                    <span className="ml-2 text-base font-normal text-gray-400">v1.0</span>
                  </h3>
                  <div className="space-y-1.5 text-sm inline-block text-left">
                    <div>
                      <span className="text-gray-600 inline-block w-20">发布日期：</span>
                      <span className="text-gray-900">{new Date(showNoticeModal.confirmedAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 inline-block w-20">生效日期：</span>
                      <span className="text-gray-900">{new Date(showNoticeModal.confirmedAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                {/* 右列：账户信息 + 认证标识 */}
                <div className="text-right space-y-1.5 flex-shrink-0 min-w-[260px] pt-2">
                  <div className="text-sm">
                    <span className="text-gray-600">账户：</span>
                    <span className="font-medium text-gray-900">{userInfo?.email}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">确认协议时间：</span>
                    <span className="font-medium text-gray-900">{new Date(showNoticeModal.confirmedAt).toLocaleString("zh-CN")}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">确认协议版本：</span>
                    <span className="font-medium text-gray-900">v1.0</span>
                  </div>

                  {/* 可信时间戳®️认证标识 */}
                  <div className="flex items-center justify-end gap-1.5 mt-2">
                    <img
                      src={TSA_LOGO_URL}
                      alt="已认证"
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs font-semibold text-blue-700">可信时间戳®️已认证</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 通知正文 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {showNoticeModal.content}
                </pre>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => handleDownloadNotice(showNoticeModal)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                下载通知
              </button>
              <button
                onClick={() => setShowNoticeModal(null)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
