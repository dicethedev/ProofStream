import { Architecture } from "./components/Architecture";
import { Header } from "./components/Header";
import { ProofLab } from "./components/ProofLab";
import { SponsorFit } from "./components/SponsorFit";

export function App() {
  return (
    <main>
      <Header />
      <ProofLab />
      <Architecture />
      <SponsorFit />
    </main>
  );
}
