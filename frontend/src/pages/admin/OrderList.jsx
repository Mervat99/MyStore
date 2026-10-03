import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const STATUS_OPTIONS = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_STYLES = {
  Processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/orders");

      setOrders(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError("");

      const { data } = await API.put(
        `/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? data : order
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchValue = search
      .trim()
      .toLowerCase()
      .replace(/^#/, "");

    const orderId = String(order._id || "").toLowerCase();

    const matchesSearch =
      !searchValue || orderId.includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredTotal = filteredOrders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-muted">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted text-sm">Admin</p>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink mt-1">
            Manage Orders
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-line rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-muted text-sm mb-2">
              Search Orders
            </label>

            <input
              type="text"
              placeholder="Search by order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            >
              <option value="All">All Statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-line">
          <div>
            <p className="text-muted text-xs">Showing</p>
            <p className="text-ink font-semibold">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1
                ? "order"
                : "orders"}
            </p>
          </div>

          <div>
            <p className="text-muted text-xs">
              Filtered Total
            </p>
            <p className="text-accent font-semibold">
              ${filteredTotal.toFixed(2)}
            </p>
          </div>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="text-sm text-accent hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-line rounded-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-muted">
              No orders found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th className="px-4 py-3 font-medium">
                    Order ID
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Customer
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Date
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Total
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-line">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-surface transition"
                  >
                    <td className="px-4 py-4 text-ink font-mono text-xs">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-ink font-medium">
                        {order.user?.name || "Unknown"}
                      </p>

                      <p className="text-muted text-xs mt-1">
                        {order.user?.email || "No email"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-muted">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-4 py-4 text-accent font-semibold">
                      $
                      {Number(
                        order.totalPrice || 0
                      ).toFixed(2)}
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className={`text-xs font-medium border rounded-full px-3 py-1.5 focus:outline-none ${
                          STATUS_STYLES[order.status] ||
                          "bg-surface text-ink border-line"
                        }`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-block bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-lg text-xs font-semibold transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;