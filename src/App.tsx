import { Routes, Route } from "react-router-dom";
import ProjectMuseum from "./sections/ProjectMuseum";
import ArtGallery from "./sections/ArtGallery";
import usePageTracking from "./hooks/usePageTracking";

const App = () => {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<ProjectMuseum />} />
      <Route path="/gallery" element={<ArtGallery />} />
    </Routes>
  );
};

export default App;
