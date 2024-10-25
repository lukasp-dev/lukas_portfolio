import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';

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

            <div className="relative min-h-screen flex items-center justify-center flex-col">
                <img src="/assets/terminal.png" alt="terminal-bg" className="absolute inset-0 min-h-screen" />

                <div className="contact-container">
                    <h3 className="head-text">Let's talk</h3>
                    <p className="text-lg text-white-600 mt-3">
                        Whether you’re looking to build a new website, improve your existing platform, or bring a unique project to
                        life, I’m here to help.
                    </p>

                    <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col space-y-7">
                        <label className="space-y-3">
                            <span className="field-label">Full Name</span>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="field-input"
                                placeholder="ex., John Doe"
                            />
                        </label>

                        <label className="space-y-3">
                            <span className="field-label">Email address</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="field-input"
                                placeholder="ex., johndoe@gmail.com"
                            />
                        </label>

                        <label className="space-y-3">
                            <span className="field-label">Your message</span>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="field-input"
                                placeholder="Share your thoughts or inquiries..."
                            />
                        </label>

                        <button className="field-btn" type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                            <img src="/assets/arrow-up.png" alt="arrow-up" className="field-btn_arrow" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
