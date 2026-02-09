import '../styles/FloralAccents.css'

/**
 * Decorative flower PNGs placed at key positions matching the reference.
 * Images: 1=saffron/yellow, 2=coral lily, 3=red poppies, 4=red flower, 5=orange hibiscus
 */

/* Hero  saffron cluster top-right, red stem bottom-left */
export const HeroFloral = () => (
  <>
    <img src="/elements/1.png" alt="" className="floral floral-hero-tr" aria-hidden />
  </>
)

/* After ShopByCategory  tall coral lily on the right and left */
export const FloralDividerA = () => (
  <div className="floral-divider">
    <img src="/elements/2.png" alt="" className="floral floral-div-a-right" aria-hidden />
    <img src="/elements/2.png" alt="" className="floral floral-div-a-left" aria-hidden />
  </div>
)

/* Popular section  lily top-right, red flower bottom-left */
export const PopularFloral = () => (
  <>
    <img src="/elements/3.png" alt="" className="floral floral-pop-tr" aria-hidden />
    <img src="/elements/4.png" alt="" className="floral floral-pop-bl" aria-hidden />
    <img src="/elements/4.png" alt="" className="floral floral-pop-bl-1" aria-hidden />
  </>
)

/* ShopGrid  orange left, poppies right */
export const ShopGridFloral = () => (
  <>
    <img src="/elements/5.png" alt="" className="floral floral-shop-left" aria-hidden />
    <img src="/elements/4.png" alt="" className="floral floral-shop-right" aria-hidden />
  </>
)

/* Testimonial  red poppies bottom-right */
export const TestimonialFloral = () => (
  <>
    <img src="/elements/3.png" alt="" className="floral floral-testimonial-br-1" aria-hidden />
    <img src="/elements/2.png" alt="" className="floral floral-testimonial-br" aria-hidden />
  </>
)

/* Newsletter  saffron flower cluster top-left */
export const NewsletterFloral = () => (
  <>
    <img src="/elements/5.png" alt="" className="floral floral-newsletter-tl" aria-hidden />
  </>
)
