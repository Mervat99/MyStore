
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

const categories = [
  "Dresses",
  "Mens",
  "T-Shirt",
  "Kids",
  "Shoes",
  "Jackets",
  "Pants",
  "Accessories",
  "Bags",
  "Sportswear",
  "Watches",
];

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Add product form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");

  // Product filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: "1",
        limit: "50",
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (filterCategory) {
        params.append("category", filterCategory);
      }

      const { data } = await API.get(`/products?${params.toString()}`);

      setProducts(data.products || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while loading products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterCategory("");
    setStockFilter("all");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalCategory =
      category === "Other" ? customCategory.trim() : category;

    if (!finalCategory) {
      setError("Please select or enter a category");
      return;
    }

    try {
      await API.post("/products", {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        image: image.trim(),
        category: finalCategory,
        countInStock: Number(countInStock),
      });

      setName("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");
      setCustomCategory("");
      setCountInStock("");

      fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while adding the product"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await API.delete(`/products/${id}`);

      fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while deleting the product"
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    if (stockFilter === "inStock" && product.countInStock <= 0) {
      return false;
    }

    if (stockFilter === "outOfStock" && product.countInStock > 0) {
      return false;
    }

    if (stockFilter === "lowStock" && product.countInStock > 0 && product.countInStock > 5) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-ink mb-8">
        Product Management
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* Add Product */}
      <div className="bg-card border border-line rounded-2xl p-6 mb-10">
        <h2 className="text-2xl font-semibold text-ink mb-6">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-muted text-sm mb-2">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Description
            </label>

            <textarea
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-muted text-sm mb-2">
                Price
              </label>

              <input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-muted text-sm mb-2">
                Stock
              </label>

              <input
                type="number"
                placeholder="0"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                min="0"
                step="1"
                required
                className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Image URL
            </label>

            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            >
              <option value="">Select category</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}

              <option value="Other">Other</option>
            </select>
          </div>

          {category === "Other" && (
            <div>
              <label className="block text-muted text-sm mb-2">
                Custom Category
              </label>

              <input
                type="text"
                placeholder="Enter your category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
                className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 rounded-lg transition"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Product Filters */}
      <div className="bg-card border border-line rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-semibold text-ink mb-5">
          Find Products
        </h2>

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2 bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
          >
            <option value="all">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>

          <div className="md:col-span-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-surface border border-line hover:border-accent text-ink font-semibold px-6 py-3 rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-line rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-ink">
            All Products
          </h2>

          <span className="text-sm text-muted">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <p className="text-muted text-center py-8">
            Loading products...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-muted text-center py-8">
            No products found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left text-muted text-sm font-medium pb-3">
                    Product
                  </th>

                  <th className="text-left text-muted text-sm font-medium pb-3">
                    Category
                  </th>

                  <th className="text-left text-muted text-sm font-medium pb-3">
                    Price
                  </th>

                  <th className="text-left text-muted text-sm font-medium pb-3">
                    Stock
                  </th>

                  <th className="text-left text-muted text-sm font-medium pb-3">
                    Status
                  </th>

                  <th className="text-left text-muted text-sm font-medium pb-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const stock = Number(product.countInStock || 0);

                  let stockStatus = "In Stock";
                  let stockClass = "bg-green-500/10 text-green-400";

                  if (stock <= 0) {
                    stockStatus = "Out of Stock";
                    stockClass = "bg-red-500/10 text-red-400";
                  } else if (stock <= 5) {
                    stockStatus = "Low Stock";
                    stockClass = "bg-yellow-500/10 text-yellow-400";
                  }

                  return (
                    <tr
                      key={product._id}
                      className="border-b border-line last:border-b-0"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg bg-white"
                          />

                          <span className="text-ink font-medium">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 text-muted">
                        {product.category}
                      </td>

                      <td className="py-4 text-ink font-semibold">
                        ${Number(product.price).toFixed(2)}
                      </td>

                      <td className="py-4 text-ink">
                        {stock}
                      </td>

                      <td className="py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${stockClass}`}
                        >
                          {stockStatus}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

