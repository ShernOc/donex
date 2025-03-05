import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCharity } from '../context/CharityContext';


const CharityDetail = () => {
  const { id } = useParams();
  const {fetchCharities, fetchCharityById}=useCharity();
  const [charity, setCharity] = useState(null);

  useEffect(() => {
    const getCharity = async () => {
      const charityData =
       await fetchCharityById(id);

      console.log("Fetched charity:", charityData); 

      setCharity(charityData); 
    };

    getCharity();
  }, [id, fetchCharityById]); 
  
  
  if (!charity) {
    return <p>Charity not found!</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold">{charity.charity_name}</h2>
      <img src={charity.profile_image} alt={charity.charity_name} className="w-full h-64 object-cover mt-4" />
      <p className="text-xl mt-4">{charity.description}</p>
    </div>
  );
};

export default CharityDetail;
