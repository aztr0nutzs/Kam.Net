import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Camera, Network, Settings, User, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [holographicMode, setHolographicMode] = React.useState(false);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = '/';
  };

  const navItems = [
    { path: '/Dashboard', icon: Shield, label: 'Network Monitor' },
    { path: '/SecurityCameras', icon: Camera, label: 'Security Cameras' },
    { path: '/Settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${holographicMode ? 'holographic-mode' : ''}`}>
      {/* CSS Variables */}
      <style jsx>{`
        :root {
          --accent-purple: #B700FF;
          --accent-cyan: #00E8F2;
          --accent-mint: #00F6A6;
          --bg-black: #000000;
          --paper-tone: #FFFDF6;
        }

        .holographic-mode {
          --glow-intensity: 2;
        }

        .holographic-mode * {
          text-shadow: 0 0 calc(10px * var(--glow-intensity, 1)) currentColor;
        }
      `}</style>

      {/* Pure Black Background */}
      <div className="fixed inset-0 bg-black" />

      {/* Animated Neon Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(var(--accent-cyan) 1px, transparent 1px),
              linear-gradient(90deg, var(--accent-cyan) 1px, transparent 1px),
              linear-gradient(var(--accent-purple) 1px, transparent 1px),
              linear-gradient(90deg, var(--accent-purple) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 100px 100px, 100px 100px',
            animation: 'grid-pulse 4s ease-in-out infinite'
          }}
        />
      </div>

      {/* Scanning Lines */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-full h-1 opacity-70"
          style={{
            background: `linear-gradient(90deg, transparent, var(--accent-cyan), transparent)`,
            boxShadow: '0 0 20px var(--accent-cyan)',
            animation: 'scan-vertical 8s linear infinite'
          }}
        />
        <div
          className="absolute h-full w-1 opacity-60"
          style={{
            background: `linear-gradient(180deg, transparent, var(--accent-mint), transparent)`,
            boxShadow: '0 0 15px var(--accent-mint)',
            animation: 'scan-horizontal 10s linear infinite'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({length: 30}).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? 'var(--accent-cyan)' : i % 3 === 1 ? 'var(--accent-purple)' : 'var(--accent-mint)',
              boxShadow: `0 0 10px currentColor`,
              animation: `float-particle-${i % 4} ${8 + Math.random() * 8}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b-2 border-cyan-400/30">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" style={{ filter: 'drop-shadow(0 0 10px var(--accent-cyan))' }} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-mint-400 bg-clip-text text-transparent">
              ISeeYou Security
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path.replace('/', ''))}
                  className={`px-4 py-2 rounded-lg border-2 font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/50 shadow-[0_0_20px_rgba(0,232,242,0.3)]'
                      : 'bg-black/40 text-gray-400 border-gray-600/50 hover:border-cyan-400/50 hover:text-cyan-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Holographic Mode Toggle */}
            <button
              onClick={() => setHolographicMode(!holographicMode)}
              className={`px-3 py-2 rounded-lg border-2 font-mono text-xs transition-all ${
                holographicMode
                  ? 'bg-purple-400/20 text-purple-400 border-purple-400/50'
                  : 'bg-black/40 text-gray-400 border-gray-600/50 hover:border-purple-400/50'
              }`}
            >
              HOLOGRAPHIC
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-mono text-cyan-400">{user.full_name || user.email}</p>
                  <p className="text-xs font-mono text-gray-500">{user.role?.toUpperCase()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center border-2 border-cyan-400/50">
                  <User className="w-5 h-5 text-black" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg border-2 border-red-400/50 text-red-400 hover:bg-red-400/20 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400 opacity-50 pointer-events-none" />
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400 opacity-50 pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        {children}
      </div>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes scan-vertical {
          0% { top: -10px; }
          100% { top: 110%; }
        }
        @keyframes scan-horizontal {
          0% { left: -10px; }
          100% { left: 110%; }
        }
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes float-particle-0 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10px) translateX(20px); opacity: 0; }
        }
        @keyframes float-particle-1 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10px) translateX(-20px); opacity: 0; }
        }
        @keyframes float-particle-2 {
          0% { transform: translateX(-10px) translateY(0px); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateX(100vw) translateY(10px); opacity: 0; }
        }
        @keyframes float-particle-3 {
          0% { transform: translateX(-10px) translateY(0px); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateX(100vw) translateY(-10px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
