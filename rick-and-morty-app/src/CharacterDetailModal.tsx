import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Detaylı Karakter Arayüzü
interface CharacterDetail {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
}

// Bölüm Arayüzü
interface Episode {
  id: number;
  name: string;
  episode: string;
  air_date: string;
}

// Modal Prop'ları
interface CharacterModalProps {
  characterId: number;
  onClose: () => void;
}

const CharacterDetailModal: React.FC<CharacterModalProps> = ({ 
  characterId, 
  onClose 
}) => {
  // State Tanımlamaları
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Karakter ve Bölüm Bilgilerini Getiren Fonksiyon
  const fetchCharacterDetails = async () => {
    try {
      setLoading(true);
      // Karakter Detaylarını Getir
      const characterResponse = await axios.get<CharacterDetail>(
        `https://rickandmortyapi.com/api/character/${characterId}`
      );

      // Bölüm Bilgilerini Getir (İlk 5 bölüm)
      const episodePromises = characterResponse.data.episode
        .slice(0, 5)
        .map(async (episodeUrl) => {
          const episodeResponse = await axios.get<Episode>(episodeUrl);
          return episodeResponse.data;
        });

      const episodeDetails = await Promise.all(episodePromises);

      setCharacter(characterResponse.data);
      setEpisodes(episodeDetails);
      setLoading(false);
    } catch (err) {
      setError('Karakter bilgileri yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  // Komponentin Yüklenmesi ve Karakterin Getirilmesi
  useEffect(() => {
    fetchCharacterDetails();
  }, [characterId]);

  // Yükleme Durumu
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Hata Durumu
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={onClose} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Kapat
          </button>
        </div>
      </div>
    );
  }

  // Karakter Bilgisi Yoksa
  if (!character) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 relative shadow-2xl">
        {/* Kapatma Butonu */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        >
          ✕
        </button>

        {/* Karakter Bilgileri */}
        <div className="flex flex-col items-center">
          {/* Karakter Resmi */}
          <img 
            src={character.image} 
            alt={character.name} 
            className="w-56 h-56 rounded-full object-cover border-4 border-blue-500 mb-6 shadow-lg"
          />

          {/* İsim */}
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            {character.name}
          </h2>

          {/* Temel Bilgiler */}
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <DetailItem label="Durum" value={character.status} />
            <DetailItem label="Tür" value={character.species} />
            <DetailItem label="Cinsiyet" value={character.gender} />
            <DetailItem 
              label="Tip" 
              value={character.type || 'Bilinmiyor'} 
            />
          </div>

          {/* Konum Bilgileri */}
          <div className="w-full mb-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Konum Bilgileri
            </h3>
            <DetailItem label="Köken" value={character.origin.name} />
            <DetailItem label="Son Konum" value={character.location.name} />
          </div>

          {/* Bölümler */}
          <div className="w-full">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Son Görüldüğü Bölümler
            </h3>
            {episodes.map((episode) => (
              <div 
                key={episode.id} 
                className="bg-blue-50 rounded-lg p-3 mb-2"
              >
                <p className="font-medium text-blue-800">
                  {episode.episode} - {episode.name}
                </p>
                <p className="text-sm text-gray-600">
                  Yayın Tarihi: {episode.air_date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Detay Öğesi Bileşeni
const DetailItem: React.FC<{ label: string; value: string }> = ({ 
  label, 
  value 
}) => (
  <div className="flex items-center space-x-2">
    <p className="text-blue-800 font-bold">{label}:</p>
    <p className="text-gray-700">{value}</p>
  </div>
);
export default CharacterDetailModal;

