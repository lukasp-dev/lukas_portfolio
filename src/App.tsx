import { Routes, Route } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import ProjectDetail from "./sections/ProjectDetail";
import Contacts from "./sections/Contacts";
import Footer from "./sections/Footer";
import Experience from "./sections/Experience";
import Gallery from "./sections/Gallery";
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
    <main className="max-w-7xl mx-auto">
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
      </Routes>
    </main>
  );
};

export default App;
