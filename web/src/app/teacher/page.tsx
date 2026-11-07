"use client";

import { useState } from "react";
import { PlusCircle, BrainCircuit, Clock, FileText, Send, Download, Table } from "lucide-react";

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState<"tests" | "tasks" | "ai" | "gradebook">("tests");

  // Тест құру формасы
  const [testTitle, setTestTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);

  // AI Генерация
  const [aiTopic, setAiTopic] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Тапсырма беру
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  // Бағалар журналы (үлгі мәліметтер)
  const sampleGrades = [
    { id: 1, name: "Әлихан Нұрланұлы", email: "alikhan@example.com", item: "FastAPI негіздері (Тест)", score: "10/10", date: "2026-11-06 14:30" },
    { id: 2, name: "Дильназ Ермекқызы", email: "dilnaz@example.com", item: "FastAPI негіздері (Тест)", score: "8/10", date: "2026-11-06 15:10" },
    { id: 3, name: "Мансұр Төлеген", email: "mansur@example.com", item: "PostgreSQL және Индекстер (ДЗ)", score: "95/100", date: "2026-11-07 11:20" },
  ];

  const handleGenerateAI = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/llm/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, count: 5 }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.result);
      } else {
        setAiResult("Ollama сервисіне сұраныс сәтті өңделмеді (Ollama моделі іске қосылған ба?).");
      }
    } catch {
      setAiResult("Жергілікті AI моделіне қосылу әрекеті жасалды.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    window.open("http://localhost:8000/api/v1/gradebook/export", "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">👨‍🏫 Мұғалім Басқару Панелі</h1>
          <p className="text-slate-600 mt-1">Тесттер құру, үй жұмыстарын тексеру, бағалар журналы және AI ментор</p>
        </div>

        {/* Навигация табтары */}
        <div className="flex bg-slate-100 p-1 rounded-xl mt-4 md:mt-0 gap-1">
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "tests" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Тесттер
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "tasks" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Тапсырмалар
          </button>
          <button
            onClick={() => setActiveTab("gradebook")}
            className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "gradebook" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📊 Журнал
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "ai" ? "bg-white text-purple-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🤖 AI Генератор
          </button>
        </div>
      </div>

      {/* 1. ТЕСТТЕР БӨЛІМІ */}
      {activeTab === "tests" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              Жаңа Тест Жасау
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Тест тақырыбы</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="Мысалы: Python негіздері"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Уақыт шегі (минут)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition">
                Сұрақтар қосу және сақтау
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Қолжетімді Тесттер Тізімі</h2>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">FastAPI және REST API архитектурасы</h3>
                <p className="text-slate-500 text-sm mt-1">10 сұрақ • 25 минут • 15 студент тапсырды</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                Белсенді
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ТАПСЫРМАЛАР БӨЛІМІ */}
      {activeTab === "tasks" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Жаңа Тапсырма Беру
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Тапсырма атауы</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Мысалы: Үй жұмысы №1"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Тапсырма сипаттамасы</label>
                <textarea
                  rows={4}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Студенттерге нұсқаулық..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition">
                Тапсырманы жариялау
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Берілген Үй Тапсырмалары</h2>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900">PostgreSQL сұраныстары және индекстер</h3>
              <p className="text-slate-600 text-sm mt-1">Дедлайн: 10 қараша 2026 ж. • 8 жұмыс тексеруді күтуде</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. БАҒАЛАР ЖУРНАЛЫ ЖӘНЕ ЭКСПОРТ (ЖАҢА) */}
      {activeTab === "gradebook" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-emerald-600" />
                Студенттердің Үлгерім Журналы
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">Барлық тест және үй тапсырмасының нәтижелері</p>
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              Excel / CSV Жүктеу
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Студент</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Тақырыбы</th>
                  <th className="py-3 px-4">Нәтиже / Баға</th>
                  <th className="py-3 px-4">Тапсырылған күні</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleGrades.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900">{row.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{row.email}</td>
                    <td className="py-3.5 px-4 text-slate-700">{row.item}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600">{row.score}</td>
                    <td className="py-3.5 px-4 text-slate-500">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. AI СҰРАҚТАР ГЕНЕРАТОРЫ (OLLAMA) */}
      {activeTab === "ai" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ollama AI: Тест сұрақтарын генерациялау</h2>
              <p className="text-slate-500 text-sm">Тақырыпты енгізіңіз, AI автоматты түрде сұрақтар мен нұсқаларды дайындайды</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Мысалы: Python декораторлары және генераторлары"
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
            >
              {isGenerating ? "Жасалуда..." : "Генерация"}
              <Send className="w-4 h-4" />
            </button>
          </div>

          {aiResult && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Генерацияланған сұрақтар:</h4>
              <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans">{aiResult}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
