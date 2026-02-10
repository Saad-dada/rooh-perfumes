import "../styles/Testimonial.css";

const Testimonial = () => {
  return (
    <section id="testimonial" className="sec sec-testimonial sec-decorated">
      <div className="sec-inner narrow">
        <p className="sec-label">What people say</p>
        <h2 className="sec-title">Testimonial</h2>
        <div className="testimonial-decor cat-header-image">
          <img src="/elements/7.png" alt="" />
        </div>
        <blockquote className="quote-card">
          <p>
            "Perfume is the art of memory. Every scent I wear connects me to a
            moment, a place, a feeling I never want to forget."
          </p>
          <footer>
            <div className="quote-avatar" />
            <div>
              <strong>Sarah Mitchell</strong>
              <span>Fragrance Curator</span>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
};

export default Testimonial;
