/* eslint-disable @next/next/no-img-element */
interface SectionCardProps {
    title: string;
    description: string;
    link: string;
    color: string;
  }
  
  const SectionCard: React.FC<SectionCardProps> = ({ title, description, link, color }) => {
    return (
      <div className={`flex flex-col lg:flex-row items-end justify-between gap-4 ${color}`}>
        <div className="flex flex-col justify-between h-full w-4/5">
          <p className="text-3xl font-bold">{title}</p>
          <p className="text-xl font-semibold">{description}</p>
        </div>
        <div className="w-1/5 h-full flex flex-col justify-between items-center">
          <a href={link}>
            <img
              src="arrow.png"
              alt="Arrow Icon"
              className="absolute bottom-6 right-6 hover:scale-110 hover:cursor-pointer transition-all"
            />
          </a>
        </div>
      </div>
    );
  };
  
  export default SectionCard;
  