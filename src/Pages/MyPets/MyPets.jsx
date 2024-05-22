import React, { useState, useEffect } from "react";
import './MyPets.scss';

export default function MyPets() {
    const [dogTypeFetchData, setDogTypeFetchData] = useState([]);
    const [pets, setPets] = useState([]);
    const [petForm, setPetForm] = useState({
        name: "",
        breed: "",
        age: "",
        weight: "",
        height: "",
        gender: "Male"
    });

    function DogTypeFetch() {
        fetch("https://dog.ceo/api/breeds/list/all")
            .then(response => response.json())
            .then(data => {
                setDogTypeFetchData(Object.keys(data.message));
                console.log(data.message);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        DogTypeFetch();
    }, []);

    class DogDescription {
        constructor(name, breed, age, weight, height, gender, image) {
            this.name = name;
            this.breed = breed;
            this.age = age;
            this.weight = weight;
            this.height = height;
            this.gender = gender;
            this.image = image;
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetForm({ ...petForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageUrl = await fetchDogImage(petForm.breed);
        const newPet = new DogDescription(
            petForm.name,
            petForm.breed,
            petForm.age,
            petForm.weight,
            petForm.height,
            petForm.gender,
            imageUrl
        );
        setPets([...pets, newPet]);
        setPetForm({
            name: "",
            breed: "",
            age: "",
            weight: "",
            height: "",
            gender: "Male"
        });
    };

    async function fetchDogImage(breed) {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            const data = await response.json();
            return data.message;
        } catch (err) {
            console.log(err);
            return "";
        }
    }

    const handleDelete = (index) => {
        const updatedPets = pets.filter((_, petIndex) => petIndex !== index);
        setPets(updatedPets);
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
                            {dogTypeFetchData.map((breed) => (
                                <option key={breed} value={breed}>{breed}</option>
                            ))}
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
                            placeholder="Pet Weight"
                            value={petForm.weight}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="height"
                            placeholder="Pet Height"
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
                                    <p>{`Weight: ${pet.weight} kg`}</p>
                                    <p>{`Height: ${pet.height} cm`}</p>
                                    <p>{`Gender: ${pet.gender}`}</p>
                                    {pet.image && <img src={pet.image} alt={`${pet.breed}`} className="petListImage" />}
                                    <button onClick={() => handleDelete(index)} className="PetListDeleteButton">Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
