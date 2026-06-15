import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";



const BASE = "https://tech-zone-backend-production.up.railway.app";

const purposes = [
    "Astrological / Rashi Ratna",
    "Health & Healing",
    "Business & Career Growth",
    "Marriage & Relationship",
    "Education & Concentration",
    "Wealth & Prosperity",
    "Spiritual Growth",
    "Just Exploring",
];

export default function Inquery() {
    const { id } = useParams(); // product id from URL

    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        purpose: "",
        budget: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch product details if id exists in URL
    useEffect(() => {
        if (id) {
            setProductLoading(true);
            axios.get(`${BASE}/api/products/${id}`)
                .then((res) => {
                    setProduct(res.data);
                    setProductLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setProductLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Send inquiry to Laravel API
            // product_id → links to product
            // owner gets notified on backend
            axios.post(`${BASE}/api/inquiries`, {
                ...form,
                product_id: id || null,
            });

            setSubmitted(true);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#f9f5ec", minHeight: "80vh" }}>
            {/* Page Header */}
            <div
                className="py-4 text-white"
                style={{ background: "linear-gradient(135deg, #1a1205, #3d2b00)" }}
            >
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-2">
                            <li className="breadcrumb-item">
                                <Link to="/" style={{ color: "#f5a623", textDecoration: "none" }}>
                                    Home
                                </Link>
                            </li>
                            {id && product && (
                                <li className="breadcrumb-item">
                                    <Link
                                        to={`/products/${id}`}
                                        style={{ color: "#f5a623", textDecoration: "none" }}
                                    >
                                        {product.name}
                                    </Link>
                                </li>
                            )}
                            <li
                                className="breadcrumb-item active"
                                style={{ color: "#d4b483" }}
                            >
                                Send Inquiry
                            </li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">
                        <i className="bi bi-chat-dots me-2" style={{ color: "#f5a623" }} />
                        {id ? "Product Inquiry" : "General Inquiry"}
                    </h4>
                </div>
            </div>

            <div className="container py-4">
                <div className="row g-4 justify-content-center">
                    {/* Left: Product Info (only if product id exists) */}
                    <div className="col-lg-4">
                        {/* Product Card */}
                        {id && (
                            <div
                                className="bg-white rounded-4 shadow-sm overflow-hidden mb-3"
                                style={{ border: "1px solid #f0e0b0" }}
                            >
                                {productLoading ? (
                                    <div className="text-center py-4">
                                        <div
                                            className="spinner-border"
                                            style={{ color: "#f5a623" }}
                                        />
                                        <p className="small text-muted mt-2 mb-0">
                                            Loading product...
                                        </p>
                                    </div>
                                ) : product ? (
                                    <>
                                        {/* Product Image */}
                                        <div style={{ position: "relative" }}>
                                            <img
                                                src={`${BASE}/storage/${product.image}`}
                                                alt={product.name}
                                                className="w-100"
                                                style={{ height: "200px", objectFit: "cover" }}
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://via.placeholder.com/300x200?text=Gemstone";
                                                }}
                                            />
                                            <span
                                                className="position-absolute top-0 start-0 m-2 badge"
                                                style={{
                                                    background: "#f5a623",
                                                    borderRadius: "8px",
                                                    fontSize: "10px",
                                                }}
                                            >
                                                💎 {product.category?.name || "Gemstone"}
                                            </span>
                                        </div>

                                        <div className="p-3">
                                            <h6 className="fw-bold mb-1">{product.name}</h6>

                                            {/* Price */}
                                            <div className="mb-2">
                                                <span
                                                    className="fw-bold fs-5"
                                                    style={{ color: "#f5a623" }}
                                                >
                                                    ₹{Number(product.price).toLocaleString()}
                                                </span>
                                                {product.discount_price > 0 && (
                                                    <span
                                                        className="text-muted text-decoration-line-through ms-2 small"
                                                    >
                                                        ₹{Number(product.discount_price).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stock */}
                                            <span
                                                className="badge mb-2"
                                                style={{
                                                    background:
                                                        product.stock > 0 ? "#e8f5e9" : "#fdecea",
                                                    color: product.stock > 0 ? "#2f9e44" : "#c92a2a",
                                                    borderRadius: "8px",
                                                    fontSize: "10px",
                                                }}
                                            >
                                                <i
                                                    className={`bi ${product.stock > 0
                                                        ? "bi-check-circle"
                                                        : "bi-x-circle"
                                                        } me-1`}
                                                />
                                                {product.stock > 0
                                                    ? `In Stock (${product.stock} left)`
                                                    : "Out of Stock"}
                                            </span>

                                            {product.description && (
                                                <p
                                                    className="text-muted mb-0"
                                                    style={{
                                                        fontSize: "12px",
                                                        lineHeight: 1.6,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4 text-muted small">
                                        Product not found
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contact Info */}
                        <div className="d-flex flex-column gap-2">
                            {[
                                {
                                    icon: "bi-whatsapp",
                                    color: "#25d366",
                                    bg: "#e8fdf0",
                                    title: "WhatsApp",
                                    desc: "+91 77103-61543",
                                },
                                {
                                    icon: "bi-telephone-fill",
                                    color: "#f5a623",
                                    bg: "#fff8ec",
                                    title: "Call Us",
                                    desc: "+91 77103-61543",
                                },
                                {
                                    icon: "bi-envelope-fill",
                                    color: "#3b5bdb",
                                    bg: "#e8f0fe",
                                    title: "Email",
                                    desc: "info@techzone.in",
                                },
                            ].map((info) => (
                                <div
                                    key={info.title}
                                    className="bg-white rounded-3 p-3 d-flex align-items-center gap-3 shadow-sm"
                                    style={{ border: `1px solid ${info.color}22` }}
                                >
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{ width: 40, height: 40, background: info.bg }}
                                    >
                                        <i
                                            className={`bi ${info.icon}`}
                                            style={{ color: info.color }}
                                        />
                                    </div>
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: "12px" }}>
                                            {info.title}
                                        </div>
                                        <div
                                            className="fw-semibold"
                                            style={{ fontSize: "13px", color: "#333" }}
                                        >
                                            {info.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Inquiry Form */}
                    <div className="col-lg-8">
                        <div
                            className="bg-white rounded-4 shadow-sm p-4"
                            style={{ border: "1px solid #f0e0b0" }}
                        >
                            {submitted ? (
                                /* Success Screen */
                                <div className="text-center py-5">
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                                        style={{
                                            width: 90,
                                            height: 90,
                                            background: "#fff8ec",
                                            border: "3px solid #f5a623",
                                        }}
                                    >
                                        <i
                                            className="bi bi-check2-circle"
                                            style={{ fontSize: "40px", color: "#f5a623" }}
                                        />
                                    </div>
                                    <h4 className="fw-bold mb-2">Inquiry Sent! 💎</h4>
                                    <p className="text-muted mb-1">
                                        Thank you, <strong>{form.name}</strong>!
                                    </p>
                                    <p className="text-muted mb-4">
                                        The product owner has been notified. They will contact you
                                        on <strong>{form.phone}</strong> within{" "}
                                        <strong>24 hours</strong>.
                                    </p>

                                    {/* Reference ID */}
                                    <div
                                        className="p-3 rounded-3 mb-4 d-inline-block"
                                        style={{
                                            background: "#fff8ec",
                                            border: "1px dashed #f5a623",
                                        }}
                                    >
                                        <div className="text-muted small">Reference ID</div>
                                        <div className="fw-bold" style={{ color: "#c17f24" }}>
                                            GZ-INQ-{Date.now().toString().slice(-6)}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                                        <button
                                            className="btn px-4 fw-bold"
                                            onClick={() => {
                                                setSubmitted(false);
                                                setForm({
                                                    name: "",
                                                    email: "",
                                                    phone: "",
                                                    city: "",
                                                    purpose: "",
                                                    budget: "",
                                                    message: "",
                                                });
                                            }}
                                            style={{
                                                background: "#f5a623",
                                                color: "#fff",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            Send Another
                                        </button>
                                        {id && (
                                            <Link
                                                to={`/products/${id}`}
                                                className="btn px-4 fw-bold"
                                                style={{
                                                    background: "#1a1205",
                                                    color: "#fff",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                Back to Product
                                            </Link>
                                        )}
                                        <Link
                                            to="/products"
                                            className="btn px-4 fw-bold"
                                            style={{
                                                background: "#f9f5ec",
                                                color: "#c17f24",
                                                border: "1px solid #f0e0b0",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            Browse More
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Form Header */}
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                            style={{ width: 48, height: 48, background: "#fff8ec" }}
                                        >
                                            <i
                                                className="bi bi-send fs-5"
                                                style={{ color: "#f5a623" }}
                                            />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">Send Your Inquiry</h5>
                                            <small className="text-muted">
                                                {id && product
                                                    ? `Inquiring about: ${product.name}`
                                                    : "Fill out the form for a personalized response"}
                                            </small>
                                        </div>
                                    </div>

                                    {/* Error Alert */}
                                    {error && (
                                        <div
                                            className="alert d-flex align-items-center gap-2 mb-4"
                                            style={{
                                                background: "#fdecea",
                                                border: "1px solid #f5c6cb",
                                                borderRadius: "12px",
                                                color: "#c92a2a",
                                            }}
                                        >
                                            <i className="bi bi-exclamation-circle-fill" />
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        {/* Personal Info Section */}
                                        <div
                                            className="p-3 rounded-3 mb-4"
                                            style={{
                                                background: "#f9f5ec",
                                                border: "1px solid #f0e0b0",
                                            }}
                                        >
                                            <div
                                                className="fw-semibold small mb-3"
                                                style={{ color: "#c17f24" }}
                                            >
                                                <i className="bi bi-person me-1" />
                                                Your Information
                                            </div>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        name="name"
                                                        className="form-control"
                                                        placeholder="Your full name"
                                                        required
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        style={{
                                                            borderRadius: "10px",
                                                            borderColor: "#e0d0b0",
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">
                                                        Phone Number *
                                                    </label>
                                                    <input
                                                        name="phone"
                                                        className="form-control"
                                                        placeholder="+91 98765 43210"
                                                        required
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        style={{
                                                            borderRadius: "10px",
                                                            borderColor: "#e0d0b0",
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="your@email.com"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        style={{
                                                            borderRadius: "10px",
                                                            borderColor: "#e0d0b0",
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">
                                                        City
                                                    </label>
                                                    <input
                                                        name="city"
                                                        className="form-control"
                                                        placeholder="Your city"
                                                        value={form.city}
                                                        onChange={handleChange}
                                                        style={{
                                                            borderRadius: "10px",
                                                            borderColor: "#e0d0b0",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inquiry Details Section */}
                                        <div
                                            className="p-3 rounded-3 mb-4"
                                            style={{
                                                background: "#f9f5ec",
                                                border: "1px solid #f0e0b0",
                                            }}
                                        >
                                            <div
                                                className="fw-semibold small mb-3"
                                                style={{ color: "#c17f24" }}
                                            >
                                                <i className="bi bi-gem me-1" />
                                                Inquiry Details
                                            </div>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">
                                                        Purpose
                                                    </label>
                                                    <select
                                                        name="purpose"
                                                        className="form-select"
                                                        value={form.purpose}
                                                        onChange={handleChange}
                                                        style={{
                                                            borderRadius: "10px",
                                                            borderColor: "#e0d0b0",
                                                        }}
                                                    >
                                                        <option value="">Select purpose...</option>
                                                        {purposes.map((p) => (
                                                            <option key={p}>{p}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-semibold">
                                                        Budget Range
                                                    </label>
                                                    <select
                                                        name="budget"
                                                        className="form-select"
                                                        value={form.budget}
                                                        onChange={handleChange}
                                                        style={{
                                                            borderRadius: "10px",
                                                            borderColor: "#e0d0b0",
                                                        }}
                                                    >
                                                        <option value="">Select budget...</option>
                                                        <option>Below ₹5,000</option>
                                                        <option>₹5,000 – ₹15,000</option>
                                                        <option>₹15,000 – ₹30,000</option>
                                                        <option>₹30,000 – ₹50,000</option>
                                                        <option>₹50,000 – ₹1,00,000</option>
                                                        <option>Above ₹1,00,000</option>
                                                    </select>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label small fw-semibold">
                                                        Message *
                                                    </label>
                                                    <textarea
                                                        name="message"
                                                        className="form-control"
                                                        rows={4}
                                                        required
                                                        placeholder={
                                                            id
                                                                ? "Ask about this product — availability, certification, weight, origin, or any specific requirement..."
                                                                : "Tell us what you're looking for, your birth details for astrological guidance, or any specific requirement..."
                                                        }
                                                        value={form.message}
                                                        onChange={handleChange}
                                                        style={{
                                                            borderRadius: "10px",
                                                            borderColor: "#e0d0b0",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="d-flex gap-3 flex-wrap">
                                            <button
                                                type="submit"
                                                className="btn px-5 py-2 fw-bold"
                                                disabled={loading}
                                                style={{
                                                    background: "#f5a623",
                                                    color: "#fff",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-send me-2" />
                                                        Send Inquiry
                                                    </>
                                                )}
                                            </button>

                                            <a
                                                href={`https://wa.me/917710361543?text=Hi! I'm interested in ${product ? product.name : "your gemstones"
                                                    }. Product ID: ${id || "N/A"}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn px-4 py-2 fw-bold"
                                                style={{
                                                    background: "#25d366",
                                                    color: "#fff",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                <i className="bi bi-whatsapp me-1" />
                                                WhatsApp
                                            </a>
                                        </div>

                                        {/* Hidden product_id note */}
                                        {id && (
                                            <p className="text-muted mt-3 mb-0" style={{ fontSize: "11px" }}>
                                                <i className="bi bi-info-circle me-1" />
                                                This inquiry will be sent directly to the product owner. Reference Product ID: <strong>#{id}</strong>
                                            </p>
                                        )}
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}