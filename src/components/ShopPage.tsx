import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useWooProducts } from "../hooks/useWooProducts";
import { useWooCategories } from "../hooks/useWooCategories";
import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/ShopPage.css";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get("category");
  const activeCatId = activeCat ? Number(activeCat) : undefined;

  const { categories, loading: catsLoading } = useWooCategories();
  const { products, loading, error } = useWooProducts({
    per_page: 50,
    ...(activeCatId ? { category: activeCatId } : {}),
  });
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<number | null>(null);

  const handleAddToCart = async (productId: number) => {
    setAddingId(productId);
    await addToCart(productId);
    setAddingId(null);
  };

  const handleFilter = (categoryId: number | null) => {
    if (categoryId) {
      setSearchParams({ category: String(categoryId) });
    } else {
      setSearchParams({});
    }
  };

  // Find active category name for the heading
  const activeCategoryName = activeCatId
    ? categories.find((c) => c.id === activeCatId)?.name
    : null;

  return (
    <div className="shop-page">
      <Navbar />

      {/* Hero banner */}
      <header className="sp-hero">
        <div className="sp-hero-inner">
          <h1 className="sp-hero-title">
            {activeCategoryName ? activeCategoryName : "Our Collection"}
          </h1>
          <p className="sp-hero-subtitle">
            {activeCategoryName
              ? `Browse our ${activeCategoryName.toLowerCase()} collection`
              : "Discover the essence of luxury — handcrafted fragrances for every soul"}
          </p>
        </div>
      </header>

      <main className="sp-main">
        {/* Category filters */}
        {!catsLoading && categories.length > 0 && (
          <div className="sp-filters">
            <button
              className={`sp-filter-btn ${!activeCatId ? "sp-filter-btn--active" : ""}`}
              onClick={() => handleFilter(null)}
            >
              All
            </button>
            {categories
              .filter((c) => c.count > 0)
              .map((cat) => (
                <button
                  key={cat.id}
                  className={`sp-filter-btn ${activeCatId === cat.id ? "sp-filter-btn--active" : ""}`}
                  onClick={() => handleFilter(cat.id)}
                >
                  {cat.name}
                  <span className="sp-filter-count">{cat.count}</span>
                </button>
              ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="sp-loading">
            <div className="sp-spinner" />
            <p>Loading products…</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="sp-error">
            <p>Could not load products. Please try again later.</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="sp-empty">
            <p>No products found in this category.</p>
            <button
              className="sp-filter-btn sp-filter-btn--active"
              onClick={() => handleFilter(null)}
            >
              View All Products
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <>
            <p className="sp-result-count">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>

            <div className="sp-grid">
              {products.map((p) => (
                <article key={p.id} className="sp-card">
                  <Link to={`/product/${p.slug}`} className="sp-card-link">
                      <div className={`sp-card-arch`}>
                      <img
                        src={p.images[0]?.src ?? "/perfumes/placeholder.png"}
                        alt={p.images[0]?.alt ?? p.name}
                        className="sp-card-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="sp-card-info">
                      {p.categories.length > 0 && (
                        <span className="sp-card-category">
                          {p.categories[0].name}
                        </span>
                      )}
                      <h3 className="sp-card-name">{p.name}</h3>
                      <div className="sp-card-pricing">
                        {p.sale_price && (
                          <span className="sp-card-price-old">
                            AED {p.regular_price}
                          </span>
                        )}
                        <span className="sp-card-price">AED {p.price}</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="shop-card-btn"
                    onClick={() => handleAddToCart(p.id)}
                    disabled={p.stock_status !== "instock" || addingId === p.id}
                  >
                    {addingId === p.id
                      ? "Adding…"
                      : p.stock_status !== "instock"
                        ? "Out of Stock"
                        : "Add to Cart"}
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
