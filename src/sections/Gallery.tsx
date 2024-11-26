import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ArtWork {
    id: number;
    title: string;
    description: string;
    image: string;
    date?: string;
}

const artworks: ArtWork[] = [
    {
        id: 1,
        title: "Bee Study",
        description: "A detailed study of bee anatomy and movement, exploring the intricate details of these fascinating creatures.",
        image: "/assets/drawing/bee.jpg",
    },
    {
        id: 2,
        title: "Black Panther Portrait",
        description: "A powerful portrait capturing the strength and majesty of the black panther.",
        image: "/assets/drawing/blackpather.jpg",
        // date: "January 2024"
    },
    {
        id: 3,
        title: "Classic Car",
        description: "A vintage automobile study, focusing on the elegant lines and mechanical beauty of classic cars.",
        image: "/assets/drawing/car.jpg",
        // date: "February 2024"
    },
    {
        id: 4,
        title: "Medieval Castle",
        description: "An architectural study of a medieval castle, emphasizing its imposing structure and historical details.",
        image: "/assets/drawing/castle.jpg",
        // date: "March 2024"
    },
    {
        id: 5,
        title: "Curious Cat",
        description: "A playful cat portrait capturing feline grace and personality.",
        image: "/assets/drawing/cat.jpg",
        // date: "April 2024"
    },
    {
        id: 6,
        title: "Majestic Eagle",
        description: "A detailed study of an eagle in flight, showcasing its power and grace.",
        image: "/assets/drawing/eagle.jpg",
        // date: "May 2024"
    },
    {
        id: 7,
        title: "Einstein Portrait",
        description: "A tribute to the legendary physicist, capturing his iconic expression and character.",
        image: "/assets/drawing/einstein.jpg",
        // date: "June 2024"
    },
    {
        id: 8,
        title: "Elephant Study",
        description: "A gentle giant captured in detail, emphasizing the texture and grandeur of these magnificent creatures.",
        image: "/assets/drawing/elephant.jpg",
        // date: "July 2024"
    },
    {
        id: 9,
        title: "Wild Horse",
        description: "A dynamic portrait of a horse in motion, capturing its strength and freedom.",
        image: "/assets/drawing/horse.jpg",
        // date: "August 2024"
    },
    {
        id: 10,
        title: "LeBron James",
        description: "A portrait of the basketball legend, capturing his intensity and determination.",
        image: "/assets/drawing/lebron.jpg",
        // date: "September 2024"
    },
    {
        id: 11,
        title: "Lion Portrait",
        description: "A majestic lion portrait showcasing the king of the jungle's fierce beauty.",
        image: "/assets/drawing/lion.jpg",
        // date: "October 2024"
    },
    {
        id: 12,
        title: "Morgan Freeman",
        description: "A detailed portrait of the legendary actor, capturing his distinctive features and presence.",
        image: "/assets/drawing/morganfreeman.jpg",
        // date: "November 2024"
    },
    {
        id: 13,
        title: "Mountain Landscape",
        description: "A serene mountain landscape study, exploring natural light and atmospheric perspective.",
        image: "/assets/drawing/mountain.jpg",
        // date: "December 2024"
    }
];

const Gallery = () => {
    const [selectedArt, setSelectedArt] = useState<ArtWork | null>(null);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black">
            <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-sm z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-300 hover:text-white flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Portfolio
                    </button>
                </div>
            </nav>

            <section className="pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl font-bold text-white mb-4">Art Gallery</h1>
                        <p className="text-xl text-gray-300">
                            A collection of my drawings and paintings
                        </p>
                    </motion.div>

                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {artworks.map((art, index) => (
                            <motion.div
                                key={art.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="break-inside-avoid cursor-pointer"
                                onClick={() => setSelectedArt(art)}
                            >
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={art.image}
                                        alt={art.title}
                                        className="w-full transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 hover:opacity-100 transition-all duration-300">
                                        <div className="absolute bottom-0 p-6">
                                            <h3 className="text-xl font-bold text-white mb-2">{art.title}</h3>
                                            <p className="text-gray-300 text-sm mb-2">{art.description}</p>
                                            <p className="text-blue-400 text-sm">{art.date}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {selectedArt && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full bg-gray-900 overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedArt(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            
                            <div className="grid md:grid-cols-2 gap-8 p-8">
                                <div className="relative">
                                    <img 
                                        src={selectedArt.image}
                                        alt={selectedArt.title}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-white">{selectedArt.title}</h2>
                                    <p className="text-gray-300">{selectedArt.description}</p>
                                    {selectedArt.date && <p className="text-blue-400">{selectedArt.date}</p>}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery; 