<?php

// require_once('database.php');

require_once('db.php');

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);

header("Access-Control-Allow-Credentials: true");

header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type");

class API extends DB
{
	public function httpGet()
	{

	}

	public function httpPost($payload)
	{  	
		$username = $payload['username'];
        $email = $payload['email'];
        $password = $payload['password'];
		$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

		$search_existing_email = "SELECT email FROM `user_accounts_tb` WHERE email = '".$email."'";
		$result = $this->connection->query($search_existing_email);

		if ($result->num_rows > 0) {
			echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Email is already existing.'));
		} else {
			$add_user_account = "INSERT INTO user_accounts_tb (username, email, password) VALUES ('$username', '$email', '$hashedPassword')";
			$new_account = $this->connection->query($add_user_account);

			if ($new_account) {
				echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => 'Your account has been successfully created.'));
			} else {
				echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => 'Account creation failed. Please try again.'));
			}
		}

        $this->connection->close();
	}

	public function httpPut($payload)
	{
		
	}

	public function httpDelete($payload)
	{

	}
}

/* END OF CLASS */

$received_data = json_decode(file_get_contents('php://input'), true);

$request_method = $_SERVER['REQUEST_METHOD'];

$api = new API;

if ($request_method == 'GET') {
	$api->httpGet($received_data);
}

if ($request_method == 'POST') {
	$api->httpPost($received_data);
}

if ($request_method == 'PUT') {
	$api->httpPut($received_data);
}

if ($request_method == 'DELETE') {
	$api->httpDelete($received_data);
}
