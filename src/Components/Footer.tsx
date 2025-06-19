import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#481111] text-[#FFFCEF] px-16 py-12 mt-0"> {/* Menggunakan px-8 dan menghapus mt-8 */}
      <div className="pb-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
          {/* Logo */}
          <div className="md:col-span-5 flex items-start mb-6">
            <div className="flex items-start">
              <Image
                src="/images/logo.png" // ganti sesuai nama/logo kamu
                alt="Logo"
                width={100}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          {/* Mitra */}
          <div>
            <h4 className="font-semibold mb-2 text-lg">Mitra</h4>
            <p>Sedang mencari...</p>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-semibold mb-2 text-lg">Bantuan</h4>
            <p>Sedang mencari...</p>
          </div>

          {/* Media Sosial */}
          <div>
            <h4 className="font-semibold mb-2 text-lg">Media Sosial</h4>
            <p>Sedang mencari...</p>
          </div>

          {/* Download Aplikasi */}
          <div>
            <h4 className="font-semibold mb-2 text-lg">Download Aplikasi</h4>
            <p>Sedang mencari...</p>
          </div>
        </div>
      </div>

      <hr className="my-6 border-[#FFFCEF]" />
      <p className="text-center text-lg">
        &copy;2025 Reservasia All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
