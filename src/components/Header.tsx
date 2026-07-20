import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // 检查登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const name = localStorage.getItem("userName") || "";
      setIsLoggedIn(loggedIn);
      setUserName(name);
    };

    checkLoginStatus();
    // 监听 storage 事件，当其他标签页修改登录状态时同步
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
  };

  const navItems = [
    { label: "首页", href: "/app" },
    { label: "我的剧本", href: "/app/scripts" },
    { label: "我的证书", href: "/app/certificates" },
    { label: "会员权益", href: "/app/pricing" },
    { label: "帮助中心", href: "/app/help" },
    { label: "返回平台", href: "/platform" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/app" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">剧</span>
            </div>
            <span className="hidden sm:inline-block font-semibold text-foreground">
              AI剧本创作平台 - 演示
            </span>
            <span className="sm:hidden font-semibold text-foreground text-sm">
              剧本创作
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Info */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{userName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="sm">注册</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 border-t">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 flex-1">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{userName}</span>
                    </div>
                    <Button variant="outline" className="flex-1" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      退出
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        登录
                      </Button>
                    </Link>
                    <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">注册</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
