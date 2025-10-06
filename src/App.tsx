import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar.tsx";
import AnimalRegister from "./pages/Animal/AnimalRegister.tsx";
import AnimalList from "./pages/Animal/AnimalList.tsx";
import StaffRegister from "./pages/Staff/StaffRegister.tsx";
import StaffList from "./pages/Staff/StaffList.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import VaccineRegister from "./pages/VaccineRegister.tsx";
import AdoptionRegister from "./pages/Adoption/AdoptionRegister.tsx";
import AdoptionList from "./pages/Adoption/AdoptionList.tsx";
import AdopterRegister from "./pages/Adopter/AdopterRegister.tsx";
import AdopterList from "./pages/Adopter/AdopterList.tsx";
import Login from "./pages/Login.tsx";
import PrivateRoute from "./routes/PrivateRoute";
import {AuthProvider} from "./context/AuthContext";
import {Toaster} from "react-hot-toast";
import type {JSX} from "react";
import {AnimalsProvider} from "./context/AnimalsContext.tsx";

const ProtectedLayout = ({children}: { children: JSX.Element }) => (
    <div className="flex h-screen bg-gray-100">
        <Sidebar/>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
);

const ProtectedRoute = ({element}: { element: JSX.Element }) => (
    <PrivateRoute>
        <ProtectedLayout>{element}</ProtectedLayout>
    </PrivateRoute>
);

export default function App() {
    return (
        <AuthProvider>
            <AnimalsProvider>
                <Toaster position="top-right" reverseOrder={false}/>

                <Router>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>

                        <Route path="/" element={<ProtectedRoute element={<Dashboard/>}/>}/>
                        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard/>}/>}/>

                        <Route path="/animals" element={<ProtectedRoute element={<AnimalRegister/>}/>}/>
                        <Route path="/animalList" element={<ProtectedRoute element={<AnimalList/>}/>}/>

                        <Route path="/staff" element={<ProtectedRoute element={<StaffRegister/>}/>}/>
                        <Route path="/staffList" element={<ProtectedRoute element={<StaffList/>}/>}/>

                        <Route path="/Adopter" element={<ProtectedRoute element={<AdopterRegister/>}/>}/>
                        <Route path="/AdopterList" element={<ProtectedRoute element={<AdopterList/>}/>}/>

                        <Route path="/vaccines" element={<ProtectedRoute element={<VaccineRegister/>}/>}/>

                        <Route path="/adoptions" element={<ProtectedRoute element={<AdoptionRegister/>}/>}/>
                        <Route path="/AdoptionList" element={<ProtectedRoute element={<AdoptionList/>}/>}/>

                        <Route path="*" element={<ProtectedRoute element={<Dashboard/>}/>}/>
                    </Routes>
                </Router>
            </AnimalsProvider>
        </AuthProvider>
    );
}
