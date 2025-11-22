import { useState } from "react";
import { UploadForm } from "./components/UploadForm";
import "./index.css";
import type { IndicatorsStats, UploadResponse } from "./types";
import { BarChart3 } from "lucide-react";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [indicators, setIndicators] = useState<IndicatorsStats | null>(null);

  const handleSuccess = (data: UploadResponse) => {
    setIndicators(data.indicators);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BarChart3 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            ESG Analytics Platform
          </h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900">
            Dashboard for ESG emissions
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Upload raw data file to view environmental performance indicators.
          </p>
        </header>
        <div className="space-y-12">
          {!indicators ? (
            <section className="py-10 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="max-w-2xl mx-auto px-6">
                <h3 className="text-center text-lg font-semibold mb-6">
                  Upload a file
                </h3>
                <UploadForm onUploadSuccess={handleSuccess} />
              </div>
            </section>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setIndicators(null)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Send another file
                </button>
              </div>

              <Dashboard
                avgEnergyPerCompany={indicators.avgEnergyPerCompany}
                top5HighEmitters={indicators.top5HighEmitters}
                totalCo2PerYear={indicators.totalCo2PerYear}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
