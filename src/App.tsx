import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar.tsx";
import AnimalRegister from "./pages/Animal/AnimalRegister.tsx";
import AnimalList from "./pages/Animal/AnimalList.tsx";
import StaffRegister from "./pages/Staff/StaffRegister.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import VaccineRegister from "./pages/VaccineRegister.tsx";
import AdoptionRegister from "./pages/AdoptionRegister.tsx";
import Login from "./pages/Login.tsx";
import PrivateRoute from "./routes/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast"; // <-- import do Toaster
import type { JSX } from "react";
import StaffList from "./pages/Staff/StaffList.tsx";
import AdopterRegister from "./pages/Adopter/AdopterRegister.tsx";
import AdopterList from "./pages/Adopter/AdopterList.tsx";


const ProtectedLayout = ({ children }: { children: JSX.Element }) => (
    <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
);

export default function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" reverseOrder={false} />

            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <Dashboard />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <Dashboard />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/animals"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <AnimalRegister />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/animalList"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <AnimalList />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/staff"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <StaffRegister />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/staffList"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <StaffList />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/Adopter"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <AdopterRegister />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/AdopterList"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <AdopterList />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/vaccines"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <VaccineRegister />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/adoptions"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <AdoptionRegister />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <Dashboard />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
