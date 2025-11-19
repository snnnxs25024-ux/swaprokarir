import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface HeroProps {
  onSearch: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Temukan Karir</span>{' '}
                <span className="block text-indigo-600 xl:inline">Impianmu Disini</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                SWAPRO KARIR menghubungkan talenta terbaik dengan perusahaan terkemuka. 
                Gunakan AI kami untuk mengoptimalkan CV Anda dan dapatkan pekerjaan lebih cepat.
              </p>
              
              <div className="mt-8 sm:flex sm:flex-col md:flex-row sm:justify-center lg:justify-start gap-3">
                <div className="relative rounded-md shadow-sm flex-1 max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                      placeholder="Posisi, keahlian..."
                    />
                </div>
                <div className="relative rounded-md shadow-sm flex-1 max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                      placeholder="Lokasi..."
                    />
                </div>
                <div className="mt-3 sm:mt-0">
                  <button
                    onClick={onSearch}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg transition shadow-lg shadow-indigo-200"
                  >
                    Cari Kerja
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://picsum.photos/800/600?random=10"
          alt="Orang bekerja di kantor"
        />
      </div>
    </div>
  );
};

export default Hero;