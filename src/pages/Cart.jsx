    import { useEffect, useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import axios from "axios";
    import "./Cart.css";

    export default function Cart() {
        const [cart, setCart] = useState([]);
        const [coupon, setCoupon] = useState("");
        const [discount, setDiscount] = useState(0);
        const [couponMsg, setCouponMsg] = useState("");
        const [removingId, setRemovingId] = useState(null);

        const navigate = useNavigate();
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        if (!userId) { navigate("/login"); return; }

        const fetchCart = async () => {


            
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/cart/${userId}`);
                setCart(response.data);
            } catch (error) { console.log(error); }
        };

        useEffect(() => { fetchCart(); }, []);

        const updateQty = async (id, qty) => {

            try {

                if (qty < 1) {

                    await removeItem(id);

                    return;

                }

                await axios.put(
                    `http://127.0.0.1:8000/api/cart/${id}`,
                    { qty }
                );

                fetchCart();

                window.dispatchEvent(new Event("cartUpdated"));

            } catch (error) {

                console.log(error);

            }
        };

        const removeItem = async (id) => {

            try {

                await axios.delete(
                    `http://127.0.0.1:8000/api/cart/${id}`
                );

                fetchCart();

                window.dispatchEvent(new Event("cartUpdated"));

            } catch (error) {

                console.log(error);

            }
        };

        const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
        const shipping = subtotal > 499 ? 0 : 49;
        const discountAmt = Math.round(subtotal * discount);
        const total = subtotal + shipping - discountAmt;

        const applyCoupon = () => {
            if (coupon.toUpperCase() === "SHOPZONE20") {
                setDiscount(0.2);
                setCouponMsg("success:🎉 Coupon applied! 20% off");
            } else {
                setDiscount(0);
                setCouponMsg("error:❌ Invalid coupon code");
            }
        };

        const handleOrderNow = () => {
            navigate("/checkout", { state: { cart, subtotal, shipping, discountAmt, total } });
        };

        const [msgType, msgText] = couponMsg ? couponMsg.split(":") : ["", ""];

        return (
            <div className="ct-page">
                <div className="ct-container">

                    {/* Breadcrumb */}
                    <nav className="ct-breadcrumb" aria-label="breadcrumb">
                        <Link to="/" className="ct-bc-link">Home</Link>
                        <span className="ct-bc-sep">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                        <span className="ct-bc-cur">Cart</span>
                    </nav>

                    {/* Page Title */}
                    <div className="ct-header">
                        <span className="ct-label-pill">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Cart
                        </span>
                        <h1 className="ct-title">
                            My Cart
                            <span className="ct-count-badge">{cart.length}</span>
                        </h1>
                    </div>

                    {/* Empty State */}
                    {cart.length === 0 ? (
                        <div className="ct-empty">
                            <div className="ct-empty-icon-wrap">
                                <svg width="52" height="52" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <h4 className="ct-empty-title">Your cart is empty!</h4>
                            <p className="ct-empty-sub">Looks like you haven't added anything yet.</p>
                            <Link to="/products" className="ct-shop-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                Shop Now
                            </Link>
                        </div>
                    ) : (
                        <div className="ct-layout">

                            {/* ── LEFT: Cart Items ── */}
                            <div className="ct-items-col">
                                <div className="ct-card">
                                    <div className="ct-card-head">
                                        <span className="ct-card-title">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            {cart.length} {cart.length === 1 ? "Item" : "Items"} in your cart
                                        </span>
                                        <Link to="/products" className="ct-continue-top">
                                            + Add more items
                                        </Link>
                                    </div>

                                    <div className="ct-items-list">
                                        {cart.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className={`ct-item ${removingId === item.id ? "ct-item--removing" : ""}`}
                                            >
                                                {/* Product Image */}
                                                <div className="ct-item-img-wrap">
                                                    <img
                                                        src={item.product?.image
                                                            ? `http://127.0.0.1:8000/storage/${item.product.image}`
                                                            : "/placeholder.png"}
                                                        alt={item.product.name}
                                                        className="ct-item-img"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="ct-item-info">
                                                    <span className="ct-item-cat">{item.product?.category?.name || "Category"}</span>
                                                    <h6 className="ct-item-name">{item.product.name}</h6>
                                                    <span className="ct-item-price">₹{Number(item.product.price).toLocaleString()}</span>
                                                </div>

                                                {/* Right Controls */}
                                                <div className="ct-item-controls">
                                                    {/* Qty */}
                                                    <div className="ct-qty">
                                                        <button className="ct-qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
                                                        </button>
                                                        <span className="ct-qty-val">{item.qty}</span>
                                                        <button className="ct-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
                                                        </button>
                                                    </div>
                                                    {/* Line total */}
                                                    <span className="ct-item-total">₹{(item.product.price * item.qty).toLocaleString()}</span>
                                                    {/* Remove */}
                                                    <button className="ct-remove-btn" onClick={() => removeItem(item.id)} title="Remove item">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT: Order Summary ── */}
                            <div className="ct-summary-col">
                                <div className="ct-summary-card">
                                    <h5 className="ct-summary-title">Order Summary</h5>

                                    {/* Coupon */}
                                    <div className="ct-coupon-wrap">
                                        <label className="ct-coupon-label">Coupon Code</label>
                                        <div className="ct-coupon-row">
                                            <input
                                                type="text"
                                                className="ct-coupon-input"
                                                placeholder="e.g. SHOPZONE20"
                                                value={coupon}
                                                onChange={(e) => setCoupon(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                                            />
                                            <button className="ct-coupon-btn" onClick={applyCoupon}>Apply</button>
                                        </div>
                                        {couponMsg && (
                                            <p className={`ct-coupon-msg ct-coupon-msg--${msgType}`}>{msgText}</p>
                                        )}
                                    </div>

                                    {/* Shipping notice */}
                                    {shipping === 0 ? (
                                        <div className="ct-ship-notice ct-ship-notice--free">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            You qualify for <strong>FREE shipping!</strong>
                                        </div>
                                    ) : (
                                        <div className="ct-ship-notice ct-ship-notice--warn">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            Add <strong>₹{500 - subtotal}</strong> more for FREE shipping
                                        </div>
                                    )}

                                    {/* Price breakdown */}
                                    <div className="ct-price-rows">
                                        <div className="ct-price-row">
                                            <span className="ct-pr-label">Subtotal ({cart.length} items)</span>
                                            <span className="ct-pr-val">₹{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="ct-price-row">
                                            <span className="ct-pr-label">Shipping</span>
                                            <span className={shipping === 0 ? "ct-pr-val ct-pr-free" : "ct-pr-val"}>
                                                {shipping === 0 ? "FREE" : `₹${shipping}`}
                                            </span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="ct-price-row">
                                                <span className="ct-pr-label">Coupon Discount</span>
                                                <span className="ct-pr-val ct-pr-discount">−₹{discountAmt.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ct-total-row">
                                        <span className="ct-total-label">Total</span>
                                        <span className="ct-total-val">₹{total.toLocaleString()}</span>
                                    </div>

                                    {/* Savings badge */}
                                    {(discount > 0 || shipping === 0) && (
                                        <div className="ct-savings-badge">
                                            🎉 You're saving ₹{(discountAmt + (shipping === 0 ? 49 : 0)).toLocaleString()} on this order!
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <button className="ct-order-btn" onClick={handleOrderNow}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        Proceed to Checkout
                                    </button>

                                    <Link to="/products" className="ct-continue-btn">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        Continue Shopping
                                    </Link>


                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        );
    }