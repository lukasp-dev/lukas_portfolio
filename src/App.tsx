import { Routes, Route } from 'react-router-dom';
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contacts from "./sections/Contacts";
import Footer from "./sections/Footer";
import Experience from "./sections/Experience";
import Gallery from "./sections/Gallery";
import UCamCode from "./sections/UCamCode";

const MainContent = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Contacts />
            <Footer />
        </>
    );
};

const App = () => {
    return (
        <main className="max-w-7xl mx-auto">
            <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/ucamcode" element={<UCamCode />} />
            </Routes>
        </main>
    );
};

export default App;