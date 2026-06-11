import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Product.css";
import Swal from "sweetalert2";

function StarRating({ rating = 0 }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
        <span>
            {[1, 2, 3, 4, 5].map((s) => (
                <i
                    key={s}
                    className={`bi ${s <= full
                        ? "bi-star-fill"
                        : s === full + 1 && half
                            ? "bi-star-half"
                            : "bi-star"
                        }`}
                    style={{ color: "#fbbf24", fontSize: "0.65rem", marginRight: "1px" }}
                />
            ))}
        </span>
    );
}



function FilterSection({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="tz-filter-section">
            <button className="tz-filter-toggle" onClick={() => setOpen((o) => !o)}>
                {title}
                <i className={`bi bi-chevron-${open ? "up" : "down"}`} />
            </button>
            {open && <div style={{ paddingBottom: "8px" }}>{children}</div>}
        </div>
    );
}


function CheckGroup({ items, selected, onToggle }) {
    if (!items || items.length === 0)
        return (
            <p style={{ color: "var(--tz-text-muted)", fontSize: "0.7rem" }}>
                No options
            </p>
        );
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((item, i) => {
                const active = selected === item;
                return (
                    <label
                        key={i}
                        className="tz-check-item"
                        onClick={() => onToggle(active ? "" : item)}
                    >
                        <div className={`tz-check-box${active ? " checked" : ""}`}>
                            {active && <i className="bi bi-check" />}
                        </div>
                        <span className={`tz-check-label${active ? " active" : ""}`}>
                            {item}
                        </span>
                    </label>
                );
            })}
        </div>
    );
}


function PriceRange({ min, max, value, onChange }) {
    return (
        <div className="tz-price-range">
            <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: "0.68rem", color: "var(--tz-text-muted)" }}>
                    ₹{Number(min).toLocaleString()}
                </span>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--tz-neon)" }}>
                    ₹{Number(value).toLocaleString()}
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--tz-text-muted)" }}>
                    ₹{Number(max).toLocaleString()}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
}

function Chip({ label, onRemove }) {
    return (
        <span className="tz-chip">
            {label}
            <i className="bi bi-x" onClick={onRemove} />
        </span>
    );
}


function PagBtn({ icon, disabled, onClick }) {
    return (
        <button className="tz-pag-btn" onClick={onClick} disabled={disabled}>
            <i className={`bi ${icon}`} />
        </button>
    );
}

function getPageRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
        return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
}


function getBadge(index) {
    const badges = ["ai-pick", "new", "trending", "hot", "sale"];
    return badges[index % badges.length];
}




const SWATCH_COLORS = {
    black: "#111", white: "#f5f5f5", silver: "#c0c0c0", gold: "#ffd700",
    blue: "#1a6fff", red: "#e53e3e", green: "#38a169", yellow: "#f6c90e",
    pink: "#ed64a6", purple: "#805ad5", grey: "#718096", gray: "#718096",
};


export default function Products() {


    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [storages, setStorages] = useState([]);
    const [colors, setColors] = useState([]);
    const [displaySizes, setDisplaySizes] = useState([]);
    const [conditions, setConditions] = useState([]);

    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedStorage, setSelectedStorage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedDisplay, setSelectedDisplay] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [maxPrice, setMaxPrice] = useState(0);
    const [priceLimit, setPriceLimit] = useState(0);
    const [sortBy, setSortBy] = useState("default");
    const [searchParams] = useSearchParams();

    const searchQuery = searchParams.get("search") || "";

    const [search, setSearch] = useState(searchQuery);
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState([]);
    const [wishlistData, setWishlistData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const productsPerPage = 12;





    useEffect(() => {
        setSearch(searchQuery);
    }, [searchQuery]);



    useEffect(() => {
        const category = searchParams.get("category");
        const params = {};
        if (category) params.category = category;


        if (category) setActiveCategory(category);

        axios
            .get("http://127.0.0.1:8000/api/products", { params })
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

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {

        if (user) {

            axios
                .get(`http://127.0.0.1:8000/api/cart/${user.id}`)
                .then((res) => setCart(res.data))
                .catch(console.log);

        }

    }, []);

    useEffect(() => {

        if (user) {

            axios
                .get(`http://127.0.0.1:8000/api/wishlist/${user.id}`)
                .then((res) => setWishlistData(res.data))
                .catch(console.log);

        }

    }, []);


    const toggleWishlist = (id) =>
        setWishlist((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );

    const fetchCartData = async () => {

        try {

            const res = await axios.get(
                `http://127.0.0.1:8000/api/cart/${user.id}`
            );

            setCart(res.data);

        } catch (e) {

            console.log(e);

        }
    };

    const addToCart = async (productId) => {

        const alreadyInCart = cart.some(
            (c) => c.product?.id === productId
        );

        if (alreadyInCart) {

            return Swal.fire({
                toast: true,
                position: "top-end",
                icon: "info",
                title: "Already in cart",
                showConfirmButton: false,
                timer: 1500,
            });

        }

        if (!user) return Swal.fire({
            icon: "warning",
            title: "Login Required",
            text: "Please login first to continue",
            confirmButtonColor: "#111827",
            position: "absolute",
            margin: "0 auto"
        });

        try {

            await axios.post(
                "http://127.0.0.1:8000/api/cart",
                {
                    user_id: user.id,
                    product_id: productId,
                    quantity: 1,
                }
            );

            window.dispatchEvent(
                new Event("cartUpdated")
            );

            fetchCartData();

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Product added to cart 🛒",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

        } catch (e) {

            console.log(e);

        }
    };


    const fetchWishlistData = async () => {

        try {

            const res = await axios.get(
                `http://127.0.0.1:8000/api/wishlist/${user.id}`
            );

            setWishlistData(res.data);

        } catch (e) {

            console.log(e);

        }
    };


    const addToWishlist = async (product) => {
        const alreadyInWishlist = wishlistData.some(
            (w) => w.product?.id === product.id
        );

        if (alreadyInWishlist) {

            return Swal.fire({
                toast: true,
                position: "top-end",
                icon: "info",
                title: "Already in wishlist",
                showConfirmButton: false,
                timer: 1500,
            });

        }
        try {
            await axios.post("http://127.0.0.1:8000/api/wishlist", {
                user_id: user?.id,
                product_id: product.id,
            });

            window.dispatchEvent(new Event("wishlistUpdated"));
            fetchWishlistData();
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Added to Wishlist ",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        } catch (e) {
            console.log(e);
        }
    };

    const clearAll = () => {
        setActiveCategory("All");
        setSelectedBrand("");
        setSelectedStorage("");
        setSelectedColor("");
        setSelectedDisplay("");
        setSelectedCondition("");
        setPriceLimit(maxPrice);
        setSearch("");
        setSortBy("default");
    };


    let filtered = products.filter((p) => {
        const price = Number(p.price) || 0;
        return (
            (activeCategory === "All" || p.category?.name === activeCategory) &&
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            (!selectedBrand || p.brand === selectedBrand) &&
            (!selectedStorage || p.storage === selectedStorage) &&
            (!selectedColor || p.color === selectedColor) &&
            (!selectedDisplay || p.display_size === selectedDisplay) &&
            (!selectedCondition || p.condition === selectedCondition) &&
            (priceLimit === 0 || price <= priceLimit)
        );
    });

    if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc") filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const totalPages = Math.ceil(filtered.length / productsPerPage);
    const currentProducts = filtered.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const activeFiltersCount = [
        activeCategory !== "All",
        selectedBrand,
        selectedStorage,
        selectedColor,
        selectedDisplay,
        selectedCondition,
        priceLimit < maxPrice && maxPrice > 0,
    ].filter(Boolean).length;


    const SidebarContent = () => (
        <>

            <div className="tz-sidebar-search">
                <i className="bi bi-search" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
            </div>


            {maxPrice > 0 && (
                <FilterSection title="Price Range" defaultOpen={true}>
                    <PriceRange
                        min={0}
                        max={maxPrice}
                        value={priceLimit}
                        onChange={(v) => { setPriceLimit(v); setCurrentPage(1); }}
                    />
                </FilterSection>
            )}


            {categories.length > 1 && (
                <FilterSection title="Category" defaultOpen={false}>
                    <CheckGroup
                        items={categories.filter((c) => c !== "All")}
                        selected={activeCategory === "All" ? "" : activeCategory}
                        onToggle={(val) => { setActiveCategory(val || "All"); setCurrentPage(1); }}
                    />
                </FilterSection>
            )}


            {brands.length > 0 && (
                <FilterSection title="Brand" defaultOpen={true}>
                    <CheckGroup
                        items={brands}
                        selected={selectedBrand}
                        onToggle={(v) => { setSelectedBrand(v); setCurrentPage(1); }}
                    />
                </FilterSection>
            )}


            <FilterSection title="Rating" defaultOpen={false}>
                {[5, 4, 3].map((r) => (
                    <div key={r} className="tz-rating-row">
                        <div
                            className={`tz-check-box${sortBy === "rating-desc" && r === 5 ? " checked" : ""}`}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setSortBy(sortBy === "rating-desc" ? "default" : "rating-desc")
                            }
                        >
                            {sortBy === "rating-desc" && r === 5 && (
                                <i className="bi bi-check" />
                            )}
                        </div>
                        {[...Array(r)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill" />
                        ))}
                        <span style={{ fontSize: "0.65rem", color: "var(--tz-text-muted)" }}>
                            & up
                        </span>
                    </div>
                ))}
            </FilterSection>


            {colors.length > 0 && (
                <FilterSection title="Color" defaultOpen={false}>
                    <div className="tz-color-swatches">
                        {colors.map((c) => (
                            <div
                                key={c}
                                className={`tz-color-swatch${selectedColor === c ? " active" : ""}`}
                                style={{ background: SWATCH_COLORS[c.toLowerCase()] || "#888" }}
                                title={c}
                                onClick={() => {
                                    setSelectedColor(selectedColor === c ? "" : c);
                                    setCurrentPage(1);
                                }}
                            />
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Storage */}
            {storages.length > 0 && (
                <FilterSection title="Storage" defaultOpen={false}>
                    <div className="tz-storage-pills">
                        {storages.map((s) => (
                            <button
                                key={s}
                                className={`tz-storage-pill${selectedStorage === s ? " active" : ""}`}
                                onClick={() => {
                                    setSelectedStorage(selectedStorage === s ? "" : s);
                                    setCurrentPage(1);
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Display Size */}
            {displaySizes.length > 0 && (
                <FilterSection title="Display Size" defaultOpen={false}>
                    <CheckGroup
                        items={displaySizes}
                        selected={selectedDisplay}
                        onToggle={(v) => { setSelectedDisplay(v); setCurrentPage(1); }}
                    />
                </FilterSection>
            )}

            {/* Condition */}
            {conditions.length > 0 && (
                <FilterSection title="Condition" defaultOpen={false}>
                    <CheckGroup
                        items={conditions}
                        selected={selectedCondition}
                        onToggle={(v) => { setSelectedCondition(v); setCurrentPage(1); }}
                    />
                </FilterSection>
            )}

            {/* Clear all */}
            {activeFiltersCount > 0 && (
                <button className="tz-clear-btn" onClick={clearAll}>
                    <i className="bi bi-x-circle" />
                    Clear All ({activeFiltersCount})
                </button>
            )}
        </>
    );

    return (
        <div
            style={{
                background: "var(--tz-bg-deep)",
                minHeight: "100vh",
                color: "var(--tz-text)",
            }}
        >


            <section className="tz-shop-hero">
                <div className="container-fluid" style={{ marginLeft: "40px" }}>
                    <div className="tz-label">
                        <i className="bi bi-shop" /> SHOP
                    </div>
                    <h1>Discover every device</h1>
                    <p>
                        Filter, compare and find your perfect tech with AI-powered search.
                    </p>
                </div>
            </section>


            <div
                className="container px-lg-4 px-3 py-4"
                style={{ maxWidth: "1300px", margin: "0 auto" }}
            >

                {/* Mobile filter toggle */}
                <div className="d-lg-none mb-3">
                    <button
                        className="tz-mobile-filter-btn"
                        onClick={() => setMobileSidebar((o) => !o)}
                    >
                        <i className="bi bi-sliders" />
                        {mobileSidebar ? "Hide Filters" : "Show Filters"}
                        {activeFiltersCount > 0 && (
                            <span className="tz-filter-badge">{activeFiltersCount}</span>
                        )}
                    </button>
                </div>

                <div className="row g-3">


                    <div
                        className={`col-lg-3 col-xl-3 ${mobileSidebar ? "d-block" : "d-none"
                            } d-lg-block`}
                        style={{ minWidth: 0 }}
                    >
                        <div className="tz-sidebar">

                            {/* Sidebar header row */}
                            <div className="tz-sidebar-head">
                                <span className="tz-sidebar-head-title">
                                    <i className="bi bi-sliders2" />
                                    Filters
                                </span>
                                {activeFiltersCount > 0 && (
                                    <span
                                        className="tz-filter-badge"
                                        style={{
                                            borderRadius: "20px",
                                            padding: "1px 7px",
                                            fontSize: "0.58rem",
                                            width: "auto",
                                            height: "auto",
                                        }}
                                    >
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </div>

                            <SidebarContent />
                        </div>
                    </div>


                    <div className="col-lg-9 col-xl-9">

                        {/* Topbar */}
                        <div className="tz-products-topbar">
                            <div>
                                <p className="tz-topbar-title">All Products</p>
                                <p className="tz-topbar-count">
                                    Showing <strong>{filtered.length}</strong> results
                                </p>
                            </div>

                            <div className="tz-topbar-right">
                                <select
                                    value={sortBy}
                                    className="tz-sort-select"
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="default">Sort: Featured</option>
                                    <option value="price-asc">Price: Low → High</option>
                                    <option value="price-desc">Price: High → Low</option>
                                    <option value="rating-desc">Top Rated</option>
                                </select>

                                <div className="tz-view-toggle d-none d-sm-flex">
                                    <button className="tz-view-btn active">
                                        <i className="bi bi-grid-3x3-gap" />
                                    </button>
                                    <button className="tz-view-btn">
                                        <i className="bi bi-list-ul" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active chips */}
                        {activeFiltersCount > 0 && (
                            <div className="tz-chips-row">
                                {activeCategory !== "All" && (
                                    <Chip
                                        label={`Category: ${activeCategory}`}
                                        onRemove={() => setActiveCategory("All")}
                                    />
                                )}
                                {selectedBrand && (
                                    <Chip
                                        label={`Brand: ${selectedBrand}`}
                                        onRemove={() => setSelectedBrand("")}
                                    />
                                )}
                                {selectedStorage && (
                                    <Chip
                                        label={`Storage: ${selectedStorage}`}
                                        onRemove={() => setSelectedStorage("")}
                                    />
                                )}
                                {selectedColor && (
                                    <Chip
                                        label={`Color: ${selectedColor}`}
                                        onRemove={() => setSelectedColor("")}
                                    />
                                )}
                                {selectedDisplay && (
                                    <Chip
                                        label={`Display: ${selectedDisplay}`}
                                        onRemove={() => setSelectedDisplay("")}
                                    />
                                )}
                                {selectedCondition && (
                                    <Chip
                                        label={`Condition: ${selectedCondition}`}
                                        onRemove={() => setSelectedCondition("")}
                                    />
                                )}
                                {priceLimit < maxPrice && maxPrice > 0 && (
                                    <Chip
                                        label={`Max ₹${Number(priceLimit).toLocaleString()}`}
                                        onRemove={() => setPriceLimit(maxPrice)}
                                    />
                                )}
                            </div>
                        )}

                        {/* ── PRODUCT GRID ── */}
                        {currentProducts.length === 0 ? (
                            <div className="tz-empty">
                                <div className="tz-empty-icon">
                                    <i className="bi bi-search" />
                                </div>
                                <h5
                                    style={{
                                        color: "#fff",
                                        fontWeight: 700,
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    No products found
                                </h5>
                                <p
                                    style={{
                                        fontSize: "0.82rem",
                                        color: "var(--tz-text-muted)",
                                        marginBottom: "1.4rem",
                                    }}
                                >
                                    Try adjusting your filters or search term
                                </p>
                                <button
                                    onClick={clearAll}
                                    className="tz-clear-btn"
                                    style={{ maxWidth: "160px", margin: "0 auto" }}
                                >
                                    <i className="bi bi-x-circle" />
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {currentProducts.map((p, idx) => {
                                    const inWishlist = wishlist.includes(p.id);
                                    const discount = p.discount || 0;
                                    const rating = Number(p.rating) || 0;
                                    const badgeType = discount > 0 ? "sale" : getBadge(idx);

                                    return (
                                        <div
                                            className="col-12 col-sm-6 col-xl-4"
                                            key={p.id}
                                        >
                                            <div className="tz-pc h-100">

                                                {/* ── Image ── */}
                                                <div className="tz-pc-img">
                                                    <img
                                                        src={`http://127.0.0.1:8000/storage/${p.image}`}
                                                        alt={p.name}
                                                    />



                                                    {/* Wishlist btn */}
                                                    <button
                                                        className={`tz-pc-wish${inWishlist ? " active" : ""}`}
                                                        onClick={() => {
                                                            toggleWishlist(p.id);
                                                            addToWishlist(p);
                                                        }}
                                                        aria-label="Wishlist"
                                                    >
                                                        <i
                                                            className={`bi ${inWishlist
                                                                ? "bi-heart-fill"
                                                                : "bi-heart"
                                                                }`}
                                                        />
                                                    </button>

                                                    {/* Quick view */}
                                                    <Link
                                                        to={`/products/${p.id}`}
                                                        className="tz-quick-view"
                                                    >
                                                        <i className="bi bi-eye" /> Quick view
                                                    </Link>
                                                </div>

                                                <div className="ppp">
                                                    <div className="hhh">
                                                        <div className="tz-pc-body">
                                                            <p className="tz-pc-brand">
                                                                {p.brand || "—"}
                                                            </p>

                                                            <h6 className="tz-pc-name">
                                                                {p.name}
                                                            </h6>

                                                        </div>
                                                        <div className="tz-pc-rating">
                                                            <StarRating rating={rating} />
                                                            <span>({rating})</span>
                                                        </div>
                                                    </div>
                                                    <div className="in">
                                                        <div className="tz-spec-pills">
                                                            {p.storage && (
                                                                <span className="tz-spec-pill">
                                                                    {p.storage}
                                                                </span>
                                                            )}

                                                            {p.color && (
                                                                <span className="tz-spec-pill">
                                                                    {p.color}
                                                                </span>
                                                            )}
                                                            {p.display_size && (
                                                                <span className="tz-spec-pill">
                                                                    {p.display_size}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Stock */}
                                                        <span className="tz-in-stock">
                                                            <i className="bi bi-check-circle-fill" />
                                                            In Stock
                                                        </span>
                                                    </div>
                                                    {/* Price */}
                                                    <div className="tz-pc-price">
                                                        <span className="tz-price-now">
                                                            ₹{Number(p.price).toLocaleString()}
                                                        </span>
                                                        {p.discount_price && (
                                                            <span className="tz-price-was">
                                                                ₹{Number(
                                                                    p.discount_price
                                                                ).toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>


                                                    {/* Action buttons */}
                                                    <div className="tz-pc-btns">
                                                        <Link
                                                            to={`/products/${p.id}`}
                                                            className="tz-btn-detail"
                                                        >
                                                            View Details
                                                        </Link>
                                                        <button
                                                            className="tz-btn-cart"
                                                            onClick={() => addToCart(p.id)}
                                                            aria-label="Add to cart"
                                                        >
                                                            <i className="bi bi-cart-plus" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── PAGINATION ── */}
                        {totalPages > 1 && (
                            <>
                                <div className="tz-pagination">
                                    <PagBtn
                                        icon="bi-chevron-double-left"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(1)}
                                    />
                                    <PagBtn
                                        icon="bi-chevron-left"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    />

                                    {getPageRange(currentPage, totalPages).map((pg, i) =>
                                        pg === "..." ? (
                                            <span key={`e-${i}`} className="tz-pag-ellipsis">
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={pg}
                                                className={`tz-pag-btn${currentPage === pg ? " active" : ""
                                                    }`}
                                                onClick={() => setCurrentPage(pg)}
                                            >
                                                {pg}
                                            </button>
                                        )
                                    )}

                                    <PagBtn
                                        icon="bi-chevron-right"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    />
                                    <PagBtn
                                        icon="bi-chevron-double-right"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(totalPages)}
                                    />
                                </div>

                                <p className="tz-pag-info">
                                    Page <span>{currentPage}</span> of {totalPages} ·{" "}
                                    {filtered.length} products
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}