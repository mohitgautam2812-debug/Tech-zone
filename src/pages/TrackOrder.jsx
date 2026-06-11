import { useState } from "react";
import { Link } from "react-router-dom";

const mockOrder = {
    id: "ORD-20251215",
    product: "Running Shoes (x2)",
    image: "https://via.placeholder.com/90x80?text=Shoes",
    estimatedDelivery: "10 Jan 2026",
    currentStep: 2,
    steps: [
        { label: "Order Placed", desc: "Your order has been placed successfully", date: "15 Dec 2025, 10:30 AM", done: true },
        { label: "Order Confirmed", desc: "Seller has confirmed your order", date: "15 Dec 2025, 02:00 PM", done: true },
        { label: "Shipped", desc: "Your order is on its way", date: "16 Dec 2025, 09:00 AM", done: true },
        { label: "Out for Delivery", desc: "Delivery partner is near your location", date: "—", done: false },
        { label: "Delivered", desc: "Package delivered to your door", date: "—", done: false },
    ],
};

export default function TrackOrder() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTrack = () => {
        setLoading(true);
        setError("");
        setTimeout(() => {
            setLoading(false);
            if (orderId.trim().toUpperCase() === "ORD-20251215" || orderId.trim() === "") {
                setOrder(mockOrder);
            } else {
                setError("No order found with this ID. Please check and try again.");
                setOrder(null);
            }
        }, 800);
    };

    return (
        <div className="py-4" style={{ background: "#f8f9fa", minHeight: "80vh" }}>
            <div className="container" style={{ maxWidth: "760px" }}>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" style={{ color: "#e94560", textDecoration: "none" }}>Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/my-orders" style={{ color: "#e94560", textDecoration: "none" }}>My Orders</Link></li>
                        <li className="breadcrumb-item active">Track Order</li>
                    </ol>
                </nav>

                <h3 className="fw-bold mb-4">
                    <i className="bi bi-geo-alt me-2" style={{ color: "#e94560" }} />
                    Track Your Order
                </h3>

                {/* Search Box */}
                <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                    <p className="text-muted small mb-3">Enter your order ID to track your shipment (try: ORD-20251215)</p>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Order ID (e.g. ORD-20251215)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                            style={{ borderRadius: "10px" }}
                        />
                        <button
                            className="btn px-4 fw-bold"
                            onClick={handleTrack}
                            style={{ background: "#e94560", color: "#fff", borderRadius: "10px", whiteSpace: "nowrap" }}
                        >
                            {loading ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-search me-1" />Track</>}
                        </button>
                    </div>
                    {error && <p className="text-danger small mt-2 mb-0"><i className="bi bi-exclamation-circle me-1" />{error}</p>}
                </div>

                {/* Tracking Result */}
                {order && (
                    <>
                        {/* Order Info */}
                        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                <img src={order.image} alt="" className="rounded-3" style={{ width: 80, height: 70, objectFit: "cover" }} />
                                <div className="flex-grow-1">
                                    <div className="fw-bold">{order.product}</div>
                                    <div className="text-muted small">Order ID: {order.id}</div>
                                    <div className="text-muted small">
                                        <i className="bi bi-calendar3 me-1" />
                                        Est. Delivery: <strong style={{ color: "#28a745" }}>{order.estimatedDelivery}</strong>
                                    </div>
                                </div>
                                <span
                                    className="badge px-3 py-2"
                                    style={{ background: "#e8f0fe", color: "#0d6efd", borderRadius: "10px", fontWeight: "600" }}
                                >
                                    <i className="bi bi-truck me-1" />Shipped
                                </span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-4 shadow-sm p-4">
                            <h6 className="fw-bold mb-4">Shipment Timeline</h6>
                            <div className="position-relative">
                                {/* Vertical line */}
                                <div
                                    className="position-absolute"
                                    style={{ left: "19px", top: "22px", bottom: "22px", width: "2px", background: "#e0e0e0" }}
                                />
                                {order.steps.map((step, i) => (
                                    <div key={i} className="d-flex gap-3 mb-4 position-relative">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                            style={{
                                                width: 38,
                                                height: 38,
                                                background: step.done ? "#e94560" : "#f0f0f0",
                                                border: step.done ? "3px solid #e94560" : "3px solid #ddd",
                                                zIndex: 1,
                                                transition: "all 0.3s",
                                            }}
                                        >
                                            {step.done ? (
                                                <i className="bi bi-check2 text-white fw-bold" />
                                            ) : (
                                                <div style={{ width: 10, height: 10, background: "#ccc", borderRadius: "50%" }} />
                                            )}
                                        </div>
                                        <div className="pt-1">
                                            <div className="fw-bold" style={{ color: step.done ? "#1a1a2e" : "#aaa" }}>
                                                {step.label}
                                                {i === order.currentStep && (
                                                    <span className="badge ms-2" style={{ background: "#e94560", fontSize: "10px", borderRadius: "6px" }}>
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="small" style={{ color: step.done ? "#555" : "#bbb" }}>{step.desc}</div>
                                            <div className="small" style={{ color: step.done ? "#e94560" : "#ccc" }}>
                                                <i className="bi bi-clock me-1" />{step.date}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 pt-3" style={{ borderTop: "1px solid #f0f0f0" }}>
                                <Link to="/contact" className="btn btn-sm px-3" style={{ background: "#f5f5f5", color: "#555", borderRadius: "8px", border: "none" }}>
                                    <i className="bi bi-headset me-1" />Need Help?
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}