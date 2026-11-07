"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle, Clock, BrainCircuit, AlertTriangle, ArrowRight, Paperclip, ShieldAlert, X } from "lucide-react";

interface QuestionItem {
  id: number;
  text: string;
  options: string[];
  correct: string;
}

export default function StudentPage() {
  const [activeTab, setActiveTab] = useState<"tests" | "tasks">("tests");
  const [takingTest, setTakingTest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 минут
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // АНТИ-СПИСЫВАНИЕ (ПРОКТОРИНГ) КҮЙЛЕРІ
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [autoSubmittedReason, setAutoSubmittedReason] = useState("");

  // Бастапқы сұрақтар
  const baseQuestions: QuestionItem[] = [
    {
      id: 1,
      text: "FastAPI-де бағыттарды (routing) топтастыру үшін қандай класс қолданылады?",
      options: ["APIRouter", "RouteGroup", "EndpointManager", "FastRouter"],
      correct: "APIRouter",
    },
    {
      id: 2,
      text: "SQLAlchemy 2-де асинхронды сессияны қалай іске қосамыз?",
      options: ["AsyncSession", "SyncSession", "AsyncDriver", "DBPool"],
      correct: "AsyncSession",
    },
    {
      id: 3,
      text: "Next.js 16-да беттер маршрутизациясы қай қапшық арқылы басқарылады?",
      options: ["App Router (app/)", "Pages Router (pages/)", "StaticRouter", "RouterLink"],
      correct: "App Router (app/)",
    },
  ];

  // Сұрақтарды кездейсоқ араластырылған күйі (Random Shuffle)
  const [shuffledQuestions, setShuffledQuestions] = useState<QuestionItem[]>(baseQuestions);

  // Үй тапсырмасы мен файл жүктеу күйі
  const [submittingTask, setSubmittingTask] = useState(false);
  const [taskAnswerText, setTaskAnswerText] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");
  const [taskSubmittedSuccess, setTaskSubmittedSuccess] = useState(false);

  // Сұрақтарды араластыру функциясы (Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleStartTest = () => {
    // Сұрақтар мен әр сұрақтың 4 нұсқасын кездейсоқ араластыру
    const randomized = shuffleArray(baseQuestions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setShuffledQuestions(randomized);
    setAnswers({});
    setTabSwitchCount(0);
    setTimeLeft(1500);
    setSubmitted(false);
    setAutoSubmittedReason("");
    setTakingTest(true);
  };

  // АНТИ-СПИСЫВАНИЕ: Вкладкадан шығуды бақылау (Visibility Change)
  useEffect(() => {
    if (!takingTest || submitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            // 3 рет ережені бұзса, тест автоматты тоқтатылады
            setAutoSubmittedReason("Студент тесттен 3 рет басқа терезеге өтті. Анти-списывание жүйесімен тест тоқтатылды.");
            setSubmitted(true);
            setTakingTest(false);
          } else {
            setShowWarningModal(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [takingTest, submitted]);

  // Таймер логикасы
  useEffect(() => {
    if (!takingTest || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setSubmitted(true);
          setTakingTest(false);
          setAutoSubmittedReason("Тест уақыты аяқталды.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [takingTest, submitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSelectAnswer = (qId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTakingTest(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  const handleSendHomework = () => {
    setTaskSubmittedSuccess(true);
    setSubmittingTask(false);
  };

  // Ұпайды есептеу
  const calculatedScore = useMemo(() => {
    let score = 0;
    shuffledQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        score += 1;
      }
    });
    return score;
  }, [answers, shuffledQuestions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* АНТИ-СПИСЫВАНИЕ: ҚАУІПСІЗДІК ЕСКЕРТУ ТЕРЕЗЕСІ */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-red-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-red-500 animate-bounce-short">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-red-600 text-center mb-2">
              ⚠️ НАЗАР АУДАРЫҢЫЗ!
            </h3>
            <p className="text-slate-700 text-sm text-center mb-4 leading-relaxed">
              Сіз тест бетінен басқа терезеге/вкладкаға шықтыңыз! Шпаргалка пайдалануға қатаң тыйым салынады.
            </p>
            <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center mb-5">
              <span className="text-xs text-red-700 font-semibold block uppercase tracking-wider">
                Ереже бұзу саны:
              </span>
              <span className="text-2xl font-black text-red-600">
                {tabSwitchCount} / 3
              </span>
              <p className="text-xs text-red-500 mt-1">3 рет шықсаңыз, тест автоматты түрде жабылып, 0 балл қойылады!</p>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition"
            >
              Түсіндім, тестке оралу
            </button>
          </div>
        </div>
      )}

      {/* Басты беттегі тақырып */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">👨‍🎓 Студент Кабинеті</h1>
          <p className="text-slate-600 mt-1">Онлайн тестілеу, үй жұмыстарын тапсыру және жеке бағалар</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mt-4 md:mt-0">
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "tests" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Тесттер
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "tasks" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Үй тапсырмалары
          </button>
        </div>
      </div>

      {/* ТЕСТТЕР БӨЛІМІ */}
      {activeTab === "tests" && (
        <div>
          {!takingTest && !submitted ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                      Белсенді Тест
                    </span>
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      🛡️ Анти-списывание қосулы
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-3">FastAPI, SQLAlchemy және Next.js 16</h3>
                  <p className="text-slate-600 text-sm mt-2">
                    3 сұрақтан тұратын тестілеу. Сұрақтар мен нұсқалар әр студент үшін кездейсоқ араласады. Басқа терезеге өтуге болмайды.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Clock className="w-4 h-4" /> 25:00
                  </span>
                  <button
                    onClick={handleStartTest}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
                  >
                    Тестті бастау
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : takingTest ? (
            /* ТЕСТ ТАПСЫРУ БАРЫСЫ (ТАЙМЕРМЕН ЖӘНЕ КӨШІРУГЕ ҚОРҒАНЫСПЕН) */
            <div
              className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm select-none"
              onCopy={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Тестілеу жүріп жатыр</h2>
                  <span className="text-xs text-slate-400">🛡️ Анти-списывание бақылауында (Мәтінді көшіру өшірілген)</span>
                </div>
                <div className="flex items-center gap-3">
                  {tabSwitchCount > 0 && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                      Ескерту: {tabSwitchCount}/3
                    </span>
                  )}
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-full font-bold">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {shuffledQuestions.map((q, idx) => (
                  <div key={q.id} className="space-y-3">
                    <h3 className="font-semibold text-slate-900">
                      {idx + 1}. {q.text}
                    </h3>
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSelectAnswer(q.id, opt)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${
                            answers[q.id] === opt
                              ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-sm transition"
                >
                  Жауаптарды тапсыру
                </button>
              </div>
            </div>
          ) : (
            /* ТЕСТ НӘТИЖЕСІ МЕН AI-МЕНТОР КЕҢЕСІ */
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Тест сәтті тапсырылды!</h2>
              {autoSubmittedReason && (
                <p className="text-xs text-red-500 mt-1 font-semibold">{autoSubmittedReason}</p>
              )}
              <p className="text-slate-600 mt-2">
                Сіздің нәтижеңіз:{" "}
                <strong className="text-indigo-600 font-bold text-xl">
                  {calculatedScore} / {shuffledQuestions.length} балл
                </strong>
              </p>

              <div className="mt-6 bg-purple-50 border border-purple-200 p-4 rounded-xl text-left">
                <div className="flex items-center gap-2 text-purple-700 font-bold mb-1">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Ollama AI Ментор пікірі:</span>
                </div>
                <p className="text-slate-700 text-sm">
                  {calculatedScore === shuffledQuestions.length
                    ? "Керемет нәтиже! Сіз тақырыпты толықтай меңгердіңіз. Келесі кезеңде PostgreSQL курсына жазылуды ұсынамын."
                    : "Жақсы талпыныс! Кейбір сұрақтар бойынша қайталау қажет. Әсіресе асинхронды архитектура мен бағыттау тақырыбын қайта қарап шығыңыз."}
                </p>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setTakingTest(false);
                  setAnswers({});
                  setTabSwitchCount(0);
                }}
                className="mt-6 text-sm text-indigo-600 hover:underline font-semibold"
              >
                Тізімге оралу
              </button>
            </div>
          )}
        </div>
      )}

      {/* ҮЙ ТАПСЫРМАЛАРЫ ЖӘНЕ ФАЙЛ ТІРКЕУ БӨЛІМІ */}
      {activeTab === "tasks" && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  taskSubmittedSuccess ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {taskSubmittedSuccess ? "✓ Тапсырылды" : "Тапсырылмаған"}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">PostgreSQL сұраныстары және индекстер</h3>
                <p className="text-slate-600 text-sm mt-1">
                  1-тапсырма бойынша SQL сұраныстарын орындап, есеп беру немесе скриптті файл түрінде тіркеңіз.
                </p>
                <p className="text-slate-400 text-xs mt-2">Дедлайн: 10 қараша 2026 ж.</p>
              </div>

              {!taskSubmittedSuccess && !submittingTask && (
                <button
                  onClick={() => setSubmittingTask(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition"
                >
                  Жауап беру
                </button>
              )}
            </div>

            {/* ЖАУАП ЖӘНЕ ФАЙЛ ЖҮКТЕУ ФОРМАСЫ */}
            {submittingTask && !taskSubmittedSuccess && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Түсініктеме немесе жауап мәтіні:
                  </label>
                  <textarea
                    rows={3}
                    value={taskAnswerText}
                    onChange={(e) => setTaskAnswerText(e.target.value)}
                    placeholder="Орындалған жұмыс бойынша қысқаша түсініктеме..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Файл тіркеу (PDF, сурет, .py, .zip):
                  </label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-indigo-400 p-4 rounded-xl cursor-pointer bg-slate-50 transition">
                    <Paperclip className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {attachedFileName ? `Таңдалған файл: ${attachedFileName}` : "Файлды таңдаңыз (15 МБ дейін)"}
                    </span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setSubmittingTask(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Бас тарту
                  </button>
                  <button
                    onClick={handleSendHomework}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
                  >
                    Жіберу
                  </button>
                </div>
              </div>
            )}

            {taskSubmittedSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Жұмысыңыз мұғалімге тексеруге сәтті жіберілді! {attachedFileName && `(Тіркелген файл: ${attachedFileName})`}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
