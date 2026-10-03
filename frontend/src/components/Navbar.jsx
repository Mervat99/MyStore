import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

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

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const activeCategory =
    location.pathname === "/"
      ? searchParams.get("category") || ""
      : "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAllProducts = () => {
    navigate("/");

    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);
  };

  const handleCategoryClick = (category) => {
    navigate(
      `/?category=${encodeURIComponent(category)}`
    );

    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 250);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-line">
      {/* =========================
          Main Navbar
      ========================= */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-2xl font-bold text-ink hover:no-underline shrink-0"
          >
            MyStore
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-5">

            {/* AI Assistant */}
            <Link
              to="/ai-assistant"
              className="flex items-center gap-1.5 text-ink text-sm font-medium hover:text-accent transition-colors"
            >
              <span className="text-base">
                ✨
              </span>

              <span className="hidden sm:inline">
                AI Assistant
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center text-ink hover:text-accent transition-colors"
              aria-label="Shopping cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.75 15.75a2.25 2.25 0 002.19 1.75h7.12a2.25 2.25 0 002.19-1.75l1.44-6.75H5.106zm0 0h13.788M9 20.25h.008v.008H9v-.008zm6 0h.008v.008H15v-.008z"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {userInfo ? (
              <>
                <Link
                  to="/orders"
                  className="text-ink text-sm font-medium hover:text-accent transition-colors"
                >
                  My Orders
                </Link>

                {userInfo.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-ink text-sm font-medium hover:text-accent transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                <span className="hidden md:block text-muted text-sm">
                  Hi, {userInfo.name}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-ink text-sm font-medium hover:text-accent transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          Category Navbar
      ========================= */}
      <div className="border-t border-line bg-card">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex justify-center overflow-x-auto">
            <div className="flex items-center justify-center gap-x-7 min-w-max py-3">

              {/* All Products */}
              <button
                type="button"
                onClick={handleAllProducts}
                className={`relative py-1 text-sm font-semibold transition-colors duration-200 ${
                  !activeCategory
                    ? "text-accent"
                    : "text-ink hover:text-accent"
                }`}
              >
                All Products

                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-accent transition-all duration-300 ${
                    !activeCategory
                      ? "w-full"
                      : "w-0"
                  }`}
                />
              </button>

              {/* Categories */}
              {categories.map((category) => {
                const isActive =
                  activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      handleCategoryClick(category)
                    }
                    className={`relative py-1 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? "text-accent"
                        : "text-ink hover:text-accent"
                    }`}
                  >
                    {category}

                    <span
                      className={`absolute left-0 -bottom-1 h-0.5 bg-accent transition-all duration-300 ${
                        isActive
                          ? "w-full"
                          : "w-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;