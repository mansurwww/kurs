"use client";

import { useState } from "react";
import { BookOpen, PlusCircle, CheckCircle, Users, ArrowRight, Sparkles } from "lucide-react";

interface CourseItem {
  id: number;
  code: string;
  title: string;
  description: string;
  teacher: string;
  studentsCount: number;
  isEnrolled?: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([
    {
      id: 1,
      code: "CS101",
      title: "FastAPI және Заманауи Backend Әзірлеу",
      description: "Python, FastAPI, SQLAlchemy 2 және асинхронды REST API архитектурасын нөлден бастап меңгеру.",
      teacher: "Мансұр Төлеген (Преподаватель)",
      studentsCount: 28,
      isEnrolled: true,
    },
    {
      id: 2,
      code: "CS102",
      title: "PostgreSQL Деректер Қоры және Индекстер",
      description: "Күрделі SQL сұраныстары, индекстермен жылдамдықты арттыру, транзакциялар және Alembic миграциялары.",
      teacher: "Ерлан Қасымов",
      studentsCount: 34,
      isEnrolled: false,
    },
    {
      id: 3,
      code: "CS103",
      title: "Next.js 16 және Full-stack Frontend",
      description: "React 19, App Router, Tailwind CSS және Keycloak OIDC қауіпсіздігін веб-қосымшаларға енгізу.",
      teacher: "Айгерім Серікқызы",
      studentsCount: 19,
      isEnrolled: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleEnroll = (id: number) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isEnrolled: true, studentsCount: c.studentsCount + 1 } : c
      )
    );
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCode) return;

    const newCourse: CourseItem = {
      id: courses.length + 1,
      code: newCode.toUpperCase(),
      title: newTitle,
      description: newDesc,
      teacher: "Сіз (Преподаватель)",
      studentsCount: 1,
      isEnrolled: true,
    };

    setCourses([newCourse, ...courses]);
    setNewTitle("");
    setNewCode("");
    setNewDesc("");
    setShowCreateModal(false);
  };

  const filteredCourses = activeTab === "all" ? courses : courses.filter((c) => c.isEnrolled);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Жоғарғы тақырып */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            Пәндер мен Курстар Каталогы
          </h1>
          <p className="text-slate-600 mt-1">
            Студенттерге пәнге жазылып оқу, мұғалімдерге жаңа курстар ашу жүйесі
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Барлық пәндер
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === "my" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Менің пәндерім
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Жаңа пән ашу
          </button>
        </div>
      </div>

      {/* ЖАҢА ПӘН ҚҰРУ МОДАЛІ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Жаңа Пән (Курс) Тіркеу
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Пән атауы</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Мысалы: Жасанды интеллект негіздері"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Пән коды (Код курса)</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Мысалы: AI201"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Сипаттамасы</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Бұл курста студенттер нені үйренеді..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Бас тарту
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
                >
                  Сақтау және Жариялау
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* КУРСТАР КАРТОЧКАЛАРЫ */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md tracking-wider">
                  {c.code}
                </span>
                {c.isEnrolled && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Жазылғансыз
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{c.title}</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">{c.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span>👨‍🏫 {c.teacher}</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {c.studentsCount} студент
                </span>
              </div>

              {c.isEnrolled ? (
                <button
                  disabled
                  className="w-full bg-slate-100 text-slate-500 font-semibold py-2.5 rounded-xl text-sm cursor-default"
                >
                  Курс белсенді
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(c.id)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Пәнге жазылу (Enroll)
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

