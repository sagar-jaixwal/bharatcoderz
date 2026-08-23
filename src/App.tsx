import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import ContentPage from "./pages/ContentPage";
import ContactPage from "./pages/ContactPage";
import { PAGES } from "./data/site";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ContentPage page={PAGES.services} />} />
          <Route path="how-we-work" element={<ContentPage page={PAGES.approach} />} />
          <Route path="company" element={<ContentPage page={PAGES.company} />} />
          <Route path="insights" element={<ContentPage page={PAGES.insights} />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
