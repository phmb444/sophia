import InfoCard from "./info_card"


export default function InfoSection(){
    return (
        <section className="md:w-1/2 w-screen h-screen flex flex-col items-center justify-center bg-zinc-900">
        <InfoCard
          title="testasdfasdf"
          description="leia o artigo"
        ></InfoCard>
        <InfoCard
          title="testasdfasdf"
          description="veja o canal no youtube"
        ></InfoCard>
        <InfoCard
          title="testasdfasdf"
          description="siga nas redes sociais"
        ></InfoCard>
      </section>
      )
}