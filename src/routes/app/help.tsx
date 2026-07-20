import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, Clock, FileText, Award, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/app/help")({
  component: HelpPage,
});

const faqs = [
  {
    question: "什么是可信时间戳？",
    answer: "可信时间戳是由联合信任时间戳服务中心签发的一个能证明电子数据（电子文件）在一个时间点已经存在的、完整的、可验证的、具备法律效力的电子凭证。它解决了电子数据易被篡改、伪造等问题，已获得司法广泛认可。",
  },
  {
    question: "在哪里申请可信时间戳认证？",
    answer: "您可以登录联合信任时间戳服务中心官方网站www.tsa.cn或授权平台申请。在剧本创作平台中，您可以在编辑器右侧点击「申请可信时间戳认证」按钮，系统会自动生成证书。",
  },
  {
    question: "可信时间戳司法认可吗？",
    answer: "联合信任时间戳服务中心作为国家授时中心唯一授时与守时保障的专业时间戳服务机构，其签发的可信时间戳已经在大量的司法实践中得到认可。截至2026年1月，全国裁判文书中使用可信时间戳作为电子证据的案例超12万件，遍及31个省（自治区、直辖市）。",
  },
  {
    question: "多长时间能拿到可信时间戳认证证书？",
    answer: "可信时间戳认证秒间完成，立刻出证。全程线上自助操作，最快1分钟即可获取《可信时间戳认证证书》，无需等待漫长审核周期。",
  },
  {
    question: "为什么要申请可信时间戳认证？",
    answer: "第一、威慑！告诉想盗版的人，这个作品是你的！第二、维权举证！被侵权时你就有了不可否认的证据。在剧本创作过程中，时间戳可以证明您的作品在某个时间点已经完成，为版权保护提供权威证据。",
  },
  {
    question: "申请可信时间戳会泄露作品内容吗？",
    answer: "可信时间戳认证时上传给TSA的只是作品的数字指纹（HASH），并不上传作品内容，并且这个指纹也不能反算出来作品内容，所以作品内容是保密安全的。",
  },
  {
    question: "什么类型的作品能作可信时间戳认证？",
    answer: "可信时间戳是全能型的认证，无论你的作品类型是什么，只要能变成电子文件或电子数据就都可以认证。剧本、小说、音乐、视频等各类创作作品均可申请认证。",
  },
  {
    question: "我的作品申请完可信时间戳就不能改了吗？",
    answer: "如果修改文件名没有任何问题，但是要修改内容就不能通过验证了！可信时间戳验证的时候需要提交申请时的作品电子文件，并且这个电子文件不能做任何的修改，哪怕你添加了一个空格都不行。必须保持原始状态。如果你要修改作品，很简单，把作品复制成另外一个文件，就可以修改了。",
  },
];

const features = [
  {
    icon: Shield,
    title: "权威认证",
    description: "由国家授时中心负责授时与守时监测，具有法律效力",
  },
  {
    icon: Clock,
    title: "快速出证",
    description: "全程线上操作，最快1分钟获取证书",
  },
  {
    icon: FileText,
    title: "内容完整",
    description: "通过密码学技术保证数据完整性，任何篡改都会被发现",
  },
  {
    icon: Award,
    title: "司法认可",
    description: "12万+裁判文书采信，可直接作为维权凭证",
  },
];

function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">帮助中心</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* 功能介绍 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">可信时间戳功能介绍</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 常见问题 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">常见问题</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-8">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 使用流程 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">使用时间戳的流程</h2>
          <Card className="p-6">
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-medium">创作剧本</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    在编辑器中完成剧本创作或修改
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-medium">点击申请</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    在编辑器右侧点击「申请可信时间戳认证」按钮
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-medium">确认信息</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    查看剧本信息和内容哈希，确认无误后提交申请
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                  4
                </span>
                <div>
                  <h4 className="font-medium">获得证书</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    系统自动生成可信时间戳认证证书，可在「我的证书」页面查看和下载
                  </p>
                </div>
              </li>
            </ol>
          </Card>
        </section>

        {/* 联系支持 */}
        <section>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">还需要帮助?</h3>
              <p className="text-muted-foreground mb-4">
                如果您有其他问题，欢迎访问联合信任时间戳服务中心官网
              </p>
              <Button onClick={() => window.open("https://www.tsa.cn", "_blank")}>
                访问官网
              </Button>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
