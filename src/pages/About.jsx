import { Link } from "react-router-dom";
import "./About.css";


const STATS = [
    { val: "2M+", label: "Happy Customers", icon: "bi-people-fill" },
    { val: "50K+", label: "Products Listed", icon: "bi-box-seam-fill" },
    { val: "4.9★", label: "Avg Rating", icon: "bi-star-fill" },
    { val: "98%", label: "On-Time Delivery", icon: "bi-truck" },
];

const TEAM = [
    { name: "Arjun Sharma", role: "CEO & Founder", avatar: "A", location: "Mumbai, IN" },
    { name: "Priya Mehta", role: "Head of Technology", avatar: "P", location: "Bengaluru, IN" },
    { name: "Rohit Verma", role: "Head of Operations", avatar: "R", location: "Delhi, IN" },
    { name: "Sneha Kapoor", role: "Customer Experience", avatar: "S", location: "Pune, IN" },
    { name: "Karan Patel", role: "AI & Data Science", avatar: "K", location: "Hyderabad, IN" },
    { name: "Divya Nair", role: "Marketing Lead", avatar: "D", location: "Chennai, IN" },
];

const TIMELINE = [
    { year: "2019", title: "TechZone Founded", desc: "Started in a small garage with 50 products and a big dream to make premium tech accessible to every Indian." },
    { year: "2020", title: "First 10,000 Customers", desc: "Crossed 10K happy customers in just 8 months. Expanded our catalog to 5,000 products." },
    { year: "2021", title: "AI Recommendation Engine", desc: "Launched our proprietary AI engine that personalizes every shopping experience uniquely." },
    { year: "2022", title: "Pan-India Expansion", desc: "Delivery network expanded to 500+ cities with same-day and next-day delivery options." },
    { year: "2023", title: "2 Million Customers", desc: "Celebrated 2M+ customers and ₹500Cr+ in GMV. Launched the TechZone mobile app." },
    { year: "2024", title: "TechZone AI 2.0", desc: "Rolled out next-gen AI shopping assistant and AR product preview features." },
];

const VALUES = [
    { icon: "bi-shield-check", title: "100% Genuine", desc: "Every product is sourced directly from authorized distributors and brand partners — no counterfeits, ever." },
    { icon: "bi-lightning-fill", title: "Speed First", desc: "From browsing to doorstep, we obsess over speed. Same-day delivery in 30+ metro cities." },
    { icon: "bi-cpu-fill", title: "AI-Powered", desc: "Our recommendation engine learns your preferences to surface products you'll actually love." },
    { icon: "bi-headset", title: "24/7 Support", desc: "Real humans, real support. Our team is available around the clock via chat, call, or email." },
    { icon: "bi-arrow-repeat", title: "Easy Returns", desc: "30-day hassle-free returns on every product. No questions asked, no complicated process." },
    { icon: "bi-lock-fill", title: "Secure Payments", desc: "Bank-grade encryption on every transaction. Your financial data is always safe with us." },
];

const AWARDS = [
    { icon: "bi-trophy-fill", title: "Best E-Commerce 2023", body: "Economic Times Retail Awards" },
    { icon: "bi-award-fill", title: "Top AI Innovation", body: "India Tech Summit 2023" },
    { icon: "bi-patch-check-fill", title: "Customer Choice", body: "Trustpilot India 2024" },
    { icon: "bi-star-fill", title: "4.9/5 Rating", body: "Google Play Store 2024" },
];


export default function About() {
    return (
        <div className="ab-page">

            {/* ── HERO ── */}
            <section className="ab-hero">
                <div className="ab-hero-glow" />
                <div className="container position-relative">
                    <div className="ab-hero-label">
                        <i className="bi bi-info-circle-fill" /> About TechZone
                    </div>
                    <h1 className="ab-hero-title">
                        India's Most Trusted<br />
                        <span className="ab-grad">Smart Tech Store</span>
                    </h1>
                    <p className="ab-hero-sub">
                        We're on a mission to make premium technology accessible to every Indian —
                        powered by AI, driven by passion, delivered with speed.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Link to="/products" className="ab-btn-primary">
                            Shop Now <i className="bi bi-arrow-right ms-1" />
                        </Link>
                        <Link to="/contact" className="ab-btn-ghost">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            
            <section className="ab-stats-strip">
                <div className="container">
                    <div className="row g-3">
                        {STATS.map((s) => (
                            <div className="col-6 col-md-3" key={s.label}>
                                <div className="ab-stat-card">
                                    <div className="ab-stat-icon">
                                        <i className={`bi ${s.icon}`} />
                                    </div>
                                    <div className="ab-stat-val">{s.val}</div>
                                    <div className="ab-stat-label">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

           
            <section className="ab-section">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="ab-section-label">
                                <i className="bi bi-book-fill" /> Our Story
                            </div>
                            <h2 className="ab-section-title">
                                Built by tech lovers,<br />for tech lovers
                            </h2>
                            <p className="ab-section-sub">
                                TechZone was born in 2019 when our founder Arjun Sharma got tired of paying
                                inflated prices for electronics — and couldn't trust half the sellers online.
                            </p>
                            <p className="ab-section-sub">
                                We built TechZone from scratch with one rule: <strong style={{ color: "#00c8ff" }}>every product must be 100% genuine,
                                    competitively priced, and delivered fast.</strong> Five years later, we serve 2 million+
                                customers across India and we're just getting started.
                            </p>
                            <p className="ab-section-sub">
                                Today, TechZone is powered by a proprietary AI engine that personalizes your shopping
                                experience, an operations team that obsesses over delivery speed, and a support team
                                that treats every customer like family.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="ab-story-panel">
                                <div className="ab-story-panel-header">
                                    <div className="ab-story-icon">
                                        <i className="bi bi-cpu-fill" />
                                    </div>
                                    <div>
                                        <div className="ab-story-panel-title">TechZone AI Engine</div>
                                        <div className="ab-story-panel-sub">Personalizing 2M+ shopping journeys</div>
                                    </div>
                                </div>
                                {[
                                    "Real-time price tracking across 500+ brands",
                                    "AI recommendations that actually understand you",
                                    "Automated fraud detection on every order",
                                    "Predictive inventory management for zero stockouts",
                                    "Smart logistics routing for fastest delivery",
                                ].map((f, i) => (
                                    <div className="ab-feature-item" key={i}>
                                        <div className="ab-feature-dot">
                                            <i className="bi bi-check" />
                                        </div>
                                        <span className="ab-feature-text">{f}</span>
                                    </div>
                                ))}
                                <div className="ab-panel-note">
                                    <i className="bi bi-shield-check me-1" />
                                    Trusted by 2M+ customers across India
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

          
            <section className="ab-section ab-section-alt">
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="ab-section-label mx-auto" style={{ display: "inline-flex" }}>
                            <i className="bi bi-gem" /> What We Stand For
                        </div>
                        <h2 className="ab-section-title">Our Core Values</h2>
                        <p className="ab-section-sub">
                            Six principles that guide every decision we make at TechZone.
                        </p>
                    </div>
                    <div className="row g-4">
                        {VALUES.map((v) => (
                            <div className="col-md-6 col-lg-4" key={v.title}>
                                <div className="ab-value-card">
                                    <div className="ab-value-icon">
                                        <i className={`bi ${v.icon}`} />
                                    </div>
                                    <div className="ab-value-title">{v.title}</div>
                                    <p className="ab-value-desc">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

           
            <section className="ab-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="ab-section-label mx-auto" style={{ display: "inline-flex" }}>
                            <i className="bi bi-clock-history" /> Our Journey
                        </div>
                        <h2 className="ab-section-title">From Garage to 2M+ Customers</h2>
                    </div>
                    <div className="ab-timeline">
                        {TIMELINE.map((t, i) => (
                            <div className={`ab-timeline-item ${i % 2 === 0 ? "ab-tl-left" : "ab-tl-right"}`} key={t.year}>
                                <div className="ab-tl-dot" />
                                <div className="ab-tl-card">
                                    <div className="ab-tl-year">{t.year}</div>
                                    <div className="ab-tl-title">{t.title}</div>
                                    <p className="ab-tl-desc">{t.desc}</p>
                                </div>
                            </div>
                        ))}
                        <div className="ab-timeline-line" />
                    </div>
                </div>
            </section>

            
            <section className="ab-section ab-section-alt">
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="ab-section-label mx-auto" style={{ display: "inline-flex" }}>
                            <i className="bi bi-people-fill" /> The Team
                        </div>
                        <h2 className="ab-section-title">People Behind TechZone</h2>
                        <p className="ab-section-sub">
                            Passionate engineers, designers, and operators united by one goal.
                        </p>
                    </div>
                    <div className="row g-4 yah">
                        {TEAM.map((m) => (
                            <div className="col-md-6 col-lg-4" key={m.name}>
                                <div className="ab-team-card">
                                    <div className="ab-team-avatar">{m.avatar}</div>
                                    <div className="ab-team-name">{m.name}</div>
                                    <div className="ab-team-role">{m.role}</div>
                                    <div className="ab-team-loc">
                                        <i className="bi bi-geo-alt-fill me-1" />
                                        {m.location}
                                    </div>
                                    <div className="ab-team-socials">
                                        <div className="ab-social-btn"><i className="bi bi-linkedin" /></div>
                                        <div className="ab-social-btn"><i className="bi bi-twitter-x" /></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

          
            <section className="ab-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="ab-section-label mx-auto" style={{ display: "inline-flex" }}>
                            <i className="bi bi-trophy-fill" /> Recognition
                        </div>
                        <h2 className="ab-section-title">Awards & Achievements</h2>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {AWARDS.map((a) => (
                           
                            <div className="col-sm-6 col-lg-3" key={a.title}>
                                <div className="ab-award-card">
                                    <div className="ab-award-icon">
                                        <i className={`bi ${a.icon}`} />
                                    </div>
                                    <div className="ab-award-title">{a.title}</div>
                                    <div className="ab-award-body">{a.body}</div>
                                </div>
                            </div>
                           
                        ))}
                    </div>
                </div>
            </section>

            
            <section className="ab-cta">
                <div className="ab-cta-glow" />
                <div className="container position-relative text-center">
                    <div className="ab-section-label mx-auto" style={{ display: "inline-flex" }}>
                        <i className="bi bi-rocket-takeoff-fill" /> Get Started
                    </div>
                    <h2 className="ab-section-title">
                        Ready to Shop Smarter?
                    </h2>
                    <p className="ab-section-sub mx-auto" style={{ maxWidth: 520 }}>
                        Join 2 million+ Indians who trust TechZone for genuine products,
                        unbeatable prices, and lightning-fast delivery.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
                        <Link to="/products" className="ab-btn-primary" style={{ fontSize: 16, padding: "0.85rem 2.2rem" }}>
                            Explore Products <i className="bi bi-arrow-right ms-1" />
                        </Link>
                        <Link to="/contact" className="ab-btn-ghost" style={{ fontSize: 16, padding: "0.85rem 2.2rem" }}>
                            Talk to Us
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}