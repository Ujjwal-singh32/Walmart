"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useUser();
    const [cartItems, setCartItems] = useState([]);

    const userId = user?.id;

    // Load cart from localStorage when user changes
    useEffect(() => {
        if (!userId) return;
        const stored = localStorage.getItem(`cart-${userId}`);
        if (stored) setCartItems(JSON.parse(stored));
        else setCartItems([]);
    }, [userId]);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (userId) {
            localStorage.setItem(`cart-${userId}`, JSON.stringify(cartItems));
        }
    }, [cartItems, userId]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            console.log("existing", existing);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        if (userId) {
            localStorage.removeItem(`cart-${userId}`);
        }
        setCartItems([]);
    };

    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const increaseQuantity = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    console.log("total price",  getTotalPrice);
    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, clearCart, total, increaseQuantity, decreaseQuantity, getTotalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);