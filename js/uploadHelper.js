/**
 * Supabase Upload Helper
 * 
 * This file provides a simple interface for uploading files to Supabase Storage.
 * It uses the official Supabase JavaScript client loaded via CDN.
 */

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file object to upload
 * @param {string} folderName - The folder name to store the file in
 * @returns {Promise<Object>} - Object containing {path, publicUrl} or throws error
 */
async function uploadFile(file, folderName) {
    try {
        // Check if Supabase is loaded
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase client not loaded. Make sure the Supabase CDN script is included.');
        }

        // Check if configuration is available
        if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url || !window.SUPABASE_CONFIG.anonKey) {
            throw new Error('Supabase configuration not found. Make sure supabaseConfig.js is loaded and configured.');
        }

        // Create Supabase client
        const supabaseClient = supabase.createClient(
            window.SUPABASE_CONFIG.url,
            window.SUPABASE_CONFIG.anonKey
        );

        // Generate timestamp for unique filename
        const timestamp = Date.now();
        
        // Sanitize filename (remove special characters, keep only alphanumeric, dots, and hyphens)
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        
        // Create the full file path in the bucket
        const filePath = `${folderName}/${timestamp}_${sanitizedFilename}`;

        console.log(`Uploading file: ${file.name} to path: ${filePath}`);

        // Upload the file to Supabase Storage
        const { data, error } = await supabaseClient.storage
            .from('uploads')  // Your bucket name
            .upload(filePath, file);

        if (error) {
            console.error('Upload error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }

        console.log('File uploaded successfully:', data);

        // Get the public URL for the uploaded file
        const { data: urlData } = supabaseClient.storage
            .from('uploads')
            .getPublicUrl(filePath);

        if (!urlData || !urlData.publicUrl) {
            throw new Error('Failed to get public URL for uploaded file');
        }

        // Return the file information
        return {
            path: data.path,
            publicUrl: urlData.publicUrl,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        };

    } catch (error) {
        console.error('Upload helper error:', error);
        throw error;
    }
}

/**
 * Upload multiple files to Supabase Storage
 * @param {File[]} files - Array of file objects to upload
 * @param {string} folderName - The folder name to store the files in
 * @returns {Promise<Object[]>} - Array of upload results
 */
async function uploadMultipleFiles(files, folderName) {
    const uploadPromises = files.map(file => uploadFile(file, folderName));
    return Promise.all(uploadPromises);
}

// Make functions available globally
window.uploadFile = uploadFile;
window.uploadMultipleFiles = uploadMultipleFiles;

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Make sure you have:
 *    - Supabase CDN script loaded in your HTML
 *    - supabaseConfig.js with your real credentials
 *    - This uploadHelper.js file loaded
 * 
 * 2. In your script.js, replace the simulateUpload function with:
 * 
 *    async function handleFormSubmit(event) {
 *        // ... existing validation code ...
 *        
 *        try {
 *            // Upload files to Supabase
 *            const uploadResults = await uploadMultipleFiles(
 *                selectedFiles.map(f => f.file), 
 *                'user-uploads'  // or whatever folder name you want
 *            );
 *            
 *            console.log('Upload results:', uploadResults);
 *            showStatus('Files uploaded successfully!', 'success');
 *            
 *        } catch (error) {
 *            console.error('Upload failed:', error);
 *            showStatus('Upload failed: ' + error.message, 'error');
 *        }
 *    }
 * 
 * 3. Make sure your Supabase Storage bucket 'uploads' exists and has proper permissions
 */
