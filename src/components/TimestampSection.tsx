import { Shield, Clock, Award, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TimestampSection() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 - 紫色荧光风格 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-400 mb-2 inline-block relative">
            可信时间戳认证服务
            {/* 手绘下划线效果 */}
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 280 12" fill="none">
              <path d="M2 8C60 4 120 10 180 6C220 2 260 8 278 4" stroke="#c084fc" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6">
            让每一个原创和数据资产都得到证明
          </p>
        </div>

        {/* 核心评估维度布局 - 参考storyplay的左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* 左侧大说明卡片 */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                TRUSTED TIMESTAMP SYSTEM V1.0
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <div className="w-2 h-2 rounded-full bg-gray-600" />
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              利用联合信任时间戳服务中心的权威授时能力，结合密码学技术，为电子数据提供精确到毫秒级的时间证明。以函数曲线的形式，直接呈现创作过程的完整性，并以创作的六个技巧维度，综合客观地评判作品质量。
            </p>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              区别于传统版权保护方式，摒弃主观性模糊评价的错误方式，充分发挥时间戳的逻辑推理能力，对作品进行客观评价。
            </p>

            {/* 数据统计 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">12万+</div>
                <div className="text-xs text-gray-400">司法采信案例</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">99.9%</div>
                <div className="text-xs text-gray-400">验证有效性</div>
              </div>
            </div>
          </div>

          {/* 右侧特性列表 */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">独创情绪趋势曲线</h3>
                <p className="text-sm text-gray-400">从情绪强度与分集钩子强度双层角度直观体现剧本价值</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">多维雷达图可视化</h3>
                <p className="text-sm text-gray-400">多维度、可视化展现，优势一目了然</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">按场景维度评估剧本</h3>
                <p className="text-sm text-gray-400">对剧本进行逐一场景的高维度拆解</p>
              </div>
            </div>
          </div>
        </div>

        {/* 电子取证服务 */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-pink-400 mb-3 inline-block relative">
              电子取证服务
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 160 12" fill="none">
                <path d="M2 8C40 4 80 10 120 6C140 2 150 8 158 4" stroke="#f472b6" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </h3>
            <p className="text-gray-400 mt-4">
              司法普遍认可的电子取证服务，覆盖线上线下所有侵权场景
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-gray-800 rounded-full">
              <Monitor className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">PC端取证</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-gray-800 rounded-full">
              <Smartphone className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">移动端取证</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-gray-800 rounded-full">
              <Shield className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">侵权行为证据固定</span>
            </div>
          </div>
          <div className="text-center">
            <Button asChild className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold">
              <a href="https://bd.tsa.cn/dist/evd?code=315728" target="_blank" rel="noopener noreferrer">
                了解详情
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
