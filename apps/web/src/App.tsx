import { useEffect, useState } from "react";
import { Architecture } from "./components/Architecture";
import { Footer } from "./components/Footer";
import { FaqSection } from "./components/FaqSection";
import { Header } from "./components/Header";
import { IntegrationSection } from "./components/IntegrationSection";
import { ProblemSection } from "./components/ProblemSection";
import { ProductShowcase } from "./components/ProductShowcase";
import { ProofStreamStory } from "./components/ProofStreamStory";
import { ProofLab } from "./components/ProofLab";
import { ProofLabHero } from "./components/proof-lab/ProofLabHero";
import { SponsorFit } from "./components/SponsorFit";

function currentPage() {
  if (window.location.hash === "#/proof-lab" || window.location.pathname === "/proof-lab") {
    return "proof-lab";
  }

  return "landing";
}

export function App() {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    const updatePage = () => setPage(currentPage());

    window.addEventListener("hashchange", updatePage);
    window.addEventListener("popstate", updatePage);

    return () => {
      window.removeEventListener("hashchange", updatePage);
      window.removeEventListener("popstate", updatePage);
    };
  }, []);

  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -90px 0px",
        threshold: 0.14,
      },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [page]);

  if (page === "proof-lab") {
    return (
      <main>
        <nav className="lab-page-nav" aria-label="ProofStream proof lab navigation">
          <a className="nav-brand" href="#/" aria-label="ProofStream home">
            <span>ProofStream</span>
          </a>
          <div className="nav-actions">
            <a className="nav-ghost" href="#/">Back home</a>
            <a className="nav-primary" href="#architecture">How it works</a>
          </div>
        </nav>

        <ProofLabHero />

        <ProofLab />
        <Architecture />
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <ProofStreamStory />
      <ProblemSection />
      <Architecture />
      <ProductShowcase />
      <IntegrationSection />
      <SponsorFit />
      <FaqSection />
      <Footer />
    </main>
  );
}
