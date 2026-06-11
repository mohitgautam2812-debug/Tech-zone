import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const user = localStorage.getItem("user");

    if (user) return <Navigate to="/" />;

    const [form, setForm] = useState({ name: "", email: "", phone: "", otp: "", password: "" });
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const sendOtp = async () => {
        if (!form.email) { setError("Please enter email first"); return; }
        setOtpLoading(true);
        setError("");
        try {
            await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", { withCredentials: true });
            const res = await axios.post("http://127.0.0.1:8000/api/send-otp", { email: form.email }, { withCredentials: true });
            setOtpSent(true);
            alert(res.data.message || "OTP sent to your email!");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", { withCredentials: true });

            const res = await axios.post("http://127.0.0.1:8000/api/register", form, { withCredentials: true });

            // Save user data
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("user_id", res.data.user.id);

            // ✅ KEY: Save credentials for dashboard auto-login
            localStorage.setItem("user_credentials", JSON.stringify({
                email: form.email,
                password: form.password,
            }));

            navigate("/");

        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#f9f5ec", minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5" style={{ border: "1px solid #f0e0b0" }}>

                            {/* Header */}
                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                    style={{ width: 60, height: 60, background: "#fff8ec" }}>
                                    <i className="bi bi-person-plus fs-3" style={{ color: "#f5a623" }} />
                                </div>
                                <h4 className="fw-bold mb-1">Create Account</h4>
                                <p className="text-muted small mb-0">Join TechZone as a customer</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="alert d-flex align-items-center gap-2 mb-3"
                                    style={{ background: "#fdecea", border: "1px solid #f5c6cb", borderRadius: "10px", color: "#c62828" }}>
                                    <i className="bi bi-exclamation-circle-fill" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Full Name *</label>
                                    <input type="text" name="name" className="form-control"
                                        placeholder="Your full name" required
                                        value={form.name} onChange={handleChange}
                                        style={{ borderRadius: "10px", borderColor: "#e0d0b0" }} />
                                </div>

                                {/* Email + OTP Send */}
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Email Address *</label>
                                    <div className="input-group">
                                        <input type="email" name="email" className="form-control"
                                            placeholder="your@email.com" required
                                            value={form.email} onChange={handleChange}
                                            style={{ borderRadius: "10px 0 0 10px", borderColor: "#e0d0b0" }} />
                                        <button type="button" className="btn fw-semibold"
                                            onClick={sendOtp} disabled={otpLoading}
                                            style={{ background: "#f5a623", color: "#fff", borderRadius: "0 10px 10px 0", whiteSpace: "nowrap" }}>
                                            {otpLoading
                                                ? <span className="spinner-border spinner-border-sm" />
                                                : otpSent ? "Resend OTP" : "Send OTP"}
                                        </button>
                                    </div>
                                    {otpSent && (
                                        <small className="text-success">
                                            <i className="bi bi-check-circle me-1" />OTP sent! Check your email.
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">OTP *</label>
                                    <input type="text" name="otp" className="form-control"
                                        placeholder="Enter 6-digit OTP" required maxLength={6}
                                        value={form.otp} onChange={handleChange}
                                        style={{ borderRadius: "10px", borderColor: "#e0d0b0", letterSpacing: "4px", fontWeight: "bold" }} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Phone Number *</label>
                                    <input type="text" name="phone" className="form-control"
                                        placeholder="10-digit phone number" required maxLength={10}
                                        value={form.phone} onChange={handleChange}
                                        style={{ borderRadius: "10px", borderColor: "#e0d0b0" }} />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-semibold">Password *</label>
                                    <input type="password" name="password" className="form-control"
                                        placeholder="Min 6 characters" required
                                        value={form.password} onChange={handleChange}
                                        style={{ borderRadius: "10px", borderColor: "#e0d0b0" }} />
                                </div>

                                {/* Note: Only user registration — agents added by admin */}
                                <div className="mb-3 p-2 rounded-3 small text-muted"
                                    style={{ background: "#fff8ec", border: "1px solid #f0e0b0" }}>
                                    <i className="bi bi-info-circle me-1" style={{ color: "#f5a623" }} />
                                    Registering as a <strong>Customer</strong>. Agent/Admin access is granted by admin only.
                                </div>

                                <button type="submit" className="btn w-100 py-2 fw-bold" disabled={loading}
                                    style={{ background: "#f5a623", color: "#fff", borderRadius: "12px" }}>
                                    {loading
                                        ? <><span className="spinner-border spinner-border-sm me-2" />Creating Account...</>
                                        : <><i className="bi bi-person-check me-2" />Create Account</>}
                                </button>

                                <p className="text-center text-muted small mt-3 mb-0">
                                    Already have an account?{" "}
                                    <Link to="/login" style={{ color: "#f5a623", fontWeight: "600" }}>Login here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}