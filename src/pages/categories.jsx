import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./categories.css";


const BADGE_CYCLE = [
    { label: "Trending", cls: "trending", icon: "bi-fire" },
    { label: "Popular", cls: "popular", icon: "bi-graph-up-arrow" },
    { label: "New Collection", cls: "new", icon: "bi-stars" },
    { label: "Featured", cls: "featured", icon: "bi-award" },
];


function getCategoryIcon(name = "") {
    const n = name.toLowerCase();
    if (n.includes("phone") || n.includes("mobile")) return "bi-phone";
    if (n.includes("laptop") || n.includes("comput")) return "bi-laptop";
    if (n.includes("tv") || n.includes("television")) return "bi-tv";
    if (n.includes("audio") || n.includes("headphone") || n.includes("speaker")) return "bi-headphones";
    if (n.includes("camera")) return "bi-camera";
    if (n.includes("tablet") || n.includes("ipad")) return "bi-tablet";
    if (n.includes("watch") || n.includes("wearable")) return "bi-smartwatch";
    if (n.includes("ac") || n.includes("air")) return "bi-wind";
    if (n.includes("fan")) return "bi-fan";
    if (n.includes("fridge") || n.includes("refriger")) return "bi-thermometer-snow";
    if (n.includes("washer") || n.includes("washing")) return "bi-droplet";
    if (n.includes("gaming") || n.includes("game")) return "bi-controller";
    if (n.includes("printer")) return "bi-printer";
    if (n.includes("keyboard")) return "bi-keyboard";
    return "bi-grid";
}

/* ── Skeleton placeholder card ── */
function CategorySkeleton() {
    return (
        <div className="tz-cat-skeleton-card" />
    );
}

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const BASE = "http://127.0.0.1:8000";

    useEffect(() => {
        axios
            .get(`${BASE}/api/categories`)
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
                setCategories(data);
            })
            .catch((err) => console.error("Categories API error:", err))
            .finally(() => setLoading(false));
    }, []);

    /* Stats derived from data */
    const totalCategories = categories.length;
    const totalProducts = categories.reduce((sum, c) => sum + (c.products_count ?? 0), 0);
    const topCategory = categories.reduce((max, c) => (c.products_count > (max?.products_count ?? 0) ? c : max), null);

    /* Split for featured grid vs all-grid */
    const featuredCats = categories.slice(0, 3);   // first 3 → big featured layout
    const remainingCats = categories.slice(3);       // rest → responsive grid below

    const getBadge = (idx) => BADGE_CYCLE[idx % BADGE_CYCLE.length];
    const getImg = (cat) => cat.image_url ?? (cat.image ? `${BASE}/storage/${cat.image}` : null);
    const fallback = (name) => `https://source.unsplash.com/800x600/?${encodeURIComponent(name)},technology,electronics`;

    return (
        <div className="tz-home">

            {/* ── Breadcrumb ── */}
            <div className="tz-breadcrumb">
                <div className="tz-breadcrumb-inner">
                    <Link to="/">Home</Link>
                    <i className="bi bi-chevron-right" />
                    <span className="tz-breadcrumb-current">All Categories</span>
                </div>
            </div>

            {/* ── Hero ── */}
            <section className="tz-cat-hero">
                <div className="tz-cat-hero-container">

                    <div className="tz-cat-hero-left tz-cat-animate">
                        <div className="tz-cat-hero-badge">
                            <i className="bi bi-grid-fill" />
                            All Categories
                        </div>
                        <h1 className="tz-cat-hero-title">
                            Explore Smart{" "}
                            <span className="highlight">Categories</span>
                        </h1>
                        <p className="tz-cat-hero-desc">
                            Discover our curated range of electronics — from flagship smartphones and
                            cutting-edge laptops to home appliances and smart gadgets.
                        </p>
                        <div className="tz-cat-hero-stats">
                            <div className="tz-cat-hero-stat">
                                <span className="tz-cat-hero-stat-val">
                                    {loading ? "—" : totalCategories}
                                </span>
                                <span className="tz-cat-hero-stat-label">Categories</span>
                            </div>
                            <div className="tz-cat-hero-stat">
                                <span className="tz-cat-hero-stat-val">
                                    {loading ? "—" : `${totalProducts}+`}
                                </span>
                                <span className="tz-cat-hero-stat-label">Products</span>
                            </div>
                            {topCategory && (
                                <div className="tz-cat-hero-stat">
                                    <span className="tz-cat-hero-stat-val">{topCategory.name}</span>
                                    <span className="tz-cat-hero-stat-label">Top Category</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pill chips — desktop only */}
                    <div className="tz-cat-hero-right">
                        {categories.slice(0, 5).map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/products?category=${cat.name}`}
                                className="tz-cat-hero-pill tz-cat-animate"
                            >
                                <i className={`bi ${getCategoryIcon(cat.name)}`} />
                                {cat.name}
                            </Link>
                        ))}
                    </div>

                </div>
            </section>

            {/* ── Stats bar ── */}
            <div className="tz-cat-stats-bar">
                <div className="tz-cat-stats-bar-inner">
                    {[
                        { icon: "bi-grid-3x3-gap-fill", val: loading ? "…" : totalCategories, label: "Product Categories" },
                        { icon: "bi-box-seam", val: loading ? "…" : `${totalProducts}+`, label: "Total Products" },
                        { icon: "bi-shield-check", val: "100%", label: "Genuine Products" },
                        { icon: "bi-truck", val: "Free", label: "Delivery Available" },
                    ].map((s, i) => (
                        <div className="tz-cat-stat-item" key={i}>
                            <div className="tz-cat-stat-icon"><i className={`bi ${s.icon}`} /></div>
                            <div className="tz-cat-stat-val">{s.val}</div>
                            <div className="tz-cat-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Featured grid (first 3 categories) ── */}
            {(loading || featuredCats.length > 0) && (
                <section className="tz-cat-featured">
                    <div className="tz-container">
                        <div className="tz-section-header">
                            <div>
                                <div className="tz-section-tag">
                                    <i className="bi bi-stars" /> Featured Categories
                                </div>
                                <h2 className="tz-section-heading">Top Picks for You</h2>
                            </div>
                            <Link to="/products" className="tz-btn-ghost">
                                Shop All <i className="bi bi-arrow-right" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="tz-cat-featured-grid">
                                <div className="tz-cat-featured-card-large tz-cat-skeleton-card" />
                                <div className="tz-cat-featured-card-sm tz-cat-skeleton-card" />
                                <div className="tz-cat-featured-card-sm tz-cat-skeleton-card" />
                            </div>
                        ) : (
                            <div className="tz-cat-featured-grid">
                                {/* Large card — first category */}
                                {featuredCats[0] && (() => {
                                    const cat = featuredCats[0];
                                    const badge = getBadge(0);
                                    const img = getImg(cat) ?? fallback(cat.name);
                                    return (
                                        <Link
                                            to={`/products?category=${cat.name}`}
                                            className="tz-cat-featured-card-large tz-cat-animate"
                                            key={cat.id}
                                        >
                                            <img src={img} alt={cat.name} className="tz-cat-featured-img" />
                                            <div className="tz-cat-featured-overlay" />
                                            <div className="tz-cat-featured-content">
                                                <div className={`tz-cat-dyn-badge ${badge.cls}`}>
                                                    <i className={`bi ${badge.icon}`} /> {badge.label}
                                                </div>
                                                <div className="tz-cat-featured-name">{cat.name}</div>
                                                <div className="tz-cat-featured-count">
                                                    {cat.products_count ?? 0} Products Available
                                                </div>
                                                <span className="tz-cat-explore-btn">
                                                    Explore Now <i className="bi bi-arrow-right" />
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })()}

                                {/* Two smaller cards */}
                                {featuredCats.slice(1).map((cat, idx) => {
                                    const badge = getBadge(idx + 1);
                                    const img = getImg(cat) ?? fallback(cat.name);
                                    return (
                                        <Link
                                            to={`/products?category=${cat.name}`}
                                            className={`tz-cat-featured-card-sm tz-cat-animate tz-cat-animate-delay-${idx + 1}`}
                                            key={cat.id}
                                        >
                                            <img src={img} alt={cat.name} className="tz-cat-featured-img" />
                                            <div className="tz-cat-featured-overlay" />
                                            <div className="tz-cat-featured-content">
                                                <div className={`tz-cat-dyn-badge ${badge.cls}`}>
                                                    <i className={`bi ${badge.icon}`} /> {badge.label}
                                                </div>
                                                <div className="tz-cat-featured-name">{cat.name}</div>
                                                <div className="tz-cat-featured-count">
                                                    {cat.products_count ?? 0} Products
                                                </div>
                                                <span className="tz-cat-explore-btn">
                                                    Explore Now<i className="bi bi-arrow-right" />
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── All Categories grid ── */}
            <section className="tz-cat-all">
                <div className="tz-container">
                    <div className="tz-section-header">
                        <div>
                            <div className="tz-section-tag">
                                <i className="bi bi-grid-fill" /> All Categories
                            </div>
                            <h2 className="tz-section-heading">Browse Everything</h2>
                            <p className="tz-section-sub">
                                {loading
                                    ? "Loading categories…"
                                    : `${totalCategories} categories · ${totalProducts}+ products`}
                            </p>
                        </div>
                        <Link to="/products" className="tz-btn-ghost">
                            View All Products <i className="bi bi-arrow-right" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="tz-cat-skeleton-grid">
                            {[...Array(8)].map((_, i) => <CategorySkeleton key={i} />)}
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="tz-cat-empty">
                            <i className="bi bi-grid" />
                            <div className="tz-cat-empty-title">No categories found</div>
                            <div className="tz-cat-empty-sub">
                                Categories you create in the admin panel will appear here automatically.
                            </div>
                        </div>
                    ) : (
                        <div className="tz-cat-all-grid">
                            {/* Show ALL categories — new ones auto-appear */}
                            {categories.map((cat, idx) => {
                                const img = getImg(cat) ?? fallback(cat.name);
                                const icon = getCategoryIcon(cat.name);
                                const delay = (idx % 8) + 1;
                                return (
                                    <Link
                                        key={cat.id}
                                        to={`/products?category=${cat.name}`}
                                        className={`tz-cat-all-card tz-cat-animate tz-cat-animate-delay-${delay}`}
                                    >
                                        <img src={img} alt={cat.name} />
                                        <div className="tz-cat-all-overlay" />
                                        <div className="tz-cat-all-content">
                                            <div className="tz-cat-all-icon">
                                                <i className={`bi ${icon}`} />
                                            </div>
                                            <div className="tz-cat-all-name">{cat.name}</div>
                                            <div className="tz-cat-all-count">
                                                {cat.products_count ?? 0} Products
                                            </div>
                                            <div className="tz-cat-all-arrow">
                                                <i className="bi bi-arrow-right" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA Newsletter strip ── */}
            <section className="tz-newsletter">
                <div className="tz-container">
                    <div className="tz-newsletter-inner">
                        <div className="tz-newsletter-tag">
                            <i className="bi bi-bell-fill" style={{ marginRight: 6 }} />
                            Stay Updated
                        </div>
                        <h2 className="tz-newsletter-title">New Categories, New Deals</h2>
                        <p className="tz-newsletter-sub">
                            Subscribe to get notified whenever we add a new category or launch
                            exclusive offers on your favourite electronics.
                        </p>
                        <div className="tz-newsletter-form">
                            <input
                                type="email"
                                className="tz-newsletter-input"
                                placeholder="Enter your email address"
                            />
                            <button className="tz-newsletter-btn">Subscribe</button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}