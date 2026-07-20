export function StatsSection() {
  return (
    <section className="py-16 px-4 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">10万+</div>
            <div className="text-gray-600">已认证作品</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">1分钟</div>
            <div className="text-gray-600">快速出证</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">12万+</div>
            <div className="text-gray-600">司法采信案例</div>
          </div>
        </div>
      </div>
    </section>
  );
}
