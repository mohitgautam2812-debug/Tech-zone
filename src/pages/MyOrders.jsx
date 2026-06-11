import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MyOrder.css";

const statusConfig = {
    pending: { color: "#F59E0B", bg: "#FEF3C7", border: "#FDE68A", icon: "bi-arrow-clockwise", label: "Order Pending", step: 0 },
    confirmed: { color: "#2874F0", bg: "#EBF2FF", border: "#bfdbfe", icon: "bi-patch-check", label: "Order Confirmed", step: 1 },
    packed: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: "bi-box-seam", label: "Order Packed", step: 2 },
    shipped: { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc", icon: "bi-truck", label: "Shipped", step: 3 },
    out_for_delivery: { color: "#00897B", bg: "#e0f2f1", border: "#b2dfdb", icon: "bi-bicycle", label: "Out for Delivery", step: 4 },
    delivered: { color: "#00897B", bg: "#e0f2f1", border: "#b2dfdb", icon: "bi-check-circle-fill", label: "Delivered", step: 5 },
    cancelled: { color: "#E53935", bg: "#fff1f0", border: "#fecdd3", icon: "bi-x-circle-fill", label: "Cancelled", step: -1 },
    returned: { color: "#6B7280", bg: "#F8FAFC", border: "#E5E7EB", icon: "bi-arrow-return-left", label: "Returned", step: -1 },
    refunded: { color: "#00897B", bg: "#e0f2f1", border: "#b2dfdb", icon: "bi-cash", label: "Refunded", step: -1 },
};

const tabs = ["All", "pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned", "refunded"];

const tabLabels = {
    All: "All Orders", pending: "Pending", confirmed: "Confirmed", packed: "Packed",
    shipped: "Shipped", out_for_delivery: "Out for Delivery", delivered: "Delivered",
    cancelled: "Cancelled", returned: "Returned", refunded: "Refunded",
};

const tabIcons = {
    All: "bi-grid-fill", pending: "bi-arrow-clockwise", confirmed: "bi-patch-check",
    packed: "bi-box-seam", shipped: "bi-truck", out_for_delivery: "bi-bicycle",
    delivered: "bi-check-circle-fill", cancelled: "bi-x-circle-fill",
    returned: "bi-arrow-return-left", refunded: "bi-cash",
};

function OrderProgress({ status }) {
    const steps = [
        { key: "confirmed", label: "Confirmed", icon: "bi-patch-check-fill" },
        { key: "packed", label: "Packed", icon: "bi-box-seam-fill" },
        { key: "shipped", label: "Shipped", icon: "bi-truck" },
        { key: "out_for_delivery", label: "Out for Delivery", icon: "bi-bicycle" },
        { key: "delivered", label: "Delivered", icon: "bi-house-check-fill" },
    ];
    const currentStep = statusConfig[status]?.step ?? 0;
    if (status === "cancelled" || status === "returned" || status === "refunded") return null;

    return (
        <div className="mo-progress-wrap">
            <div className="d-flex align-items-center position-relative">
                <div className="mo-progress-track" />
                <div className="mo-progress-fill" style={{ width: `${Math.max(0, (currentStep - 1) / 4) * 80}%` }} />
                {steps.map((step, i) => {
                    const done = currentStep > i + 1;
                    const active = currentStep === i + 1;
                    return (
                        <div key={step.key} className="d-flex flex-column align-items-center flex-grow-1 position-relative" style={{ zIndex: 2 }}>
                            <div className={`mo-step-dot ${done || active ? "done" : "inactive"}`}
                                style={{ width: 36, height: 36, boxShadow: active ? "0 0 0 4px rgba(40,116,240,0.15)" : "none" }}>
                                <i className={`bi ${step.icon}`} style={{ color: done || active ? "#fff" : "#9CA3AF", fontSize: 14 }} />
                            </div>
                            <div className="mo-step-label" style={{ color: done || active ? "#2874F0" : "#9CA3AF" }}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [returnReason, setReturnReason] = useState("");
    const [returnDescription, setReturnDescription] = useState("");
    const [returnImage, setReturnImage] = useState(null);

    const userId = JSON.parse(localStorage.getItem("user"))?.id;

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/my-orders/${userId}`);
            setOrders(res.data);
        } catch (e) { console.log(e); }
        finally { setLoading(false); }
    };

    const submitReturnRequest = async () => {
        try {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("order_id", selectedOrder.id);
            formData.append("reason", returnReason);
            formData.append("description", returnDescription);
            if (returnImage) { formData.append("image", returnImage); }
            const response = await axios.post("http://127.0.0.1:8000/api/return-request", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Return request submitted successfully");
            setShowReturnModal(false);
            setReturnReason("");
            setReturnDescription("");
            setReturnImage(null);
            fetchOrders();
        } catch (error) {
            console.log(error.response);
            alert(error.response?.data?.message || "Failed to submit return request");
        }
    };

    const cancelOrder = async (id) => {
        try {
            const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
            if (!confirmCancel) return;
            await axios.put(`http://127.0.0.1:8000/api/cancel-order/${id}`);
            alert("Order cancelled successfully");
            fetchOrders();
        } catch (error) {
            console.log(error.response);
            alert(error.response?.data?.message || "Failed to cancel order");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    };

    let filtered = activeTab === "All" ? orders : orders.filter(o => o.status === activeTab);
    if (searchQuery) filtered = filtered.filter(o =>
        String(o.id).includes(searchQuery) ||
        o.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const countByTab = (tab) => tab === "All" ? orders.length : orders.filter(o => o.status === tab).length;

    if (loading) return (
        <div className="mo-loading">
            <div className="mo-spinner" />
            <p className="mo-loading-text">Loading your orders...</p>
        </div>
    );

    return (
        <div className="mo-page">

            {/* ── Top Bar ── */}
            <div className="mo-topbar">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="mo-topbar-icon">
                                <i className="bi bi-box-seam-fill text-white fs-4" />
                            </div>
                            <div>
                                <p className="mo-topbar-title">My Orders</p>
                                <p className="mo-topbar-sub">{orders.length} total orders</p>
                            </div>
                        </div>
                        <div className="mo-search-wrap">
                            <span className="mo-search-icon"><i className="bi bi-search" /></span>
                            <input
                                type="text"
                                className="mo-search-input"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                <div className="row g-4">

                    {/* ── Sidebar ── */}
                    <div className="col-lg-3">
                        <div className="mo-sidebar">
                            <div className="mo-sidebar-title">
                                <i className="bi bi-funnel-fill me-2" style={{ color: "#2874F0" }} />
                                Filter Orders
                            </div>
                            {tabs.map(tab => {
                                const active = activeTab === tab;
                                const count = countByTab(tab);
                                const sc = statusConfig[tab];
                                return (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`mo-filter-btn ${active ? "active" : ""}`}>
                                        <span className="d-flex align-items-center gap-2">
                                            <i className={`bi ${tabIcons[tab]}`}
                                                style={{ color: active ? "#2874F0" : (sc?.color || "#9CA3AF"), fontSize: 14 }} />
                                            {tabLabels[tab]}
                                        </span>
                                        {count > 0 && <span className="mo-filter-count">{count}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Orders List ── */}
                    <div className="col-lg-9">
                        {filtered.length === 0 ? (
                            <div className="mo-empty">
                                <div className="mo-empty-icon-wrap">
                                    <i className="bi bi-bag-x-fill" style={{ fontSize: 40, color: "#2874F0" }} />
                                </div>
                                <h5 className="fw-bold mb-2" style={{ color: "#111827" }}>No orders found</h5>
                                <p style={{ color: "#6B7280", fontSize: 14, maxWidth: 320, margin: "0 auto 20px" }}>
                                    {searchQuery ? `No orders matching "${searchQuery}"` : "You haven't placed any orders in this category yet."}
                                </p>
                                <Link to="/products" className="mo-btn-primary">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {filtered.map((order) => {
                                    const sc = statusConfig[order.status] || statusConfig.pending;
                                    const isOpen = expanded === order.id;
                                    const isDelivered = order.status === "delivered";
                                    const isCancelled = order.status === "cancelled";

                                    return (
                                        <div key={order.id} className={`mo-order-card ${isOpen ? "open" : ""}`}>

                                            {/* ── Card Header ── */}
                                            <div className="mo-order-card-header"
                                                onClick={() => setExpanded(isOpen ? null : order.id)}>

                                                <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">

                                                    {/* Left: image + info */}
                                                    <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
                                                        <div className="mo-product-img-box">
                                                            {order.product?.image ? (
                                                                <img
                                                                    src={`http://127.0.0.1:8000/storage/${order.product.image}`}
                                                                    alt={order.product?.name}
                                                                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }}
                                                                />
                                                            ) : (
                                                                <i className="bi bi-box-seam" style={{ fontSize: 26, color: "#2874F0" }} />
                                                            )}
                                                        </div>

                                                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                                                <span className="mo-order-id-pill">Order #{order.id}</span>
                                                                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                                                                    <i className="bi bi-calendar3 me-1" />{formatDate(order.created_at)}
                                                                </span>
                                                                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                                                                    <i className="bi bi-clock me-1" />{formatTime(order.created_at)}
                                                                </span>
                                                            </div>
                                                            <h6 className="fw-bold mb-1" style={{
                                                                color: "#111827", fontSize: 14, lineHeight: 1.35,
                                                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                                            }}>
                                                                {order.product?.name || "Product"}
                                                            </h6>
                                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                <span style={{ fontSize: 12, color: "#6B7280" }}>
                                                                    <i className="bi bi-hash me-1" />Qty:{" "}
                                                                    <strong style={{ color: "#111827" }}>{order.quantity}</strong>
                                                                </span>
                                                                {order.product?.category?.name && (
                                                                    <span style={{
                                                                        fontSize: 10, background: sc.bg, color: sc.color,
                                                                        padding: "2px 8px", borderRadius: 6, fontWeight: 600,
                                                                        border: `1px solid ${sc.border}`,
                                                                    }}>
                                                                        {order.product.category.name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right: status + price + chevron — all inline */}
                                                    <div className="mo-order-card-right"
                                                        onClick={e => e.stopPropagation()}>
                                                        <div className="mo-status-badge"
                                                            style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                                                            <i className={`bi ${sc.icon}`} style={{ fontSize: 12 }} />
                                                            {sc.label}
                                                        </div>

                                                        <div>
                                                            <div className="mo-price-box">
                                                                ₹{Number(order.total_price).toLocaleString()}
                                                            </div>
                                                        
                                                        </div>

                                                        <div className={`mo-chevron-btn ${isOpen ? "open" : ""}`}
                                                            onClick={() => setExpanded(isOpen ? null : order.id)}>
                                                            <i className={`bi bi-chevron-${isOpen ? "up" : "down"}`}
                                                                style={{ color: isOpen ? "#fff" : "#2874F0", fontSize: 12 }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Hint row */}
                                                {!isOpen && (
                                                    <div className="mo-hint-row">
                                                        {isDelivered && (
                                                            <button
                                                                onClick={() => { setSelectedOrder(order); setShowReturnModal(true); }}
                                                                className="mo-btn-success"
                                                                style={{ fontSize: 12, padding: "5px 12px" }}
                                                            >
                                                                <i className="bi bi-arrow-counterclockwise" />
                                                                Return / Refund
                                                            </button>
                                                        )}
                                                        {isCancelled && (
                                                            <span style={{ fontSize: 12, color: "#E53935", fontWeight: 600 }}>
                                                                <i className="bi bi-x-circle-fill me-1" />Order was cancelled
                                                            </span>
                                                        )}
                                                        {!isDelivered && !isCancelled && (
                                                            <span style={{ fontSize: 12, color: "#2874F0", fontWeight: 600 }}>
                                                                <i className="bi bi-truck me-1" />
                                                                Expected delivery in 3–5 days ·{" "}
                                                                <span style={{ color: "#9CA3AF", fontWeight: 400 }}>Tap to view details</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── Expanded Content ── */}
                                            {isOpen && (
                                                <>
                                                    <OrderProgress status={order.status} />

                                                    <div className="mo-detail-section">
                                                        <div className="row g-3">

                                                            {/* Product Details */}
                                                            <div className="col-md-6">
                                                                <div className="mo-detail-panel">
                                                                    <div className="mo-detail-panel-label">
                                                                        <i className="bi bi-box-seam me-1" />Product Details
                                                                    </div>
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <div className="mo-detail-product-img">
                                                                            {order.product?.image ? (
                                                                                <img
                                                                                    src={`http://127.0.0.1:8000/storage/${order.product.image}`}
                                                                                    alt=""
                                                                                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
                                                                                />
                                                                            ) : (
                                                                                <i className="bi bi-box" style={{ color: "#2874F0", fontSize: 22 }} />
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <div className="fw-bold" style={{ fontSize: 13, color: "#111827" }}>
                                                                                {order.product?.name}
                                                                            </div>
                                                                            <div style={{ fontSize: 12, color: "#6B7280" }}>Qty: {order.quantity}</div>
                                                                            <div style={{ fontSize: 15, fontWeight: 800, color: "#2874F0" }}>
                                                                                ₹{Number(order.total_price).toLocaleString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Order Info */}
                                                            <div className="col-md-6">
                                                                <div className="mo-detail-panel">
                                                                    <div className="mo-detail-panel-label">
                                                                        <i className="bi bi-info-circle me-1" />Order Info
                                                                    </div>
                                                                    {[
                                                                        { label: "Order ID", value: `#${order.id}`, icon: "bi-hash" },
                                                                        { label: "Placed On", value: formatDate(order.created_at), icon: "bi-calendar3" },
                                                                        { label: "Payment", value: "Paid · Online", icon: "bi-credit-card" },
                                                                        { label: "Status", value: sc.label, icon: sc.icon, color: sc.color },
                                                                    ].map(item => (
                                                                        <div key={item.label} className="mo-info-row">
                                                                            <i className={`bi ${item.icon}`}
                                                                                style={{ color: item.color || "#9CA3AF", fontSize: 12, width: 14 }} />
                                                                            <span className="mo-info-label">{item.label}</span>
                                                                            <span className="mo-info-value" style={{ color: item.color || "#111827" }}>
                                                                                {item.value}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="d-flex gap-2 flex-wrap mt-4">
                                                            <Link to={`/track-order/${order.id}`} className="mo-btn-primary">
                                                                <i className="bi bi-geo-alt-fill" />Track Order
                                                            </Link>

                                                            <a href={`http://127.0.0.1:8000/invoice/${order.id}`}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="mo-btn-invoice">
                                                                <i className="bi bi-file-earmark-pdf-fill" />Invoice
                                                            </a>

                                                            {isDelivered && (
                                                                <button className="mo-btn-warning">
                                                                    <i className="bi bi-star-fill" />Rate & Review
                                                                </button>
                                                            )}

                                                            {isDelivered && (
                                                                <button
                                                                    onClick={() => { setSelectedOrder(order); setShowReturnModal(true); }}
                                                                    className="mo-btn-success"
                                                                >
                                                                    <i className="bi bi-arrow-counterclockwise" />
                                                                    Return / Refund
                                                                </button>
                                                            )}

                                                            {order.status === "pending" && (
                                                                <button onClick={() => cancelOrder(order.id)} className="mo-btn-danger">
                                                                    <i className="bi bi-x-circle" />Cancel Order
                                                                </button>
                                                            )}

                                                            <Link to={`/products/${order.product?.id}`} className="mo-btn-ghost">
                                                                <i className="bi bi-arrow-repeat" />Buy Again
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Return Modal ── */}
            {showReturnModal && (
                <div className="mo-modal-overlay">
                    <div className="mo-modal">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mo-modal-title">Return Product</h5>
                            <button className="mo-modal-close" onClick={() => setShowReturnModal(false)}>×</button>
                        </div>

                        <div className="mb-3">
                            <label className="mo-modal-label">Return Reason</label>
                            <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className="mo-modal-input">
                                <option value="">Select Reason</option>
                                <option value="Damaged Product">Damaged Product</option>
                                <option value="Wrong Product">Wrong Product</option>
                                <option value="Product Not Working">Product Not Working</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="mo-modal-label">Description</label>
                            <textarea
                                value={returnDescription}
                                onChange={(e) => setReturnDescription(e.target.value)}
                                className="mo-modal-input"
                                rows="4"
                                placeholder="Describe issue..."
                            />
                        </div>

                        <div className="mb-4">
                            <label className="mo-modal-label">Upload Proof Image</label>
                            <input
                                type="file"
                                onChange={(e) => setReturnImage(e.target.files[0])}
                                className="mo-modal-input"
                            />
                        </div>

                        <button onClick={submitReturnRequest} className="mo-modal-submit">
                            Submit Return Request
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}