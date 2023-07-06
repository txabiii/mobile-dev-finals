<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Check if a file was uploaded
if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $tempFile = $_FILES['file']['tmp_name'];
    $originalFileName = $_FILES['file']['name'];
    
    // Specify the directory where you want to save the uploaded file
    $uploadDirectory = __DIR__ . '/uploads/';
    
    // Generate a unique filename to avoid conflicts
    $newFileName = uniqid() . '_' . $originalFileName;
    
    // Move the uploaded file to the desired directory
    $destination = $uploadDirectory . $newFileName;
    move_uploaded_file($tempFile, $destination);
    
    // Prepare the response
    $response = [
        'success' => true,
        'message' => 'File uploaded successfully.',
        'file_path' => $destination,
    ];
} else {
    // Handle the error if file upload failed
    $response = [
        'success' => false,
        'message' => 'Error uploading file.',
    ];
}

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>