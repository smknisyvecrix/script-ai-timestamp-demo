import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "什么是可信时间戳",
    answer: "可信时间戳是由联合信任时间戳服务中心签发的一个能证明电子数据（电子文件）在一个时间点已经存在的、完整的、可验证的、具备法律效力的电子凭证。",
  },
  {
    question: "在哪里申请可信时间戳认证？",
    answer: "您可以登录联合信任时间戳服务中心官方网站www.tsa.cn或授权平台申请。在剧本创作平台中，您可以在编辑器右侧点击「申请可信时间戳认证」按钮，系统会自动生成证书。",
  },
  {
    question: "可信时间戳司法认可吗？",
    answer: "联合信任时间戳服务中心作为国家授时中心唯一授时与守时保障的专业时间戳服务机构，其签发的可信时间戳已经在大量的司法实践中得到认可。截至2026年1月，全国裁判文书中使用可信时间戳作为电子证据的案例超12万件。",
  },
  {
    question: "多长时间能拿到可信时间戳认证证书？",
    answer: "可信时间戳认证秒间完成，立刻出证。全程线上自助操作，最快1分钟即可获取《可信时间戳认证证书》。",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">常见问题解答</h2>
          <p className="text-muted-foreground">为您解答在创作旅程中可能遇到的疑问</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
