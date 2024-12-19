import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';

const Contacts: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);

    const { alert, showAlert, hideAlert } = useAlert();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    /**
     * Handles form submission by sending an email to the server using emailjs and
     * shows a success or danger alert based on the response.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        emailjs
            .send(
                'service_ao3vk9p',
                'template_hn5p0ro',
                {
                    from_name: form.name,
                    to_name: 'Lukas Park',
                    from_email: form.email,
                    to_email: 'lukas.park.dev@gmail.com',
                    message: form.message,
                },
                '-WtUOnnWi028Pu96C',
            )
            .then(
                () => {
                    setLoading(false);
                    showAlert({
                        text: 'Thank you for your message 😃',
                        type: 'success',
                    });

                    setTimeout(() => {
                        hideAlert();
                        setForm({
                            name: '',
                            email: '',
                            message: '',
                        });
                    }, 3000);
                },
                (error) => {
                    setLoading(false);
                    console.error(error);

                    showAlert({
                        text: "I didn't receive your message 😢",
                        type: 'danger',
                    });
                },
            );
    };

    return (
        <section className="c-space my-20" id="contact">
            {alert.show && <Alert {...alert} />}

            <div className="relative min-h-screen flex items-center justify-center">
                <div className="w-full max-w-4xl mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left side - Text content */}
                        <div className="space-y-8">
                                <motion.img
                                    src="/assets/contact-removebg.png"
                                    alt="contact"
                                    className="w-32 h-auto object-cover shadow-2xl transition-transform duration-300 hover:scale-110"
                                />
                            <div>
                                <h2 className="head-text mb-4">Let's Connect</h2>
                                <p className="text-lg text-gray-300">
                                    Whether you're looking to build something amazing or just want to chat, 
                                    I'm always open to new opportunities and interesting conversations.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>lukas.park.dev@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Atlanta, GA</span>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Contact form */}
                        <form 
                            ref={formRef} 
                            onSubmit={handleSubmit} 
                            className="space-y-6 bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700/50"
                        >
                            <div className="space-y-2">
                                <label className="text-gray-300 block">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-300 block">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-300 block">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Your message here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
