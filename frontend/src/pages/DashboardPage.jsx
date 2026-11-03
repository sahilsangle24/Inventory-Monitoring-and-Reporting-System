import { useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import ChartComponent from "../components/ChartComponent";
import LowStockBadge from "../components/LowStockBadge";

import { useProducts } from "../hooks/useProducts";
import { useToast } from "../context/ToastContext";
import { FormatUtils } from "../utilities/FormatUtils";

export default function DashboardPage() {
  const { products, loading, lowStockProducts } = useProducts();
  const toast = useToast();

  const totalValue = products.reduce(
    (total, product) =>
      total + Number(product.quantity || 0) * Number(product.unitPrice || 0),
    0,
  );

  const categoryMap = {};

  products.forEach((product) => {
    const category =
      typeof product.category === "object"
        ? product.category?.name || "Uncategorized"
        : product.category || "Uncategorized";

    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const chartData = Object.entries(categoryMap).map(([label, value]) => ({
    label,
    value,
  }));

  useEffect(() => {
    if (!loading && lowStockProducts.length > 0) {
      toast.warning(
        "Low Stock Alert",
        `${lowStockProducts.length} product${
          lowStockProducts.length > 1 ? "s are" : " is"
        } below reorder level.`,
      );
    }
  }, [loading, lowStockProducts.length]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="page-layout dashboard-layout">
      <Sidebar lowStockCount={lowStockProducts.length} />

      <main className="main-content dashboard-main">
        <Navbar title="Dashboard" lowStockCount={lowStockProducts.length} />

        <div className="page-inner dashboard-page">
          {/* Dashboard heading */}
          <section className="dashboard-heading">
            <div>
              <span className="dashboard-eyebrow">INVENTORY MANAGEMENT</span>

              <h1 className="page-title">Overview</h1>

              <p className="page-subtitle">
                Here's what's happening with your inventory today.
              </p>

              <div className="dashboard-date">
                <span>◷</span> {today}
              </div>
            </div>

            <div className="dashboard-heading-actions">
              <Link to="/products" className="dashboard-secondary-btn">
                View Products
              </Link>

              <Link to="/add-product" className="dashboard-primary-btn">
                <span>＋</span> Add Product
              </Link>
            </div>
          </section>

          {/* Summary cards */}
          <section className="dashboard-stats-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Inventory Summary</h2>
                <p>Key metrics at a glance</p>
              </div>

              <span className="dashboard-live-indicator">
                <span /> LIVE OVERVIEW
              </span>
            </div>

            <div className="summary-grid dashboard-summary-grid">
              <SummaryCard
                label="Total Products"
                value={loading ? "…" : FormatUtils.number(products.length)}
                icon="📦"
                color="accent"
                delay={0}
              />

              <SummaryCard
                label="Inventory Value"
                value={loading ? "…" : FormatUtils.currency(totalValue)}
                icon="₹"
                color="green"
                delay={80}
              />

              <SummaryCard
                label="Low Stock Items"
                value={loading ? "…" : lowStockProducts.length}
                icon="⚠"
                color={lowStockProducts.length > 0 ? "amber" : "green"}
                delay={160}
                trend={
                  lowStockProducts.length > 0 ? (
                    <span className="dashboard-warning-text">
                      ↓ Needs restocking
                    </span>
                  ) : (
                    <span className="dashboard-success-text">
                      ✓ All stocked
                    </span>
                  )
                }
              />

              <SummaryCard
                label="Categories"
                value={loading ? "…" : Object.keys(categoryMap).length}
                icon="🏷"
                color="purple"
                delay={240}
              />
            </div>
          </section>

          {/* Analytics section */}
          <section className="dashboard-analytics-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Inventory Analytics</h2>
                <p>Understand your stock distribution</p>
              </div>
            </div>

            <div className="dash-grid dashboard-analytics-grid">
              {/* Category chart */}
              <div className="dash-panel dashboard-chart-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <span className="dashboard-panel-icon">▥</span>
                    <h3>Products by Category</h3>
                    <p>Product distribution across categories</p>
                  </div>

                  <Link to="/products" className="dashboard-view-link">
                    View all <span>→</span>
                  </Link>
                </div>

                {loading ? (
                  <div className="dashboard-empty-state">
                    Loading inventory analytics...
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="dashboard-empty-state">
                    <span>📊</span>
                    <strong>No inventory data yet</strong>
                    <p>Add products to view category analytics.</p>
                    <Link to="/add-product">Add your first product →</Link>
                  </div>
                ) : (
                  <div className="dashboard-chart-container">
                    <ChartComponent data={chartData} height={240} />
                  </div>
                )}
              </div>

              {/* Low stock panel */}
              <div className="dash-panel dashboard-stock-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <span className="dashboard-panel-icon stock-icon">⚠</span>
                    <h3>Low Stock Alerts</h3>
                    <p>Products that need your attention</p>
                  </div>

                  <span className="dashboard-stock-count">
                    {lowStockProducts.length} items
                  </span>
                </div>

                {loading ? (
                  <div className="dashboard-empty-state">
                    Checking stock levels...
                  </div>
                ) : lowStockProducts.length === 0 ? (
                  <div className="dashboard-stock-empty">
                    <div className="dashboard-stock-success-icon">✓</div>
                    <strong>Everything looks good!</strong>
                    <p>All products are sufficiently stocked.</p>
                  </div>
                ) : (
                  <div className="dashboard-stock-list">
                    {lowStockProducts.slice(0, 6).map((product) => (
                      <div key={product.id} className="dashboard-stock-item">
                        <div className="dashboard-stock-product">
                          <div className="dashboard-product-icon">📦</div>

                          <div className="dashboard-product-details">
                            <strong>{product.name}</strong>
                            <span>
                              {typeof product.category === "object"
                                ? product.category?.name || "Uncategorized"
                                : product.category || "Uncategorized"}
                            </span>
                          </div>
                        </div>

                        <div className="dashboard-stock-status">
                          <span className="dashboard-stock-quantity">
                            {product.quantity}/{product.reorderLevel}
                          </span>

                          <LowStockBadge
                            quantity={product.quantity}
                            reorderLevel={product.reorderLevel}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {lowStockProducts.length > 6 && (
                  <p className="dashboard-more-alerts">
                    + {lowStockProducts.length - 6} more products need attention
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="dashboard-footer">
            <span>InvenTrack Inventory Management</span>
            <span>Manage smarter. Grow faster.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
