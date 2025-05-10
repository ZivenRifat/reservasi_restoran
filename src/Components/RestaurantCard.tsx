type Props = {
  title: string;
  description: string;
  imageUrl: string;
  variant?: "default" | "recommendation";
};

const RestaurantCard = ({ title, description, imageUrl, variant = "default" }: Props) => {
  if (variant === "recommendation") {
    return (
      <div className="bg-white rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/3">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="md:w-2/3 p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">{title}</h2>
            <p className="text-gray-600">{description}</p>
            <div className="flex items-center text-sm text-gray-600 mt-2 gap-2">
              <span className="text-yellow-400">⭐</span>
              <span>5.0</span>
              <span className="mx-2">|</span>
              <span>Sangat Baik</span>
              <span className="mx-2">|</span>
              <span>2334 Ulasan</span>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button className="bg-gray-200 text-black px-5 py-2 rounded-full hover:bg-gray-300 transition">
              Pesan
            </button>
            <button className="bg-gray-200 text-black px-5 py-2 rounded-full hover:bg-gray-300 transition">
              Lihat selengkapnya...
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default tampilan (landing page)
  return (
    <div className="max-w-sm">
      <a href="#">
        <img
          src="https://images.pexels.com/photos/31468067/pexels-photo-31468067/free-photo-of-street-view-of-katinat-coffee-tea-house.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt={title}
          className="rounded-lg"
        />
        <h3 className="text-xl font-bold mt-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </a>
    </div>
  );
};

export default RestaurantCard;
