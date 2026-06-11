import { useEffect } from "react";









export default function PaymentFailed() {
    useEffect(() => {

        localStorage.removeItem("pendingOrder");

    }, []);
    return (

        <div
            className="container py-5 text-center"
        >

            <div
                className="bg-white shadow-sm rounded-4 p-5"
            >

                <h1 className="text-danger mb-3">

                    Payment Failed ❌

                </h1>

                <p className="text-muted">

                    Your payment was not completed.

                </p>

                <a
                    href="/checkout"
                    className="btn btn-danger mt-3"
                >

                    Try Again

                </a>

            </div>

        </div>

    );

}