"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [totalProducts, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homeProducts, setHomeProducts] = useState([]);
  const [loadingHome, setLoadingHome] = useState(true);
  const [greenKartProducts, setGreenKartProducts] = useState([]);
  const [loadingGreenKart, setLoadingGreenKart] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeProducts = async () => {
    setLoadingHome(true);
    try {
      const res = await axios.get("/api/products/home");
      setHomeProducts(res.data.products);
    } catch (err) {
      console.error("Home products fetch failed", err);
    } finally {
      setLoadingHome(false);
    }
  };

  const fetchGreenKartProducts = async () => {
    setLoadingGreenKart(true);
    try {
      const res = await axios.get("/api/products/green-kart");
      setGreenKartProducts(res.data.products);
    } catch (error) {
      console.error("Failed to fetch GreenKart products:", error.message);
    } finally {
      setLoadingGreenKart(false);
    }
  };


  useEffect(() => {
    fetchHomeProducts(); // fetch only 100 for fast load
    fetchGreenKartProducts(); // fetch organic-only products

    const timer = setTimeout(() => {
      fetchProducts(); // fetch all 22k in background
    }, 1500);

    return () => clearTimeout(timer);
  }, []);


  const organicProducts = totalProducts.filter(product => product.isOrganic);
  console.log("organic product", organicProducts);
  return (
    <ProductContext.Provider value={{ totalProducts, loading, refetch: fetchProducts, organicProducts, homeProducts, loadingHome, greenKartProducts, loadingGreenKart }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
