import Navbar from "./sections/Navbar.tsx";
import Hero from "./sections/Hero.tsx";
import About from "./sections/About.tsx";
import Projects from "./sections/Projects.tsx";
import Contacts from "./sections/Contacts.tsx";
import Footer from "./sections/Footer.tsx";
import Experience from "./sections/Experience.tsx";

const App = () => {
    return (
        <main className="max-w-7xl mx-auto">
            <Navbar></Navbar>
            <Hero/>
            <About/>
            <Experience/>
            <Projects/>
            {/*<Clients/>*/}
            <Contacts/>
            <Footer/>
        </main>
    )
}
export default App
