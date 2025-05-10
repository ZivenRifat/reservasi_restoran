// src/app/restoran/page.tsx
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Link from 'next/link';

const RestaurantPage = () => {
  return (
    <>
      <Navbar />

      <main className="bg-gray-100 min-h-screen px-6 md:px-20 pt-4 pb-16">
        {/* Hero Images */}
        <section className="grid grid-cols-4 gap-2 mb-6 py-10">
          <div className="col-span-2 row-span-2">
            <img
              src="/images/LandingPagePic.jpg"
              alt="Main Restaurant"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <img
            src="/images/LandingPagePic.jpg"
            alt="Alt 1"
            className="w-full h-full object-cover rounded"
          />
          <img
            src="/images/LandingPagePic.jpg"
            alt="Alt 2"
            className="w-full h-full object-cover rounded"
          />
          <img
            src="/images/LandingPagePic.jpg"
            alt="Alt 3"
            className="w-full h-full object-cover rounded"
          />
          <div className="bg-gray-400 text-white text-center flex items-center justify-center rounded cursor-pointer">
            Lihat Semua Foto
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            {/* Title & Address */}
            <div>
              <h2 className="text-2xl font-bold">
                Warung Sambal Bakar Semarang
              </h2>
              <p className="text-gray-600">
                Jl. Setia Budi No.207, Srondol Kulon, Kec. Banyumanik, Kota
                Semarang, Jawa Tengah 50263
              </p>
            </div>

            {/* Deskripsi */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Deskripsi</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                "Warung Sambal Bakar" menyajikan hidangan istimewa dengan
                sentuhan sambal bakar yang menggugah selera. Nikmati berbagai
                pilihan menu dengan sambal khas yang pedas dan lezat, siap
                memanjakan lidah Anda. Dengan susunan yang hangat dan nyaman,
                kami menawarkan pengalaman makan yang tak terlupakan...
              </p>
            </div>

            {/* Jam Operasional */}
            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Jam Operasional</h4>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">🟢 Buka</span>
                <span className="font-semibold">09:00 - 22:00</span>
              </div>
            </div>

            {/* Highlight Menu */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Highlight Menu</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <img
                    key={i}
                    src="/images/LandingPagePic.jpg"
                    alt={`Menu ${i + 1}`}
                    className="w-full h-36 object-cover rounded shadow"
                  />
                ))}
              </div>
            </div>

            {/* Lokasi */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Lokasi</h3>
              <p className="text-sm text-gray-700 mb-2">
                Jl. Setia Budi No.207, Srondol Kulon, Kec. Banyumanik, Kota
                Semarang, Jawa Tengah 50263
              </p>
              <img
                src="/images/map-placeholder.png"
                alt="Map"
                className="w-full h-60 object-cover rounded"
              />
            </div>
          </div>

          {/* Sidebar Pesan */}
          <div className="w-full lg:w-80 bg-white p-6 rounded shadow h-fit">
            <h3 className="font-semibold mb-4">Buat Pesanan</h3>
            <form className="space-y-4">
              <select className="w-full p-2 border rounded">
                <option>1 Orang</option>
                <option>2 Orang</option>
                <option>3 Orang</option>
                <option>4 Orang</option>
              </select>
              <input type="date" className="w-full p-2 border rounded" />
              <input type="time" className="w-full p-2 border rounded" />
              <Link href='/Menu'>
              <button
                type="submit"
                className="bg-[#481111] text-white py-2 w-full rounded font-semibold"
              >
                Pilih Menu
              </button>
              </Link>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RestaurantPage;
