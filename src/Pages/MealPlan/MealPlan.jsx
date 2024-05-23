import React, { useEffect } from "react";
import { getPetsForUser } from '../../Firebase/FireStore.js';
import { auth } from '../../Firebase/Firebase.jsx';

export default function MealPlan({ petState }) {
    const { pets, setPets } = petState;

    const loadPets = async (userId) => {
        const userPets = await getPetsForUser(userId);
        setPets(userPets);
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
    const handleDelete = async (index) => {
        // Implement your delete logic here
    };

    return (
        <div className="mealplan-Div">
            <div className="mealplan-list">
                <p>Meal Plan</p>
                <ul className="PetListUnordered">
                    {pets.map((pet, index) => (
                        <li key={index}>
                            <p>{`Name: ${pet.name}`}</p>
                            <p>{`Breed: ${pet.breed}`}</p>
                            <p>{`Age: ${pet.age} years old`}</p>
                            <p>{`Weight: ${pet.weight} LB`}</p>
                            <p>{`Height: ${pet.height} In`}</p>
                            <p>{`Gender: ${pet.gender}`}</p>
                            {pet.image && <img src={pet.image} alt={`${pet.breed}`} className="petListImage" />}
                            <button onClick={() => handleDelete(index)} className="PetListDeleteButton">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
