import { storage } from './config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param folder - The folder path in storage (e.g., 'projects', 'activities')
 * @returns The download URL of the uploaded file
 */
export async function uploadToFirebase(
    file: File,
    folder: string = 'projects'
): Promise<string> {
    try {
        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `${folder}/${filename}`;

        // Create storage reference
        const storageRef = ref(storage, filePath);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading to Firebase:', error);
        throw new Error('Failed to upload file to Firebase Storage');
    }
}

/**
 * Delete a file from Firebase Storage
 * @param fileUrl - The full download URL of the file to delete
 */
export async function deleteFromFirebase(fileUrl: string): Promise<void> {
    try {
        // Extract the file path from the URL
        const url = new URL(fileUrl);
        const pathMatch = url.pathname.match(/\/o\/(.+)\?/);

        if (!pathMatch) {
            throw new Error('Invalid Firebase Storage URL');
        }

        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);

        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting from Firebase:', error);
        throw new Error('Failed to delete file from Firebase Storage');
    }
}

/**
 * Upload multiple files to Firebase Storage
 * @param files - Array of files to upload
 * @param folder - The folder path in storage
 * @returns Array of download URLs
 */
export async function uploadMultipleToFirebase(
    files: File[],
    folder: string = 'projects'
): Promise<string[]> {
    try {
        const uploadPromises = files.map(file => uploadToFirebase(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error uploading multiple files:', error);
        throw new Error('Failed to upload files to Firebase Storage');
    }
}
