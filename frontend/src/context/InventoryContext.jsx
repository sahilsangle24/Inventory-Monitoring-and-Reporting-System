import { createContext, useContext, useState, useCallback } from "react";
import api from "../utilities/ApiUtils";

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get("/api/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add product
  const addProduct = async (product) => {
    const data = await api.post("/api/product", product);
    await fetchProducts();
    return data;
  };

  // Update product
  const updateProduct = async (id, product) => {
    const data = await api.put(`/api/product/${id}`, product);
    await fetchProducts();
    return data;
  };

  // Delete product
  const deleteProduct = async (id) => {
    await api.delete(`/api/product/${id}`);
    await fetchProducts();
  };

  const getLowStock = () =>
    products.filter((p) => p.quantity <= p.reorderLevel);

  return (
    <InventoryContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getLowStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventoryContext = () => useContext(InventoryContext);
