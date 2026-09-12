import { FaGithub } from "react-icons/fa6";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Proof lab", href: "#/proof-lab" },
      { label: "How it works", href: "#architecture" },
      { label: "Use cases", href: "#use-cases" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "MerkleForge", href: "https://github.com/dicethedev/MerkleForge" },
      { label: "The Graph", href: "https://thegraph.com/" },
      { label: "Trust model", href: "#security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "README", href: "https://github.com/dicethedev/proofstream#readme" },
      { label: "Source code", href: "https://github.com/dicethedev/proofstream" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer footer-v2">
      <div className="footer-v2-main" data-reveal>
        <div className="footer-v2-intro">
          <a className="footer-v2-brand" href="#top" aria-label="ProofStream home">
            ProofStream
          </a>
          <h2>Proof receipts for indexed blockchain data.</h2>
          <p>
            Fetch public DEX activity, seal the dataset with MerkleForge, and
            let anyone verify one record independently.
          </p>
          <a className="footer-v2-action" href="#/proof-lab">
            Open proof lab <LuArrowRight aria-hidden="true" />
          </a>
        </div>

        <nav className="footer-v2-links" aria-label="Footer navigation">
          {footerGroups.map((group) => (
            <div className="footer-v2-group" key={group.title}>
              <b>{group.title}</b>
              {group.links.map((link) => {
                const isExternal = link.href.startsWith("http");

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                  >
                    {link.label}
                    {isExternal ? <LuArrowUpRight aria-hidden="true" /> : null}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="footer-v2-wordmark" aria-hidden="true">
        ProofStream
      </div>

      <div className="footer-v2-bottom">
        <span>© 2026 ProofStream. Built with MerkleForge.</span>
        <div>
          <span>Open source</span>
          <span>API keys are never stored</span>
          <a
            href="https://github.com/dicethedev/proofstream"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub aria-hidden="true" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
