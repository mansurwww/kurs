import Link from "next/link";
import { BookOpen, BrainCircuit, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Басты тақырып */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-4">
          <BrainCircuit className="w-3.5 h-3.5" />
          Жергілікті Ollama AI интеграциясымен
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Заманауи Білім Беру және Тестілеу Платформасы
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          FastAPI backend, Next.js 16 frontend, Keycloak OIDC қауіпсіздігі және Ollama жасанды интеллектісімен жасалған оқу ортасы.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/teacher"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition"
          >
            👨‍🏫 Мұғалім ретінде кіру
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/student"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl shadow-sm transition"
          >
            👨‍🎓 Студент ретінде кіру
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Мүмкіндіктер карточкалары */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Мұғалім кабинеті</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Тесттер құрастыру, уақыт шегін (таймер) белгілеу, үй тапсырмаларын беру және студенттердің жұмыстарын бағалау.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Студент кабинеті</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Онлайн тестілеуден өту, тапсырмаларды уақытында тапсыру және жеке үлгерім мен бағалар журналын бақылау.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ollama AI Ментор</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Мұғалім үшін тақырып бойынша тест сұрақтарын автоматты генерациялау және студентке қателерін түсіндіріп беру.
          </p>
        </div>
      </div>
    </div>
  );
}

