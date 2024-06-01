import React, { useState, useEffect } from "react";
import './MyPets.scss';
import { auth } from '../../Firebase/Firebase.jsx';
import { savePetData, getPetsForUser, deletePetEntry } from '../../Firebase/FireStore.js';

export default function MyPets({ petState }) {
    const [dogTypeFetchData, setDogTypeFetchData] = useState([]);
    const {pets, setPets} = petState;
    const [petForm, setPetForm] = useState({
        name: "",
        breed: "",
        age: "",
        weight: "",
        height: "",
        gender: "Male",
        image: ""
    });

    useEffect(() => {
        DogTypeFetch();
        auth.onAuthStateChanged(user => {
            if (user) {
                loadPets(user.uid);
            } else {
                setPets([]); // Clear pets array when user logs out
            }
        });
    }, []);

    const loadPets = async (userId) => {
        const userPets = await getPetsForUser(userId);
        setPets(userPets);
    };

    function DogTypeFetch() {
        fetch("https://dog.ceo/api/breeds/list/all")
            .then(response => response.json())
            .then(data => {
                setDogTypeFetchData(Object.keys(data.message));
                console.log(data.message);
            })
            .catch(err => console.log(err));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetForm({ ...petForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageUrl = await fetchDogImage(petForm.breed);
        const newPet = {
            name: petForm.name,
            breed: petForm.breed,
            age: petForm.age,
            weight: petForm.weight,
            height: petForm.height,
            gender: petForm.gender,
            image: imageUrl
        };
        const updatedPets = [...pets, newPet];
        setPets(updatedPets);
        setPetForm({
            name: "",
            breed: "",
            age: "",
            weight: "",
            height: "",
            gender: "Male",
            image: ""
        });

        // Save pet data to Firestore
        const userId = auth.currentUser?.uid;
        if (userId) {
            await savePetData(userId, updatedPets);
        }
    };

    async function fetchDogImage(breed) {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            const data = await response.json();
            setPetForm((prevForm) => ({ ...prevForm, image: data.message }));
            console.log(data.message); // This will correctly log the fetched image URL
            return data.message; // Return the fetched image URL directly
        } catch (err) {
            console.log(err);
            return "";
        }
    }

    const handleDelete = async (index) => {
        const userId = auth.currentUser?.uid;
        if (userId) {
            await deletePetEntry(userId, index);
            const updatedPets = pets.filter((_, petIndex) => petIndex !== index);
            setPets(updatedPets);
        }
    };

    return (
        <div className="mypets-Div">
            <div className="mypets-list">
                <h2>Your Pets</h2>
                <section>
                    <h3>Add Your Pet</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Pet Name"
                            value={petForm.name}
                            onChange={handleInputChange}
                            required
                        />
                        <select
                            name="breed"
                            value={petForm.breed}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Select Breed</option>
                            {dogTypeFetchData.map((breed) => {
                                const formattedBreed = breed.charAt(0).toUpperCase() + breed.slice(1);
                                return (
                                    <option key={breed} value={breed}>{formattedBreed}</option>
                                );
                                })}
                        </select>
                        <input
                            type="text"
                            name="age"
                            placeholder="Pet Age"
                            value={petForm.age}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="weight"
                            placeholder="Pet Weight(LB)"
                            value={petForm.weight}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="height"
                            placeholder="Pet Height(In)"
                            value={petForm.height}
                            onChange={handleInputChange}
                            required
                        />
                        <select
                            name="gender"
                            value={petForm.gender}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <input type="submit" value="Add Pet" />
                    </form>
                </section>
                <section className="PetListSection">
                    <div>
                        <h2>Pet List</h2>
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
                </section>
            </div>
            <div className="mypets-continue-button">
                <a href="/mealplan">
                    <button>Continue</button>
                </a>
            </div>
            <div className="mypets-back-button">
                <a href="/">
                    <button>Back</button>
                </a>
            </div>
        </div>
    );
}
