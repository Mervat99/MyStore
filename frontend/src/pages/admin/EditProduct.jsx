import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios.js";

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

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    countInStock: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get(`/products/${id}`);

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? "",
          image: data.image || "",
          category: data.category || "",
          countInStock: data.countInStock ?? "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while loading the product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await API.put(`/products/${id}`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
        category: formData.category,
        countInStock: Number(formData.countInStock),
      });

      toast.success("Product updated successfully");

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while updating the product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="animate-pulse">
          <div className="h-8 w-52 bg-card rounded mb-8" />
          <div className="h-96 bg-card border border-line rounded-xl" />
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-card border border-line rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-ink">
            Unable to load product
          </h1>

          <p className="text-muted mt-3">{error}</p>

          <Link
            to="/admin/products"
            className="inline-block mt-6 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-muted text-sm">Admin</p>

          <h1 className="font-display text-3xl font-bold text-ink mt-1">
            Edit Product
          </h1>
        </div>

        <Link
          to="/admin/products"
          className="text-accent hover:underline text-sm font-medium"
        >
          Back to Products
        </Link>
      </div>

      <div className="bg-card border border-line rounded-xl p-6">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-muted text-sm mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
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
                name="price"
                value={formData.price}
                onChange={handleChange}
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
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
                required
                className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          {formData.image && (
            <div>
              <p className="text-muted text-sm mb-2">
                Image Preview
              </p>

              <img
                src={formData.image}
                alt={formData.name}
                className="w-32 h-32 object-cover rounded-lg border border-line"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 rounded-lg border border-line text-ink hover:bg-surface transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;