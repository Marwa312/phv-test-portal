/**
 * PHV Upload Portal - Client-side JavaScript
 * Handles file validation, management, form submission, and email notifications
 */

// EmailJS Configuration - Replace with your actual EmailJS credentials
const SERVICE_ID = "service_cl8wqsf";
const TEMPLATE_ID = "template_xsv6zey";
const PUBLIC_KEY = "5bWPJQF6Mg1jmRoM5";

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
const applicantNameInput = document.getElementById('applicantName');
const applicantEmailInput = document.getElementById('applicantEmail');
const applicantMessageInput = document.getElementById('applicantMessage');

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
    const applicantName = applicantNameInput.value.trim();
    const applicantEmail = applicantEmailInput.value.trim();
    const hasFiles = selectedFiles.length > 0;
    
    submitBtn.disabled = !(applicantName && applicantEmail && hasFiles);
}

/**
 * Handle form submission
 * @param {Event} event - The form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const applicantName = applicantNameInput.value.trim();
    const applicantEmail = applicantEmailInput.value.trim();
    const applicantMessage = applicantMessageInput.value.trim();
    
    // Final validation
    if (!applicantName) {
        showStatus('Please enter your name.', 'error');
        return;
    }
    
    if (!applicantEmail) {
        showStatus('Please enter your email address.', 'error');
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
        
        // Upload files to Supabase Storage
        const uploadResults = await uploadMultipleFiles(
            selectedFiles.map(f => f.file), 
            'user-uploads'  // Folder name in the uploads bucket
        );
        
        console.log('Upload results:', uploadResults);
        showStatus('Files uploaded successfully to Supabase!', 'success');
        
        // Send email notification after successful upload
        await sendEmailNotification(applicantName, applicantEmail, applicantMessage, uploadResults);
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Upload error:', error);
        showStatus('Upload failed: ' + error.message, 'error');
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
    applicantNameInput.value = '';
    applicantEmailInput.value = '';
    applicantMessageInput.value = '';
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

/**
 * Send email notification using EmailJS after successful upload
 * @param {string} applicantName - The name of the applicant
 * @param {string} applicantEmail - The email of the applicant
 * @param {string} applicantMessage - The message from the applicant
 * @param {Array} uploadResults - Array of upload results from Supabase
 */
async function sendEmailNotification(applicantName, applicantEmail, applicantMessage, uploadResults) {
    try {
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not loaded. Skipping email notification.');
            return;
        }

        // Check if EmailJS credentials are configured
        if (SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID" || 
            TEMPLATE_ID === "YOUR_EMAILJS_TEMPLATE_ID" || 
            PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY") {
            console.warn('EmailJS credentials not configured. Skipping email notification.');
            return;
        }

        // Initialize EmailJS with your public key
        emailjs.init(PUBLIC_KEY);

        // Prepare email template parameters
        const templateParams = {
            to_name: 'PHV Team', // Recipient name
            from_name: applicantName, // Sender name
            from_email: applicantEmail, // Sender email
            message: applicantMessage || `New file upload from ${applicantName}`,
            uploaded_files_html: uploadResults.map(result => 
                `<a href="${result.publicUrl}" style="color: #667eea; text-decoration: underline;">${result.fileName}</a> (${formatFileSize(result.fileSize)}, ${result.fileType})`
            ).join('<br>'),
            uploaded_files_text: uploadResults.map(result => 
                `${result.fileName}: ${result.publicUrl}`
            ).join('\n'),
            file_count: uploadResults.length,
            upload_date: new Date().toLocaleString()
        };

        console.log('Sending email notification...', templateParams);

        // Send email using EmailJS
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        
        console.log('Email sent successfully:', response);
        showStatus('Email notification sent successfully!', 'success');

    } catch (error) {
        console.error('Email sending failed:', error);
        // Don't show error to user as upload was successful
        // Just log it for debugging
        console.warn('Email notification failed, but upload was successful');
    }
}

/**
 * Format file size for display in email
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
function formatFileSizeForEmail(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add event listeners for form inputs to update submit button
applicantNameInput.addEventListener('input', updateSubmitButton);
applicantEmailInput.addEventListener('input', updateSubmitButton);

// Dark mode toggle functionality
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const toggle = document.getElementById('darkModeToggle');
    toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load dark mode preference on page load
document.addEventListener('DOMContentLoaded', function() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = '☀️';
    }
});