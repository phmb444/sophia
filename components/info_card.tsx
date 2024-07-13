/* eslint-disable @next/next/no-img-element */
export default function InfoCard({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
return (
    <div className="flex hover:w-4/5 mt-8 transition-all hover:bg-zinc-800 rounded-t-lg items-center justify-between w-4/5 md:w-3/5 py-2 px-2 text-zinc-100 border-b-2 border-b-zinc-100">
        <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-zinc-600">
            <img src="information.png" alt="" width={20} />
        </div>
        <div className="flex flex-col w-3/5">
            <h2 className="text-xl font-bold">{title}</h2>
            {description.length > 30 ? (
                <p>{description.slice(0, 30)}...</p>
            ) : (
                <p>{description}</p>
            )}
        </div>
        <div className="h-12 w-12 flex items-center justify-center">
            <img src="arrow.png" width={30} alt="" />
        </div>
    </div>
);
}
