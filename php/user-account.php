<?php

session_start();

require_once('db.php');

header("Access-Control-Allow-Credentials: true");

header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");

header("Access-Control-Allow-Headers: Content-Type");

class API extends DB
{
	public function httpGet()
	{
		$get_all_users = "SELECT * FROM user_accounts_tb WHERE user_id = '".$_SESSION['user_id']."'";
		$result = $this->connection->query($get_all_users);

		if ($result) {
			$users = mysqli_fetch_all($result, MYSQLI_ASSOC);

			$specificUsers = array_map(function ($user) {
				return array(
					'user_id' => $user['user_id'],
					'username' => $user['username'],
					'email' => $user['email']
				);
			}, $users);
			
			echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => $specificUsers));
		  } else {
			echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => 'Failed to retrieve users.'));
		  }
	}

	public function httpPost($payload)
	{  	
		if ($payload['action'] === 'signup') {

			$username = $payload['username'];
			$email = $payload['email'];
			$password = $payload['password'];
			$hashed_password = password_hash($password, PASSWORD_DEFAULT);

			$search_existing_user = "SELECT username, email FROM user_accounts_tb WHERE email = '".$email."' OR username = '".$username."'";
			$result = $this->connection->query($search_existing_user);

			if ($result->num_rows > 0) {
				$existing_user = $result->fetch_assoc();

				if ($existing_user['email'] === $email) {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Email is already existing.'));
				} else if ($existing_user['username'] === $username) {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Username is already taken.'));
				}
			} else {
				$add_user_account = "INSERT INTO user_accounts_tb (username, email, password) VALUES ('$username', '$email', '$hashed_password')";
				$new_account = $this->connection->query($add_user_account);

				if ($new_account) {
					echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => 'Your account has been successfully created. You may now proceed to login.'));
				} else {
					echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => 'Account creation failed. Please try again.'));
				}
			}
		} else if ($payload['action'] === 'login') {
			$usernameOrEmail = $payload['usernameOrEmail'];
			$password = $payload['password'];

			$search_user = "SELECT * FROM user_accounts_tb WHERE (username = '".$usernameOrEmail."' OR email = '".$usernameOrEmail."')";
			$result = $this->connection->query($search_user);

			if ($result->num_rows > 0) {
				$user = $result->fetch_assoc();

				if (password_verify($password, $user['password'])) {

					$_SESSION['user_id'] = $user['user_id'];
					$_SESSION['username'] = $user['username'];

					echo json_encode(array('method' => 'GET', 'status' => 'success', 'data' => 'Login successful.', 'username' => $_SESSION['username']));
				} else {
					echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => 'Incorrect username/email address or password.'));
				}
			} else {
				echo json_encode(array('method' => 'GET', 'status' => 'failed', 'data' => 'User not found.'));
			}
		} else {
			echo json_encode(array('method' => 'POST', 'status' => 'failed', 'data' => 'Unknown action.'));
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
