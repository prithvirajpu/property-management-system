
import Toast from "./components/common/Toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <AuthProvider>
            <Toast />
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
