/* eslint-disable @next/next/no-img-element */
const Header = () => {
    return (
      <div className="h-2/5 min-h-40 flex flex-col md:flex-row relative items-center justify-center gradient-gray text-zinc-100">
        converse com
        <img src="logo_novo_branco.png" alt="Logo" className="h-12 ml-6" />
        <a href="/chat">
            <img
              src="arrow.png"
              alt="Arrow Icon"
              className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"
            />
          </a>
      </div>
    );
  };
  
  export default Header;