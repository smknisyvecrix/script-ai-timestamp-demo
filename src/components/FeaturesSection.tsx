import { Brain, FileText, Users, Clock, Award, PenTool } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI智能创作",
    description: "基于大语言模型的智能写作助手，提供剧情建议、角色塑造、对白优化等全方位创作支持",
    accentColor: "text-yellow-400",
    bgColor: "bg-gray-900",
    borderColor: "border-gray-800",
  },
  {
    icon: FileText,
    title: "梗概大纲",
    description: "可视化故事结构，拖拽式情节调整，轻松驾驭宏大叙事结构",
    accentColor: "text-purple-400",
    bgColor: "bg-gray-900",
    borderColor: "border-gray-800",
  },
  {
    icon: Users,
    title: "人物设定",
    description: "在同一画布中管理人物小传、性格职业和人物关系，持续沉淀角色设定",
    accentColor: "text-pink-400",
    bgColor: "bg-gray-900",
    borderColor: "border-gray-800",
  },
  {
    icon: Clock,
    title: "节拍卡片",
    description: "记录桥段、台词、伏笔和人物想法，通过时间轴和画板整理故事节奏",
    accentColor: "text-cyan-400",
    bgColor: "bg-gray-900",
    borderColor: "border-gray-800",
  },
  {
    icon: Award,
    title: "剧本医生",
    description: "从结构、人物、节奏、对白和可拍性出发，生成专业诊断报告",
    accentColor: "text-green-400",
    bgColor: "bg-gray-900",
    borderColor: "border-gray-800",
  },
  {
    icon: PenTool,
    title: "导入与改编",
    description: "把已有剧本文档、小说和长文素材整理成可继续创作的项目资料",
    accentColor: "text-orange-400",
    bgColor: "bg-gray-900",
    borderColor: "border-gray-800",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 - 彩色荧光风格 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 inline-block relative">
            全方位的创作武装
            {/* 手绘下划线效果 */}
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
              <path d="M2 8C40 4 80 10 120 6C160 2 180 8 198 4" stroke="#facc15" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6">
            不仅仅是一个编辑器，更是你创作路上的智能合伙人
          </p>
        </div>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${feature.bgColor} ${feature.borderColor} border rounded-2xl p-6 hover:border-gray-600 transition-colors duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.accentColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
