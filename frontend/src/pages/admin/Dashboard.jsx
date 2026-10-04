import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    pendingOrders: 0,
    totalSales: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          API.get("/products"),
          API.get("/orders"),
        ]);

        const orders = ordersRes.data;

        const totalSales = orders.reduce(
          (sum, order) => sum + Number(order.totalPrice || 0),
          0
        );

        const pendingOrders = orders.filter(
          (order) => order.status === "Processing"
        ).length;

        setStats({
          productCount: productsRes.data.totalProducts || 0,
          orderCount: orders.length,
          pendingOrders,
          totalSales,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
        console.error("Response:", err.response);
        console.error("Response data:", err.response?.data);
        console.error("Status:", err.response?.status);
        console.error("Message:", err.message);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard stats"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-muted">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-ink mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-line rounded-xl p-6">
          <p className="text-sm text-muted font-medium mb-1">
            Total Products
          </p>
          <p className="font-display text-4xl font-bold text-ink mb-3">
            {stats.productCount}
          </p>
          <Link
            to="/admin/products"
            className="text-sm text-accent font-medium hover:underline"
          >
            Manage Products →
          </Link>
        </div>

        <div className="bg-card border border-line rounded-xl p-6">
          <p className="text-sm text-muted font-medium mb-1">
            Total Orders
          </p>
          <p className="font-display text-4xl font-bold text-ink mb-3">
            {stats.orderCount}
          </p>
          <Link
            to="/admin/orders"
            className="text-sm text-accent font-medium hover:underline"
          >
            Manage Orders →
          </Link>
        </div>

        <div className="bg-card border border-line rounded-xl p-6">
          <p className="text-sm text-muted font-medium mb-1">
            Pending Orders
          </p>
          <p className="font-display text-4xl font-bold text-ink mb-3">
            {stats.pendingOrders}
          </p>
          <Link
            to="/admin/orders"
            className="text-sm text-accent font-medium hover:underline"
          >
            View Orders →
          </Link>
        </div>

        <div className="bg-accent-light border border-accent/20 rounded-xl p-6">
          <p className="text-sm text-accent-dark font-medium mb-1">
            Total Sales
          </p>
          <p className="font-display text-4xl font-bold text-accent-dark">
            ${stats.totalSales.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;