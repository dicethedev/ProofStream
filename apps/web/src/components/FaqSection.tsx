const questions = [
  {
    question: "What does ProofStream prove?",
    answer: "It proves that a selected DEX activity record belongs to the exact dataset represented by a published Merkle root.",
  },
  {
    question: "Does ProofStream prove that The Graph is correct?",
    answer: "No. ProofStream proves dataset integrity after the response is fetched. The source and query remain visible so users can understand where the data came from.",
  },
  {
    question: "Why not send the full dataset?",
    answer: "A client often needs to check only one record. A Merkle proof sends that row plus a small helper path instead of every row in the response.",
  },
  {
    question: "Is my Graph API key stored?",
    answer: "No. The key is held only in browser memory while the page is open and is used to call the selected Graph endpoint.",
  },
  {
    question: "Can I use another DEX or subgraph?",
    answer: "Yes. Choose a preset or supply a compatible subgraph ID or direct GraphQL endpoint in the proof lab.",
  },
];

export function FaqSection() {
  return (
    <section className="section faq-section" id="faq">
      <div className="faq-heading" data-reveal>
        <p className="eyebrow">Questions, answered</p>
        <h2>Understand the proof before you trust it.</h2>
      </div>
      <div className="faq-list">
        {questions.map((item) => (
          <details key={item.question} data-reveal>
            <summary>{item.question}<span>+</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
