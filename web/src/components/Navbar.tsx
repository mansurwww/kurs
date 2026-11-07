"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, User, Bell, Check, Sparkles } from "lucide-react";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Жаңа баға қойылды",
      message: "Мұғалім 'PostgreSQL сұраныстары' үй тапсырмаңызды тексеріп, 95 балл қойды!",
      time: "10 минут бұрын",
      isRead: false,
    },
    {
      id: 2,
      title: "Жаңа тест жарияланды",
      message: "FastAPI және SQLAlchemy курсы бойынша жаңа бақылау тесті ашылды.",
      time: "1 сағат бұрын",
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <GraduationCap className="w-7 h-7" />
          <span>EduPlatform</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/courses"
            className="text-slate-600 hover:text-indigo-600 font-medium transition"
          >
            📚 Пәндер каталогы
          </Link>
          <Link
            href="/teacher"
            className="text-slate-600 hover:text-indigo-600 font-medium transition"
          >
            👨‍🏫 Мұғалім бөлімі
          </Link>
          <Link
            href="/student"
            className="text-slate-600 hover:text-indigo-600 font-medium transition"
          >
            👨‍🎓 Студент бөлімі
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* ХАБАРЛАМАЛАР ҚОҢЫРАУШАСЫ (NOTIFICATIONS BELL) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* ХАБАРЛАМАЛАР ТЕРЕЗЕСІ (DROPDOWN) */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Хабарламалар</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Барлығын оқу
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border transition ${
                        n.isRead
                          ? "bg-white border-slate-100"
                          : "bg-indigo-50/50 border-indigo-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 px-3.5 py-1.5 rounded-full text-sm font-semibold transition border border-slate-200"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Жеке Профиль</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
