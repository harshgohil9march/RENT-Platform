import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Layout from "./components/layout/Layout";
import Search from "./pages/Search";
import PropertyDetail from "./pages/PropertyDetail";
function App() {

  return (
      <BrowserRouter>
        <Layout>
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />}/>
            <Route path="property/:id" element={<PropertyDetail />}/>
          </Routes>
        </Layout>
      </BrowserRouter>
  )
}

export default App
