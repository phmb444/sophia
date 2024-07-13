/* eslint-disable @next/next/no-img-element */


export default function Landing() {
  return (
    <div className="h-screen md:flex bg-zinc-900">
      <main className="h-4/5 text-white md:font-extrabold font-semibold p-8 flex flex-col justify-center md:h-screen md:w-3/5">
        <p className="text-3xl md:text-5xl">conheça</p>
        <img src="/logo_novo_branco.png" alt="logo" />
        <p className="text-3xl mt-4 md:text-4xl">
          uma inteligência artificial educacional
        </p>
      </main>
      <section className="fundo_main h-1/5 rounded-t-3xl md:rounded-none flex flex-col justify-center items-center md:h-screen md:w-2/5">
        <p className="text-zinc-100 font-bold text-3xl">Vamos começar</p>
        <div className="flex justify-center w-full mt-12">
          <a href="/login" className="button_secondary mr-8 w-40">
            entrar
          </a>
          <a href="/register" className="button_secondary w-40">
            registrar-se
          </a>
        </div>
      </section>
    </div>
  );
}
