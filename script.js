/**
 * PHV Upload Portal - Client-side JavaScript
 * Handles file validation, management, and form submission
 */

// Global variables to store selected files
let selectedFiles = [];
let fileIdCounter = 1;

// DOM elements
const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const addFileBtn = document.getElementById('addFileBtn');
const fileList = document.getElementById('fileList');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('PHV Upload Portal initialized');
    
    // Add event listeners
    addFileBtn.addEventListener('click', handleAddFile);
    form.addEventListener('submit', handleFormSubmit);
    
    // Update submit button state
    updateSubmitButton();
});

/**
 * Handle adding files to the list
 */
function handleAddFile() {
    const files = fileInput.files;
    
    if (files.length === 0) {
        showStatus('Please select at least one file.', 'error');
        return;
    }
    
    // Process each selected file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        const validation = validateFile(file);
        if (!validation.isValid) {
            showStatus(`File "${file.name}": ${validation.error}`, 'error');
            continue;
        }
        
        // Check if file already exists
        if (isFileAlreadySelected(file)) {
            showStatus(`File "${file.name}" is already selected.`, 'error');
            continue;
        }
        
        // Add file to list
        addFileToList(file);
    }
    
    // Clear the file input
    fileInput.value = '';
    updateSubmitButton();
}

/**
 * Validate a single file
 * @param {File} file - The file to validate
 * @returns {Object} - {isValid: boolean, error: string}
 */
function validateFile(file) {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Only JPG, PNG, and PDF files are allowed.'
        };
    }
    
    // Check file size (32MB = 32 * 1024 * 1024 bytes)
    const maxSize = 32 * 1024 * 1024;
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: 'File size must be 32MB or less.'
        };
    }
    
    return { isValid: true, error: null };
}

/**
 * Check if a file is already in the selected files list
 * @param {File} file - The file to check
 * @returns {boolean}
 */
function isFileAlreadySelected(file) {
    return selectedFiles.some(selectedFile => 
        selectedFile.name === file.name && 
        selectedFile.size === file.size &&
        selectedFile.lastModified === file.lastModified
    );
}

/**
 * Add a file to the selected files list and display it
 * @param {File} file - The file to add
 */
function addFileToList(file) {
    // Generate unique identifier (timestamp + name)
    const timestamp = Date.now();
    const identifier = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Create file object with metadata
    const fileObj = {
        id: fileIdCounter++,
        file: file,
        identifier: identifier,
        name: file.name,
        size: file.size,
        type: file.type
    };
    
    // Add to selected files array
    selectedFiles.push(fileObj);
    
    // Update the display
    updateFileListDisplay();
    
    showStatus(`Added "${file.name}" to upload list.`, 'success');
}

/**
 * Remove a file from the selected files list
 * @param {number} fileId - The ID of the file to remove
 */
function removeFile(fileId) {
    const fileIndex = selectedFiles.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
        const removedFile = selectedFiles[fileIndex];
        selectedFiles.splice(fileIndex, 1);
        updateFileListDisplay();
        updateSubmitButton();
        showStatus(`Removed "${removedFile.name}" from upload list.`, 'info');
    }
}

/**
 * Update the file list display in the UI
 */
function updateFileListDisplay() {
    if (selectedFiles.length === 0) {
        fileList.innerHTML = '<p class="no-files">No files selected</p>';
        return;
    }
    
    const fileItems = selectedFiles.map(fileObj => {
        const sizeFormatted = formatFileSize(fileObj.size);
        const typeFormatted = fileObj.type.split('/')[1].toUpperCase();
        
        return `
            <div class="file-item">
                <div class="file-info-item">
                    <div class="file-name">${fileObj.name}</div>
                    <div class="file-details">
                        <span class="file-size">${sizeFormatted}</span> • 
                        <span class="file-type">${typeFormatted}</span>
                    </div>
                    <div class="file-id">ID: ${fileObj.identifier}</div>
                </div>
                <button type="button" class="btn btn-danger" onclick="removeFile(${fileObj.id})">
                    Remove
                </button>
            </div>
        `;
    }).join('');
    
    fileList.innerHTML = fileItems;
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Update the submit button state based on form validity
 */
function updateSubmitButton() {
    const applicantName = document.getElementById('applicantName').value.trim();
    const hasFiles = selectedFiles.length > 0;
    
    submitBtn.disabled = !(applicantName && hasFiles);
}

/**
 * Handle form submission
 * @param {Event} event - The form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const applicantName = document.getElementById('applicantName').value.trim();
    
    // Final validation
    if (!applicantName) {
        showStatus('Please enter your name.', 'error');
        return;
    }
    
    if (selectedFiles.length === 0) {
        showStatus('Please select at least one file.', 'error');
        return;
    }
    
    // Disable submit button during upload
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';
    
    try {
        // Create FormData for the upload
        const formData = new FormData();
        formData.append('applicantName', applicantName);
        
        // Add each file with its identifier
        selectedFiles.forEach(fileObj => {
            formData.append('files', fileObj.file);
            formData.append('identifiers', fileObj.identifier);
        });
        
        // Log what would be sent (for debugging)
        console.log('Upload data prepared:');
        console.log('Applicant:', applicantName);
        console.log('Files:', selectedFiles.map(f => ({
            name: f.name,
            size: f.size,
            identifier: f.identifier
        })));
        
        // Simulate upload (replace with actual endpoint)
        await simulateUpload(formData);
        
        showStatus('Files uploaded successfully! (This is a demo - no actual upload occurred)', 'success');
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Upload error:', error);
        showStatus('Upload failed. Please try again.', 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Files';
    }
}

/**
 * Simulate file upload (placeholder function)
 * @param {FormData} formData - The form data to upload
 */
async function simulateUpload(formData) {
    // This is a placeholder - replace with actual upload logic
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate network delay
            if (Math.random() > 0.1) { // 90% success rate for demo
                resolve();
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 2000);
    });
    
    // Real upload would look like this:
    /*
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return response.json();
    */
}

/**
 * Reset the form to initial state
 */
function resetForm() {
    // Clear form fields
    document.getElementById('applicantName').value = '';
    fileInput.value = '';
    
    // Clear selected files
    selectedFiles = [];
    fileIdCounter = 1;
    
    // Update display
    updateFileListDisplay();
    updateSubmitButton();
    
    // Clear status message after a delay
    setTimeout(() => {
        hideStatus();
    }, 5000);
}

/**
 * Show status message to user
 * @param {string} message - The message to show
 * @param {string} type - The message type (success, error, info)
 */
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide success and info messages
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            hideStatus();
        }, 4000);
    }
}

/**
 * Hide status message
 */
function hideStatus() {
    statusMessage.style.display = 'none';
}

// Add event listener for applicant name input to update submit button
document.getElementById('applicantName').addEventListener('input', updateSubmitButton);