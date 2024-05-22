// firestore.js
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './Firebase';

// Save pet data
export const savePetData = async (userId, petData) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { pets: petData }, { merge: true });
        console.log('Pet data saved successfully');
    } catch (err) {
        console.error('Error saving pet data:', err);
    }
};

// Get all pets for a user
export const getPetsForUser = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data().pets;
        } else {
            console.log('No such document!');
            return [];
        }
    } catch (err) {
        console.error('Error getting pets:', err);
    }
};

// Update a specific pet's data
export const updatePetData = async (userId, petIndex, updatedPetData) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const pets = userDoc.data().pets;
            pets[petIndex] = updatedPetData;
            await updateDoc(userDocRef, { pets });
            console.log('Pet data updated successfully');
        } else {
            console.log('No such document!');
        }
    } catch (err) {
        console.error('Error updating pet data:', err);
    }
};

// Delete a specific pet
export const deletePetData = async (userId, petIndex) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const pets = userDoc.data().pets;
            pets.splice(petIndex, 1);
            await updateDoc(userDocRef, { pets });
            console.log('Pet data deleted successfully');
        } else {
            console.log('No such document!');
        }
    } catch (err) {
        console.error('Error deleting pet data:', err);
    }
};
