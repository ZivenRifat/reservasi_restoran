import SectionTitle from './SectionTitle';
import RestaurantCard from './RestaurantCard';

const sections = [
  { title: 'Rekomendasi Restoran' },
  { title: 'Restoran Terdekat' },
  { title: 'Restoran Baru' },
];

const RestaurantSection = () => {
  return (
    <div className="px-15 py-8 space-y-12">
      {sections.map((section, idx) => (
        <div key={idx}>
          {/* Kontainer untuk judul dan kartu restoran */}
          <div className="flex items-center justify-between mb-4">
            <SectionTitle title={section.title} />
            {/* Jika diperlukan, Anda bisa menambahkan tombol atau kontrol di sini */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="transform hover:scale-102 hover:rounded-b-2xl hover:shadow-2xl transition-all duration-300 ease-in-out p-4"
              >
                <RestaurantCard
                  title="Masakan Padang"
                  description="Dijamin masakan padang terenak seindonesia raya! Jokowi pernah kesini."
                  imageUrl="/images/restaurant.jpg"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantSection;
