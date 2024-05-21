import React, { useState, useEffect } from "react";
import './MyPets.scss'
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
        constructor(name, breed, age, weight, height, gender) {
            this.name = name;
            this.breed = breed;
            this.age = age;
            this.weight = weight;
            this.height = height;
            this.gender = gender;
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetForm({ ...petForm, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPet = new DogDescription(
            petForm.name,
            petForm.breed,
            petForm.age,
            petForm.weight,
            petForm.height,
            petForm.gender
        );
        setPets([...pets, newPet]);
        setPetForm({
            name: "",
            breed: 'Select Breed',
            age: "",
            weight: "",
            height: "",
            gender: "Male"
        });
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
                        />
                        <select
                            name="breed"
                            value={petForm.breed}
                            onChange={handleInputChange}
                        >
                            <option value="" >Select Breed</option>
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
                        />
                        <input
                            type="text"
                            name="weight"
                            placeholder="Pet Weight"
                            value={petForm.weight}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="height"
                            placeholder="Pet Height"
                            value={petForm.height}
                            onChange={handleInputChange}
                        />
                        <select
                            name="gender"
                            value={petForm.gender}
                            onChange={handleInputChange}
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
                        <ul>
                            {pets.map((pet, index) => (
                                <li key={index}>
                                    {`${pet.name}, ${pet.breed}, ${pet.age} years old, ${pet.weight} kg, ${pet.height} cm, ${pet.gender}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
