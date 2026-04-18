import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import "../styles/TermsAndConditionPage.css";
import "../styles/AboutPage.css";

const TermsAndConditionPage = () => {
	useEffect(() => {
		const elements = Array.from(document.querySelectorAll<HTMLElement>(".terms-reveal"));
		if (elements.length === 0) return;
		const observer = new window.IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
		);
		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);

	return (
		<div className="about-page">
			<Navbar />
			<main className="about-main">
				<section className="terms-container terms-reveal">
					<h1>Terms and Conditions</h1>
					<p>These Terms and Conditions govern the use of the Rooh Perfumes website and the purchase of products through this website.</p>
					<p>By accessing or using this website, you agree to be bound by these Terms and Conditions.</p>

					<h2>Products and Pricing</h2>
					<p>All products displayed on this website are subject to availability. Prices listed on the website may change without prior notice.</p>

					<h2>Orders</h2>
					<p>An order is considered confirmed once payment has been successfully processed. Rooh Perfumes reserves the right to cancel or refuse any order at its discretion.</p>

					<h2>Payments</h2>
					<p>Payments are processed securely through Razorpay. Rooh Perfumes does not store any payment card information.</p>

					<h2>Liability</h2>
					<p>Rooh Perfumes is not responsible for delays caused by courier services or circumstances beyond our control.</p>

					<h2>Business Information</h2>
					<p>Rooh Perfumes is a brand owned by RB Trading – F.Z.E, Ajman Free Zone, United Arab Emirates.</p>

					<p>Use of this website indicates acceptance of these Terms and Conditions.</p>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default TermsAndConditionPage;
