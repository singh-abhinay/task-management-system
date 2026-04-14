import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalOpen: false,
    modalType: null,
    toast: {
        show: false,
        message: "",
        type: "success",
    },
    sidebarOpen: true,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isModalOpen = true;
            state.modalType = action.payload;
        },

        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalType = null;
        },

        showToast: (state, action) => {
            state.toast = {
                show: true,
                message: action.payload.message,
                type: action.payload.type || "success",
            };
        },

        hideToast: (state) => {
            state.toast.show = false;
            state.toast.message = "";
        },

        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
    },
});

export const { openModal, closeModal, showToast, hideToast, toggleSidebar } =
    uiSlice.actions;
export default uiSlice.reducer;
