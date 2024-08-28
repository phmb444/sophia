'use client'
/* eslint-disable @next/next/no-img-element */

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {

  return (
    <section className="md:px-20 px-4 min-h-screen w-screen overflow-hidden">
      <header className="w-full h-20 flex items-center justify-between"> {/* Modified line */}
        <a href="/home">
          <img src="/logo_novo_preto.png" alt="logo sophia" className="md:w-32 w-20" />
        </a>
        <button
          className="md:w-32 w-20 flex justify-end gap-2"
          style={{ color: 'red', fontWeight: 'bold' }}
          onClick={() => {
            localStorage.setItem("sophia_token", "");
            window.location.href = "/";
          }}
        >
          Sair
        </button>
        {/*<div className="md:w-32 w-20 flex justify-end gap-2">
          <img src="/question_mark.png" className="md:h-8 h-6 hover:scale-110 hover:cursor-pointer transition-all" alt="" /> 
          <a href="/home/user"><img src="/user.png" alt="" className="md:h-8 h-6 hover:scale-110 hover:cursor-pointer transition-all" /></a>
        </div> */}

      </header>

      {children}
    </section>
  );
}
