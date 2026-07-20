// 根布局：Provider 放这里；页面路由在 src/routes/ 下单独建文件，勿堆进 index.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  Navigate,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';

function NotFoundComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === '/') return null;
  return <Navigate to="/" replace />;
}

function ErrorComponent({ error }: { error: Error; reset: () => void }) {
  console.error("Route error:", error);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // 已在首页仍报错时不再 redirect，避免 / → / 死循环
  if (pathname === '/') return null;
  // 显示错误信息便于调试，不自动重定向
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-500 mb-4">页面加载错误</h2>
        <p className="text-gray-400 mb-4">路径: {pathname}</p>
        <p className="text-gray-400 mb-4">{error.message}</p>
        <pre className="text-xs text-gray-500 bg-gray-900 p-4 rounded overflow-auto max-w-lg">{error.stack}</pre>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">刷新页面</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
