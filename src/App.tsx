import { Routes, Route } from "react-router-dom";
import BotanicalHome from "./sections/BotanicalHome";
import ProjectMuseum from "./sections/ProjectMuseum";
import ArtGallery from "./sections/ArtGallery";
import AboutRoom from "./sections/AboutRoom";
import usePageTracking from "./hooks/usePageTracking";

const App = () => {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<BotanicalHome />} />
      <Route path="/projects" element={<ProjectMuseum />} />
      <Route path="/gallery" element={<ArtGallery />} />
      <Route path="/about" element={<AboutRoom />} />
    </Routes>
  );
};

export default App;
