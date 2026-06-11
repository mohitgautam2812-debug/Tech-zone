import { useEffect, useState } from "react";
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

import "./Checkout.css";
const steps = ["Address", "Payment"];

export default function Checkout() {

    const navigate = useNavigate();

    const location = useLocation();

    const [cartItems, setCartItems] = useState([]);

    const [step, setStep] = useState(0);

    const [payMethod, setPayMethod] = useState("");



    const userData = localStorage.getItem("user");

    const user = userData
        ? JSON.parse(userData)
        : null;


    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        cardNum: "",
        expiry: "",
        cvv: "",
        upiId: "",
    });


    const userId = user?.id;

    const buyNow = location.state?.buyNow;

    const buyNowProduct = location.state?.product;

    const buyNowQty = location.state?.qty || 1;

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleOrder = async () => {

        try {
            if (payMethod === "online") {

                try {

                    const response = await axios.post(

                        "http://127.0.0.1:8000/api/stripe/payment",

                        {

                            amount: total,

                            email: form.email

                        }

                    );

                    localStorage.setItem(

                        "pendingOrder",

                        JSON.stringify({

                            cartItems,

                            form,

                            total,

                            userId,

                            payMethod

                        })

                    );

                    window.location.href =
                        response.data.url;

                    return;

                } catch (error) {

                    console.log(error);

                    alert("Payment failed");

                }

            }

            // COD ORDER
            let createdOrder = null;

            for (const item of cartItems) {

                const response = await axios.post(

                    "http://127.0.0.1:8000/api/orders",

                    {

                        user_id: userId,

                        product_id: item.product?.id
                            ? item.product.id
                            : item.id,

                        quantity: item.qty,

                        total_price:
                            item.product.price * item.qty,

                        name: form.name,

                        email: form.email,

                        phone: form.phone,

                        address: form.address,

                        city: form.city,

                        state: form.state,

                        pincode: form.pincode,

                        payment_method: payMethod,

                    }

                );

                createdOrder = response.data.order;

            }

            localStorage.setItem(

                "codOrder",

                JSON.stringify({

                    success: true

                })

            );

            navigate(
                `/payment-success?order_id=${createdOrder.id}`
            );

        } catch (error) {

            console.log(error);

            console.log(error.response);

            alert(JSON.stringify(error.response?.data));

        }

    };


    const fetchCart = async () => {

        try {

            const response = await axios.get(
                `http://127.0.0.1:8000/api/cart/${userId}`
            );

            setCartItems(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        if (buyNow && buyNowProduct) {

            setCartItems([
                {
                    id: buyNowProduct.id,

                    qty: buyNowQty,
                    product: {

                        id: buyNowProduct.id,

                        name: buyNowProduct.name,

                        image: buyNowProduct.image,

                        price: Number(
                            buyNowProduct.price
                        )

                    }
                }
            ]);

        }


        else {

            fetchCart();

        }

    }, []);

    const subtotal = cartItems.reduce(

        (sum, item) =>

            sum +
            (
                Number(item.product?.price || 0)
                * item.qty
            ),

        0

    );

    const shipping = 0;

    const total = subtotal + shipping;

    return (

        <div className="tz-checkout-page">

            <div className="tz-checkout-container">

                {/* HEADING */}
                <h3 className="tz-checkout-heading">
                    <i className="bi bi-bag-check" />
                    Checkout
                </h3>

                {/* STEPPER */}
                <div className="tz-stepper">

                    {steps.map((s, i) => (

                        <div
                            key={s}
                            className="tz-stepper-item"
                        >

                            <div className="tz-stepper-node">

                                <div
                                    className={`tz-stepper-circle ${i < step ? "done" : i === step ? "active" : "inactive"}`}
                                >
                                    {i < step
                                        ? <i className="bi bi-check2" />
                                        : i + 1}
                                </div>

                                <small className={`tz-stepper-label ${i === step ? "active" : "inactive"}`}>
                                    {s}
                                </small>

                            </div>

                            {i < steps.length - 1 && (
                                <div className={`tz-stepper-line ${i < step ? "done" : "pending"}`} />
                            )}

                        </div>

                    ))}

                </div>

                <div className="tz-checkout-grid">

                    {/* LEFT */}
                    <div>

                        {/* ADDRESS STEP */}
                        {step === 0 && (

                            <div className="tz-panel">

                                <h5 className="tz-panel-title">
                                    <i className="bi bi-geo-alt" />
                                    Delivery Address
                                </h5>

                                <div className="tz-form-grid">

                                    <div className="tz-form-group">
                                        <label className="tz-form-label">Full Name *</label>
                                        <input
                                            name="name"
                                            className="tz-form-control"
                                            value={form.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="tz-form-group">
                                        <label className="tz-form-label">Email *</label>
                                        <input
                                            name="email"
                                            type="email"
                                            className="tz-form-control"
                                            value={form.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="tz-form-group">
                                        <label className="tz-form-label">Phone *</label>
                                        <input
                                            name="phone"
                                            className="tz-form-control"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="tz-form-group">
                                        <label className="tz-form-label">Pincode *</label>
                                        <input
                                            name="pincode"
                                            className="tz-form-control"
                                            value={form.pincode}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="tz-form-group tz-form-full">
                                        <label className="tz-form-label">Address *</label>
                                        <textarea
                                            name="address"
                                            className="tz-form-control"
                                            rows={2}
                                            value={form.address}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="tz-form-group">
                                        <label className="tz-form-label">City *</label>
                                        <input
                                            name="city"
                                            className="tz-form-control"
                                            value={form.city}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="tz-form-group">
                                        <label className="tz-form-label">State *</label>
                                        <select
                                            name="state"
                                            className="tz-form-control"
                                            value={form.state}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select State</option>
                                            {[
                                                "Maharashtra",
                                                "Delhi",
                                                "Karnataka",
                                                "Tamil Nadu",
                                                "Gujarat",
                                                "Punjab",
                                                "Rajasthan"
                                            ].map((st) => (
                                                <option key={st}>{st}</option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

                                <button
                                    className="tz-btn-primary"
                                    onClick={() => {

                                        if (

                                            !form.name ||

                                            !form.email ||

                                            !form.phone ||

                                            !form.pincode ||

                                            !form.address ||

                                            !form.city ||

                                            !form.state

                                        ) {

                                            alert("Please fill all address details");

                                            return;

                                        }

                                        if (form.phone.length < 10) {

                                            alert("Enter valid phone number");

                                            return;

                                        }

                                        if (form.pincode.length < 6) {

                                            alert("Enter valid pincode");

                                            return;

                                        }

                                        setStep(1);

                                    }}
                                >
                                    Continue to Payment
                                    <i className="bi bi-arrow-right ms-1" />
                                </button>

                            </div>

                        )}

                        {/* PAYMENT STEP */}
                        {step === 1 && (

                            <div className="tz-panel">

                                <h5 className="tz-panel-title">
                                    <i className="bi bi-credit-card" />
                                    Payment Method
                                </h5>

                                <div className="tz-pay-options">

                                    {/* COD */}
                                    <div
                                        className={`tz-pay-option ${payMethod === "cod" ? "selected" : ""}`}
                                        onClick={() => setPayMethod("cod")}
                                    >
                                        <div className="tz-pay-option-left">
                                            <div className="tz-pay-icon-wrap">
                                                <i className="bi bi-cash-stack" />
                                            </div>
                                            <div>
                                                <div className="tz-pay-option-name">Cash On Delivery</div>
                                                <div className="tz-pay-option-sub">Pay when your order arrives</div>
                                            </div>
                                        </div>
                                        <input
                                            type="radio"
                                            checked={payMethod === "cod"}
                                            readOnly
                                            className="tz-pay-radio"
                                        />
                                    </div>

                                    {/* ONLINE */}
                                    <div
                                        className={`tz-pay-option ${payMethod === "online" ? "selected" : ""}`}
                                        onClick={() => setPayMethod("online")}
                                    >
                                        <div className="tz-pay-option-left">
                                            <div className="tz-pay-icon-wrap">
                                                <i className="bi bi-credit-card-2-front" />
                                            </div>
                                            <div>
                                                <div className="tz-pay-option-name">Online Payment</div>
                                                <div className="tz-pay-option-sub">Pay securely using card / UPI</div>
                                            </div>
                                        </div>
                                        <input
                                            type="radio"
                                            checked={payMethod === "online"}
                                            readOnly
                                            className="tz-pay-radio"
                                        />
                                    </div>

                                    {/* PLACE ORDER BUTTON */}
                                    <button
                                        className="tz-btn-primary"
                                        onClick={() => {

                                            if (!payMethod) {

                                                alert("Please select payment method");

                                                return;

                                            }

                                            handleOrder();

                                        }}
                                    >
                                        Place Order
                                        <i className="bi bi-arrow-right ms-1" />
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                    {/* RIGHT SUMMARY */}
                    <div className="tz-panel">

                        <h6 className="tz-panel-title" style={{ fontSize: "15px" }}>
                            Order Summary
                        </h6>

                        {cartItems.map((item) => (

                            <div key={item.id} className="tz-summary-item">

                                <img
                                    src={`http://127.0.0.1:8000/storage/${item.product.image}`}
                                    alt=""
                                    className="tz-summary-img"
                                />

                                <span className="tz-summary-name">
                                    {item.product.name}{" × "}{item.qty}
                                </span>

                                <span className="tz-summary-price">
                                    ₹{(
                                        Number(item.product?.price) *
                                        item.qty
                                    ).toLocaleString()}
                                </span>

                            </div>

                        ))}

                        <hr className="tz-divider" />

                        <div className="tz-summary-row">
                            <span className="tz-summary-row-label">Subtotal</span>
                            <span className="tz-summary-row-value">₹{subtotal.toLocaleString()}</span>
                        </div>

                        <div className="tz-summary-row">
                            <span className="tz-summary-row-label">Shipping</span>
                            <span className="tz-summary-row-free">FREE</span>
                        </div>

                        <hr className="tz-divider" />

                        <div className="tz-summary-total-row">
                            <span className="tz-summary-total-label">Total</span>
                            <span className="tz-summary-total-value">₹{total.toLocaleString()}</span>
                        </div>

                        <div className="tz-secure-badge">
                            <i className="bi bi-shield-check-fill" />
                            <span>100% Secure Checkout</span>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}