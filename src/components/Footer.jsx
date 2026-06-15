import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./footer.css";


const BASE = "https://tech-zone-backend-production.up.railway.app";

export default function Footer() {

    const [settings, setSettings] = useState(null);

    useEffect(() => {
        axios
            .get(`${BASE}/api/footer-settings`)
            .then((response) => setSettings(response.data))
            .catch((error) => console.log(error));
    }, []);

    /* ── Static link data (unchanged) ── */
    const shopLinks = [
        { label: "All Products", to: "/products" },
        { label: "Categories", to: "/products" },
        { label: "Best Sellers", to: "/products" },
        { label: "Flash Sale", to: "/products" },
    ];

    const companyLinks = [
        { label: "About Us", to: "/about" },
        { label: "Blog & News", to: "/blog" },
        { label: "Contact", to: "/contact" },
        { label: "FAQ", to: "/contact" },
    ];

    const supportLinks = [
        { label: "Order Tracking", to: "/my-orders" },
        { label: "Returns & Refunds", to: "/contact" },
        { label: "Privacy Policy", to: "/contact" },
        { label: "Terms & Conditions", to: "/contact" },
    ];

    return (
        <footer className="tz-footer">


            {/* ── Main footer body ── */}
            <div className="tz-footer-body">
                <div className="container">

                    {/* ── Newsletter Strip ── */}
                    <div className="tz-footer-newsletter">
                        <div className="row align-items-center g-3">
                            <div className="col-md-5">
                                <div className="tz-footer-newsletter-title">
                                    <i className="bi bi-envelope-fill me-2" style={{ color: "var(--tz-primary)" }} />
                                    Get Exclusive Deals
                                </div>
                                <div className="tz-footer-newsletter-sub">
                                    Subscribe for AI-curated picks, flash sale alerts &amp; new arrivals.
                                </div>
                            </div>
                            <div className="col-md-7">
                                <div className="tz-footer-newsletter-form">
                                    <input
                                        type="email"
                                        className="tz-footer-newsletter-input"
                                        placeholder="Enter your email address"
                                    />
                                    <button className="tz-footer-newsletter-btn">
                                        Subscribe <i className="bi bi-arrow-right" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Four-column grid ── */}
                    <div className="row g-4">

                        {/* ── Brand Column ── */}
                        <div className="col-lg-4 col-md-6">

                            {/* Logo — same style as navbar */}
                            <Link to="/" className="tz-footer-logo">
                                <div className="tz-footer-logo-icon">
                                    <i className="bi bi-stars" />
                                </div>
                                <div className="tz-footer-logo-text">
                                    <span>
                                        {settings?.site_name?.slice(0, 4) || "Tech"}
                                    </span>
                                    {settings?.site_name?.slice(4) || "Zone"}
                                </div>
                            </Link>

                            {/* Description */}
                            <p className="tz-footer-desc">
                                {settings?.footer_description ||
                                    "AI-curated smart electronics — from flagship phones to immersive gaming. Smarter recommendations, premium devices, instant delivery."}
                            </p>

                            {/* Trust badges */}
                            <div className="tz-footer-trust-row">
                                <span className="tz-footer-trust-badge">
                                    <i className="bi bi-shield-fill-check" /> Secure Pay
                                </span>
                                <span className="tz-footer-trust-badge">
                                    <i className="bi bi-award-fill" /> 100% Genuine
                                </span>
                                <span className="tz-footer-trust-badge">
                                    <i className="bi bi-headset" /> 24/7 Support
                                </span>
                            </div>

                            {/* Social icons */}
                            <div className="tz-footer-socials">
                                <a
                                    href={settings?.twitter || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tz-social-btn"
                                    aria-label="Twitter / X"
                                >
                                    <i className="bi bi-twitter-x" />
                                </a>
                                <a
                                    href={settings?.instagram || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tz-social-btn"
                                    aria-label="Instagram"
                                >
                                    <i className="bi bi-instagram" />
                                </a>
                                <a
                                    href={settings?.youtube || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tz-social-btn"
                                    aria-label="YouTube"
                                >
                                    <i className="bi bi-youtube" />
                                </a>
                                <a
                                    href={settings?.facebook || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tz-social-btn"
                                    aria-label="Facebook"
                                >
                                    <i className="bi bi-github" />
                                </a>
                            </div>
                        </div>

                        {/* ── Shop Column ── */}
                        <div className="col-6 col-md-4 col-lg-2 ">
                            <div className="tz-footer-heading">Shop</div>
                            <ul className="tz-footer-links">
                                {shopLinks.map((l) => (
                                    <li key={l.label}>
                                        <Link to={l.to}>
                                            <i className="bi bi-chevron-right" />
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Company Column ── */}
                        <div className="col-6 col-md-3 col-lg-2">
                            <div className="tz-footer-heading">Company</div>
                            <ul className="tz-footer-links">
                                {companyLinks.map((l) => (
                                    <li key={l.label}>
                                        <Link to={l.to}>
                                            <i className="bi bi-chevron-right" />
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Support + Contact Column ── */}
                        <div className="col-md-3 col-lg-2">
                            <div className="tz-footer-heading">Support</div>
                            <ul className="tz-footer-links mb-4">
                                {supportLinks.map((l) => (
                                    <li key={l.label}>
                                        <Link to={l.to}>
                                            <i className="bi bi-chevron-right" />
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact info */}
                        <div className="col-md-3 col-lg-2">
                            <div className="tz-footer-heading">Contact</div>
                            <ul className="tz-footer-contact">
                                <li>
                                    <div className="tz-contact-icon">
                                        <i className="bi bi-envelope" />
                                    </div>
                                    <span>support@techzone.in</span>
                                </li>
                                <li>
                                    <div className="tz-contact-icon">
                                        <i className="bi bi-telephone" />
                                    </div>
                                    <span>1800-123-4567</span>
                                </li>
                                <li>
                                    <div className="tz-contact-icon">
                                        <i className="bi bi-geo-alt" />
                                    </div>
                                    <span>Mumbai, Maharashtra, India</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>



        </footer>
    );
}

