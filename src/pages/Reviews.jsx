import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reviews.css";


const Reviews = ({ productId, refreshReviews }) => {

  
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;


    const [hoverStar, setHoverStar] = useState(0);

   
    const fetchReviews = async () => {
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/reviews/${productId}`
            );
            setReviews(res.data);
        } catch (error) {
            console.log(error);
        }
    };



    useEffect(() => {
        if (productId) {
            fetchReviews();
            if (refreshReviews) refreshReviews();
        }
    }, [productId]);

    useEffect(() => {
        const handleEditReview = () => {
            const editData = JSON.parse(localStorage.getItem("editReview"));
            if (editData) {
                setEditingId(editData.id);
                setReview(editData.review);
                setRating(editData.rating);
                window.scrollTo({ top: 1200, behavior: "smooth" });
            }
        };
        window.addEventListener("edit-review", handleEditReview);
        return () => window.removeEventListener("edit-review", handleEditReview);
    }, []);

    
    const submitReview = async () => {
        try {
            if (!userId) { alert("Please login first"); return; }

            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("product_id", productId);
            formData.append("rating", rating);
            formData.append("review", review);
            if (image) formData.append("image", image);

            if (editingId) {
                formData.append("_method", "PUT");
                await axios.post(
                    `http://127.0.0.1:8000/api/reviews/${editingId}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                alert("Review Updated");
            } else {
                await axios.post(
                    "http://127.0.0.1:8000/api/reviews",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                alert("Review Added");
            }

           
            setReview("");
            setRating(5);
            setImage(null);
            setEditingId(null);
            fetchReviews();

        } catch (error) {
            console.log(error);
            if (error.response) alert(error.response.data.message);
            else alert("Review Failed");
        }
    };

  
    const renderStars = (r) =>
        [1, 2, 3, 4, 5].map((s) => (
            <i
                key={s}
                className={`bi ${s <= r ? "bi-star-fill" : "bi-star"}${s > r ? " empty" : ""}`}
            />
        ));

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
            });
        } catch { return dateStr; }
    };


    return (
        <div>


            <div className="tz-review-form">

               
                <p className="tz-review-form-title">
                    <i className="bi bi-pencil-square" />
                    {editingId ? "Edit Your Review" : "Write a Review"}
                </p>

               
                {editingId && (
                    <div className="tz-editing-badge">
                        <i className="bi bi-pencil" /> Editing review
                    </div>
                )}

               
                <div className="mb-3">
                    <span className="tz-form-label">Your Rating</span>
                    <div className="tz-star-row">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                className={`tz-star-btn${(hoverStar || rating) >= s ? " filled" : ""}`}
                                onMouseEnter={() => setHoverStar(s)}
                                onMouseLeave={() => setHoverStar(0)}
                                onClick={() => setRating(s)}
                                aria-label={`${s} star`}
                            >
                                <i className={`bi ${(hoverStar || rating) >= s ? "bi-star-fill" : "bi-star"}`} />
                            </button>
                        ))}
                        <span style={{
                            fontSize: "0.78rem",
                            color: "var(--tz-neon)",
                            fontWeight: 700,
                            alignSelf: "center",
                            marginLeft: "0.4rem",
                        }}>
                            {["", "Poor", "Fair", "Good", "Great", "Excellent"][hoverStar || rating]}
                        </span>
                    </div>

                 
                    <select
                        className="tz-select d-none"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    >
                        {[5, 4, 3, 2, 1].map((v) => (
                            <option key={v} value={v}>{v} Star{v > 1 ? "s" : ""}</option>
                        ))}
                    </select>
                </div>

             
                <div className="mb-3">
                    <label className="tz-form-label">Your Review</label>
                    <textarea
                        className="tz-textarea"
                        rows={4}
                        placeholder="Share your experience with this product..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                </div>

              
                <div className="mb-4">
                    <label className="tz-form-label">
                        <i className="bi bi-image me-1" style={{ color: "var(--tz-neon)" }} />
                        Attach Photo (optional)
                    </label>
                    <input
                        type="file"
                        className="tz-file-input"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    {image && (
                        <p style={{ fontSize: "0.7rem", color: "var(--tz-neon)", marginTop: "0.4rem" }}>
                            <i className="bi bi-check-circle me-1" />{image.name}
                        </p>
                    )}
                </div>

                
                <div className="d-flex align-items-center gap-3">
                    <button className="tz-submit-btn" onClick={submitReview}>
                        <i className={`bi ${editingId ? "bi-arrow-repeat" : "bi-send"}`} />
                        {editingId ? "Update Review" : "Submit Review"}
                    </button>

                    {editingId && (
                        <button
                            style={{
                                background: "none",
                                border: "1px solid var(--tz-border)",
                                borderRadius: "var(--tz-radius-pill)",
                                color: "var(--tz-text-muted)",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                padding: "0.55rem 1.1rem",
                                cursor: "pointer",
                                transition: "border-color var(--tz-transition), color var(--tz-transition)",
                            }}
                            onClick={() => {
                                setEditingId(null);
                                setReview("");
                                setRating(5);
                                setImage(null);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            
            <div className="tz-reviews-section">

                <div className="tz-reviews-header">
                    <p className="tz-reviews-title mb-0">
                        <i className="bi bi-chat-square-text" style={{ color: "var(--tz-neon)" }} />
                        Customer Reviews
                        <span className="tz-reviews-count">{reviews.length}</span>
                    </p>

                    {reviews.length > 0 && (
                        <span style={{ fontSize: "0.72rem", color: "var(--tz-text-muted)" }}>
                            Avg rating:{" "}
                            <strong style={{ color: "var(--tz-neon)" }}>
                                {(reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1)}
                            </strong>
                            <i className="bi bi-star-fill ms-1" style={{ color: "#fbbf24", fontSize: "0.68rem" }} />
                        </span>
                    )}
                </div>

                {reviews.length === 0 ? (
                    <div className="tz-no-reviews">
                        <i className="bi bi-chat-dots" />
                        <p>No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    reviews.map((r) => (
                        <div className="tz-review-card" key={r.id}>

                          
                            <div className="tz-reviewer-row">
                                <div className="tz-reviewer-avatar">
                                    {getInitial(r.user?.name)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                        <span className="tz-reviewer-name">
                                            {r.user?.name || "Anonymous"}
                                        </span>
                                        <span className="tz-reviewer-date">
                                            {formatDate(r.created_at)}
                                        </span>
                                    </div>

                                   
                                    <div className="tz-review-stars mt-1">
                                        {renderStars(Number(r.rating))}
                                    </div>
                                </div>
                            </div>

                           
                            {r.review && (
                                <p className="tz-review-text">{r.review}</p>
                            )}

                           
                            {r.image && (
                                <img
                                    src={`http://127.0.0.1:8000/storage/${r.image}`}
                                    alt="Review"
                                    className="tz-review-img"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;