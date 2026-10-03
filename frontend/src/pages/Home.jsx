import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../api/axios.js";
import ProductCard from "../components/ProductCard";

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

const heroSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80",
    title: "Discover Your Style",
    description:
      "Explore our latest collection and find something made for you.",
    button: "Shop Now",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=80",
    title: "New Season Collection",
    description:
      "Fresh looks, modern styles, and timeless essentials.",
    button: "Explore Collection",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1600&q=80",
    title: "Style For Everyone",
    description:
      "Find fashion pieces for every moment and every occasion.",
    button: "View Products",
  },
];

const categoryImages = {
  Dresses:
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",

  Mens:
    "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",

  "T-Shirt":
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",

  Kids:
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80",

  Shoes:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",

  Jackets:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",

  Pants:
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",

  Accessories:
    "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=800&q=80",

  Bags:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",

  Sportswear:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",

  Watches:
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
};

const ProductSkeleton = () => {
  return (
    <div className="bg-card border border-line rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-72 bg-surface" />

      <div className="px-4 py-3">
        <div className="h-3 w-16 bg-surface rounded mb-2" />

        <div className="h-5 w-3/4 bg-surface rounded" />

        <div className="mt-2 space-y-1">
          <div className="h-3 w-full bg-surface rounded" />
          <div className="h-3 w-2/3 bg-surface rounded" />
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="h-5 w-20 bg-surface rounded" />
          <div className="h-3 w-16 bg-surface rounded" />
        </div>

        <div className="h-9 w-full bg-surface rounded-lg mt-3" />
      </div>
    </div>
  );
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentSlide, setCurrentSlide] = useState(0);

  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [error, setError] = useState("");

  const productsPerPage = 9;

  // ==========================================
  // Sync category with URL
  // ==========================================
  useEffect(() => {
    const urlCategory =
      searchParams.get("category") || "";

    setCategory(urlCategory);
    setPage(1);
  }, [searchParams]);

  // ==========================================
  // Debounce Search
  // ==========================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================
  // Hero Slider
  // ==========================================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previousSlide) =>
        previousSlide === heroSlides.length - 1
          ? 0
          : previousSlide + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // Fetch Main Products
  // ==========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", productsPerPage);

        if (debouncedSearch.trim()) {
          params.append(
            "search",
            debouncedSearch.trim()
          );
        }

        if (category) {
          params.append("category", category);
        }

        if (sort) {
          params.append("sort", sort);
        }

        const { data } = await API.get(
          `/products?${params.toString()}`
        );

        setProducts(data.products || []);
        setPages(data.pages || 1);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while loading products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    debouncedSearch,
    category,
    sort,
  ]);

  // ==========================================
  // Fetch Featured Products
  // ==========================================
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setFeaturedLoading(true);

        const { data } = await API.get(
          "/products?page=1&limit=4&sort=newest"
        );

        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error(
          "Featured products error:",
          err
        );
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // ==========================================
  // Update Category
  // ==========================================
  const updateCategory = (selectedCategory) => {
    if (selectedCategory) {
      setSearchParams({
        category: selectedCategory,
      });
    } else {
      setSearchParams({});
    }

    setSearch("");
    setDebouncedSearch("");
    setSort("");
    setPage(1);
  };

  // ==========================================
  // Search
  // ==========================================
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // ==========================================
  // Category Select
  // ==========================================
  const handleCategoryChange = (e) => {
    updateCategory(e.target.value);

    // When category is selected from the filter,
    // scroll to products.
    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);
  };

  // ==========================================
  // Sort
  // ==========================================
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  // ==========================================
  // Category Card
  // ==========================================
  const handleCategoryClick = (selectedCategory) => {
    updateCategory(selectedCategory);

    // This is for the category cards on Home.
    // Navbar uses the same products-section target.
    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);
  };

  // ==========================================
  // Previous Page
  // ==========================================
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);

      setTimeout(() => {
        document
          .getElementById("products-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 50);
    }
  };

  // ==========================================
  // Next Page
  // ==========================================
  const handleNext = () => {
    if (page < pages) {
      setPage(page + 1);

      setTimeout(() => {
        document
          .getElementById("products-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 50);
    }
  };

  // ==========================================
  // Page Change
  // ==========================================
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);

    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  // ==========================================
  // Clear Filters
  // ==========================================
  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSort("");
    setPage(1);
    setSearchParams({});
  };

  // ==========================================
  // Hero Previous
  // ==========================================
  const handlePreviousSlide = () => {
    setCurrentSlide((previousSlide) =>
      previousSlide === 0
        ? heroSlides.length - 1
        : previousSlide - 1
    );
  };

  // ==========================================
  // Hero Next
  // ==========================================
  const handleNextSlide = () => {
    setCurrentSlide((previousSlide) =>
      previousSlide === heroSlides.length - 1
        ? 0
        : previousSlide + 1
    );
  };

  // ==========================================
  // Hero Slide Change
  // ==========================================
  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  // ==========================================
  // View All
  // ==========================================
  const handleViewAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setSort("newest");
    setPage(1);
    setSearchParams({});

    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);
  };

  // ==========================================
  // Error
  // ==========================================
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="bg-card border border-line rounded-2xl p-10">
          <h2 className="text-2xl font-semibold text-ink">
            Something went wrong
          </h2>

          <p className="text-muted mt-3">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* ==========================================
          Space between navbar and hero
      ========================================== */}
      <div className="h-3" />

      {/* ==========================================
          HERO
      ========================================== */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative h-[500px] md:h-[550px] rounded-3xl overflow-hidden">

          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-xl px-8 md:px-14 text-white">

              <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-4 text-white/80">
                Welcome to MyStore
              </p>

              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="mt-5 text-base md:text-lg text-white/80 max-w-md">
                {heroSlides[currentSlide].description}
              </p>

              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("products-section")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className="mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all hover:-translate-y-0.5"
              >
                {heroSlides[currentSlide].button}
              </button>

            </div>
          </div>

          {/* Previous */}
          <button
            type="button"
            onClick={handlePreviousSlide}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
            aria-label="Previous slide"
          >
            ←
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={handleNextSlide}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
            aria-label="Next slide"
          >
            →
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleSlideChange(index)
                }
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${
                  index + 1
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          CATEGORIES
      ========================================== */}
      <section className="max-w-6xl mx-auto px-6 py-14">

        <div className="mb-7">
          <p className="text-accent text-sm font-medium uppercase tracking-wider">
            Explore
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-ink mt-2">
            Shop by Category
          </h2>

          <p className="text-muted mt-2">
            Find the style that fits you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          {categories.slice(0, 8).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                handleCategoryClick(item)
              }
              className="group relative h-40 md:h-48 rounded-2xl overflow-hidden text-left"
            >

              <img
                src={categoryImages[item]}
                alt={item}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

              <div className="relative z-10 h-full flex items-end p-5">
                <div>

                  <h3 className="text-white text-lg md:text-xl font-semibold">
                    {item}
                  </h3>

                  <span className="text-white/80 text-sm mt-1 inline-block">
                    Shop now →
                  </span>

                </div>
              </div>

            </button>
          ))}

        </div>
      </section>

      {/* ==========================================
          FEATURED / NEW ARRIVALS
      ========================================== */}
      <section className="max-w-6xl mx-auto px-6 pb-14">

        <div className="flex justify-between items-end mb-7">

          <div>

            <p className="text-accent text-sm font-medium uppercase tracking-wider">
              Featured
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-ink mt-2">
              New Arrivals
            </h2>

            <p className="text-muted mt-2">
              Discover some of our latest products.
            </p>

          </div>

          <button
            type="button"
            onClick={handleViewAll}
            className="hidden sm:block text-accent hover:text-accent-dark font-medium transition"
          >
            View all →
          </button>

        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <ProductSkeleton key={index} />
              )
            )}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>
        ) : (
          <p className="text-muted text-center py-10">
            No products available yet.
          </p>
        )}

      </section>

      {/* ==========================================
          AI ASSISTANT
      ========================================== */}
      <section className="max-w-6xl mx-auto px-6 pb-14">

        <div className="relative overflow-hidden rounded-3xl bg-card border border-line p-8 md:p-12">

          <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl">

            <p className="text-accent text-sm font-medium uppercase tracking-wider">
              MyStore AI
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-ink mt-2">
              Not sure what to choose?
            </h2>

            <p className="text-muted mt-4 leading-7">
              Tell our AI Shopping Assistant what
              you're looking for, your preferred style,
              or your budget, and it can help you
              discover products from our catalog.
            </p>

            <Link
              to="/ai-assistant"
              className="inline-flex mt-7 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Ask MyStore AI →
            </Link>

          </div>

          <div className="absolute right-10 bottom-8 hidden md:block text-7xl opacity-20">
            ✨
          </div>

        </div>
      </section>

      {/* ==========================================
          WHY MYSTORE
      ========================================== */}
      <section className="bg-card border-y border-line">

        <div className="max-w-6xl mx-auto px-6 py-14">

          <div className="text-center mb-10">

            <p className="text-accent text-sm font-medium uppercase tracking-wider">
              Why MyStore
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-ink mt-2">
              Shopping made simple
            </h2>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="text-center">
              <div className="text-3xl mb-4">
                🚚
              </div>

              <h3 className="text-ink font-semibold text-lg">
                Easy Shopping
              </h3>

              <p className="text-muted text-sm mt-2 leading-6">
                Browse products and find what you need
                with simple search and filters.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-4">
                🔒
              </div>

              <h3 className="text-ink font-semibold text-lg">
                Secure Account
              </h3>

              <p className="text-muted text-sm mt-2 leading-6">
                Your account and orders are protected
                with secure authentication.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-4">
                🛍️
              </div>

              <h3 className="text-ink font-semibold text-lg">
                Curated Products
              </h3>

              <p className="text-muted text-sm mt-2 leading-6">
                Explore products across different
                categories and styles.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-4">
                ✨
              </div>

              <h3 className="text-ink font-semibold text-lg">
                AI Assistance
              </h3>

              <p className="text-muted text-sm mt-2 leading-6">
                Get personalized product suggestions
                with MyStore AI.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          PRODUCTS
      ========================================== */}
      <div
        id="products-section"
        className="max-w-6xl mx-auto px-6 py-14 scroll-mt-32"
      >

        <div className="mb-8">

          <p className="text-accent text-sm font-medium uppercase tracking-wider">
            Browse
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-ink mt-2">
            {category
              ? `${category} Products`
              : "Our Products"}
          </h2>

          <p className="text-muted mt-2">
            Search, filter, and explore our full
            collection.
          </p>

        </div>

        {/* Filters */}
        <div className="bg-card border border-line rounded-2xl p-5 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div>

              <label className="block text-muted text-sm mb-2">
                Search
              </label>

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
              />

            </div>

            {/* Category */}
            <div>

              <label className="block text-muted text-sm mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
              >
                <option value="">
                  All Categories
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>

            </div>

            {/* Sort */}
            <div>

              <label className="block text-muted text-sm mb-2">
                Sort By
              </label>

              <select
                value={sort}
                onChange={handleSortChange}
                className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
              >
                <option value="">
                  Default
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>
              </select>

            </div>

          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {Array.from({
              length: productsPerPage,
            }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}

          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">

            <div className="text-5xl mb-5">
              🛍️
            </div>

            <h3 className="text-2xl font-semibold text-ink">
              No products found
            </h3>

            <p className="text-muted mt-2 max-w-md mx-auto">
              We couldn't find any products matching
              your search or filters.
            </p>

            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-6 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}

            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-line text-ink hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                {Array.from(
                  { length: pages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() =>
                      handlePageChange(pageNumber)
                    }
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      page === pageNumber
                        ? "bg-accent text-white"
                        : "border border-line text-ink hover:bg-card"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={page === pages}
                  className="px-4 py-2 rounded-lg border border-line text-ink hover:bg-card disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>

              </div>
            )}

          </>
        )}

      </div>

    </div>
  );
};

export default Home;