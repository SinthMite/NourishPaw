import React, { useEffect, useState } from "react";
import { getPetsForUser, savePetData, deletePetEntry } from '../../Firebase/FireStore.js';
import { auth } from '../../Firebase/Firebase.jsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import './Tracker.scss'
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Tracker({ petState, weightState, caloriesState }) {
  const { pets, setPets } = petState;
  const { underweight, atWeight, overweight } = weightState;
  const { caloriesData, setCaloriesData } = caloriesState;
  const [selectedPet, setSelectedPet] = useState(null);
  const [dailyEntries, setDailyEntries] = useState([]);

  const loadPets = async (userId) => {
    const userPets = await getPetsForUser(userId);
    setPets(userPets);
    const updatedCaloriesData = userPets.map(pet => ({ petName: pet.name, calories: pet.calories }));
    setCaloriesData(updatedCaloriesData);
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

  const generateChartData = (pet) => {
    const petCalories = caloriesData.find(data => data.petName === pet.name)?.calories || 0;
    const consumedCalories = dailyEntries.filter(entry => entry.petName === pet.name).reduce((acc, entry) => acc + entry.amount, 0);
    return {
      labels: ['Calories Consumed', 'Remaining Calories'],
      datasets: [
        {
          label: `${pet.name}'s Daily Calorie Intake`,
          data: [consumedCalories, petCalories - consumedCalories],
          backgroundColor: ['#FF6384', '#ffe4ea'],
          hoverBackgroundColor: ['#f8345e', '#fdcdd7']
        }
      ]
    };
  };

  const handleEntrySubmit = async (event) => {
    event.preventDefault();
    const { petName, itemName, amount } = event.target.elements;
    const newEntry = { petName: petName.value, itemName: itemName.value, amount: parseFloat(amount.value) };
    const updatedEntries = [...dailyEntries, newEntry];
    setDailyEntries(updatedEntries);

    const user = auth.currentUser;
    if (user) {
      const updatedPets = pets.map(pet => {
        if (pet.name === petName.value) {
          return { ...pet, dailyEntries: updatedEntries };
        }
        return pet;
      });
      await savePetData(user.uid, updatedPets);
    }

    event.target.reset();
  };

  const handleDeleteEntry = async (entryIndex) => {
    const user = auth.currentUser;
    if (user && selectedPet) {
      const updatedEntries = dailyEntries.filter((_, index) => index !== entryIndex);
      setDailyEntries(updatedEntries);

      const updatedPets = pets.map(pet => {
        if (pet.name === selectedPet.name) {
          return { ...pet, dailyEntries: updatedEntries };
        }
        return pet;
      });
      setPets(updatedPets);
      await savePetData(user.uid, updatedPets);
    }
  };

  return (
    <div className="tracker-Div">
      <div className="tracker-list">
        <h2>Pet List</h2>
        <div className="PetListUnordered">
          {pets.map((pet, index) => (
            <button key={index} onClick={() => {
              setSelectedPet(pet);
              setDailyEntries(pet.dailyEntries || []);
            }} className="petButton">
              <p>{`Name: ${pet.name}`}</p>
              <p>{`Weight: ${pet.weight} LB`}</p>
              {pet.image && <img src={pet.image} alt={`${pet.breed}`} className="petListImage" />}
            </button>
          ))}
        </div>
      </div>
      {selectedPet && (
        <div className="selected-pet-details">
          <h2>{`Selected Pet: ${selectedPet.name}`}</h2>
          <p>{`Weight: ${selectedPet.weight} LB`}</p>
          {selectedPet.image && <img src={selectedPet.image} alt={`${selectedPet.breed}`} className="selectedPetImage" />}
          <div className="chart-container">
            <Doughnut data={generateChartData(selectedPet)} />
          </div>          <form onSubmit={handleEntrySubmit}>
            <input type="hidden" name="petName" value={selectedPet.name} />
            <label>
              Item Name:
              <input type="text" name="itemName" required />
            </label>
            <label>
              Amount (Calories):
              <input type="number" name="amount" required />
            </label>
            <button type="submit">Add Entry</button>
          </form>
          <h3>Daily Entries</h3>
          <ul className="daily-entries-list">
            {dailyEntries
              .filter(entry => entry.petName === selectedPet.name)
              .map((entry, index) => (
                <li key={index} className="daily-entry">
                  <p>{`Item: ${entry.itemName}`}</p>
                  <p>{`Calories: ${entry.amount}`}</p>
                  <button onClick={() => handleDeleteEntry(index)}>Delete</button>
                </li>
              ))}
          </ul>
        </div>
      )}
      <div className="mypets-continue-button">
        <a href="/tracker">
          <button>Continue</button>
        </a>
      </div>
      <div className="mypets-back-button">
        <a href="/mealplan">
          <button>Back</button>
        </a>
      </div>
    </div>
  );
}
