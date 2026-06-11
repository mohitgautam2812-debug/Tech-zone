import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Blog.css";


const CAT_COLORS = {
    Reviews: "#2874F0", Comparisons: "#1a5fd1", Guides: "#00897B",
    Cameras: "#7c3aed", Audio: "#0891b2", Insights: "#FF6D00", News: "#D4537E",
};
const catColor = (c) => CAT_COLORS[c] || "#2874F0";

const fmtDate = (s) =>
    s ? new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

export default function BlogIndex() {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activecat, setActiveCat] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const BASE = "http://127.0.0.1:8000/api";

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE}/blogs/categories`);
            setCategories(res.data.data || []);
        } catch (err) { console.log(err); }
    };

    const fetchBlogs = async (page = 1) => {
        setLoading(true);
        try {
            const params = { per_page: 6, page };
            if (activecat) params.category = activecat;
            if (search) params.search = search;
            const res = await axios.get(`${BASE}/blogs`, { params });
            setBlogs(res.data.data || []);
            setCurrentPage(res.data.meta?.current_page || 1);
            setLastPage(res.data.meta?.last_page || 1);
            setTotal(res.data.meta?.total || 0);
        } catch (err) { console.log(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { fetchBlogs(1); }, [activecat, search]);

    const SkeletonCard = () => (
        <div className="col-lg-4 col-md-6">
            <div className="rounded-4 overflow-hidden" style={{ background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                <div style={{ width: "100%", aspectRatio: "16/9", background: "#F1F3F5" }} />
                <div className="p-3">
                    <div style={{ width: "40%", height: 10, background: "#F1F3F5", borderRadius: 6, marginBottom: 10 }} />
                    <div style={{ width: "90%", height: 14, background: "#F1F3F5", borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ width: "65%", height: 12, background: "#F1F3F5", borderRadius: 6 }} />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ background: "#F5F7FA", minHeight: "80vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="py-5">
            <div className="container" style={{ maxWidth: 1400 }}>

                {/* Page Header */}
                <div className="mb-4">
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "#e8f0fe", color: "#2874F0", fontSize: 11, fontWeight: 700,
                        padding: "4px 14px", borderRadius: 999, letterSpacing: ".08em",
                        textTransform: "uppercase", marginBottom: 10,
                    }}>
                        <i className="bi bi-journal-richtext" /> Blog
                    </div>
                    <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#111827", margin: 0, letterSpacing: -0.5 }}>
                        Articles & Insights{" "}
                        <span style={{
                            display: "inline-block", background: "#e8f0fe", color: "#2874F0",
                            fontSize: 14, fontWeight: 700, padding: "2px 14px", borderRadius: 999, marginLeft: 8,
                        }}>{total}</span>
                    </h2>
                </div>

                {/* Toolbar */}
                <div style={{
                    background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
                    padding: "14px 18px", marginBottom: 28, display: "flex", flexWrap: "wrap",
                    alignItems: "center", gap: 10,
                }}>
                    {/* Search */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        background: "#F8FAFC", border: "1px solid #E5E7EB",
                        borderRadius: 999, overflow: "hidden", maxWidth: 260,
                    }}>
                        <span style={{ padding: "0 12px", color: "#2874F0", fontSize: 14 }}>
                            <i className="bi bi-search" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search articles…"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            style={{
                                border: "none", background: "transparent", padding: "8px 12px 8px 0",
                                fontSize: 13, color: "#111827", outline: "none",
                                fontFamily: "inherit", width: 200,
                            }}
                        />
                    </div>

                    {/* Category Pills */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
                        {["", ...categories].map((c) => (
                            <button
                                key={c}
                                onClick={() => { setActiveCat(c); setCurrentPage(1); }}
                                style={{
                                    border: `1.5px solid ${activecat === c ? "#2874F0" : "#E5E7EB"}`,
                                    background: activecat === c ? "#2874F0" : "transparent",
                                    color: activecat === c ? "#fff" : "#6B7280",
                                    fontSize: 12, fontWeight: 700, padding: "5px 14px",
                                    borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
                                    transition: "all .2s",
                                }}
                            >
                                {c || "All"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="row g-4">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
                ) : blogs.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "60px 24px", background: "#fff",
                        border: "1px solid #E5E7EB", borderRadius: 16,
                    }}>
                        <div style={{ fontSize: 48, color: "#E5E7EB", marginBottom: 16 }}>
                            <i className="bi bi-journal-x" />
                        </div>
                        <h5 style={{ fontWeight: 800, color: "#111827", marginBottom: 6 }}>No articles found!</h5>
                        <p style={{ color: "#6B7280", fontSize: 13.5 }}>Try a different category or search term.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {blogs.map((b) => (
                            <div className="col-lg-4 col-md-6" key={b.id}>
                                <Link to={`/blog/${b.slug}`} style={{ textDecoration: "none" }}>
                                    <div
                                        className="h-100 d-flex flex-column"
                                        style={{
                                            background: "#fff", border: "1px solid #E5E7EB",
                                            borderRadius: 16, overflow: "hidden", cursor: "pointer",
                                            transition: "transform .2s, box-shadow .2s, border-color .2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.10)";
                                            e.currentTarget.style.borderColor = "#D1D5DB";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "";
                                            e.currentTarget.style.boxShadow = "";
                                            e.currentTarget.style.borderColor = "#E5E7EB";
                                        }}
                                    >
                                        {/* Thumbnail */}
                                        {b.thumbnail ? (
                                            <img
                                                src={b.thumbnail.startsWith("http") ? b.thumbnail : `http://127.0.0.1:8000/storage/${b.thumbnail}`}
                                                alt={b.title}
                                                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: "100%", aspectRatio: "16/9", background: "#F8FAFC",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: "#E5E7EB", fontSize: 36,
                                            }}>
                                                <i className="bi bi-image" />
                                            </div>
                                        )}

                                        {/* Body */}
                                        <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1, gap: 6 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                {b.category && (
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 700, padding: "3px 10px",
                                                        borderRadius: 6, background: catColor(b.category), color: "#fff",
                                                    }}>{b.category}</span>
                                                )}
                                                <span style={{ fontSize: 11.5, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 4 }}>
                                                    <i className="bi bi-calendar3" style={{ fontSize: 11 }} />
                                                    {fmtDate(b.published_at || b.created_at)}
                                                </span>
                                            </div>

                                            <h6 style={{ fontSize: 14.5, fontWeight: 800, color: "#111827", lineHeight: 1.4, margin: 0 }}>
                                                {b.title}
                                            </h6>

                                            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, flex: 1, margin: 0 }}>
                                                {b.excerpt}
                                            </p>

                                            <div style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                marginTop: 10, paddingTop: 12, borderTop: "1px solid #F3F4F6",
                                            }}>
                                                <span style={{ fontSize: 12, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 5 }}>
                                                    <i className="bi bi-person" style={{ fontSize: 13 }} /> {b.author}
                                                </span>
                                                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#2874F0", display: "flex", alignItems: "center", gap: 4 }}>
                                                    Read more <i className="bi bi-arrow-right" style={{ fontSize: 12 }} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {lastPage > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => { setCurrentPage(p => p - 1); fetchBlogs(currentPage - 1); }}
                            style={{
                                border: "1.5px solid #E5E7EB", background: "#fff", color: "#6B7280",
                                fontSize: 13, fontWeight: 700, padding: "7px 14px", borderRadius: 999,
                                cursor: "pointer", fontFamily: "inherit", opacity: currentPage === 1 ? .4 : 1,
                            }}
                        >‹</button>

                        {[...Array(lastPage)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setCurrentPage(i + 1); fetchBlogs(i + 1); }}
                                style={{
                                    border: `1.5px solid ${currentPage === i + 1 ? "#2874F0" : "#E5E7EB"}`,
                                    background: currentPage === i + 1 ? "#2874F0" : "#fff",
                                    color: currentPage === i + 1 ? "#fff" : "#6B7280",
                                    fontSize: 13, fontWeight: 700, padding: "7px 14px", minWidth: 36,
                                    borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
                                }}
                            >{i + 1}</button>
                        ))}

                        <button
                            disabled={currentPage === lastPage}
                            onClick={() => { setCurrentPage(p => p + 1); fetchBlogs(currentPage + 1); }}
                            style={{
                                border: "1.5px solid #E5E7EB", background: "#fff", color: "#6B7280",
                                fontSize: 13, fontWeight: 700, padding: "7px 14px", borderRadius: 999,
                                cursor: "pointer", fontFamily: "inherit", opacity: currentPage === lastPage ? .4 : 1,
                            }}
                        >›</button>
                    </div>
                )}

            </div>
        </div>
    );
}