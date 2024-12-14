import React, { useState } from 'react';
import { useCharacters } from './hooks/useCharacters';
import CharacterDetailModal from './CharacterDetailModal'; // Modal bileşenini import ediyoruz

const CharacterTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    species: '',
    gender: ''
  });
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

  const { characters, loading, error, totalPages } = useCharacters(currentPage, filters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Filtreleme yapınca ilk sayfaya dön
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCharacterClick = (id: number) => {
    setSelectedCharacterId(id);
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="name"
          placeholder="İsme göre ara"
          value={filters.name}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <select 
          name="status" 
          value={filters.status} 
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Tüm Durumlar</option>
          <option value="alive">Canlı</option>
          <option value="dead">Ölü</option>
          <option value="unknown">Bilinmiyor</option>
        </select>
        <select 
          name="species" 
          value={filters.species} 
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Tüm Türler</option>
          <option value="human">İnsan</option>
          <option value="alien">Uzaylı</option>
        </select>
        <select 
          name="gender" 
          value={filters.gender} 
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Tüm Cinsiyetler</option>
          <option value="male">Erkek</option>
          <option value="female">Kadın</option>
          <option value="unknown">Bilinmiyor</option>
        </select>
      </div>

      {characters.length === 0 ? (
        <div className="text-center text-gray-600">
          Filtrelere uygun karakter bulunamadı.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Resim</th>
              <th className="border p-2">Ad</th>
              <th className="border p-2">Durum</th>
              <th className="border p-2">Tür</th>
              <th className="border p-2">Cinsiyet</th>
            </tr>
          </thead>
          <tbody>
            {characters.map(character => (
              <tr 
                key={character.id} 
                className="hover:bg-gray-100"
                onClick={() => handleCharacterClick(character.id)} // Tıklama işlemi
              >
                <td className="border p-2 text-center">
                  <img 
                    src={character.image} 
                    alt={character.name} 
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                </td>
                <td className="border p-2">{character.name}</td>
                <td className="border p-2">{character.status}</td>
                <td className="border p-2">{character.species}</td>
                <td className="border p-2">{character.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* CharacterDetailModal gösterimi */}
      {selectedCharacterId && (
        <CharacterDetailModal 
          characterId={selectedCharacterId}
          onClose={() => setSelectedCharacterId(null)} // Modal'ı kapatma işlemi
        />
      )}
    </div>
  );
};

export default CharacterTable;
