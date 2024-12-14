
import React from 'react';
import CharacterTable from './CharacterTable';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-800 drop-shadow-md">
          Rick and Morty Karakter Rehberi
        </h1>
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <CharacterTable />
        </div>
        <footer className="text-center mt-6 text-blue-700">
          Rick and Morty API kullanılarak oluşturulmuştur.
        </footer>
      </div>
    </div>
  );
};

export default App;

