import React, { useEffect, useState } from "react";
import { getPetsForUser } from '../../Firebase/FireStore.js';
import { auth } from '../../Firebase/Firebase.jsx';
import Jsondata from '../../JSON/Data.json'; // Ensure this path is correct
import stringSimilarity from 'string-similarity';

export default function MealPlan({ petState }) {
    const { pets, setPets } = petState;
    const [breedInfo, setBreedInfo] = useState({});

    // Log the JSON data to ensure it is imported correctly
    useEffect(() => {
        console.log("Jsondata:", Jsondata);
        if (Jsondata) {
            console.log("Jsondata.dogs:", Jsondata.dogs);
        }
    }, []);

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
                    const breeds = Jsondata.dogs.map(item => item.breed.toLowerCase());
                    const bestMatch = stringSimilarity.findBestMatch(breed.toLowerCase(), breeds).bestMatch.target;
                    const breedDetails = Jsondata.dogs.find(item => item.breed.toLowerCase() === bestMatch);
                    if (breedDetails) {
                        console.log(`Closest breed details for ${breed}:`, breedDetails);
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

        // Check authentication state when component mounts
        checkAuthState();

        // Optionally, you can add an auth state listener to handle any future auth state changes
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                loadPets(user.uid);
            }
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className="mealplan-Div">
            <div className="mealplan-list">
                <p>Meal Plan</p>
                <ul className="PetListUnordered">
                    {pets.map((pet, index) => (
                        <BreedDetails key={index} pet={pet} findBreedInfo={findBreedInfo} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

const BreedDetails = ({ pet, findBreedInfo }) => {
    const [breedDetails, setBreedDetails] = useState({});

    useEffect(() => {
        const fetchBreedDetails = async () => {
            const details = await findBreedInfo(pet.breed);
            setBreedDetails(details);
        };
        fetchBreedDetails();
    }, [pet.breed, findBreedInfo]);

    useEffect(() => {
        console.log(`Breed details for ${pet.breed}:`, breedDetails);
    }, [breedDetails, pet.breed]);

    const getWeightStatus = (petWeight, weightRange) => {
        const [minWeight, maxWeight] = weightRange.split('-').map(weight => parseFloat(weight));
        if (petWeight < minWeight) {
            return 'Underweight';
        } else if (petWeight > maxWeight) {
            return 'Overweight';
        } else {
            return 'At weight';
        }
    };

    const weightStatus = breedDetails.weight
        ? getWeightStatus(
            parseFloat(pet.weight),
            pet.gender.toLowerCase() === 'male' ? breedDetails.weight.male : breedDetails.weight.female
        )
        : '';

    return (
        <li>
            <p>{`Name: ${pet.name}`}</p>
            <p>{`Breed: ${pet.breed}`}</p>
            <p>{`Age: ${pet.age} years old`}</p>
            <p>{`Weight: ${pet.weight} LB`}</p>
            <p>{`Height: ${pet.height} In`}</p>
            <p>{`Gender: ${pet.gender}`}</p>
            {pet.image && <img src={pet.image} alt={`${pet.breed}`} className="petListImage" />}
            {breedDetails.weight && (
                <div className="breed-info">
                    {pet.gender.toLowerCase() === 'male' && (
                        <p>{`Breed Weight (Male): ${breedDetails.weight.male}`}</p>
                    )}
                    {pet.gender.toLowerCase() === 'female' && (
                        <p>{`Breed Weight (Female): ${breedDetails.weight.female}`}</p>
                    )}
                    <p>{`Weight Status: ${weightStatus}`}</p>
                </div>
            )}
        </li>
    );
};
