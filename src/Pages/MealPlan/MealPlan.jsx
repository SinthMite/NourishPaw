import React, { useEffect, useState } from "react";
import { getPetsForUser, savePetData } from '../../Firebase/FireStore.js';
import { auth } from '../../Firebase/Firebase.jsx';
import Jsondata from '../../JSON/Data.json'; // Ensure this path is correct
import stringSimilarity from 'string-similarity';
import ErrorBoundary from './ErrorBoundary'; // Import the ErrorBoundary component
import './MealPlan.scss';

export default function MealPlan({ petState, weightState, caloriesState }) {
  const { pets, setPets } = petState;
  const { setUnderweight, setAtWeight, setOverweight } = weightState;
  const { setCaloriesData } = caloriesState;

  const loadPets = async (userId) => {
    const userPets = await getPetsForUser(userId);
    setPets(userPets);
  };

  const findBreedInfo = (breed) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!Jsondata || !Jsondata.dogs) {
          console.error("Jsondata.dogs is undefined or Jsondata is not loaded correctly");
          resolve({});
        } else {
          const breedLower = breed.toLowerCase();
          const breeds = Jsondata.dogs.map(item => item.breed.toLowerCase());

          const partialMatches = breeds.filter(breedName => 
            breedName.split(' ').some(word => breedLower.includes(word))
          );

          let bestMatchBreed;
          if (partialMatches.length > 0) {
            bestMatchBreed = partialMatches[0];
          } else {
            bestMatchBreed = stringSimilarity.findBestMatch(breedLower, breeds).bestMatch.target;
          }

          const breedDetails = Jsondata.dogs.find(item => item.breed.toLowerCase() === bestMatchBreed);
          if (breedDetails) {
            resolve(breedDetails);
          } else {
            console.log(`No breed details found for ${breed}`);
            resolve({});
          }
        }
      }, 0);
    });
  };

  useEffect(() => {
    const checkAuthState = () => {
      const user = auth.currentUser;
      if (user) {
        loadPets(user.uid);
      }
    };

    checkAuthState();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        loadPets(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const weightCounts = {
      underweight: 0,
      atWeight: 0,
      overweight: 0
    };

    const caloriesData = [];

    const updateWeightsAndCalories = async () => {
      const updatedPets = [...pets];
      for (let pet of updatedPets) {
        const breedDetails = await findBreedInfo(pet.breed);
        if (breedDetails.weight) {
          const petWeight = parseFloat(pet.weight);
          const weightRange = pet.gender.toLowerCase() === 'male' ? breedDetails.weight.male : breedDetails.weight.female;
          const [minWeight, maxWeight] = weightRange.split('-').map(weight => parseFloat(weight));
          
          if (petWeight < minWeight) {
            weightCounts.underweight += 1;
            pet.weightStatus = 'underweight';
            pet.calories = breedDetails.calories_per_day.split('-')[1]; // Max calories
          } else if (petWeight > maxWeight) {
            weightCounts.overweight += 1;
            pet.weightStatus = 'overweight';
            pet.calories = breedDetails.calories_per_day.split('-')[0]; // Min calories
          } else {
            weightCounts.atWeight += 1;
            pet.weightStatus = 'atWeight';
            const [minCalories, maxCalories] = breedDetails.calories_per_day.split('-').map(cal => parseInt(cal));
            pet.calories = (minCalories + maxCalories) / 2; // Average calories
          }
          caloriesData.push({ petName: pet.name, calories: pet.calories });
        }
      }

      setUnderweight(weightCounts.underweight);
      setAtWeight(weightCounts.atWeight);
      setOverweight(weightCounts.overweight);
      setCaloriesData(caloriesData);

      // Save updated pet data to Firestore
      const user = auth.currentUser;
      if (user) {
        await savePetData(user.uid, updatedPets);
      }
    };

    if (pets.length > 0) {
      updateWeightsAndCalories();
    }
  }, [pets, setUnderweight, setAtWeight, setOverweight, setCaloriesData]);

  return (
    <ErrorBoundary>
      <div className="mealplan-Div">
        <div className="mealplan-list">
          <p>Meal Plan</p>
          <ul className="PetListUnordered">
            {pets.map((pet, index) => (
              <BreedDetails key={index} pet={pet} findBreedInfo={findBreedInfo} />
            ))}
          </ul>
        </div>
        <div className="mypets-continue-button">
          <a href="/tracker">
            <button>Continue</button>
          </a>
        </div>
        <div className="mypets-back-button">
          <a href="/mypets">
            <button>Back</button>
          </a>
        </div>
      </div>
    </ErrorBoundary>
  );
}

const BreedDetails = ({ pet, findBreedInfo }) => {
  const [breedDetails, setBreedDetails] = useState({});
  const [shoppingResults, setShoppingResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreedDetails = async () => {
      const details = await findBreedInfo(pet.breed);
      console.log(`Fetched breed details for ${pet.breed}:`, details);
      setBreedDetails(details);
    };
    fetchBreedDetails();
  }, [pet.breed, findBreedInfo]);

  const getWeightStatus = (petWeight, weightRange) => {
    if (typeof weightRange !== 'string') {
      console.error(`Expected a string for weightRange, but received:`, weightRange);
      return 'Unknown';
    }
    const [minWeight, maxWeight] = weightRange.split('-').map(weight => parseFloat(weight));
    if (petWeight < minWeight) {
      return 'Underweight';
    } else if (petWeight > maxWeight) {
      return 'Overweight';
    } else {
      return 'At weight';
    }
  };

  const weightStatus = breedDetails.weight ? getWeightStatus(
    parseFloat(pet.weight),
    pet.gender.toLowerCase() === 'male' ? breedDetails.weight.male : breedDetails.weight.female
  ) : '';

  useEffect(() => {
    const fetchShoppingResults = async () => {
      const apiKey = 'AIzaSyARQTBhPD7pd8yO-HWC3iQzSFDUnEqWSpY';
      const searchEngineId = 'f362cbcad97df4478';
      const DogFood = `Dog Food for ${pet.breed} that is ${weightStatus}`;
      const searchTerm = `${DogFood} site:amazon.com OR site:chewy.com OR site:petsmart.com OR site:petco.com`;

      try {
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchTerm)}&num=1`);
        if (response.ok) {
          const data = await response.json();
          setShoppingResults(data.items || []);
        } else {
          throw new Error('Error fetching shopping data');
        }
      } catch (error) {
        console.error('Error fetching shopping data:', error);
        setError('Error fetching shopping data. Please try again later.');
      }
    };

    fetchShoppingResults();
  }, [pet.breed, weightStatus]);

  return (
    <li className="pet-details">
      <p className="pet-name">{`Name: ${pet.name}`}</p>
      <p className="pet-breed">{`Breed: ${pet.breed.charAt(0).toUpperCase() + pet.breed.slice(1)}`}</p>
      <p className="pet-age">{`Age: ${pet.age} years old`}</p>
      <p className="pet-weight">{`Weight: ${pet.weight} LB`}</p>
      <p className="pet-height">{`Height: ${pet.height} In`}</p>
      <p className="pet-gender">{`Gender: ${pet.gender}`}</p>
      {breedDetails.calories_per_day && <p className="pet-calories">{`Calories Per Day: ${breedDetails.calories_per_day}`}</p>}
      {pet.image && <img src={pet.image} alt={`${pet.breed}`} className="pet-list-image" />}
      {breedDetails.weight && (
        <div className="breed-info">
          {pet.gender.toLowerCase() === 'male' && (
            <p className="breed-weight-male">{`Breed Weight (Male): ${breedDetails.weight.male}`}</p>
          )}
          {pet.gender.toLowerCase() === 'female' && (
            <p className="breed-weight-female">{`Breed Weight (Female): ${breedDetails.weight.female}`}</p>
          )}
          <p className="weight-status">{`Weight Status: ${weightStatus}`}</p>
        </div>
      )}
      {shoppingResults.length > 0 && (
        <div className="shopping-section">
          <h4>Related Dog Food Products</h4>
          <ul className="shopping-list">
            {shoppingResults.map((result, index) => (
              <li key={index} className="shopping-item">
                <a href={result.link} target="_blank" rel="noopener noreferrer" className="shopping-link">
                  <img src={result.pagemap?.cse_image?.[0]?.src} alt={result.title} className="shopping-image" />
                  {result.title}
                </a>
                <p className="shopping-snippet">{result.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="error-message">Food Options not Available at the Moment</p>}
    </li>
  );
};
