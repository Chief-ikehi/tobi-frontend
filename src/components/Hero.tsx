import React from 'react';

interface Location {
  value: string;
  label: string;
}

interface Guest {
  value: string;
  label: string;
}

const Hero: React.FC = () => {
  const locations: Location[] = [
    { value: '', label: 'Select Location' },
    { value: 'ikoyi', label: 'Ikoyi' },
    { value: 'victoria-island', label: 'Victoria Island' }
  ];

  const guests: Guest[] = [
    { value: '1', label: '1 Guest' },
    { value: '2', label: '2 Guests' },
    { value: '3', label: '3 Guests' },
    { value: '4', label: '4+ Guests' }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your search functionality here
  };

  return (
    <section className="relative flex justify-center items-center text-center text-white h-[600px] md:h-[600px]
      mb-12 px-4 py-8 md:px-32 md:py-12 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://i.ibb.co/vCfcbnDD/background-hero.png")'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect Stay
        </h1>
        <p className="text-xl md:text-2xl font-medium mb-8">
          Discover luxury accommodations tailored to your needs.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {/* Location Dropdown */}
          <select
            className="w-full md:w-[200px] h-12 px-3 rounded-lg text-base text-gray-900
              shadow-sm transition-shadow duration-300 focus:outline-none focus:ring-2
              focus:ring-black bg-white"
          >
            {locations.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>

          {/* Guests Dropdown */}
          <select
            className="w-full md:w-[200px] h-12 px-3 rounded-lg text-base text-gray-900
              shadow-sm transition-shadow duration-300 focus:outline-none focus:ring-2
              focus:ring-black bg-white"
          >
            {guests.map((guest) => (
              <option key={guest.value} value={guest.value}>
                {guest.label}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-[200px] h-12 px-3 rounded-lg text-base bg-black
              text-white transition-colors duration-300 hover:bg-blue-700 flex items-center
              justify-center font-medium"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;