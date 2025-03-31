import { useState } from "react";
import BusinessAnalysisForm from "./components/BusinessAnalysisForm";
import BusinessAnalysisReport from "./components/BusinessAnalysisReport";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Business Analysis Platform
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate in-depth analysis and recommendations for your business
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <BusinessAnalysisForm onAnalysisComplete={handleAnalysisComplete} />
          </div>
          <div>
            <BusinessAnalysisReport analysisData={analysisData} />
          </div>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
