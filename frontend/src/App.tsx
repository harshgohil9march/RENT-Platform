import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Layout from "./components/layout/Layout";
import Search from "./pages/Search";
import PropertyDetail from "./pages/PropertyDetail";
import  {AuthProvider}  from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import AddProperty from "./pages/AddProperty";
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />}/>
            <Route path="property/:id" element={<PropertyDetail />}/>
            <Route path="/login" element = {<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-property" element= {<AddProperty/>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
