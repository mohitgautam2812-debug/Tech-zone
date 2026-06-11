import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "./SingleProduct.css";

const BASE = "http://127.0.0.1:8000";

function StarRating({ rating = 0, size = "13px", interactive = false, onRate }) {
    const [hover, setHover] = useState(0);
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
        <span className="sp-stars">
            {[1, 2, 3, 4, 5].map((s) => (
                <i key={s}
                    className={`bi ${interactive
                        ? s <= (hover || rating) ? "bi-star-fill" : "bi-star"
                        : s <= full ? "bi-star-fill" : s === full + 1 && half ? "bi-star-half" : "bi-star"}`}
                    style={{
                        color: s <= (hover || full) || (!interactive && s === full + 1 && half) ? "#fbbf24" : "#d1d5db",
                        fontSize: size, marginRight: "2px",
                        cursor: interactive ? "pointer" : "default",
                        transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={() => interactive && setHover(s)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => interactive && onRate && onRate(s)}
                />
            ))}
        </span>
    );
}

function RatingBar({ star, count, total, onClick, active }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <button className={`sp-rbar-row ${active ? "active" : ""}`} onClick={onClick}>
            <span className="sp-rbar-label">{star} <i className="bi bi-star-fill" style={{ color: "#fbbf24", fontSize: "10px" }} /></span>
            <div className="sp-rbar-track"><div className="sp-rbar-fill" style={{ width: `${pct}%` }} /></div>
            <span className="sp-rbar-count">{count}</span>
        </button>
    );
}

function Toast({ msg, type }) {
    if (!msg) return null;
    return (
        <div className={`sp-toast sp-toast-${type}`}>
            <i className={`bi ${type === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"}`} />
            {msg}
        </div>
    );
}



function StockBar({ stock, maxShow = 20 }) {
    if (!stock) return null;
    const pct = Math.min((stock / maxShow) * 100, 100);
    const isLow = stock <= 5;

}



function ReviewCard({ review, index, userId, onEdit, onDelete, onHelpful, helpfulMap }) {
    const colors = ["#38bdf8", "#818cf8", "#7c3aed", "#34d399", "#f472b6"];
    const initial = (review.user?.name || review.name || "U")[0].toUpperCase();
    const color = colors[index % colors.length];
    const ratingNum = Number(review.rating || 5);
    const fmtDate = (s) => s ? new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently";
    return (
        <div className="sp-review-card">
            <div className="sp-review-top">
                <div className="sp-review-avatar" style={{ background: `linear-gradient(135deg,${color}22,${color}44)`, border: `1.5px solid ${color}55`, color }}>
                    {initial}
                </div>
                <div className="sp-review-meta">
                    <div className="sp-review-name">{review.user?.name || review.name || "Customer"}</div>
                    <div className="sp-review-date"><i className="bi bi-calendar3" /> {fmtDate(review.created_at)}</div>
                </div>
                <div className="sp-review-right">
                    <div className="sp-review-rating-badge" style={{
                        background: ratingNum >= 4 ? "linear-gradient(135deg,#059669,#34d399)" : ratingNum >= 3 ? "linear-gradient(135deg,#d97706,#fbbf24)" : "linear-gradient(135deg,#dc2626,#f87171)"
                    }}>
                        <i className="bi bi-star-fill" style={{ fontSize: "9px" }} /> {ratingNum}
                    </div>
                    <span className="sp-verified-badge"><i className="bi bi-patch-check-fill" /> Verified</span>
                </div>
            </div>
            {review.title && <div className="sp-review-title">"{review.title}"</div>}
            <p className="sp-review-body">{review.review || review.body || review.comment}</p>
            {review.image && (
                <img src={review.image.startsWith("http") ? review.image : `${BASE}/reviews/${review.image}`} alt="review" className="sp-review-img" />
            )}
            <div className="sp-review-footer">
                <button className={`sp-helpful-btn ${helpfulMap?.[review.id] ? "active" : ""}`} onClick={() => onHelpful?.(review.id)}>
                    <i className={`bi ${helpfulMap?.[review.id] ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}`} /> Helpful
                </button>
                {(review.user_id == userId || review.user?.id == userId) && (
                    <div className="sp-review-actions">
                        <button className="sp-edit-btn" onClick={() => onEdit(review)}><i className="bi bi-pencil" /> Edit</button>
                        <button className="sp-del-btn" onClick={() => onDelete(review.id)}><i className="bi bi-trash" /> Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SingleProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const swiperRef = useRef(null);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [cartAdded, setCartAdded] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [similarWishlist, setSimilarWishlist] = useState([]);
    const [toast, setToast] = useState({ msg: "", type: "success" });
    const [activeTab, setActiveTab] = useState("description");
    const [colorVariants, setColorVariants] = useState([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [similarProducts, setSimilarProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [reviewFilter, setReviewFilter] = useState("all");
    const [reviewSort, setReviewSort] = useState("newest");
    const [editingReview, setEditingReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 0, title: "", body: "", image: null });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [helpfulMap, setHelpfulMap] = useState({});
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    const fetchReviews = useCallback(async () => {
        try {
            const res = await axios.get(`${BASE}/api/reviews/${id}`);
            setReviews(res.data || []);
        } catch (e) { console.log(e); }
    }, [id]);

    const fetchSimilarAndVariants = useCallback((prod) => {
        axios.get(`${BASE}/api/products`).then((res) => {
            const all = res.data || [];
            setSimilarProducts(all.filter((p) => p.id !== prod.id && (p.category?.name === prod.category?.name || p.brand === prod.brand)).slice(0, 6));
            setColorVariants(all.filter((p) => p.name === prod.name));
        }).catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true); setError(false); setActiveImg(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
        axios.get(`${BASE}/api/products/${id}`)
            .then((res) => {
                const data = res.data.data ?? res.data;
                setProduct(data);
                fetchSimilarAndVariants(data);
                fetchReviews();
                setQty(1); setSelectedSize("");
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {

        if (user) {

            axios
                .get(`${BASE}/api/can-review/${id}/${user.id}`)
                .then((res) => {
                    setCanReview(res.data.canReview);
                })
                .catch((err) => {
                    console.log(err);
                });

        }

    }, [id, user]);


    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
            setRecentlyViewed(stored.filter((p) => String(p.id) !== String(id)).slice(0, 4));
        } catch { }
    }, [id]);

    useEffect(() => {
        if (!product) return;
        try {
            const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
            const next = [
                { id: product.id, name: product.name, price: product.price, image: product.image },
                ...stored.filter((p) => String(p.id) !== String(product.id)),
            ].slice(0, 8);
            localStorage.setItem("recentlyViewed", JSON.stringify(next));
        } catch { }
    }, [product]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const handleAddToCart = async () => {

        if (!user) {
            showToast("Please login first!", "error");
            setTimeout(() => navigate("/login"), 1200);
            return;
        }

        if (!product || !product.id) {
            showToast("Product not loaded yet!", "error");
            return;
        }

        try {

            console.log(product);

            await axios.post(`${BASE}/api/cart`, {
                user_id: user.id,
                product_id: Number(product.id),
                quantity: Number(qty),
            });

            setCartAdded(true);

            showToast("Added to cart!", "success");

            setTimeout(() => {
                setCartAdded(false);
            }, 2500);

        } catch (e) {

            console.log(e.response);

            showToast("Could not add to cart", "error");
        }
    };

    const addSimilarToCart = async (productId) => {
        if (!user) { showToast("Please login first!", "error"); return; }
        try {
            await axios.post(`${BASE}/api/cart`, { user_id: user.id, product_id: productId, quantity: 1 });
            showToast("Added to cart!", "success");
        } catch (e) { console.log(e); }
    };

    const handleBuyNow = () => {
        if (!user) { showToast("Please login first!", "error"); setTimeout(() => navigate("/login"), 1200); return; }
        navigate("/checkout", { state: { buyNow: true, product: { id: product.id, name: product.name, image: product.image, price: Number(product.price) }, qty } });
    };

    const handleWishlist = async () => {
        if (!user) { showToast("Please login first!", "error"); return; }
        try { await axios.post(`${BASE}/api/wishlist`, { user_id: user.id, product_id: product.id }); } catch { }
        setInWishlist((w) => !w);
        showToast(inWishlist ? "Removed from wishlist" : "Added to wishlist!", "success");
    };

    const toggleSimilarWishlist = async (prod) => {
        if (!user) { showToast("Please login first!", "error"); return; }
        try { await axios.post(`${BASE}/api/wishlist`, { user_id: user.id, product_id: prod.id }); } catch { }
        setSimilarWishlist((prev) => prev.includes(prod.id) ? prev.filter((i) => i !== prod.id) : [...prev, prod.id]);
        showToast("Wishlist updated!", "success");
    };

    const submitReview = async () => {
        if (!user) { showToast("Please login to review", "error"); return; }
        if (!reviewForm.rating) { showToast("Please select a rating", "error"); return; }
        setSubmittingReview(true);
        try {
            const fd = new FormData();
            fd.append("product_id", product.id); fd.append("user_id", user.id);
            fd.append("rating", reviewForm.rating); fd.append("title", reviewForm.title);
            fd.append("review", reviewForm.body);
            if (reviewForm.image) fd.append("image", reviewForm.image);
            const headers = { "Content-Type": "multipart/form-data" };
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (editingReview) {
                fd.append("_method", "PUT");
                await axios.post(`${BASE}/api/reviews/${editingReview.id}`, fd, { headers });
                showToast("Review updated!", "success");
            } else {
                await axios.post(`${BASE}/api/reviews`, fd, { headers });
                showToast("Review submitted!", "success");
            }
            setReviewForm({ rating: 0, title: "", body: "", image: null });
            setEditingReview(null); fetchReviews();
        } catch (e) { showToast("Could not submit review", "error"); }
        finally { setSubmittingReview(false); }
    };

    const deleteReview = async (rid) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await axios.delete(`${BASE}/api/reviews/${rid}`, { data: { user_id: user?.id } });
            showToast("Review deleted", "success");
            setReviews((prev) => prev.filter((r) => r.id !== rid));
        } catch (e) { console.log(e); }
    };

    const imgSrc = (img) => img?.startsWith("http") ? img : `${BASE}/storage/${img}`;
    const allImages = product ? [product.image, ...(product.images?.map((i) => i.image) || [])].filter(Boolean) : [];
    const discountPct = product?.discount_price && product?.price ? Math.round(((product.discount_price - product.price) / product.discount_price) * 100) : 0;
    const savings = product?.discount_price && product?.price ? product.discount_price - product.price : 0;
    const colors = product?.color?.split(",").map((c) => c.trim()).filter(Boolean) || [];

    const storageVariants =
        colorVariants
            .map((p) => p.storage)
            .filter(Boolean);
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? (reviews.reduce((a, r) => a + Number(r.rating || 0), 0) / totalReviews).toFixed(1) : (product?.rating || 0);
    const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({ star: s, count: reviews.filter((r) => Number(r.rating) === s).length }));
    const filteredReviews = reviews
        .filter((r) => reviewFilter === "all" || Number(r.rating) === Number(reviewFilter))
        .sort((a, b) => {
            if (reviewSort === "newest") return new Date(b.created_at) - new Date(a.created_at);
            if (reviewSort === "highest") return Number(b.rating) - Number(a.rating);
            if (reviewSort === "lowest") return Number(a.rating) - Number(b.rating);
            return 0;
        });
    const estimatedDelivery = () => {
        const d = new Date(); d.setDate(d.getDate() + 3);

        return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    };

    if (loading) return (
        <div className="sp-root"><div className="sp-container">
            <div className="sp-skeleton-wrap">
                <div className="sp-skeleton sp-skel-gallery" />
                <div className="sp-skeleton-info">
                    <div className="sp-skeleton sp-skel-title" />
                    <div className="sp-skeleton sp-skel-line" />
                    <div className="sp-skeleton sp-skel-line short" />
                    <div className="sp-skeleton sp-skel-price" />
                    <div className="sp-skeleton sp-skel-btn" />
                    <div className="sp-skeleton sp-skel-btn half" />
                </div>
            </div>
        </div></div>
    );

    if (error || !product) return (
        <div className="sp-root"><div className="sp-container">
            <div className="sp-error-state">
                <div className="sp-error-icon"><i className="bi bi-box-seam" /></div>
                <h4>Product Not Found</h4>
                <p>We couldn't find this product. It may have been removed or the link is incorrect.</p>
                <Link to="/products" className="sp-btn-primary">← Back to Products</Link>
            </div>
        </div></div>
    );

    const inStock = product.stock > 0;

    return (
        <div className="sp-root">
            <Toast msg={toast.msg} type={toast.type} />

            {/* BREADCRUMB */}
            <div className="sp-breadcrumb-bar">
                <div className="sp-container">
                    <nav className="sp-breadcrumb">
                        <Link to="/"><i className="bi bi-house" /></Link>
                        <i className="bi bi-chevron-right sp-bc-sep" />
                        <Link to="/products">Products</Link>
                        {product.category?.name && (<>
                            <i className="bi bi-chevron-right sp-bc-sep" />
                            <Link to={`/products?category=${product.category.name}`}>{product.category.name}</Link>
                        </>)}
                        <i className="bi bi-chevron-right sp-bc-sep" />
                        <span className="sp-bc-current">{product.name?.slice(0, 40)}{product.name?.length > 40 ? "…" : ""}</span>
                    </nav>
                </div>
            </div>

            <div className="sp-container">
                <div className="sp-product-grid">

                    {/* ── GALLERY ── */}
                    <div className="sp-gallery-col">
                        <div className="sp-gallery-sticky">
                            <PhotoProvider>
                                <div className="sp-swiper-wrap">
                                    {discountPct > 0 && <span className="sp-img-badge">{discountPct}% OFF</span>}
                                    <div className="sp-img-count-badge"><i className="bi bi-images" /> {allImages.length} Photos</div>
                                    <Swiper
                                        modules={[Pagination, Autoplay]}
                                        autoplay={{ delay: 320000, disableOnInteraction: false }}
                                        pagination={{ clickable: true }}
                                        loop={allImages.length > 1}
                                        onSwiper={(swiper) => { swiperRef.current = swiper; }}
                                        onSlideChange={(swiper) => setActiveImg(swiper.realIndex)}
                                        className="sp-main-swiper"
                                    >
                                        {allImages.map((img, i) => (
                                            <SwiperSlide key={i}>
                                                <div className="sp-swiper-slide-inner">
                                                    <PhotoView src={imgSrc(img)}>
                                                        <img src={imgSrc(img)} alt={product.name} className="sp-swiper-img" />
                                                    </PhotoView>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <div className="sp-zoom-hint-bar"><i className="bi bi-zoom-in" /> Click image to zoom · Swipe to browse</div>
                                </div>

                                {allImages.length > 1 && (
                                    <div className="sp-thumb-strip">
                                        {allImages.map((img, i) => (
                                            <button key={i} className={`sp-thumb ${activeImg === i ? "active" : ""}`}
                                                onClick={() => { setActiveImg(i); swiperRef.current?.slideToLoop(i); }}>
                                                <img src={imgSrc(img)} alt={`View ${i + 1}`} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </PhotoProvider>

                            <div className="sp-share-row">
                                <span className="sp-share-label">Share</span>
                                <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast("Link copied!"); }} className="sp-share-btn" title="Copy link"><i className="bi bi-link-45deg" /></button>
                                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(product.name + " " + window.location.href)}`)} className="sp-share-btn whatsapp" title="WhatsApp"><i className="bi bi-whatsapp" /></button>
                                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`)} className="sp-share-btn" title="Share on X"><i className="bi bi-twitter-x" /></button>
                                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} className="sp-share-btn facebook" title="Facebook"><i className="bi bi-facebook" /></button>
                            </div>

                            <div className="sp-trust-row">
                                <div className="sp-trust-item"><i className="bi bi-shield-fill-check" /><span>100% Genuine</span></div>
                                <div className="sp-trust-item"><i className="bi bi-arrow-repeat" /><span>Easy Returns</span></div>
                                <div className="sp-trust-item"><i className="bi bi-lock-fill" /><span>Secure Pay</span></div>
                            </div>
                        </div>
                    </div>

                    {/* ── INFO ── */}
                    <div className="sp-info-col">

                        {/* Chips — brand, category, condition only (SKU shown in info cards below) */}
                        <div className="sp-chips">
                            {product.brand && <span className="sp-chip brand"><i className="bi bi-building" /> {product.brand}</span>}
                            {product.category?.name && <span className="sp-chip cat"><i className="bi bi-tag" /> {product.category.name}</span>}
                            {product.condition && <span className="sp-chip accent"><i className="bi bi-check-circle-fill" /> {product.condition}</span>}
                        </div>

                        <h1 className="sp-title">{product.name}</h1>

                        <div className="sp-rating-row">
                            <div className="sp-rating-pill"><span>{avgRating}</span><i className="bi bi-star-fill" /></div>
                            <StarRating rating={Number(avgRating)} size="14px" />
                            <span className="sp-review-count">{totalReviews} {totalReviews === 1 ? "review" : "reviews"}</span>
                            {totalReviews > 0 && (
                                <button className="sp-read-reviews" onClick={() => { setActiveTab("reviews"); document.querySelector(".sp-tabs-section")?.scrollIntoView({ behavior: "smooth" }); }}>
                                    Read all →
                                </button>
                            )}
                        </div>

                        <div className="sp-divider" />

                        <div className="sp-price-block">
                            <span className="sp-price-current">₹{Number(product.price).toLocaleString("en-IN")}</span>
                            {product.discount_price > 0 && (<>
                                <span className="sp-price-mrp">MRP <s>₹{Number(product.discount_price).toLocaleString("en-IN")}</s></span>
                                <span className="sp-price-off-badge">{discountPct}% off</span>
                            </>)}
                        </div>
                        {savings > 0 && <div className="sp-savings-tag"><i className="bi bi-tag-fill" /> You save ₹{savings.toLocaleString("en-IN")} on this order</div>}

                        <div className="sp-stock-row">
                            <div className={`sp-stock-chip ${inStock ? "in" : "out"}`}>
                                <i className={`bi ${inStock ? "bi-check-circle-fill" : "bi-x-circle-fill"}`} />
                                {inStock ? `In Stock${product.stock <= 5 ? ` — Only ${product.stock} left!` : ` · ${product.stock} units`}` : "Out of Stock"}
                            </div>
                            {inStock && <StockBar stock={product.stock} />}
                        </div>

                        {product.short_title && <p className="sp-product-desc">{product.short_title}</p>}

                        {/* ── EXTRA INFO CARDS (Flipkart-style) ── */}
                        {(product.sku || product.warranty || product.box_contents) && (
                            <div className="sp-extra-info-grid">
                                {product.short_title && (
                                    <div className="sp-extra-card">
                                        <div className="sp-extra-icon" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>
                                            <i className="bi bi-card-text" />
                                        </div>
                                        <div><span className="sp-extra-label">Short Title</span><h6>{product.short_title}</h6></div>
                                    </div>
                                )}
                                {product.sku && (
                                    <div className="sp-extra-card">
                                        <div className="sp-extra-icon" style={{ background: "linear-gradient(135deg,#0ea5e9,#38bdf8)" }}>
                                            <i className="bi bi-upc-scan" />
                                        </div>
                                        <div>
                                            <span className="sp-extra-label">SKU / Model No.</span>
                                            <h6 className="sp-sku-val">{product.sku}</h6>
                                        </div>
                                    </div>
                                )}
                                {product.warranty && (
                                    <div className="sp-extra-card">
                                        <div className="sp-extra-icon" style={{ background: "linear-gradient(135deg,#10b981,#34d399)" }}>
                                            <i className="bi bi-shield-check" />
                                        </div>
                                        <div><span className="sp-extra-label">Warranty</span><h6>{product.warranty}</h6></div>
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Spec pills */}
                        {(product.storage || product.color || product.display_size || product.condition) && (
                            <div className="sp-spec-tags-row">
                                {product.storage && <span className="sp-spec-tag-pill">💾 {product.storage}</span>}
                                {product.color && <span className="sp-spec-tag-pill">🎨 {product.color}</span>}
                                {product.display_size && <span className="sp-spec-tag-pill">📐 {product.display_size}</span>}
                                {product.condition && <span className="sp-spec-tag-pill">✅ {product.condition}</span>}
                            </div>
                        )}

                        <div className="sp-divider" />

                        {/* Color Variants */}
                        {colorVariants.length > 1 && (
                            <div className="sp-variant-group">
                                <div className="sp-variant-label">Color Variant</div>
                                <div className="sp-variant-options">
                                    {colorVariants.map((item) => (
                                        <button key={item.id} className={`sp-variant-chip ${product.id === item.id ? "selected" : ""}`}
                                            onClick={() => navigate(`/products/${item.id}`)}>
                                            {item.color || item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color from field */}
                        {colors.length > 0 && colorVariants.length <= 1 && (
                            <div className="sp-variant-group">
                                <div className="sp-variant-label">Color: <strong>{colors[0]}</strong></div>
                                <div className="sp-variant-options">
                                    {colors.map((c) => <button key={c} className="sp-variant-chip selected">{c}</button>)}
                                </div>
                            </div>
                        )}

                        {/* Storage */}
                        {storageVariants.length > 0 && (

                            <div className="sp-variant-group">

                                <div className="sp-variant-label">

                                    Storage:
                                    <strong>
                                        {product.storage}
                                    </strong>

                                </div>

                                <div className="sp-variant-options">

                                    {storageVariants.map((storage, index) => {

                                        const variantProduct =
                                            colorVariants.find(
                                                (p) => p.storage === storage
                                            );

                                        return (

                                            <button
                                                key={index}
                                                className={`sp-variant-chip ${product.storage === storage
                                                    ? "selected"
                                                    : ""
                                                    }`}

                                                onClick={() =>
                                                    navigate(
                                                        `/products/${variantProduct.id}`
                                                    )
                                                }
                                            >

                                                {storage}

                                            </button>

                                        );

                                    })}

                                </div>

                            </div>

                        )}

                        {/* Offers */}
                        <div className="sp-offers-grid">
                            <div className="sp-offer-card">
                                <div className="sp-offer-icon" style={{ background: "#EBF2FF" }}><i className="bi bi-bank" style={{ color: "var(--tz-primary)" }} /></div>
                                <div><div className="sp-offer-title">Bank Offer</div><div className="sp-offer-sub">5% cashback on select cards</div></div>
                            </div>
                            <div className="sp-offer-card">
                                <div className="sp-offer-icon" style={{ background: "#e0f2f1" }}><i className="bi bi-credit-card" style={{ color: "var(--tz-success)" }} /></div>
                                <div><div className="sp-offer-title">No Cost EMI</div><div className="sp-offer-sub">From ₹{Math.round(product.price / 6).toLocaleString()}/mo</div></div>
                            </div>
                            <div className="sp-offer-card">
                                <div className="sp-offer-icon" style={{ background: "#fff3e0" }}><i className="bi bi-arrow-repeat" style={{ color: "var(--tz-accent)" }} /></div>
                                <div><div className="sp-offer-title">30 Day Return</div><div className="sp-offer-sub">Easy exchange policy</div></div>
                            </div>
                            <div className="sp-offer-card">
                                <div className="sp-offer-icon" style={{ background: "#f3e5f5" }}><i className="bi bi-shield-check" style={{ color: "#7B1FA2" }} /></div>
                                <div><div className="sp-offer-title">1 Year Warranty</div><div className="sp-offer-sub">Brand authorized</div></div>
                            </div>
                        </div>



                        {inStock ? (<>
                            <div className="sp-qty-row">
                                <span className="sp-qty-label">Qty</span>
                                <div className="sp-qty-ctrl">
                                    <button className="sp-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                                    <span className="sp-qty-val">{qty}</span>
                                    <button className="sp-qty-btn" onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} disabled={qty >= (product.stock || 99)}>+</button>
                                </div>
                                <span className="sp-qty-total">Total: <strong>₹{(Number(product.price) * qty).toLocaleString("en-IN")}</strong></span>
                            </div>
                            <div className="sp-cta-row">
                                <button className={`sp-btn-cart ${cartAdded ? "added" : ""}`} onClick={handleAddToCart}>
                                    <i className={`bi ${cartAdded ? "bi-check-lg" : "bi-cart-plus"}`} />
                                    {cartAdded ? "Added!" : "Add to Cart"}
                                </button>
                                <button className="sp-btn-buy" onClick={handleBuyNow}>
                                    <i className="bi bi-lightning-charge-fill" /> Buy Now
                                </button>
                                <button className={`sp-btn-wish ${inWishlist ? "active" : ""}`} onClick={handleWishlist} title="Wishlist">
                                    <i className={`bi ${inWishlist ? "bi-heart-fill" : "bi-heart"}`} />
                                </button>
                            </div>
                        </>) : (
                            <div className="sp-outstock-msg"><i className="bi bi-bell" /> Notify me when available</div>
                        )}

                        <Link to={`/inquery/${product.id}`} className="sp-inquiry-btn">
                            <i className="bi bi-chat-dots-fill" /> Ask a Product Inquiry
                        </Link>

                        {inStock && (
                            <div className="sp-delivery-eta">
                                <i className="bi bi-truck" />
                                <span>Estimated delivery by <strong>{estimatedDelivery()}</strong></span>
                            </div>
                        )}

                        <div className="sp-delivery-strip">
                            <div className="sp-delivery-item"><i className="bi bi-truck" /><div><div className="sp-delivery-label">Free Delivery</div><div className="sp-delivery-sub">On orders above ₹499</div></div></div>
                            <div className="sp-delivery-item"><i className="bi bi-arrow-counterclockwise" /><div><div className="sp-delivery-label">30 Day Return</div><div className="sp-delivery-sub">Easy exchange</div></div></div>
                            <div className="sp-delivery-item"><i className="bi bi-shield-lock" /><div><div className="sp-delivery-label">Secure Payment</div><div className="sp-delivery-sub">SSL encrypted</div></div></div>
                        </div>

                        <div className="sp-payment-icons">
                            <span className="sp-payment-label">Accepted:</span>
                            {["bi-credit-card", "bi-paypal", "bi-wallet2", "bi-phone"].map((ic) => (
                                <div key={ic} className="sp-payment-icon"><i className={`bi ${ic}`} /></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="sp-tabs-section">
                    <div className="sp-tab-nav">
                        {[
                            { key: "description", label: "Description", icon: "bi-file-text" },
                            { key: "specifications", label: "Specifications", icon: "bi-list-ul" },
                            { key: "reviews", label: `Reviews (${totalReviews})`, icon: "bi-chat-square-text" },
                        ].map((tab) => (
                            <button key={tab.key} className={`sp-tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
                                <i className={`bi ${tab.icon}`} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="sp-tab-body">
                        {activeTab === "description" && (
                            <div className="sp-tab-pane">
                                {product.description && (
                                    <div className="sp-desc-card">
                                        <h3 className="sp-section-title">Product Description</h3>
                                        <div className="sp-desc-body" dangerouslySetInnerHTML={{ __html: product.description }} />
                                    </div>
                                )}
                                {product.key_features && (
                                    <div className="sp-desc-card mt-4">
                                        <h3 className="sp-section-title">Key Features</h3>
                                        <div className="sp-feature-list">
                                            {product.key_features.split('\n').map((feature, index) => (
                                                <div key={index} className="sp-feature-item">
                                                    <i className="bi bi-check-circle-fill" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!product.description && !product.key_features && <p className="sp-empty-text">No description available.</p>}
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="sp-tab-pane">
                                {product.specifications ? (
                                    <div className="sp-spec-card">
                                        <h3 className="sp-section-title">Technical Specifications</h3>
                                        <div className="sp-spec-grid">
                                            {(typeof product.specifications === "string"
                                                ? product.specifications.split('\n').map((spec, i) => {
                                                    const parts = spec.split(':');
                                                    return <div key={i} className={`sp-spec-row ${i % 2 === 0 ? "even" : ""}`}><div className="sp-spec-key">{parts[0]}</div><div className="sp-spec-val">{parts.slice(1).join(':')}</div></div>;
                                                })
                                                : Object.entries(product.specifications).map(([k, v], i) => (
                                                    <div key={i} className={`sp-spec-row ${i % 2 === 0 ? "even" : ""}`}><div className="sp-spec-key">{k}</div><div className="sp-spec-val">{v}</div></div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ) : <p className="sp-empty-text">No specifications available.</p>}
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="sp-tab-pane">
                                <div className="sp-reviews-layout">
                                    <div className="sp-review-sidebar">
                                        <div className="sp-review-overview">
                                            <div className="sp-big-score">
                                                <span className="sp-big-num">{avgRating}</span>
                                                <StarRating rating={Number(avgRating)} size="20px" />
                                                <span className="sp-total-label">{totalReviews} reviews</span>
                                            </div>
                                            <div className="sp-rbar-list">
                                                {ratingCounts.map((rc) => (
                                                    <RatingBar key={rc.star} star={rc.star} count={rc.count} total={totalReviews}
                                                        active={reviewFilter === String(rc.star)}
                                                        onClick={() => setReviewFilter(reviewFilter === String(rc.star) ? "all" : String(rc.star))} />
                                                ))}
                                            </div>
                                        </div>

                                        {!user ? (

                                            <div className="sp-login-review">
                                                <i className="bi bi-lock" />
                                                <p>Login to write a review</p>

                                                <Link to="/login" className="sp-btn-primary">
                                                    Login
                                                </Link>
                                            </div>

                                        ) : canReview ? (

                                            <div className="sp-write-review">

                                                <h6 className="sp-wr-heading">
                                                    <i className="bi bi-pencil-square" />
                                                    {editingReview ? "Edit Review" : "Write a Review"}
                                                </h6>

                                                <div className="sp-wr-stars-row">
                                                    <span>Your Rating</span>

                                                    <StarRating
                                                        rating={reviewForm.rating}
                                                        size="24px"
                                                        interactive
                                                        onRate={(r) =>
                                                            setReviewForm((f) => ({
                                                                ...f,
                                                                rating: r
                                                            }))
                                                        }
                                                    />
                                                </div>

                                                <input
                                                    className="sp-wr-input"
                                                    placeholder="Review title"
                                                    value={reviewForm.title}
                                                    onChange={(e) =>
                                                        setReviewForm((f) => ({
                                                            ...f,
                                                            title: e.target.value
                                                        }))
                                                    }
                                                />

                                                <textarea
                                                    className="sp-wr-textarea"
                                                    placeholder="Share your experience..."
                                                    rows={4}
                                                    value={reviewForm.body}
                                                    onChange={(e) =>
                                                        setReviewForm((f) => ({
                                                            ...f,
                                                            body: e.target.value
                                                        }))
                                                    }
                                                />

                                                <button
                                                    className="sp-wr-submit"
                                                    onClick={submitReview}
                                                >
                                                    Submit Review
                                                </button>

                                            </div>

                                        ) : (

                                            <div className="sp-login-review">

                                                <i className="bi bi-bag-check-fill" />

                                                <p>
                                                    Only customers who purchased and received
                                                    this product can write a review.
                                                </p>

                                            </div>

                                        )}
                                    </div>

                                    <div className="sp-reviews-main">
                                        <div className="sp-review-banner">
                                            <div className="sp-review-banner-left">
                                                <div className="sp-review-banner-verified"><i className="bi bi-patch-check-fill" /> VERIFIED CUSTOMER FEEDBACK</div>
                                                <h3 className="sp-review-banner-title">What Customers Say 💜</h3>
                                                <p className="sp-review-banner-sub">Real opinions from verified buyers of this product.</p>
                                            </div>
                                            <div className="sp-review-score-box">
                                                <div className="sp-review-score-big">{avgRating}</div>
                                                <StarRating rating={Number(avgRating)} size="16px" />
                                                <div className="sp-review-score-label">Based on {totalReviews} Reviews</div>
                                            </div>
                                        </div>

                                        <div className="sp-review-toolbar">
                                            <div className="sp-review-filters">
                                                {["all", "5", "4", "3", "2", "1"].map((f) => (
                                                    <button key={f} className={`sp-filter-btn ${reviewFilter === f ? "active" : ""}`} onClick={() => setReviewFilter(f)}>
                                                        {f === "all" ? "All" : <><i className="bi bi-star-fill" style={{ color: "#fbbf24", fontSize: "10px" }} /> {f}</>}
                                                    </button>
                                                ))}
                                            </div>
                                            <select className="sp-sort-sel" value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
                                                <option value="newest">Newest First</option>
                                                <option value="highest">Highest Rated</option>
                                                <option value="lowest">Lowest Rated</option>
                                            </select>
                                        </div>

                                        <div className="sp-review-count-label">
                                            Showing <strong>{filteredReviews.length}</strong> {filteredReviews.length === 1 ? "review" : "reviews"}
                                            {reviewFilter !== "all" && <span className="sp-filter-label"> · {reviewFilter}★ filter</span>}
                                        </div>

                                        {filteredReviews.length > 0 ? (
                                            <div className="sp-review-list">
                                                {filteredReviews.map((rev, i) => (
                                                    <ReviewCard key={rev.id || i} review={rev} index={i} userId={user?.id} helpfulMap={helpfulMap}
                                                        onHelpful={(rid) => setHelpfulMap((m) => ({ ...m, [rid]: !m[rid] }))}
                                                        onEdit={(item) => {
                                                            setEditingReview(item);
                                                            setReviewForm({ rating: item.rating, title: item.title || "", body: item.review || item.body || item.comment || "", image: null });
                                                            document.querySelector(".sp-write-review")?.scrollIntoView({ behavior: "smooth" });
                                                        }}
                                                        onDelete={deleteReview} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="sp-empty-reviews">
                                                <i className="bi bi-chat-square-heart" style={{ fontSize: "48px", marginBottom: "16px", display: "block" }} />
                                                <h4 style={{ fontWeight: 800, marginBottom: "8px" }}>{reviewFilter !== "all" ? `No ${reviewFilter}★ Reviews Yet` : "No Reviews Yet"}</h4>
                                                <p>{reviewFilter !== "all" ? "Try a different filter." : "Be the first to share your experience!"}</p>
                                                {reviewFilter !== "all" && <button className="sp-filter-btn active" onClick={() => setReviewFilter("all")} style={{ marginTop: "12px" }}>Show All Reviews</button>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* SIMILAR PRODUCTS */}
                {similarProducts.length > 0 && (
                    <div className="sp-similar-section">
                        <div className="sp-section-header">
                            <div>
                                <div className="sp-section-tag"><i className="bi bi-grid-fill" /> Similar Products</div>
                                <h2 className="sp-section-heading">You May Also Like</h2>
                                <p className="sp-section-sub">More from {product.category?.name || product.brand}</p>
                            </div>
                            <Link to="/products" className="sp-view-all-btn">View All <i className="bi bi-arrow-right" /></Link>
                        </div>
                        <div className="sp-similar-grid">
                            {similarProducts.map((p, idx) => {
                                const inW = similarWishlist.includes(p.id);
                                const disc = p.discount_price && p.price ? Math.round(((p.discount_price - p.price) / p.discount_price) * 100) : 0;
                                return (
                                    <div className="sp-similar-card" key={p.id} style={{ animationDelay: `${idx * 0.08}s` }}>
                                        <div className="sp-similar-img-wrap">
                                            <img src={p.image?.startsWith("http") ? p.image : `${BASE}/storage/${p.image}`} alt={p.name} loading="lazy" className="sp-similar-img" />
                                            {disc > 0 && <span className="sp-similar-badge">-{disc}%</span>}
                                            <button className="sp-similar-wish-btn" onClick={() => toggleSimilarWishlist(p)}>
                                                <i className={`bi ${inW ? "bi-heart-fill" : "bi-heart"}`} style={{ color: inW ? "#ef4444" : undefined }} />
                                            </button>
                                            <div className="sp-similar-overlay">
                                                <Link to={`/products/${p.id}`} className="sp-similar-overlay-btn"><i className="bi bi-eye" /> Quick View</Link>
                                            </div>
                                        </div>
                                        <div className="sp-similar-body">
                                            <div className="sp-similar-meta">
                                                <span className="sp-similar-brand">{p.brand || "—"}</span>
                                                <span className="sp-similar-cat">{p.category?.name || "—"}</span>
                                            </div>
                                            <h6 className="sp-similar-name">{p.name}</h6>
                                            {p.description && <p className="sp-similar-desc">{p.description?.slice(0, 65)}...</p>}
                                            {Number(p.rating) > 0 && (
                                                <div className="sp-similar-rating">
                                                    <div className="sp-mini-rating-badge" style={{ background: Number(p.rating) >= 4 ? "linear-gradient(135deg,#059669,#34d399)" : "linear-gradient(135deg,#d97706,#fbbf24)" }}>
                                                        {p.rating} <i className="bi bi-star-fill" style={{ fontSize: "8px" }} />
                                                    </div>
                                                    <span>Verified</span>
                                                </div>
                                            )}
                                            {(p.storage || p.color || p.display_size) && (
                                                <div className="sp-similar-spec-tags">
                                                    {p.storage && <span>{p.storage}</span>}
                                                    {p.color && <span>{p.color}</span>}
                                                    {p.display_size && <span>{p.display_size}</span>}
                                                </div>
                                            )}
                                            <div className="sp-similar-price-row">
                                                <span className="sp-similar-price">₹{Number(p.price).toLocaleString("en-IN")}</span>
                                                {p.discount_price && <span className="sp-similar-price-old">₹{Number(p.discount_price).toLocaleString("en-IN")}</span>}
                                            </div>
                                            <div className="sp-similar-actions">
                                                <Link to={`/products/${p.id}`} className="sp-similar-view-btn">View Details</Link>
                                                <button className="sp-similar-cart-btn" onClick={() => addSimilarToCart(p.id)}><i className="bi bi-cart-plus" /></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* RECENTLY VIEWED */}
                {recentlyViewed.length > 0 && (
                    <div className="sp-similar-section">
                        <div className="sp-section-header">
                            <div>
                                <div className="sp-section-tag"><i className="bi bi-clock-history" /> Recently Viewed</div>
                                <h2 className="sp-section-heading">Continue Browsing</h2>
                            </div>
                        </div>
                        <div className="sp-recent-grid">
                            {recentlyViewed.map((p) => (
                                <Link to={`/products/${p.id}`} className="sp-recent-card" key={p.id}>
                                    <div className="sp-recent-img">
                                        {p.image ? <img src={p.image?.startsWith("http") ? p.image : `${BASE}/storage/${p.image}`} alt={p.name} loading="lazy" /> : <i className="bi bi-box-seam" />}
                                    </div>
                                    <div className="sp-recent-info">
                                        <div className="sp-recent-name">{p.name}</div>
                                        <div className="sp-recent-price">₹{Number(p.price).toLocaleString("en-IN")}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {inStock && (
                <div className="sp-mobile-cta">
                    <button
                        type="button"
                        className={`sp-btn-cart ${cartAdded ? "added" : ""}`}
                        onClick={handleAddToCart}
                    ><i className="bi bi-cart-plus" /> Add to Cart</button>
                    <button className="sp-mobile-buy" onClick={handleBuyNow}><i className="bi bi-lightning-charge-fill" /> Buy Now</button>
                </div>
            )}
        </div>
    );
}