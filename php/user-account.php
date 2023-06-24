<?php

require_once('database.php');

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);

header("Access-Control-Allow-Credentials: true");

header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type");

class API
{
	public function httpGet()
	{
        global $connection;

        $query = "SELECT * FROM test_tb";
        $result = $connection->query($query);


		if ($result) {
			echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => 'success'));
		} else {
			echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => 'failed'));
		}

        $connection->close();
	}

	public function httpPost($payload)
	{  
        global $connection;

        $username = $payload['username'];
        $email = $payload['email'];
        $password = $payload['password'];

        $query = "INSERT INTO `user_accounts_tb`( `username`, `email`, `password`) VALUES ('$username', '$email', '$password')";
        $result = $connection->query($query);


		if ($result) {
			echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => 'success'));
		} else {
			echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => 'failed'));
		}

        $connection->close();
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
