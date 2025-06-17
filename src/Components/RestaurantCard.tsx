import Link from "next/link";

type Props = {
  title: string;
  description: string;
  imageUrl: string;
  variant?: "default" | "recommendation";
  href?: string; // tambah href opsional
};

const RestaurantCard = ({
  title,
  description,
  imageUrl,
  variant = "default",
  href,
}: Props) => {
  const cardContent =
    variant === "recommendation" ? (
      <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden w-full">
        <div className="md:w-1/3 h-48 md:h-60">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="md:w-2/3 p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">{title}</h2>
            <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
            <div className="flex items-center text-sm text-gray-600 mt-2 gap-2">
              <span className="text-yellow-400">⭐</span>
              <span>5.0</span>
              <span className="mx-2">|</span>
              <span>Sangat Baik</span>
              <span className="mx-2">|</span>
              <span>2334 Ulasan</span>
            </div>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap">
            <button className="bg-gray-200 text-black px-5 py-2 rounded-full hover:bg-gray-300 transition">
              Pesan
            </button>
            <button className="bg-gray-200 text-black px-5 py-2 rounded-full hover:bg-gray-300 transition">
              Lihat selengkapnya...
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-sm">
        <div className="h-48">
          <img
            src={
              imageUrl || "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate mb-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        </div>
      </div>
    );

  if (href) {
    return (
      <Link
        href={href}
        className="block transform hover:scale-102 hover:rounded-b-2xl hover:shadow-2xl transition-all duration-300 ease-in-out p-4"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default RestaurantCard;
