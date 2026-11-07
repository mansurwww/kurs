"use client";

import { useState } from "react";
import { User, Award, BookOpen, CheckCircle, ShieldCheck, Mail, Edit3, Key, Star } from "lucide-react";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("Мансұр");
  const [lastName, setLastName] = useState("Төлеген");
  const [email] = useState("mrxplll1x@gmail.com");
  const [role] = useState("Студент / Әзірлеуші");
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const stats = [
    { label: "Орташа үлгерім (GPA)", value: "3.85 / 4.0", sub: "92% сапалы көрсеткіш", color: "text-indigo-600 bg-indigo-50" },
    { label: "Тапсырылған тесттер", value: "14 тест", sub: "100% уақытында", color: "text-emerald-600 bg-emerald-50" },
    { label: "Үй тапсырмалары", value: "9 жұмыс", sub: "Барлығы тексерілді", color: "text-amber-600 bg-amber-50" },
    { label: "Белсенді курстар", value: "3 пән", sub: "CS101, CS102, CS103", color: "text-purple-600 bg-purple-50" },
  ];

  const badges = [
    { id: 1, title: "FastAPI шебері", desc: "FastAPI және REST API тесттерін 100% нәтижемен аяқтады", icon: "🏆", date: "Қараша 2026" },
    { id: 2, title: "Адал студент", desc: "Анти-списывание бақылауында 0 ескертумен емтихан тапсырды", icon: "🛡️", date: "Қараша 2026" },
    { id: 3, title: "Ollama AI Зерттеушісі", desc: "Жергілікті AI ментормен белсенді сұрақ-жауап жасады", icon: "🤖", date: "Қараша 2026" },
    { id: 4, title: "Үздік нәтиже", desc: "Семестрдің ТОП-5 студенттер қатарына енді", icon: "⭐", date: "Қараша 2026" },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. НЕГІЗГІ ПРОФИЛЬ КАРТОЧКАСЫ */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-3xl shadow-md">
              {firstName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900">{firstName} {lastName}</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                  {role}
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {email}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-2 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Keycloak OIDC верификацияланған
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "Жабу" : "Профильді өңдеу"}
          </button>
        </div>

        {/* ПРОФИЛЬДІ ӨҢДЕУ ФОРМАСЫ */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Жеке деректерді жаңарту</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Аты</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Тегі</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
              >
                Сақтау
              </button>
            </div>
          </form>
        )}

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-sm font-medium border border-emerald-200">
            ✓ Профиль өзгерістері сәтті сақталды!
          </div>
        )}

        {/* 2. АКАДЕМИЯЛЫҚ СТАТИСТИКА */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {stats.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
              <span className="text-xs text-slate-500 font-medium">{s.label}</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{s.value}</p>
              <span className="text-xs text-slate-500 mt-1 block">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ЦИФРЛЫҚ ЖЕТІСТІКТЕР МЕН БЕЙДЖДЕР (BADGES) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Цифрлық Бейдждер мен Марапаттар
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">Оқу барысында жиналған арнайы жетістік белгілері</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            4 Марапат жиналды
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition text-center flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-3">{b.icon}</div>
                <h4 className="font-bold text-slate-900 text-base mb-1">{b.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{b.desc}</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-4 block pt-3 border-t border-slate-100">
                {b.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

