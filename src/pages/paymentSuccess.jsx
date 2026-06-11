

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {


    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("order_id");


    console.log(orderId);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [generatedOrderId, setGeneratedOrderId] = useState(null);

    const [isCod, setIsCod] = useState(false);

    useEffect(() => {

        const saveOrder = async () => {

            try {

                const pendingOrder = JSON.parse(
                    localStorage.getItem("pendingOrder")
                );

                const codOrder = JSON.parse(
                    localStorage.getItem("codOrder")
                );

                if (!pendingOrder && !codOrder) {

                    navigate("/");

                    return;

                }

                let createdOrder = null;

                if (codOrder) {

                    setIsCod(true);

                    setLoading(false);

                    localStorage.removeItem("codOrder");

                    return;

                }

                // SAVE ALL CART ITEMS
                for (const item of pendingOrder.cartItems) {

                    const response = await axios.post(



                        "http://127.0.0.1:8000/api/orders",

                        {


                            user_id:
                                pendingOrder.userId,

                            product_id:
                                item.product.id,

                            quantity:
                                item.qty,

                            total_price:
                                item.product.price *
                                item.qty,

                            name:
                                pendingOrder.form.name,

                            email:
                                pendingOrder.form.email,

                            phone:
                                pendingOrder.form.phone,

                            address:
                                pendingOrder.form.address,

                            city:
                                pendingOrder.form.city,

                            state:
                                pendingOrder.form.state,

                            pincode:
                                pendingOrder.form.pincode,

                            payment_method:
                                "online",

                            payment_status:
                                "paid"


                        }

                    );

                    createdOrder =
                        response.data.order;

                }

                // SAVE REAL ORDER ID
                const generatedOrderId = createdOrder.id;

                // CLEAR TEMP STORAGE
                localStorage.removeItem(
                    "pendingOrder"
                );

                setLoading(false);

            } catch (error) {

                console.log(error);

                alert("Order save failed");

            }

        };

        saveOrder();

    }, []);

    if (loading) {

        return (

            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "70vh" }}
            >

                <div className="text-center">

                    <div
                        className="spinner-border text-success mb-3"
                    />

                    <h5>
                        Processing Your Order...
                    </h5>

                </div>

            </div>

        );

    }

    return (

        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "70vh",
                background: "#f8f9fa"
            }}
        >

            <div
                className="bg-white rounded-4 shadow-sm p-5 text-center"
                style={{ maxWidth: 480 }}
            >

                <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{
                        width: 90,
                        height: 90,
                        background: "#e8f5e9"
                    }}
                >

                    <i className="bi bi-check2-circle display-4 text-success" />

                </div>

                <h3 className="fw-bold mb-2">

                    {
                        isCod
                            ? "Order Placed Successfully"
                            : "Payment Successful"
                    }

                </h3>
                <p className="text-muted mb-1">

                    Thank you for shopping with ShopZone.

                </p>

                <p className="text-muted mb-4">

                    {
                        isCod
                            ? "Your COD order has been placed successfully."
                            : "Your payment was successful and order has been placed."
                    }

                </p>

                <div
                    className="p-3 rounded-3 mb-4"
                    style={{
                        background: "#f0fff4",
                        border: "1px dashed #28a745"
                    }}
                >

                    <div className="text-muted small">

                        Order ID

                    </div>

                    <div
                        className="fw-bold"
                        style={{ color: "#28a745" }}
                    >

                        ORD-{orderId || generatedOrderId}

                    </div>

                </div>

                <div
                    className="d-flex gap-2 justify-content-center flex-wrap"
                >

                    <a
                        href={`http://127.0.0.1:8000/invoice/${orderId || generatedOrderId}`}
                        className="btn px-4"
                        style={{
                            background: "#28a745",
                            color: "#fff",
                            borderRadius: "12px"
                        }}
                    >

                        <i className="bi bi-download me-2"></i>

                        Download Invoice

                    </a>

                    <Link
                        to="/my-orders"
                        className="btn px-4"
                        style={{
                            background: "#1a1a2e",
                            color: "#fff",
                            borderRadius: "12px"
                        }}
                    >

                        My Orders

                    </Link>

                    <Link
                        to="/products"
                        className="btn px-4"
                        style={{
                            background: "#e94560",
                            color: "#fff",
                            borderRadius: "12px"
                        }}
                    >

                        Continue Shopping

                    </Link>

                </div>

            </div>

        </div>

    );

}