import React, { useEffect, useRef } from 'react';

const skillsData = {
    languages: [
        { name: "Java", years: 4 },
        { name: "Python", years: 3 },
        { name: "JavaScript/TypeScript/HTML/CSS", years: 3 },
        { name: "SQL", years: 1.5 },
        { name: "C/C++", years: 2 }
    ],
    technologies: [
        { name: "React.js/Redux", years: 3 },
        { name: "Node.js", years: 3 },
        { name: "Spring Boot / SwaggerUI", years: 3 },
        { name: "Three.js", years: 2 },
        { name: "Git/Docker/Jenkins", years: 3 },
        { name: "AWS/GCP/Heroku", years: 1 }
    ],
    databases: [
        { name: "MySQL", years: 3 },
        { name: "Oracle", years: 2 },
        { name: "MongoDB", years: 3 }
    ]
};

const Skills: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const bars = document.querySelectorAll('.skill-bar-fill');
                    bars.forEach(bar => {
                        (bar as HTMLElement).style.width = (bar as HTMLElement).dataset.width ?? '0%';
                    });
                } else {
                    // 애니메이션 초기화
                    const bars = document.querySelectorAll('.skill-bar-fill');
                    bars.forEach(bar => {
                        (bar as HTMLElement).style.width = '0%';
                    });
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            root: null, // viewport를 기준으로 관찰
            threshold: 0.2 // 20%가 보이면 애니메이션 실행
        });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const renderBar = (skill: { name: string; years: number }) => (
        <div key={skill.name} className="mb-4">
            <div className="flex justify-between">
                <span className="text-gray-300">{skill.name}</span>
                <span className="text-gray-300">{skill.years} years</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mt-1 overflow-hidden">
                <div
                    className="skill-bar-fill bg-green-800 h-4 rounded-full transition-all duration-1000"
                    style={{ width: '0%' }}
                    data-width={`${skill.years * 25}%`} // Adjust to your preferred calculation
                />
            </div>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            className="p-8 bg-gray-900 text-white mx-4 md:mx-12 lg:mx-20 rounded-lg"
            style={{
                background: "transparent",
                backgroundSize: "cover",
            }}
        >
            <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Languages</h3>
                {skillsData.languages.map(renderBar)}
            </div>
            <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Technologies / Frameworks</h3>
                {skillsData.technologies.map(renderBar)}
            </div>
            <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Database Technologies</h3>
                {skillsData.databases.map(renderBar)}
            </div>
        </section>
    );
};

export default Skills;
