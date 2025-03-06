import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CharityDetail = () => {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get the token from localStorage (or other storage)
    
    fetch(`https://donex-66an.onrender.com/charities/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch charity details');
        }
        return response.json();
      })
      .then((data) => setCharity(data))
      .catch((error) => console.error(error));
  }, [id]);

  if (!charity) {
    return <p>Charity not found!</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold">{charity.name}</h2>
      <img src={charity.image} alt={charity.name} className="w-full h-64 object-cover mt-4" />
      <p className="text-xl mt-4">{charity.moreInfo}</p>
    </div>
  );
};

export default CharityDetail;
