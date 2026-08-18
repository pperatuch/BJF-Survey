export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">BJF-Survey</h1>
        <p className="text-slate-600 mb-6">
          Project Initialized with React + TypeScript + Vite + TailwindCSS & Laravel API Backend
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Ready for Development
        </div>
      </div>
    </div>
  )
}
