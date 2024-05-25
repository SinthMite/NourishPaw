import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './Firebase';

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
            return userDoc.data().pets || [];
        } else {
            console.log('No such document!');
            return [];
        }
    } catch (err) {
        console.error('Error getting pets:', err);
        return [];
    }
};

// Delete a specific pet entry
export const deletePetEntry = async (userId, petName, entryIndex) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const pets = userDoc.data().pets;
            const petIndex = pets.findIndex(pet => pet.name === petName);
            if (petIndex > -1) {
                pets[petIndex].dailyEntries.splice(entryIndex, 1);
                await updateDoc(userDocRef, { pets });
                console.log('Pet entry deleted successfully');
            }
        } else {
            console.log('No such document!');
        }
    } catch (err) {
        console.error('Error deleting pet entry:', err);
    }
};
