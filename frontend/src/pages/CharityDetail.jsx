import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCharity } from '../context/CharityContext';

const CharityDetail = () => {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading]=useState(true)


  // useEffect(()=>{
  //   const getCharity = async () => {
  //     try {
  //       const data = await fetchApprovedCharities(); 
  //       if (data) {
  //         setCharity(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching charity:", error);
  //     }
  //   };

  //   getCharity();
  // },[fetchApprovedCharities]);


  const fetchCurrentCharities = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/charities/all_approved", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      console.log("Fetched Charities:", data); 
  
      if (response.ok) {
        setCharity(data.charities);
      } else {
        console.error("Failed to fetch approved charities:", data.message);
      }
    } catch (error) {
      console.error("Error fetching approved charities:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchCurrentCharities(); // Fetch charities when the component loads
  }, []);


  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {charity.length === 0 ? (
         <p>No approved charities found.</p>):(

          <ul>
          {charity.map((charity) => (
            <li key={charity.id}>
              <h3>{charity.charity_name}</h3>
              <p>{charity.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
)
}

export default CharityDetail;
