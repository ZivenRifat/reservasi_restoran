import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import RestaurantCard from "@/Components/RestaurantCard";

const TerdekatPage = () => {
  return (
    <>
      <Navbar />

      <main className="px-6 md:px-16 py-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">Restoran Terdekat</h1>
        <p className="text-gray-600 mb-6">Pilihan restoran terdekat!</p>

        <div className="space-y-6">
          <RestaurantCard
            title="Warung Sambal Bakar Semarang"
            description="Semarang Timur, Kota Semarang"
            imageUrl="/images/SearchPagePic.jpg"
            variant="recommendation"
          />

          <RestaurantCard
            title="Warung Sambal Bakar Semarang"
            description="Semarang Timur, Kota Semarang"
            imageUrl="/images/SearchPagePic.jpg"
            variant="recommendation"
          />

          <RestaurantCard
            title="Warung Sambal Bakar Semarang"
            description="Semarang Timur, Kota Semarang"
            imageUrl="/images/SearchPagePic.jpg"
            variant="recommendation"
          />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TerdekatPage;
