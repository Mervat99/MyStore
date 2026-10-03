
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios.js";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while loading your orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-400";

      case "Cancelled":
        return "bg-red-500/10 text-red-400";

      case "Shipped":
        return "bg-blue-500/10 text-blue-400";

      default:
        return "bg-yellow-500/10 text-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-ink mb-8">
          My Orders
        </h1>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-card border border-line rounded-xl p-5 animate-pulse"
            >
              <div className="h-5 bg-surface rounded w-32 mb-4" />
              <div className="h-4 bg-surface rounded w-48 mb-2" />
              <div className="h-4 bg-surface rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-card border border-line rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-ink">
            Unable to load orders
          </h1>

          <p className="text-muted mt-3">{error}</p>

          <Link
            to="/"
            className="inline-block mt-6 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-accent text-sm uppercase tracking-wider font-medium">
          Account
        </p>

        <h1 className="font-display text-3xl font-bold text-ink mt-2">
          My Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border border-line rounded-xl p-10 text-center">
          <div className="text-5xl mb-4">📦</div>

          <h2 className="text-xl font-semibold text-ink">
            You don't have any orders yet
          </h2>

          <p className="text-muted mt-2">
            Start shopping and your orders will appear here.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-card border border-line rounded-xl p-5 hover:border-accent transition"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-5 items-center">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-muted text-xs uppercase tracking-wider">
                    Order
                  </p>

                  <h2 className="text-ink font-semibold mt-1 truncate">
                    #{order._id.slice(-6)}
                  </h2>

                  <p className="text-muted text-xs mt-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs uppercase tracking-wider">
                    Total
                  </p>

                  <p className="text-accent font-bold text-lg mt-1">
                    ${Number(order.totalPrice).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-xs uppercase tracking-wider">
                    Status
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status || "Processing"}
                  </span>
                </div>

                <div>
                  <p className="text-muted text-xs uppercase tracking-wider">
                    Items
                  </p>

                  <p className="text-ink font-medium mt-1">
                    {order.orderItems?.reduce(
                      (total, item) => total + item.qty,
                      0
                    ) || 0}
                  </p>
                </div>

                <div className="col-span-2 md:col-span-1 md:text-right">
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-block bg-surface border border-line text-ink hover:text-accent hover:border-accent px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

