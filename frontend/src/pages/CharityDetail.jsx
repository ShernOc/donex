import { useParams } from 'react-router-dom';

const CharityDetail = () => {
  const { id } = useParams();
  const charity = charities.find(char => char.id === parseInt(id));

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