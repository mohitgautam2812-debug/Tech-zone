import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function BlogSingle() {

    const { slug } = useParams();

    const [blog, setBlog] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const BASE = "http://127.0.0.1:8000/api";

    const CAT_COLORS = {
        Reviews: "#00d4ff", Comparisons: "#2563eb", Guides: "#16a34a",
        Cameras: "#7c3aed", Audio: "#0891b2", Insights: "#d97706", News: "#db2777",
    };
    const catColor = (c) => CAT_COLORS[c] || "#00d4ff";

    const fmtDate = (s) =>
        s ? new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

    const readTime = (html) => {
        const words = (html || "").replace(/<[^>]+>/g, "").split(/\s+/).length;
        return Math.max(1, Math.round(words / 200)) + " min read";
    };

    const initials = (name) =>
        (name || "A").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    const fetchBlog = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await axios.get(`${BASE}/blogs/${slug}`);
            setBlog(res.data.data);
            setRelated(res.data.related || []);
        } catch (err) {
            console.log(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    // ── Loading skeleton
    if (loading) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "80vh" }} className="py-4">
                <div className="container" style={{ maxWidth: 780 }}>
                    <div className="placeholder-glow">
                        <div className="placeholder w-100 rounded-4 mb-4" style={{ height: 360, background: "#1a2540" }} />
                        <div className="placeholder col-3 mb-3" style={{ height: 12, background: "#1a2540" }} />
                        <div className="placeholder col-12 mb-2" style={{ height: 32, background: "#1a2540" }} />
                        <div className="placeholder col-8  mb-4" style={{ height: 32, background: "#1a2540" }} />
                        <div className="placeholder col-12 mb-2" style={{ height: 14, background: "#1a2540" }} />
                        <div className="placeholder col-12 mb-2" style={{ height: 14, background: "#1a2540" }} />
                        <div className="placeholder col-7  mb-2" style={{ height: 14, background: "#1a2540" }} />
                    </div>
                </div>
            </div>
        );
    }

    // ── Error state
    if (error || !blog) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "80vh" }} className="py-4">
                <div className="container text-center py-5">
                    <i className="bi bi-exclamation-circle display-2" style={{ color: "#1e2d4a" }} />
                    <h5 className="mt-3 fw-bold" style={{ color: "#e8eaf0" }}>Blog post not found!</h5>
                    <p style={{ color: "#8899bb" }}>Make sure the API is running at {BASE}</p>
                    <Link to="/blog" className="btn btn-sm mt-2" style={{ background: "#00d4ff", color: "#0a0e1a", border: "none", fontWeight: 600 }}>
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const thumbSrc = blog.thumbnail
        ? blog.thumbnail.startsWith("http")
            ? blog.thumbnail
            : `http://127.0.0.1:8000/storage/${blog.thumbnail}`
        : null;

    return (
        <div style={{ background: "#0a0e1a", minHeight: "80vh" }} className="py-4">
            <div className="container">

                {/* ── Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/" style={{ color: "#00d4ff", textDecoration: "none" }}>Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/blog" style={{ color: "#00d4ff", textDecoration: "none" }}>Blog</Link>
                        </li>
                        <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200, color: "#8899bb" }}>
                            {blog.title}
                        </li>
                    </ol>
                </nav>

                <div className="row g-4">

                    {/* ════════════════════════════════════════ */}
                    {/* MAIN ARTICLE                            */}
                    {/* ════════════════════════════════════════ */}
                    <div className="col-lg-8">
                        <div className="rounded-4 overflow-hidden" style={{ background: "#131929", border: "1px solid #1e2d4a" }}>

                            {/* Thumbnail */}
                            {thumbSrc ? (
                                <img
                                    src={thumbSrc}
                                    alt={blog.title}
                                    className="w-100"
                                    style={{ height: 340, objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    className="w-100 d-flex align-items-center justify-content-center"
                                    style={{ height: 200, background: "linear-gradient(135deg,#0a0e1a,#1a2540)" }}
                                >
                                    <i className="bi bi-image display-2" style={{ color: "#1e2d4a" }} />
                                </div>
                            )}

                            <div className="p-4">

                                {/* Category badge */}
                                <span
                                    className="badge mb-2"
                                    style={{
                                        background: catColor(blog.category),
                                        color: "#0a0e1a",
                                        fontSize: "11px",
                                        borderRadius: "6px",
                                        letterSpacing: ".04em",
                                    }}
                                >
                                    {blog.category}
                                </span>

                                {/* Title */}
                                <h3 className="fw-bold mb-2" style={{ lineHeight: 1.25, color: "#e8eaf0" }}>
                                    {blog.title}
                                </h3>

                                {/* Excerpt */}
                                <p style={{ color: "#8899bb", fontStyle: "italic", lineHeight: 1.6 }} className="mb-3">
                                    {blog.excerpt}
                                </p>

                                {/* Meta row */}
                                <div
                                    className="d-flex align-items-center flex-wrap gap-3 py-3 mb-4"
                                    style={{ borderTop: "1px solid #1e2d4a", borderBottom: "1px solid #1e2d4a" }}
                                >
                                    {/* Author avatar + name */}
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                            style={{
                                                width: 32, height: 32,
                                                background: "linear-gradient(135deg,#00d4ff,#2563eb)",
                                                color: "#0a0e1a",
                                                fontSize: "12px",
                                            }}
                                        >
                                            {initials(blog.author)}
                                        </div>
                                        <span className="fw-semibold small" style={{ color: "#e8eaf0" }}>{blog.author}</span>
                                    </div>

                                    <span style={{ color: "#1e2d4a" }}>|</span>

                                    <span className="small" style={{ color: "#8899bb" }}>
                                        <i className="bi bi-calendar3 me-1" />
                                        {fmtDate(blog.published_at || blog.created_at)}
                                    </span>

                                    <span style={{ color: "#1e2d4a" }}>|</span>

                                    <span className="small" style={{ color: "#8899bb" }}>
                                        <i className="bi bi-clock me-1" />
                                        {readTime(blog.content)}
                                    </span>
                                </div>

                                {/* Article body */}
                                <div
                                    className="blog-content"
                                    style={{ lineHeight: 1.85, fontSize: "15px", color: "#c8d0e0" }}
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />

                                {/* Share row */}
                                <div
                                    className="d-flex align-items-center gap-2 mt-4 p-3 rounded-3"
                                    style={{ background: "#1a2540", border: "1px solid #1e2d4a" }}
                                >
                                    <span className="fw-semibold small me-auto" style={{ color: "#e8eaf0" }}>Share this article</span>
                                    <button
                                        className="btn btn-sm"
                                        style={{ background: "#0a0e1a", color: "#8899bb", border: "1px solid #1e2d4a", borderRadius: 8 }}
                                        onClick={() =>
                                            navigator.clipboard.writeText(window.location.href)
                                                .then(() => alert("Link copied!"))
                                        }
                                        title="Copy link"
                                    >
                                        <i className="bi bi-link-45deg" />
                                    </button>
                                    <button
                                        className="btn btn-sm"
                                        style={{ background: "#0a0e1a", color: "#e8eaf0", border: "1px solid #1e2d4a", borderRadius: 8 }}
                                        onClick={() =>
                                            window.open(
                                                `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`
                                            )
                                        }
                                        title="Share on X"
                                    >
                                        <i className="bi bi-twitter-x" />
                                    </button>
                                    <button
                                        className="btn btn-sm"
                                        style={{ background: "#0a66c2", color: "#fff", border: "none", borderRadius: 8 }}
                                        onClick={() =>
                                            window.open(
                                                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
                                            )
                                        }
                                        title="Share on LinkedIn"
                                    >
                                        <i className="bi bi-linkedin" />
                                    </button>
                                </div>

                            </div>
                        </div>

                        {/* ← Back button */}
                        <div className="mt-3">
                            <Link
                                to="/blog"
                                style={{ color: "#00d4ff", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
                            >
                                ← Back to all articles
                            </Link>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════ */}
                    {/* SIDEBAR — Related Articles              */}
                    {/* ════════════════════════════════════════ */}
                    <div className="col-lg-4">
                        <div className="rounded-4 p-4" style={{ background: "#131929", border: "1px solid #1e2d4a" }}>

                            <h5 className="fw-bold mb-4" style={{ color: "#e8eaf0" }}>
                                <i className="bi bi-grid me-2" style={{ color: "#00d4ff" }} />
                                Related Articles
                            </h5>

                            {related.length === 0 ? (
                                <p className="small" style={{ color: "#8899bb" }}>No related articles found.</p>
                            ) : (
                                related.map((r, idx) => (
                                    <div key={r.id}>
                                        <Link to={`/blog/${r.slug}`} style={{ textDecoration: "none" }}>
                                            <div className="d-flex align-items-center gap-3">
                                                {/* Thumb */}
                                                {r.thumbnail ? (
                                                    <img
                                                        src={
                                                            r.thumbnail.startsWith("http")
                                                                ? r.thumbnail
                                                                : `http://127.0.0.1:8000/storage/${r.thumbnail}`
                                                        }
                                                        alt={r.title}
                                                        className="rounded-3"
                                                        style={{ width: 70, height: 55, objectFit: "cover", flexShrink: 0 }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="rounded-3 d-flex align-items-center justify-content-center"
                                                        style={{ width: 70, height: 55, background: "#1a2540", flexShrink: 0, border: "1px solid #1e2d4a" }}
                                                    >
                                                        <i className="bi bi-image" style={{ color: "#8899bb" }} />
                                                    </div>
                                                )}

                                                <div className="flex-grow-1">
                                                    <span
                                                        className="badge mb-1"
                                                        style={{ background: "#1a2540", color: "#8899bb", fontSize: "10px", borderRadius: "6px", border: "1px solid #1e2d4a" }}
                                                    >
                                                        {r.category}
                                                    </span>
                                                    <p className="fw-semibold mb-0 small" style={{ lineHeight: 1.35, color: "#e8eaf0" }}>
                                                        {r.title}
                                                    </p>
                                                    <span style={{ color: "#00d4ff", fontSize: "11px", fontWeight: 600 }}>
                                                        Read more →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                        {idx < related.length - 1 && <hr className="my-3" style={{ borderColor: "#1e2d4a" }} />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}