import { useState } from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
    };

    return (
        <div className="ct-root">

           
            <section className="ct-hero">
                <div className="ct-hero-blob ct-hero-blob-1" />
                <div className="ct-hero-blob ct-hero-blob-2" />
                <div className="ct-hero-blob ct-hero-blob-3" />

                <div className="container position-relative">
                    <div className="row align-items-center g-5">

                        {/* Left */}
                        <div className="col-lg-6">
                            <div className="ct-badge-pill">
                                <i className="bi bi-headset" />
                                GET IN TOUCH
                            </div>

                            <h1 className="ct-hero-title">
                                We're Here to
                                <span className="ct-hero-title-accent ;">Help You</span>
                            </h1>
 
                            <p className="ct-hero-desc">
                                Have a question, issue, or just want to say hello? Our expert support team is always ready to assist you — fast, friendly, and hassle-free.
                            </p>

                            <div className="ct-stats">
                                {[
                                    { val: "24/7", label: "Support" },
                                    { val: "1hr", label: "Response" },
                                    { val: "2M+", label: "Happy Users" },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <div className="ct-stat-val">{s.val}</div>
                                        <div className="ct-stat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                       
                        <div className="col-lg-6">
                            <div className="ct-hero-cards">
                                <div className="row g-3">
                                    {[
                                        { icon: "bi-telephone-fill", label: "Call Us", val: "+91 98765 43210", color: "var(--tz-neon)" },
                                        { icon: "bi-envelope-fill", label: "Email", val: "support@techzone.in", color: "var(--tz-purple)" },
                                        { icon: "bi-chat-dots-fill", label: "Live Chat", val: "Available 24/7", color: "#34d399" },
                                        { icon: "bi-geo-alt-fill", label: "Office", val: "Mumbai, India", color: "#f472b6" },
                                    ].map((item) => (
                                        <div className="col-6" key={item.label}>
                                            <div className="ct-mini-card">
                                                <div className="ct-mini-icon">
                                                    <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: "18px" }} />
                                                </div>
                                                <div className="ct-mini-label">{item.label}</div>
                                                <div className="ct-mini-val">{item.val}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="ct-secure-note">
                                    <i className="bi bi-shield-check me-1" style={{ color: "#34d399" }} />
                                    Your data is 100% private and secure
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="ct-trust-strip">
                <div className="container py-4">
                    <div className="row g-3 donj">
                        {[
                            { icon: "bi-lightning-charge-fill", color: "var(--tz-neon)", title: "Fast Response", sub: "Under 1 hour" },
                            { icon: "bi-headset", color: "var(--tz-purple)", title: "Expert Support", sub: "Certified tech team" },
                            { icon: "bi-shield-lock-fill", color: "#34d399", title: "Secure & Private", sub: "SSL encrypted" },
                            { icon: "bi-award-fill", color: "#fbbf24", title: "Trusted Service", sub: "2M+ customers" },
                            { icon: "bi-calendar-check-fill", color: "#38bdf8", title: "24/7 Available", sub: "Always online" },
                        ].map((b) => (
                            <div className="col-6 col-md" key={b.title}>
                                <div className="ct-trust-item">
                                    <div className="ct-trust-icon">
                                        <i className={`bi ${b.icon}`} style={{ color: b.color, fontSize: "17px" }} />
                                    </div>
                                    <div>
                                        <div className="ct-trust-title">{b.title}</div>
                                        <div className="ct-trust-sub">{b.sub}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="ct-divider" />

           
            <div className="container py-5">
                <div className="row g-4 just">

                    {/* Info Cards */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-3">
                            {[
                                { icon: "bi-telephone-fill", color: "var(--tz-neon)", title: "Call Us", desc: "+91 98765 43210", sub: "Mon–Sat, 9am–6pm IST" },
                                { icon: "bi-envelope-fill", color: "var(--tz-purple)", title: "Email Us", desc: "support@techzone.in", sub: "We reply within 1 hour" },
                                { icon: "bi-geo-alt-fill", color: "#34d399", title: "Visit Us", desc: "123 Tech Street, Mumbai", sub: "India — 400001" },
                                { icon: "bi-chat-dots-fill", color: "#fbbf24", title: "Live Chat", desc: "Chat with us now", sub: "Available 24/7" },
                            ].map((info, i) => (
                                <div
                                    key={info.title}
                                    className="ct-info-card"
                                    style={{ animationDelay: `${i * 0.07}s` }}
                                >
                                    <div
                                        className="ct-info-icon"
                                        style={{ background: `${info.color}14`, borderColor: `${info.color}25` }}
                                    >
                                        <i className={`bi ${info.icon}`} style={{ color: info.color }} />
                                    </div>
                                    <div>
                                        <div className="ct-info-title">{info.title}</div>
                                        <div className="ct-info-desc">{info.desc}</div>
                                        <div className="ct-info-sub">{info.sub}</div>
                                    </div>
                                </div>
                            ))}

                            
                            <div className="ct-social-panel">
                                <div className="ct-social-title">Follow Us</div>
                                <div className="d-flex gap-2 flex-wrap">
                                    {[
                                        { icon: "bi-instagram", color: "#f472b6" },
                                        { icon: "bi-twitter-x", color: "var(--tz-text)" },
                                        { icon: "bi-facebook", color: "#38bdf8" },
                                        { icon: "bi-youtube", color: "#f87171" },
                                        { icon: "bi-whatsapp", color: "#34d399" },
                                    ].map((s) => (
                                        <div
                                            key={s.icon}
                                            className="ct-social-btn"
                                        >
                                            <i className={`bi ${s.icon}`} style={{ color: s.color }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="col-lg-8">
                        <div className="ct-form-panel">
                            {submitted ? (
                                <div className="ct-success">
                                    <div className="ct-success-icon">
                                        <i className="bi bi-check2-circle" />
                                    </div>
                                    <div className="ct-section-badge">
                                        <i className="bi bi-check-circle-fill" />
                                        MESSAGE SENT
                                    </div>
                                    <h3 className="ct-success-title">Thank You! 🎉</h3>
                                    <p className="ct-success-desc">
                                        Your message has been received. Our support team will get back to you within{" "}
                                        <span className="ct-success-accent">1 hour</span>.
                                    </p>
                                    <button
                                        className="ct-btn-submit"
                                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                                    >
                                        <i className="bi bi-arrow-left" />
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <div className="ct-form-header-badge">
                                            <i className="bi bi-send-fill" />
                                            CONTACT FORM
                                        </div>
                                        <h3 className="ct-form-title">Send Us a Message</h3>
                                        <p className="ct-form-sub">Fill in the details below and we'll respond as soon as possible.</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="ct-form-label">Full Name *</label>
                                                <input
                                                    name="name" required placeholder="Enter your Name"
                                                    value={form.name} onChange={handleChange}
                                                    className="ct-input"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="ct-form-label">Email Address *</label>
                                                <input
                                                    name="email" type="email" required  placeholder="Enter your email"
                                                    value={form.email} onChange={handleChange}
                                                    className="ct-input"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="ct-form-label">Phone Number</label>
                                                <input
                                                    name="phone" placeholder="Enter your Phone Number"
                                                    value={form.phone} onChange={handleChange}
                                                    className="ct-input"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="ct-form-label">Subject *</label>
                                                <select
                                                    name="subject" required value={form.subject} onChange={handleChange}
                                                    className="ct-input" style={{ cursor: "pointer",background:"var(--tz-bg-card)" }}
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option>Order Issue</option>
                                                    <option>Delivery Problem</option>
                                                    <option>Return / Refund</option>
                                                    <option>Payment Issue</option>
                                                    <option>Product Inquiry</option>
                                                    <option>Technical Support</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label className="ct-form-label">Your Message *</label>
                                                <textarea
                                                    name="message" rows={5} required
                                                    placeholder="Describe your issue or question in detail..."
                                                    value={form.message} onChange={handleChange}
                                                    className="ct-input"
                                                    style={{ resize: "vertical", minHeight: "130px" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex gap-3 mt-4 flex-wrap">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="ct-btn-submit"
                                            >
                                                {loading ? (
                                                    <><span className="ct-spin" />Sending...</>
                                                ) : (
                                                    <><i className="bi bi-send-fill" />Send Message</>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="ct-btn-clear"
                                                onClick={() => setForm({ name: "", email: "", phone: "", subject: "", message: "" })}
                                            >
                                                <i className="bi bi-arrow-counterclockwise me-2" />Clear
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>

              
                <div className="ct-faq-section">
                    <div className="ct-section-center">
                        <div className="ct-section-badge">
                            <i className="bi bi-question-circle-fill" />
                            FAQ
                        </div>
                        <h2 className="ct-section-title">Frequently Asked Questions</h2>
                        <p className="ct-section-sub">Quick answers to common questions</p>
                    </div>

                    <div className="row g-3">
                        {[
                            { q: "How do I track my order?", a: "Go to My Orders → click your order → Track Order. You can also use the Track Order page with your Order ID and registered email." },
                            { q: "What is the return policy?", a: "We offer a 10-day easy return policy. If you're not satisfied, return the product for a full refund — no questions asked." },
                            { q: "How long does delivery take?", a: "Standard delivery: 3–7 business days. Express delivery available for select pincodes. Same-day delivery in 50+ cities." },
                            { q: "Is my payment information safe?", a: "Yes! We use 256-bit SSL encryption. Your payment data is 100% secure. We support UPI, cards, EMI, and COD." },
                            { q: "How do I cancel or modify my order?", a: "You can cancel or modify orders within 2 hours of placing them via My Orders page or by contacting our support team." },
                            { q: "Do products come with warranty?", a: "All products come with manufacturer warranty (1 year minimum). Extended warranty plans are also available at checkout." },
                        ].map((faq, i) => (
                            <div className="col-md-6" key={i}>
                                <div className={`ct-faq-item ${openFaq === i ? "open" : ""}`}>
                                    <button
                                        className="ct-faq-btn"
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    >
                                        <div className="ct-faq-q-icon">?</div>
                                        <span className="ct-faq-q-text">{faq.q}</span>
                                        <i className={`bi bi-chevron-down ct-faq-chevron`} />
                                    </button>
                                    {openFaq === i && (
                                        <div className="ct-faq-answer">{faq.a}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                
                <div className="ct-cta">
                    <div className="ct-cta-inner">
                        <div className="ct-cta-glow-1" />
                        <div className="ct-cta-glow-2" />
                        <div className="ct-cta-badge" style={{ position: "relative", zIndex: 2 }}>
                            <i className="bi bi-stars" />
                            STILL NEED HELP?
                        </div>
                        <h2 className="ct-cta-title" style={{ position: "relative", zIndex: 2 }}>
                            Our Experts Are Ready for You
                        </h2>
                        <p className="ct-cta-desc" style={{ position: "relative", zIndex: 2 }}>
                            Can't find your answer? Chat with a live agent or schedule a call with our certified tech specialists.
                        </p>
                        <div className="d-flex gap-3 justify-content-center flex-wrap" style={{ position: "relative", zIndex: 2 }}>
                            <button className="ct-cta-btn-primary">
                                <i className="bi bi-chat-dots-fill me-2" />Start Live Chat
                            </button>
                            <button className="ct-cta-btn-ghost">
                                <i className="bi bi-telephone-fill me-2" />Schedule a Call
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}