import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../store/slices/uiSlice";

export default function ToastWrapper() {
    const dispatch = useDispatch();
    const { toast: toastState } = useSelector((state) => state.ui);

    useEffect(() => {
        if (toastState.show) {
            const toastFn = toast[toastState.type] || toast.info;
            toastFn(toastState.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            dispatch(hideToast());
        }
    }, [toastState.show, toastState.message, toastState.type, dispatch]);

    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
}
