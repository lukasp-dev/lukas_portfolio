import { Routes, Route } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import ProjectDetail from "./sections/ProjectDetail";
import Contacts from "./sections/Contacts";
import Footer from "./sections/Footer";
import Experience from "./sections/Experience";
import Gallery from "./sections/Gallery";
import CyberpunkScene from "./sections/CyberpunkScene";
import usePageTracking from "./hooks/usePageTracking";

const MainContent = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Experience />
      <Projects />
      <Contacts />
      <Footer />
    </>
  );
};

const App = () => {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<CyberpunkScene />} />
      <Route
        path="/old"
        element={
          <main className="max-w-7xl mx-auto">
            <MainContent />
          </main>
        }
      />
      <Route
        path="/gallery"
        element={
          <main className="max-w-7xl mx-auto">
            <Gallery />
          </main>
        }
      />
      <Route
        path="/project/:projectId"
        element={
          <main className="max-w-7xl mx-auto">
            <ProjectDetail />
          </main>
        }
      />
    </Routes>
  );
};

export default App;
