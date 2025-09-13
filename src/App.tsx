import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar.tsx";
import AnimalRegister from "./pages/AnimalRegister";
import StaffRegister from "./pages/StaffRegister";
import Dashboard from "./pages/Dashboard.tsx";
import VaccineRegister from "./pages/VaccineRegister.tsx";
import AdoptionRegister from "./pages/AdoptionRegister.tsx";
import Login from "./pages/Login.tsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/Login" element={<Login/>}/>
            </Routes>

            <div className="flex h-screen bg-gray-100">
                <Sidebar/>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/animals" element={<AnimalRegister/>}/>
                        <Route path="/staff" element={<StaffRegister/>}/>
                        <Route path="/vaccines" element={<VaccineRegister/>}/>
                        <Route path="/adoptions" element={<AdoptionRegister/>}/>
                        <Route path="*" element={<AnimalRegister/>}/> {/* default */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
