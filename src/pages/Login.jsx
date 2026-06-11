import { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const user = localStorage.getItem("user");
    if (user) return <Navigate to="/" />;

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // ✅ NO CSRF needed — direct API call with token auth
            const res = await axios.post(
                "http://127.0.0.1:8000/api/login",
                form
                // NO withCredentials — token auth use ho rahi hai
            );

            const { token, user } = res.data;

            // ✅ Token save karo
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("user_id", user.id);
            localStorage.setItem("user_credentials", JSON.stringify({
                email: form.email,
                password: form.password,
            }));

            // ✅ Axios header set karo globally
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            navigate("/");

        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#f9f5ec", minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5"
                            style={{ border: "1px solid #f0e0b0" }}>
                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                    style={{ width: 60, height: 60, background: "#fff8ec" }}>
                                    <i className="bi bi-gem fs-3" style={{ color: "#f5a623" }} />
                                </div>
                                <h4 className="fw-bold mb-1">Welcome Back</h4>
                                <p className="text-muted small mb-0">Login to your TechZone account</p>
                            </div>

                            {error && (
                                <div className="alert d-flex align-items-center gap-2 mb-3"
                                    style={{ background: "#fdecea", border: "1px solid #f5c6cb", borderRadius: "10px", color: "#c62828" }}>
                                    <i className="bi bi-exclamation-circle-fill" /> {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Email Address</label>
                                    <input type="email" name="email" className="form-control"
                                        placeholder="your@email.com" required
                                        value={form.email} onChange={handleChange}
                                        style={{ borderRadius: "10px", borderColor: "#e0d0b0" }} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-semibold">Password</label>
                                    <input type="password" name="password" className="form-control"
                                        placeholder="••••••••" required
                                        value={form.password} onChange={handleChange}
                                        style={{ borderRadius: "10px", borderColor: "#e0d0b0" }} />
                                </div>
                                <button type="submit" className="btn w-100 py-2 fw-bold" disabled={loading}
                                    style={{ background: "#f5a623", color: "#fff", borderRadius: "12px" }}>
                                    {loading
                                        ? <><span className="spinner-border spinner-border-sm me-2" />Logging in...</>
                                        : <><i className="bi bi-box-arrow-in-right me-2" />Login</>}
                                </button>
                                <p className="text-center text-muted small mt-3 mb-0">
                                    Don't have an account?{" "}
                                    <Link to="/register" style={{ color: "#f5a623", fontWeight: "600" }}>
                                        Register here
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}