import { AppRouter } from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "../@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <>
        <div className="app-container">
          <AppRouter />
        </div>
        <Toaster position="top-right" richColors closeButton />
      </>
    </AuthProvider>
  );
}

export default App;