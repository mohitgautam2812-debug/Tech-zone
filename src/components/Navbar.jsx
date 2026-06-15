import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const CATEGORIES = [
    { label: "Phones", icon: "bi bi-phone", slug: "Phones" },
    { label: "laptop", icon: "bi bi-laptop", slug: "laptop" },
    { label: "TVs", icon: "bi bi-tv", slug: "TV" },
    { label: "Gaming", icon: "bi bi-controller", slug: "gaming" },
    { label: "Cameras", icon: "bi bi-camera", slug: "cameras" },
    { label: "Smart Watches", icon: "bi bi-watch", slug: "smart-watches" },
    { label: "Audio", icon: "bi bi-headphones", slug: "audio" },
    { label: "Smart Home", icon: "bi bi-house-heart", slug: "smart-home" },
];

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/products" },
    { label: "Categories", to: "/categories" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

const Navbar = () => {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [brands, setBrands] = useState([]);
    const [storages, setStorages] = useState([]);
    const [colors, setColors] = useState([]);
    const [displaySizes, setDisplaySizes] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [maxPrice, setMaxPrice] = useState(0);
    const [priceLimit, setPriceLimit] = useState(0);
    const location = useLocation();
    const dropRef = useRef(null);
    const BASE = "https://tech-zone-backend-production.up.railway.app";

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {

            setIsLoggedIn(true);

            const user = JSON.parse(localStorage.getItem("user") || "{}");

            setUserName(user?.name || "User");

            fetchCartCount();

            fetchWishlistCount();
        }

        const updateCart = () => {

            fetchCartCount();

        };

        window.addEventListener("cartUpdated", updateCart);

        const updateWishlist = () => {

            fetchWishlistCount();

        };

        window.addEventListener("wishlistUpdated", updateWishlist);
        return () => {

            window.removeEventListener("cartUpdated", updateCart);

            window.removeEventListener("wishlistUpdated", updateWishlist);

        };

    }, []);


    const fetchCartCount = async () => {

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const res = await axios.get(`${BASE}/api/cart/${user.id}`);

            setCartCount(res.data.length);

        } catch (err) {

            console.log(err);

        }
    };

    const fetchWishlistCount = async () => {

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const res = await axios.get(`${BASE}/api/wishlist/${user.id}`);

            setWishlistCount(res.data.length);

        } catch (err) {

            console.log(err);

        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setCartCount(0);
        setWishlistCount(0);
        navigate("/");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");


    useEffect(() => {
        const category = searchParams.get("category");
        const params = {};
        if (category) params.category = category;


        if (category) setActiveCategory(category);

        axios.get(`${BASE}/api/products`, { params })
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
                setProducts(data);

                setCategories(["All", ...new Set(data.map((p) => p.category?.name).filter(Boolean))]);
                setBrands([...new Set(data.map((p) => p.brand).filter(Boolean))]);
                setStorages([...new Set(data.map((p) => p.storage).filter(Boolean))]);
                setColors([...new Set(data.map((p) => p.color).filter(Boolean))]);
                setDisplaySizes([...new Set(data.map((p) => p.display_size).filter(Boolean))]);
                setConditions([...new Set(data.map((p) => p.condition).filter(Boolean))]);
                const top = Math.max(...data.map((p) => Number(p.price) || 0), 0);
                setMaxPrice(top);
                setPriceLimit(top);
            })
            .catch(console.error);
    }, [searchParams]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Top Bar */}
            <div className="tz-topbar">
                <div className="tz-topbar-inner">
                    <span> Free delivery on orders above ₹999</span>
                    <ul className="tz-topbar-links">
                        <li><Link to="/track-order">Track Order</Link></li>
                        <li><Link to="/help">Help Center</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className={`tz-navbar${scrolled ? " scrolled" : ""}`}>
                <div className="tz-nav-inner">

                    {/* Logo */}
                    <Link to="/" className="tz-logo">
                        <span className="tz-logo-mark">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </span>
                        <span className="tz-logo-text">Tech<em>Zone</em></span>
                    </Link>

                    <ul style={{ display: "flex", alignItems: "center", gap: "2px", listStyle: "none", margin: 0, padding: 0 }} className="tz-nav-links">
                        {NAV_LINKS.map((l) => (
                            <li key={l.to}>
                                <Link
                                    to={l.to}
                                    style={{
                                        display: "block",
                                        padding: "6px 12px",
                                        fontSize: "13.5px",
                                        fontWeight: 600,
                                        color: isActive(l.to) ? "var(--tz-primary)" : "var(--tz-text-secondary)",
                                        textDecoration: "none",
                                        borderRadius: "var(--tz-radius-sm)",
                                        transition: "all 0.2s ease",
                                        background: isActive(l.to) ? "var(--tz-primary-light)" : "transparent",
                                        whiteSpace: "nowrap",
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive(l.to)) {
                                            e.target.style.color = "var(--tz-primary)";
                                            e.target.style.background = "var(--tz-primary-light)";
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive(l.to)) {
                                            e.target.style.color = "var(--tz-text-secondary)";
                                            e.target.style.background = "transparent";
                                        }
                                    }}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Search Bar */}
                    <div className="tz-search">
                        <form className="tz-search-form" onSubmit={handleSearch}>
                            <span className="tz-search-icon-wrap">
                                <i className="bi bi-search" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search for products, brands and more..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="tz-search-btn-tt">
                                <i className="bi bi-search" />
                            </button>
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="tz-nav-actions">

                        {/* Wishlist */}
                        <Link to="/wishlist" className="tz-nav-action" aria-label="Wishlist">
                            <i className="bi bi-heart" />
                            <span className="tz-nav-action-label">Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="tz-nav-badge">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>


                        {/* Cart */}
                        <Link to="/cart" className="tz-nav-action" aria-label="Cart">
                            <i className="bi bi-bag" />
                            <span className="tz-nav-action-label">Cart</span>

                            <span className="tz-nav-badge">
                                {cartCount}
                            </span>
                        </Link>

                        {/* Account */}
                        {isLoggedIn ? (
                            <div className="tz-user-menu" ref={dropRef}>
                                <button
                                    className="tz-nav-action"
                                    onClick={() => setDropdownOpen((p) => !p)}
                                    aria-label="Account"
                                >
                                    <i className="bi bi-person-circle" />
                                    <span className="tz-nav-action-label">Account</span>
                                </button>
                                <div className={`tz-dropdown${dropdownOpen ? " show" : ""}`}>
                                    <div className="tz-dropdown-header">
                                        <div className="tz-dropdown-name">{userName}</div>
                                        <div className="tz-dropdown-sub">Verified Member</div>
                                    </div>
                                    <Link to="/dashboard" className="tz-drop-item" onClick={() => setDropdownOpen(false)}>
                                        <i className="bi bi-grid" /> Dashboard
                                    </Link>
                                    <Link to="/my-orders" className="tz-drop-item" onClick={() => setDropdownOpen(false)}>
                                        <i className="bi bi-box-seam" /> My Orders
                                    </Link>
                                    <Link to="/wishlist" className="tz-drop-item" onClick={() => setDropdownOpen(false)}>
                                        <i className="bi bi-heart" /> Wishlist
                                    </Link>
                                    <Link to="/profile" className="tz-drop-item" onClick={() => setDropdownOpen(false)}>
                                        <i className="bi bi-gear" /> Settings
                                    </Link>
                                    <div className="tz-drop-divider" />
                                    <button
                                        className="tz-drop-item danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="tz-signin-pill">
                                <i className="bi bi-person" />
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            className="tz-mobile-toggle"
                            aria-label="Menu"
                            onClick={() => setMobileOpen((p) => !p)}
                        >
                            <i className={`bi ${mobileOpen ? "bi-x-lg" : "bi-list"}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`tz-mobile-menu${mobileOpen ? " open" : ""}`}>
                    <div className="tz-mobile-menu-inner">
                        <form className="tz-mobile-search-wrap" onSubmit={handleSearch}>
                            <i className="bi bi-search" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        {NAV_LINKS.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className={`tz-mobile-link${isActive(l.to) ? " active" : ""}`}
                            >
                                {l.label}
                                <i className="bi bi-chevron-right" style={{ fontSize: "12px" }} />
                            </Link>
                        ))}
                        <div className="tz-mobile-actions">
                            {isLoggedIn ? (
                                <button
                                    className="tz-mobile-btn-primary"
                                    onClick={handleLogout}
                                    style={{ background: "var(--tz-danger)" }}
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <Link to="/login" className="tz-mobile-btn-primary">
                                    Sign In / Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Category Bar */}
            <div className="tz-cat-bar">
                <div className="tz-cat-inner">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            className={`tz-cat-link${activeCategory === cat.slug ? " active" : ""}`}
                        >
                            <i className={cat.icon} />
                            {cat.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;