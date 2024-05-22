import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './Firebase';

// Save pet data
export const savePetData = async (userId, petData) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { pets: petData }, { merge: false });
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
