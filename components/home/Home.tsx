import { useState, useEffect } from "react";
import Header from "./Header";
import SectionCard from "./SectionCards";

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("sophia_token");
    if (!token) {
      window.location.href = "/";
    }
    setToken(token);
    console.log(token);
  }, []);

  return (
    <div className="lg:h-[85vh] h-fit pb-8">
      {/* Header */}
      <Header />

      {/* Main content */}
      <section className="h-3/5 pt-4 box-border flex flex-col lg:flex-row items-end justify-between gap-4">
        <SectionCard
          title="Corrija seus textos e trabalhos"
          description="Receba um parecer detalhado sobre seu texto, com sugestões de melhorias e correções."
          link="/correcoes"
          color="box-1"
        />
        <SectionCard
          title="Gere listas de exercícios"
          description="Personalizadas e baseadas em seus documentos ou sites de escolha."
          link="/exercises"
          color="box-2"
        />
        <SectionCard
          title="Crie roteiros de estudos"
          description="Para estudar para provas, vestibulares, concursos ou sobre um assunto de seu interesse."
          link="/roteiros"
          color="box-3"
        />
      </section>
    </div>
  );
}
