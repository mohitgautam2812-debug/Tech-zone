        import { useState, useEffect } from "react";
        import { Link } from "react-router-dom";
        import axios from "axios";
        import "./home.css";
        import ProductSkeleton from "../components/loaders/ProductSkeleton";
        import Swal from "sweetalert2";

        function StarRating({ rating, size = "12px" }) {
            return (
                <span>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <i
                            key={s}
                            className={`bi ${s <= rating ? "bi-star-fill" : "bi-star"}`}
                            style={{ color: "#F59E0B", fontSize: size, marginRight: "1px" }}
                        />
                    ))}
                </span>
            );
        }

        function CountdownTimer() {
            const [time, setTime] = useState({ h: 5, m: 47, s: 22 });
            useEffect(() => {
                const t = setInterval(() => {
                    setTime((prev) => {
                        let { h, m, s } = prev;
                        s--;
                        if (s < 0) { s = 59; m--; }
                        if (m < 0) { m = 59; h--; }
                        if (h < 0) return { h: 0, m: 0, s: 0 };
                        return { h, m, s };
                    });
                }, 1000);
                return () => clearInterval(t);
            }, []);
            const pad = (n) => String(n).padStart(2, "0");
            return (
                <div className="tz-cd-blocks">
                    {[{ v: time.h, u: "HRS" }, { v: time.m, u: "MIN" }, { v: time.s, u: "SEC" }].map(({ v, u }) => (
                        <div key={u} className="tz-cd-block">
                            <span className="tz-cd-num">{pad(v)}</span>
                            <span className="tz-cd-unit">{u}</span>
                        </div>
                    ))}
                </div>
            );
        }

        const user = JSON.parse(localStorage.getItem("user") || "null");

        const addToCart = async (productId) => {

            if (!user) {
                return Swal.fire({
                    icon: "warning",
                    title: "Login Required",
                    text: "Please login first",
                });
            }

            try {

                await axios.post("http://127.0.0.1:8000/api/cart", {
                    user_id: user.id,
                    product_id: productId,
                    quantity: 1,
                });

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Added to cart",
                    showConfirmButton: false,
                    timer: 2000,
                });

            } catch (e) {
                console.log(e);
            }
        };


        const addToWishlist = async (product) => {

            if (!user) {
                return Swal.fire({
                    icon: "warning",
                    title: "Login Required",
                    text: "Please login first",
                });
            }

            try {

                await axios.post("http://127.0.0.1:8000/api/wishlist", {
                    user_id: user.id,
                    product_id: product.id,
                });

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Added to wishlist",
                    showConfirmButton: false,
                    timer: 2000,
                });

            } catch (e) {
                console.log(e);
            }
        };

        export default function Home() {
            const [pageData, setPageData] = useState(null);
            const [categories, setCategories] = useState([]);
            const [aiFeatures, setAiFeatures] = useState([]);
            const [reviews, setReviews] = useState([]);
            const [steps, setSteps] = useState([]);
            const [flashProducts, setFlashProducts] = useState([]);
            const [featuredProducts, setFeaturedProducts] = useState([]);
            const [loading, setLoading] = useState(true);
            const BASE = "http://127.0.0.1:8000";
            useEffect(() => {
                Promise.all([
                    axios.get(`${BASE}/api/home-page`),
                    axios.get(`${BASE}/api/featured-products`),
                    axios.get(`${BASE}/api/categories`),
                ])
                    .then(([homeRes, featuredRes, categoryRes]) => {
                        const res = homeRes.data;
                        const d = res.data ?? res;
                        setPageData(d);
                        setCategories(categoryRes.data ?? []);
                        setAiFeatures(res.ai_features ?? []);
                        setReviews(res.reviews ?? []);
                        setSteps(res.steps ?? []);
                        setFlashProducts(res.flashProducts ?? []);
                        setFeaturedProducts(featuredRes.data ?? []);
                    })
                    .catch((err) => console.error("Home API error:", err))
                    .finally(() => setLoading(false));
            }, []);

            if (loading || !pageData) {
                return (
                    <div style={{ minHeight: "100vh", background: "var(--tz-bg)", padding: "40px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px", maxWidth: "1400px", margin: "0 auto" }}>
                            {[...Array(8)].map((_, index) => <ProductSkeleton key={index} />)}
                        </div>
                    </div>
                );
            }

            const hero = pageData.hero ?? {};
            const badges = pageData.badges ?? [];
            const catSection = pageData.categories_section ?? {};
            const flash = pageData.flash_sale ?? {};
            const aiPicks = pageData.ai_picks ?? {};
            const reviewsSec = pageData.reviews_section ?? {};
            const about = pageData.about ?? {};
            const hiw = pageData.how_it_works ?? {};
            const newsletter = pageData.newsletter ?? {};

            const bulletLines = about.bullets
                ? about.bullets.split("\n").map((b) => b.trim()).filter(Boolean)
                : (about.bullets_array ?? []);

            return (
                <div className="tz-home">

                    {/* ── Hero ── */}
                    <section className="tz-hero">
                        <div className="tz-hero-container">

                            {/* Left */}
                            <div>
                                {hero.badge && (
                                    <div className="tz-hero-badge">
                                        <i className="bi bi-lightning-charge-fill" />
                                        {hero.badge}
                                    </div>
                                )}
                                <h1 className="tz-hero-title">
                                    {hero.heading?.replace(hero.highlight, "").trim()}{" "}
                                    {hero.highlight && <span className="highlight">{hero.highlight}</span>}{" "}
                                    {hero.subheading}
                                </h1>
                                {hero.description && (
                                    <p className="tz-hero-desc">{hero.description}</p>
                                )}
                                <div className="tz-hero-actions">
                                    {hero.button1_text && (
                                        <Link to={hero.button1_link ?? "/products"} className="tz-btn-primary-no">
                                            {hero.button1_text} <i className="bi bi-arrow-right" />
                                        </Link>
                                    )}
                                    {hero.button2_text && (
                                        <Link to={hero.button2_link ?? "/products"} className="tz-btn-outline">
                                            {hero.button2_text}
                                        </Link>
                                    )}
                                </div>
                                <div className="tz-hero-stats">
                                    {[
                                        { val: hero.stat1_number, label: hero.stat1_label },
                                        { val: hero.stat2_number, label: hero.stat2_label },
                                        { val: hero.stat3_number, label: hero.stat3_label },
                                    ].filter((s) => s.val).map((s) => (
                                        <div key={s.label}>
                                            <div className="tz-hero-stat-val">{s.val}</div>
                                            <div className="tz-hero-stat-label">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right — mini product grid */}
                            <div className="tz-hero-right">
                                {featuredProducts.slice(1, 5).map((item) => (
                                    <Link to={`/products/${item.id}`} key={item.id} style={{ textDecoration: "none" }}>
                                        <div className="tz-hero-product-card">
                                            {item.image
                                                ? <img src={`${BASE}/storage/${item.image}`} alt={item.name} className="tz-hero-product-img" />
                                                : <div className="tz-hero-product-img" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <i className="bi bi-box-seam" style={{ fontSize: "40px", color: "var(--tz-primary)" }} />
                                                </div>
                                            }

                                            {item.badge && <div className="tz-hero-product-badge">{item.badge}</div>}
                                        </div>
                                    </Link>
                                ))}
                                <div className="tz-hero-panel-note">
                                    <i className="bi bi-shield-check-fill" style={{ fontSize: "16px" }} />
                                    100% Genuine Products — All items come with brand warranty
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* ── Trust Badges ── */}
                    {badges.length > 0 && (
                        <div className="tz-trust">
                            <div className="tz-trust-container">
                                {badges.map((b, i) => (
                                    <div className="tz-trust-card" key={i}>
                                        <div className="tz-trust-icon-wrap">
                                            <i className={b.icon} />
                                        </div>
                                        <div>
                                            <div className="tz-trust-title">{b.heading}</div>
                                            <div className="tz-trust-sub">{b.subtext}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Categories ── */}
                    <section className="tz-categories">
                        <div className="tz-container">
                            <div className="tz-section-header">
                                <div class="cato">
                                    {catSection?.badge && (
                                        <div className="tz-section-tag">
                                            <i className="bi bi-grid-fill" />
                                            {catSection.badge}
                                        </div>
                                    )}
                                    {catSection?.heading && (
                                        <h2 className="tz-section-heading">{catSection.heading}</h2>
                                    )}

                                </div>
                                {catSection?.btn_text && (
                                    <Link to={catSection.btn_link ?? "/products"} className="tz-btn-ghost">
                                        {catSection.btn_text} <i className="bi bi-arrow-right" />
                                    </Link>
                                )}

                            </div>


                            <div className="tz-cat-grid">
                                {categories.map((cat) => (
                                    <Link to={`/products?category=${cat.name}`} className="tz-cat-image-card" key={cat.id}>
                                        <img
                                            src={cat.image ? `${BASE}/storage/${cat.image}` : `https://source.unsplash.com/600x800/?${cat.name},technology`}
                                            alt={cat.name}
                                        />
                                        <div className="tz-cat-overlay" />
                                        <div className="tz-cat-content">
                                            <div className="tz-cat-icon-badge">
                                                <i className="bi bi-grid-fill" />
                                            </div>
                                            <div className="tz-cat-name">{cat.name}</div>
                                            <div className="tz-cat-count">{cat.products_count ?? cat.count ?? 0} products</div>
                                        </div>
                                    </Link>
                                ))}


                            </div>
                        </div>
                    </section>

                    {/* ── Flash Sale ── */}
                    <section className="tz-flash">
                        <div className="tz-container">
                            <div className="tz-flash-banner">
                                <div className="tz-flash-left">
                                    {flash.badge && (
                                        <div className="tz-flash-tag">
                                            <i className="bi bi-lightning-fill" /> {flash.badge}
                                        </div>
                                    )}
                                    <h2 className="tz-flash-heading"
                                        dangerouslySetInnerHTML={{
                                            __html: (flash.heading ?? "Flash Sale — Up to <span class='highlight'>70% OFF</span>")
                                                .replace(/(\d+%)/g, "<span class='highlight'>$1</span>")
                                        }}
                                    />
                                    {flash.description && (
                                        <p className="tz-flash-desc">{flash.description}</p>
                                    )}
                                    <div className="tz-countdown">
                                        <span className="tz-countdown-label">Ends in:</span>
                                        <CountdownTimer />
                                    </div>
                                    {flash.btn_text && (
                                        <Link to={flash.btn_link ?? "/products"} className="tz-btn-primary-no-y">
                                            {flash.btn_text} <i className="bi bi-arrow-right" />
                                        </Link>
                                    )}
                                </div>
                                <div className="tz-flash-right">
                                    {flashProducts.map((p) => (
                                        <div className="tz-flash-product" key={p.id}>
                                            <div className="tz-flash-product-img">
                                                {p.image
                                                    ? <img src={`${BASE}/storage/${p.image}`} alt={p.name} />
                                                    : <i className="bi bi-headphones" style={{ fontSize: "48px", color: "rgba(255,255,255,0.4)" }} />
                                                }
                                            </div>
                                            <div className="tz-flash-product-body">
                                                <div className="tz-flash-product-name">{p.name}</div>
                                                <div>
                                                    <div className="tz-price-row">
                                                        <span className="tz-price-main">₹{Number(p.price).toLocaleString()}</span>
                                                        {p.discount_price && (
                                                            <span className="tz-price-old">₹{Number(p.discount_price).toLocaleString()}</span>
                                                        )}
                                                        {p.discount_price && (
                                                            <span className="tz-price-discount">
                                                                {Math.round(((p.discount_price - p.price) / p.discount_price) * 100)}% off
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {p.badge && <div className="tz-flash-product-badge">{p.badge}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Featured Products ── */}
                    <section className="tz-section" style={{ background: "#fff", borderTop: "1px solid var(--tz-border)" }}>
                        <div className="tz-container">
                            <div className="tz-section-header">
                                <div>
                                    {aiPicks.badge && (
                                        <div className="tz-section-tag">
                                            <i className="bi bi-stars" /> {aiPicks.badge}
                                        </div>
                                    )}
                                    {aiPicks.heading && <h2 className="tz-section-heading">{aiPicks.heading}</h2>}
                                    {aiPicks.description && <p className="tz-section-sub">{aiPicks.description}</p>}
                                </div>
                                {aiPicks.btn_text && (
                                    <Link to={aiPicks.btn_link ?? "/products"} className="tz-btn-ghost">
                                        {aiPicks.btn_text} <i className="bi bi-arrow-right" />
                                    </Link>
                                )}
                            </div>
                            <div className="tz-product-grid">
                                {featuredProducts.map((p) => (
                                    <div className="tz-product-card" key={p.id}>
                                        <div className="tz-product-img-wrap">
                                            <img src={`${BASE}/storage/${p.image}`} alt={p.name} />
                                            <span className="tz-product-badge featured">FEATURED</span>
                                            <button
                                                className="tz-wishlist-btn"
                                                onClick={() => addToWishlist(p)}
                                            >
                                                <i className="bi bi-heart" />
                                            </button>
                                        </div>
                                        <div className="tz-product-body">
                                            <div className="tz-product-brand">{p.category?.name}</div>
                                            <div className="tz-product-name">{p.name}</div>
                                            <div className="tz-product-rating">
                                                <StarRating rating={Number(p.rating) || 0} size="11px" />
                                                <span>({p.rating || 0})</span>
                                            </div>
                                            <div className="tz-price-row">
                                                <span className="tz-price-main">₹{Number(p.price).toLocaleString()}</span>
                                                {p.discount_price && (
                                                    <span className="tz-price-old">₹{Number(p.discount_price).toLocaleString()}</span>
                                                )}
                                                {p.discount_price && (
                                                    <span className="tz-price-discount">
                                                        {Math.round(((p.discount_price - p.price) / p.discount_price) * 100)}% off
                                                    </span>
                                                )}
                                            </div>
                                            <div className="tz-product-actions">
                                                <Link to={`/products/${p.id}`} className="tz-btn-add-cart">
                                                    <i className="bi bi-eye" /> View
                                                </Link>
                                                <button
                                                    className="tz-btn-buy-now"
                                                    onClick={() => addToCart(p.id)}
                                                >
                                                    <i className="bi bi-cart-plus" /> Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                            {aiPicks.btn_text && (
                                <Link to={aiPicks.btn_link ?? "/products"} className="tz-btn-ghosts">
                                    {aiPicks.btn_text} <i className="bi bi-arrow-right" />
                                </Link>
                            )}
                        </div>
                    </section>

                    {/* ── Reviews ── */}
                    {reviews.length > 0 && (
                        <section className="tz-reviews">
                            <div className="tz-container">
                                <div className="text-center mb-4" style={{ textAlign: "center", marginBottom: "36px" }}>
                                    {reviewsSec.badge && (
                                        <div className="tz-section-tag" style={{ display: "inline-flex", marginBottom: "12px" }}>
                                            <i className="bi bi-chat-quote-fill" /> {reviewsSec.badge}
                                        </div>
                                    )}
                                    {reviewsSec.heading && (
                                        <h2 className="tz-section-heading">{reviewsSec.heading}</h2>
                                    )}
                                    {reviewsSec.rating && (
                                        <div className="tz-rating-row" style={{ justifyContent: "center", marginTop: "8px" }}>
                                            <StarRating rating={5} size="18px" />
                                            <span className="tz-rating-big" style={{ marginLeft: "8px" }}>{reviewsSec.rating}</span>
                                            {reviewsSec.rating_sub && (
                                                <span className="tz-rating-of">{reviewsSec.rating_sub}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="tz-reviews-grid">
                                    {reviews.slice(1, 4).map((r) => (
                                        <div className="tz-review-card" key={r.id}>
                                            <StarRating rating={r.rating ?? 5} size="14px" />
                                            {r.product && (
                                                <div className="tz-review-product-name">Reviewed: {r.product}</div>
                                            )}
                                            <p className="tz-review-text">{r.review}</p>
                                            <div className="tz-review-footer">
                                                <div className="tz-review-avatar">
                                                    {r.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="tz-review-name">{r.user?.name || "Anonymous"}</div>
                                                    <div className="tz-review-verified">
                                                        <i className="bi bi-patch-check-fill" /> Verified Buyer
                                                    </div>
                                                </div>
                                                <i className="bi bi-patch-check-fill tz-review-check" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ── About ── */}
                    <section className="tz-about">
                        <div className="tz-container-about">
                            <div className="daba">

                                {/* Left panel */}
                                <div className="tz-about-panel">
                                    {(about.panel_title || about.panel_subtitle) && (
                                        <div className="tz-about-panel-header">
                                            <div className="tz-about-panel-icon">
                                                <i className="bi bi-cpu-fill" />
                                            </div>
                                            <div>
                                                {about.panel_title && <div className="tz-about-panel-title">{about.panel_title}</div>}
                                                {about.panel_subtitle && <div className="tz-about-panel-sub">{about.panel_subtitle}</div>}
                                            </div>
                                        </div>
                                    )}
                                    {bulletLines.map((f, i) => (
                                        <div className="tz-feature-row" key={i}>
                                            <div className="tz-feature-check"><i className="bi bi-check" /></div>
                                            <span className="tz-feature-text">{f}</span>
                                        </div>
                                    ))}
                                    <div className="tz-about-stats">
                                        {[
                                            { val: about.stat1_number, label: about.stat1_label, icon: "bi-box-seam" },
                                            { val: about.stat2_number, label: about.stat2_label, icon: "bi-award" },
                                            { val: about.stat3_number, label: about.stat3_label, icon: "bi-people" },
                                        ].filter((s) => s.val).map((s) => (
                                            <div className="tz-about-stat" key={s.label}>
                                                <i className={`bi ${s.icon} tz-about-stat-icon`} />
                                                <div className="tz-about-stat-val">{s.val}</div>
                                                <div className="tz-about-stat-label">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right text */}
                                <div class="right-daba">
                                    {about.badge && (
                                        <div className="tz-section-tag">
                                            <i className="bi bi-info-circle" /> {about.badge}
                                        </div>
                                    )}
                                    {about.heading && <h2 className="tz-section-heading">{about.heading}</h2>}
                                    {about.para1 && (
                                        <p style={{ fontSize: "15px", color: "var(--tz-text-secondary)", lineHeight: 1.8, marginBottom: "16px" }}>
                                            {about.para1}
                                        </p>
                                    )}
                                    {about.para2 && (
                                        <p style={{ fontSize: "15px", color: "var(--tz-text-secondary)", lineHeight: 1.8, marginBottom: "28px" }}>
                                            {about.para2}
                                        </p>
                                    )}
                                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                                        {about.btn1_text && (
                                            <Link to={about.btn1_link ?? "/products"} className="tz-btn-primary-no">
                                                {about.btn1_text} <i className="bi bi-arrow-right" />
                                            </Link>
                                        )}
                                        {about.btn2_text && (
                                            <Link to={about.btn2_link ?? "/contact"} className="tz-btn-outline">
                                                {about.btn2_text}
                                            </Link>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* ── How It Works ── */}
                    {steps.length > 0 && (
                        <section className="tz-how">
                            <div className="tz-container">
                                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                                    {hiw.badge && (
                                        <div className="tz-section-tag" style={{ display: "inline-flex", marginBottom: "12px" }}>
                                            <i className="bi bi-diagram-3" /> {hiw.badge}
                                        </div>
                                    )}
                                    {hiw.heading && <h2 className="tz-section-heading">{hiw.heading}</h2>}
                                    {hiw.subheading && <p className="tz-section-sub">{hiw.subheading}</p>}
                                </div>
                                <div className="tz-step-grid">
                                    {steps.map((step, i) => (
                                        <div className="tz-step-card" key={step.id ?? i}>
                                            <div className="tz-step-number">STEP {step.step ?? String(i + 1).padStart(2, "0")}</div>
                                            <div className="tz-step-icon">
                                                <i className={step.icon} />
                                            </div>
                                            <div className="tz-step-title">{step.title}</div>
                                            <p className="tz-step-desc">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                                {hiw.btn_text && (
                                    <div style={{ textAlign: "center" }}>
                                        <Link to={hiw.btn_link ?? "/products"} className="tz-btn-primary-no" style={{ fontSize: "15px", padding: "14px 32px" }}>
                                            {hiw.btn_text} <i className="bi bi-arrow-right" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ── Newsletter ── */}
                    <section className="tz-newsletter">
                        <div className="tz-container">
                            <div className="tz-newsletter-inner">
                                {newsletter.badge && (
                                    <div className="tz-newsletter-tag">{newsletter.badge}</div>
                                )}
                                {newsletter.heading && (
                                    <h2 className="tz-newsletter-title">{newsletter.heading}</h2>
                                )}
                                {newsletter.subheading && (
                                    <p className="tz-newsletter-sub">{newsletter.subheading}</p>
                                )}
                                <div className="tz-newsletter-form">
                                    <input
                                        type="email"
                                        className="tz-newsletter-input"
                                        placeholder={newsletter.placeholder ?? "Enter your email address"}
                                    />
                                    <button className="tz-newsletter-btn">
                                        {newsletter.btn_text ?? "Subscribe"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            );
        }