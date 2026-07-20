import { Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const posters = [
  {
    title: "夫人一个过肩摔",
    subtitle: "瘫子总裁站起来了",
    tag: "新",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    hasTimestamp: true,
  },
  {
    title: "龙头",
    subtitle: "DRAGON HEAD",
    tag: "新",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    hasTimestamp: false,
  },
  {
    title: "金钱照冷暖",
    subtitle: "人心比钱更冷",
    tag: "新",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    hasTimestamp: true,
  },
  {
    title: "山茶花开会",
    subtitle: "花开花落终有时",
    tag: "",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    hasTimestamp: false,
  },
  {
    title: "分家只给枯井",
    subtitle: "绝境重生",
    tag: "新",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    hasTimestamp: true,
  },
];

const postersRow2 = [
  {
    title: "我的车间不养闲人",
    subtitle: "实力说话",
    tag: "新",
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    hasTimestamp: false,
  },
  {
    title: "一碗热菜守人心",
    subtitle: "温暖如初",
    tag: "新",
    image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=600&fit=crop",
    hasTimestamp: true,
  },
  {
    title: "长姐进门",
    subtitle: "家族风云",
    tag: "爆",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop",
    hasTimestamp: true,
  },
  {
    title: "罪妻开荒养出战神",
    subtitle: "逆袭之路",
    tag: "新",
    image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=400&h=600&fit=crop",
    hasTimestamp: false,
  },
  {
    title: "龙头",
    subtitle: "权力游戏",
    tag: "",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    hasTimestamp: true,
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-cyan-400 text-lg mb-4 font-medium">短剧剧本创作平台</p>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white whitespace-nowrap">
            让AI辅助故事创作者成为超级个体
          </h1>
          
          <p className="text-lg text-gray-300 mb-8">
            真人、AI短剧 🔥 剧本创作效率提升10倍！
          </p>
          
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 px-10 py-6 text-lg rounded-full font-semibold">
            <Link to="/app/login">
              <Sparkles className="w-5 h-5 mr-2" />
              立即体验
            </Link>
          </Button>
        </div>

        {/* 海报展示区 - 两行网格 */}
        <div className="max-w-6xl mx-auto mt-16">
          {/* 第一行 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
            {posters.map((poster, index) => (
              <PosterCard key={index} poster={poster} />
            ))}
          </div>
          
          {/* 第二行 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {postersRow2.map((poster, index) => (
              <PosterCard key={index} poster={poster} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PosterCard({ poster }: { poster: typeof posters[0] }) {
  return (
    <div className="relative group cursor-pointer">
      <div className="aspect-[3/4] rounded-xl overflow-hidden relative">
        <img
          src={poster.image}
          alt={poster.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* 标签 */}
        {poster.tag && (
          <div className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded font-semibold z-10 ${
            poster.tag === "爆" ? "bg-red-600" : "bg-blue-600"
          }`}>
            {poster.tag}
          </div>
        )}
        
        {/* 可信时间戳认证标识 */}
        {poster.hasTimestamp && (
          <div className="absolute bottom-3 right-3 bg-purple-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
            <Shield className="w-3 h-3" />
            <span>已认证</span>
          </div>
        )}
        
        {/* 标题区域 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-white font-bold text-base md:text-lg leading-tight drop-shadow-lg mb-1">
            {poster.title}
          </h3>
          <p className="text-white/70 text-xs">{poster.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
