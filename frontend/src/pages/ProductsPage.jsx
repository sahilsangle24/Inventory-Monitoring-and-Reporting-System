import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";

import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";

import "../styles/inventory.css";

export default function ProductsPage() {
  const { products, loading, error, editProduct, deleteProduct } =
    useProducts();

  const { hasRole } = useAuth();

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // Search and filter products
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return products;

    return products.filter((p) =>
      [p.name, p.sku, p.category, p.supplier].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [products, query]);

  // Permissions
  const canEdit = hasRole("ADMIN") || hasRole("SUPPLIER");
  const canDelete = hasRole("ADMIN");

  // Update product
  const handleSave = async (data) => {
    if (!editing?.id) return;

    setSaving(true);

    try {
      await editProduct(editing.id, data);

      setEditing(null);

      alert("Product updated successfully!");
    } catch (err) {
      console.error("Update product error:", err);

      alert(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Failed to update product",
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (product) => {
    if (!product?.id) return;

    const confirmed = window.confirm(`Delete "${product.name}"?`);

    if (!confirmed) return;

    try {
      await deleteProduct(product.id);

      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Delete product error:", err);

      alert("Failed to delete product.");
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar title="Products" />

        <div className="page-inner fade-up">
          <h1 className="page-title">Products</h1>

          <p className="page-subtitle">
            Manage your product catalog, stock and pricing.
          </p>

          {/* Search and Add Product */}

          <div className="inventory-toolbar">
            <div className="search-box">
              <span className="search-icon">🔎</span>

              <input
                type="text"
                placeholder="Search by name, SKU, category, supplier..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {(hasRole("ADMIN") || hasRole("SUPPLIER")) && (
              <Link to="/add-product" className="btn btn-primary">
                + Add Product
              </Link>
            )}
          </div>

          {/* Error Message */}

          {error && (
            <div
              className="empty-state"
              style={{
                padding: "20px 16px",
                marginBottom: 16,
              }}
            >
              <h3>Unable to load products</h3>

              <p>{error}</p>
            </div>
          )}

          {/* Product Table */}

          <ProductTable
            products={filtered}
            loading={loading}
            onEdit={setEditing}
            onDelete={handleDelete}
            canEdit={canEdit}
            canDelete={canDelete}
          />

          {/* Edit Product Form */}

          {editing && (
            <div style={{ marginTop: 24 }}>
              <h2 style={{ marginBottom: 12 }}>Edit Product</h2>

              <ProductForm
                key={editing.id}
                initial={editing}
                onSubmit={handleSave}
                onCancel={() => setEditing(null)}
                loading={saving}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
