import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useWooProducts } from "../hooks/useWooProducts";
import { useWooCategories } from "../hooks/useWooCategories";
import { useCart } from "../context/CartContext";
import { getProductVolume, isComingSoon } from '../lib/productUtils';
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/ShopPage.css";
import "../styles/ShopGrid.css";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get("category");
  const activeCatId = activeCat ? Number(activeCat) : undefined;

  const { categories, loading: catsLoading } = useWooCategories();
  const { products, loading, error, retry } = useWooProducts({
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
            <p>{error}</p>
            <button className="sp-filter-btn sp-filter-btn--active" onClick={retry}>
              Retry
            </button>
            {import.meta.env.DEV && (
              <pre className="sp-error-details" style={{whiteSpace: 'pre-wrap'}}>{error}</pre>
            )}
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
              {[...products].slice().reverse().map((p) => {
                const isSahara = isComingSoon(p)
                const volume = getProductVolume(p)
                return (
                <article key={p.id} className={`sp-card${isSahara ? ' sp-card--coming-soon' : ''}`}>
                  {isSahara ? (
                    <div className="sp-card-link">
                      <div className="shop-card-arch">
                        <img src={p.images[0]?.src ?? "/perfumes/placeholder.png"} alt={p.images[0]?.alt ?? p.name} className="shop-card-img shop-card-img--front" loading="lazy" />
                        {p.images.length > 1 && <img src={p.images[p.images.length - 1].src} alt={p.images[p.images.length - 1].alt ?? p.name} className="shop-card-img shop-card-img--back" loading="lazy" />}
                      </div>
                      <div className="shop-card-info">
                        {p.categories.length > 0 && <span className="sp-card-category">{p.categories[0].name}</span>}
                        <h4 className="shop-card-name">{p.name}</h4>
                        <div className="shop-card-pricing">
                          {p.sale_price && <span className="shop-card-price-old">AED {p.regular_price}</span>}
                          <span className="shop-card-price">AED {p.price}</span>
                          {volume && <span className="shop-card-volume">{volume}</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                  <Link to={`/product/${p.slug}`} className="sp-card-link">
                      <div className="shop-card-arch">
                      <img
                        src={p.images[0]?.src ?? "/perfumes/placeholder.png"}
                        alt={p.images[0]?.alt ?? p.name}
                        className="shop-card-img shop-card-img--front"
                        loading="lazy"
                      />
                      {p.images.length > 1 && (
                        <img
                          src={p.images[p.images.length - 1].src}
                          alt={p.images[p.images.length - 1].alt ?? p.name}
                          className="shop-card-img shop-card-img--back"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="shop-card-info">
                      {p.categories.length > 0 && (
                        <span className="sp-card-category">
                          {p.categories[0].name}
                        </span>
                      )}
                      <h4 className="shop-card-name">{p.name}</h4>
                      <div className="shop-card-pricing">
                        {p.sale_price && (
                          <span className="shop-card-price-old">
                            AED {p.regular_price}
                          </span>
                        )}
                        <span className="shop-card-price">AED {p.price}</span>
                        {volume && <span className="shop-card-volume">{volume}</span>}
                      </div>
                    </div>
                  </Link>
                  )}
                  <button
                    className="shop-card-btn"
                    onClick={() => { if (!isSahara) handleAddToCart(p.id) }}
                    data-stock={isSahara ? 'out' : (p.stock_status !== undefined && p.stock_status !== 'instock' ? 'out' : 'in')}
                    disabled={isSahara || p.stock_status !== "instock" || addingId === p.id}
                  >
                    {isSahara ? "Coming Soon" : addingId === p.id ? "Adding…" : p.stock_status !== "instock" ? "Coming Soon" : "Add to Cart"}
                  </button>
                </article>
                )
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
