
/* eslint-disable @next/next/no-img-element */

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {  
  
  return (
    <section className="md:px-20 px-4 min-h-screen w-screen overflow-hidden">
      <header className="w-full h-20 flex items-center justify-between">
        <a href="/home">
        <img src="/logo_novo_preto.png" alt="logo sophia" className="md:w-32 w-20" />
        </a>
        <div className="w-32 bg-zinc-300 hover:w-52 h-8 transition-all rounded-full flex pr-2 items-center justify-between">
          <input
            type="text"
            className="w-24 hover:w-52 overflow-scroll transition-all rounded-full h-8 bg-zinc-300"
          />
          <img src="/search.png" alt="" className="h-6" />
        </div>
        <div className="md:w-32 w-20 flex justify-end gap-2">
          <img src="/question_mark.png" className="md:h-8 h-6 hover:scale-110 hover:cursor-pointer transition-all" alt="" /> 
          <a href="/home/user"><img src="/user.png" alt="" className="md:h-8 h-6 hover:scale-110 hover:cursor-pointer transition-all" /></a>
        </div>
      </header>

      {children}
    </section>
  );
}
