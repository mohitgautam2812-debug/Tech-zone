    import { useState, useEffect } from "react";
    import { Link } from "react-router-dom";
    import axios from "axios";
    import "./Wishlist.css";

    export default function Wishlist() {
        const [wishlist, setWishlist] = useState([]);
        const [cartAdded, setCartAdded] = useState([]);
        const [removing, setRemoving] = useState([]);

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        useEffect(() => { fetchWishlist(); }, []);

        const fetchWishlist = async () => {


            
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/wishlist/${userId}`);
                setWishlist(res.data);
            } catch (error) { console.log(error); }
        };

        const removeFromWishlist = async (id) => {

            setRemoving((prev) => [...prev, id]);

            setTimeout(async () => {

                try {

                    await axios.delete(
                        `http://127.0.0.1:8000/api/wishlist/${id}`
                    );

                    setWishlist((prev) =>
                        prev.filter((item) => item.id !== id)
                    );

                    setRemoving((prev) =>
                        prev.filter((i) => i !== id)
                    );

                    window.dispatchEvent(
                        new Event("wishlistUpdated")
                    );

                } catch (error) {

                    console.log(error);

                }

            }, 320);
        };
        const addToCart = async (item) => {

            try {

                await axios.post(
                    "http://127.0.0.1:8000/api/cart",
                    {
                        user_id: userId,
                        product_id: item.product?.id,
                        quantity: 1
                    }
                );

                window.dispatchEvent(
                    new Event("cartUpdated")
                );

                setCartAdded((prev) => [
                    ...prev,
                    item.id
                ]);

                setTimeout(() => {

                    setCartAdded((prev) =>
                        prev.filter((i) => i !== item.id)
                    );

                }, 2000);

            } catch (error) {

                console.log(error);

            }
        };

        return (
            <div className="wl-page">
                <div className="wl-container">

                    {/* Breadcrumb */}
                    <nav className="wl-breadcrumb" aria-label="breadcrumb">
                        <Link to="/" className="wl-bc-link">Home</Link>
                        <span className="wl-bc-sep">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                        <span className="wl-bc-cur">Wishlist</span>
                    </nav>

                    {/* Header */}
                    <div className="wl-header">
                        <div className="wl-header-left">
                            <span className="wl-label-pill">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                Wishlist
                            </span>
                            <h1 className="wl-title">
                                My Wishlist
                                <span className="wl-count-badge">{wishlist.length}</span>
                            </h1>
                        </div>
                        {wishlist.length > 0 && (
                            <button className="wl-clear-btn" onClick={() => setWishlist([])}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Empty State */}
                    {wishlist.length === 0 ? (
                        <div className="wl-empty">
                            <div className="wl-empty-icon-wrap">
                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#CBD5E1" strokeWidth="1.5" fill="none" /></svg>
                            </div>
                            <h4 className="wl-empty-title">Your wishlist is empty!</h4>
                            <p className="wl-empty-sub">Save the products you love and buy them when you're ready.</p>
                            <Link to="/products" className="wl-explore-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                Explore Products
                            </Link>
                        </div>
                    ) : (
                        <div className="wl-grid">
                            {wishlist.map((item) => {
                                const price = Number(item.product?.price) || 0;
                                const originalPrice = Number(item.product?.original_price) || price + 500;
                                const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
                                const added = cartAdded.includes(item.id);
                                const isRemoving = removing.includes(item.id);

                                return (
                                    <div
                                        className={`wl-card ${isRemoving ? "wl-card--removing" : ""}`}
                                        key={item.id}
                                    >
                                        {/* Image */}
                                        <div className="wl-card-img-wrap">
                                            <img
                                                src={`http://127.0.0.1:8000/storage/${item.product?.image}`}
                                                alt={item.product?.name}
                                                className="wl-card-img"
                                            />
                                            <span className="wl-discount-badge">-{discount}%</span>
                                            <button
                                                className="wl-remove-btn"
                                                onClick={() => removeFromWishlist(item.id)}
                                                title="Remove from wishlist"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                            </button>
                                            <div className="wl-img-overlay" />
                                        </div>

                                        {/* Body */}
                                        <div className="wl-card-body">
                                            <span className="wl-category-tag">
                                                {item.product?.category?.name || "Category"}
                                            </span>
                                            <h6 className="wl-product-name">{item.product?.name}</h6>
                                            <div className="wl-price-row">
                                                <span className="wl-price">₹{price.toLocaleString()}</span>
                                                <span className="wl-orig-price">₹{originalPrice.toLocaleString()}</span>
                                                <span className="wl-save-tag">Save ₹{(originalPrice - price).toLocaleString()}</span>
                                            </div>
                                            <div className="wl-actions">
                                                <button
                                                    className={`wl-cart-btn ${added ? "wl-cart-btn--added" : ""}`}
                                                    onClick={() => addToCart(item)}
                                                >
                                                    {added ? (
                                                        <>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                            Added!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                            Add to Cart
                                                        </>
                                                    )}
                                                </button>
                                                <Link to={`/products/${item.product?.id}`} className="wl-view-btn">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg>
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }