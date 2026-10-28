import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Layout from "./components/layout/Layout";
import Search from "./pages/Search";
function App() {

  return (
      <BrowserRouter>
        <Layout>
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />}/>
          </Routes>
        </Layout>
      </BrowserRouter>
  )
}

export default App
