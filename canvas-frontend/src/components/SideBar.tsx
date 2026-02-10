import { Github, Twitter, Moon, Sun, Radio, LogIn, UserPlus } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

export function Sidebar({ isOpen, onClose, onThemeToggle, isDarkMode = true }: SidebarProps) {
  // If closed, return null so it doesn't exist in the DOM
  if (!isOpen) return null;

  return (
    <>
      {/* 1. Invisible Click Layer (z-40) 
          This detects clicks on the canvas to close the menu. 
          It has NO background color and NO blur. */}
      <div 
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
      />

      {/* 2. The Sidebar Panel (z-50) */}
      <div 
        className="fixed top-20 left-4 w-64 bg-neutral-900 border border-neutral-800 shadow-2xl rounded-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="flex flex-col p-4 gap-4">
          
          {/* Auth Buttons */}
          <div className="flex flex-col gap-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg transition-all border border-neutral-700">
              <LogIn size={16} />
              Sign In
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-purple-900/20">
              <UserPlus size={16} />
              Sign Up
            </button>
          </div>

          <div className="h-px bg-neutral-800" />

          {/* Menu Items */}
          <div className="space-y-1">
            
            {/* Live Session */}
            <button className="w-full flex items-center justify-between px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-red-400 rounded-lg transition-colors group">
              <span className="flex items-center gap-3 text-sm">
                <Radio size={18} className="group-hover:animate-pulse" />
                Live Session
              </span>
              <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">
                OFF
              </span>
            </button>

            {/* Theme Toggle (Sun / Moon) */}
            <button 
              onClick={onThemeToggle}
              className="w-full flex items-center justify-between px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-yellow-400 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-3 text-sm">
                {/* Dynamic Icon based on state */}
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                Theme
              </span>
              
              {/* Visual Indicator */}
              <div className="relative w-8 h-8 flex items-center justify-center bg-neutral-800 rounded-full border border-neutral-700">
                {isDarkMode ? (
                  <Moon size={14} className="text-purple-400 fill-purple-400/20" />
                ) : (
                  <Sun size={14} className="text-yellow-400 fill-yellow-400/20" />
                )}
              </div>
            </button>
          </div>

          <div className="h-px bg-neutral-800" />

          {/* Socials */}
          <div className="flex items-center justify-between px-1 pt-1">
             <div className="flex gap-1">
                <a href="#" className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-blue-400 transition-colors">
                  <Twitter size={18} />
                </a>
             </div>
             <span className="text-[10px] text-neutral-600 font-medium tracking-wide">
               © 2026 SKETCH
             </span>
          </div>

        </div>
      </div>
    </>
  );
}