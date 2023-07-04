<?php

session_start();
date_default_timezone_set('Asia/Singapore');

require_once('db.php');
require('vendor/autoload.php');

use PHPMailer\PHPMailer\PHPMailer;

class API extends DB
{
	public function httpGet()
	{
		$email = $_GET['email'];

		$search_email_address_query = "SELECT user_id, username, email FROM user_accounts_tb WHERE email = ?";
		$statement = $this->connection->prepare($search_email_address_query);
		$statement->bind_param("s", $email);
		$statement->execute();
		$result = $statement->get_result();

		if ($result->num_rows > 0) {
			$user = $result->fetch_assoc();

			$user_data = array(
				'action' => 'resend_code',
				'action2' => 'forgot_password',
				'user_id' => $user['user_id'],
				'email' => $user['email']
			);

			echo json_encode(array('method' => 'GET', 'status' => 'success', 'message' => 'We found your email address. Please verify your email address.', 'data' => $user_data));
		} else {
			echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'User not found'));
		}
	}

	public function httpPost($payload)
	{  	
		$action = $payload['action'];

		if ($action === 'signup') {

			$username = $payload['username'];
			$email = $payload['email'];
			$password = $payload['password'];
			$hashed_password = password_hash($password, PASSWORD_DEFAULT);
			$date_created = date('Y-m-d H:i:s');

			$search_existing_user = "SELECT username, email FROM user_accounts_tb WHERE email = ? OR username = ?";
			$statement = $this->connection->prepare($search_existing_user);
			$statement->bind_param("ss", $email, $username);
			$statement->execute();
			$result = $statement->get_result();

			if ($result->num_rows > 0) {
				$existing_user = $result->fetch_assoc();

				if ($existing_user['email'] === $email) {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Email is already existing.'));
				} else if ($existing_user['username'] === $username) {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Username is already taken.'));
				}
			} else {
				$verification_code = $this->emailVerification($email);

				$add_user_account = "INSERT INTO user_accounts_tb (username, email, password, verification_code, date_created) VALUES (?, ?, ?, ?, ?)";
				$statement = $this->connection->prepare($add_user_account);
				$statement->bind_param("sssss", $username, $email, $hashed_password, $verification_code, $date_created);
				$new_account = $statement->execute();

				if ($new_account) {
					$user_id = $statement->insert_id;

					$user_data = array(
						'user_id' => $user_id,
						'email' => $email
					);
					echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Account creation successful. Please verify your email address.', 'data' => $user_data));
				} else {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Account creation failed. Please try again.'));
				}
			}
		} else if ($action === 'login') {
			$usernameOrEmail = $payload['usernameOrEmail'];
			$password = $payload['password'];

			$search_user = "SELECT * FROM user_accounts_tb WHERE (username = ? OR email = ?)";
			$statement = $this->connection->prepare($search_user);
			$statement->bind_param("ss", $usernameOrEmail, $usernameOrEmail);
			$statement->execute();
			$result = $statement->get_result();

			if ($result->num_rows > 0) {
				$user = $result->fetch_assoc();

				$user_data = array(
					'user_id' => $user['user_id'],
					'username' => $user['username'],
					'email' => $user['email'],
					'password' => $password,
					'profile_image_url' => $user['profile_image_url']
				);

				if ($user['email_verified_at'] !== null) {
					if (password_verify($password, $user['password'])) {
						echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Login successful.', 'data' => $user_data));
					} else {
						echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Incorrect username/email address or password.'));
					}
				} else {
					echo json_encode(array('method' => 'POST', 'status' => 'warning', 'message' => 'Please verify your email account before signing in.', 'data' => $user_data));
				}
			} else {
				echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'User not found.'));
			}
		} else {
			echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Unknown action.'));
		}

        $this->connection->close();
	}

	public function httpPut($payload)
	{
		$action = $payload['action'];

		if($action === 'verify_email') {
			$user_id = $payload['user_id'];
			$verification_code = $payload['verification_code'];
			$email_verified_at = date('Y-m-d H:i:s');

			$statement = $this->connection->prepare("SELECT verification_code FROM user_accounts_tb WHERE user_id = ?");
			$statement->bind_param("s", $user_id);
			$statement->execute();
			$result = $statement->get_result();
			$row = $result->fetch_assoc();

			if ($row && $verification_code === $row['verification_code']) {
				$verify_account_query = "UPDATE user_accounts_tb SET email_verified_at = ? WHERE user_id = ?";
				$statement = $this->connection->prepare($verify_account_query);
				$statement->bind_param("ss", $email_verified_at, $user_id);
				$statement->execute();

				echo json_encode(array('method' => 'PUT', 'status' => 'success', 'message' => 'You have successfully verified your account.'));
			} else {
				echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'Verification code failed.'));
			}
		} else if ($action === 'resend_code') {
			$user_id = $payload['user_id'];
			$email = $payload['email'];
			$verification_code = $this->emailVerification($email);
			$email_verified_at = null;

			$resend_code_query = "UPDATE user_accounts_tb SET verification_code = ?, email_verified_at = ? WHERE user_id = ?";
			$statement = $this->connection->prepare($resend_code_query);
			$statement->bind_param("sss", $verification_code, $email_verified_at, $user_id);
			$execution = $statement->execute();

			if ($execution) {
				echo json_encode(array('method' => 'PUT', 'status' => 'success', 'message' => 'Verification code successfully resent to your email address.'));
			} else {
				echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'Failed to resend the verification code to your email address.'));
			}
		} else if ($action === 'new_password') {
			$user_id = $payload['user_id'];
			$password = $payload['newPassword'];
			$hashed_password = password_hash($password, PASSWORD_DEFAULT);

			$new_password_query = "UPDATE user_accounts_tb SET password = ? WHERE user_id = ?";
			$statement = $this->connection->prepare($new_password_query);
			$statement->bind_param("ss", $hashed_password, $user_id);
			$execution = $statement->execute();

			if ($execution) {
				echo json_encode(array('method' => 'PUT', 'status' => 'success', 'message' => 'Password changed successfully.'));
			} else {
				echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'Failed to change password. Please try again.'));
			}
		} else if ($action === 'update_user_credentials') {
			$user_id = $payload['user_id'];

			$search_existing_user = 'SELECT username, email FROM user_accounts_tb WHERE email = ? OR username = ?';
			$statement = $this->connection->prepare($search_existing_user);
			$statement->bind_param('ss', $payload['email'], $payload['username']);
			$statement->execute();
			$result = $statement->get_result();

			if ($result->num_rows > 0) {
				$existing_user = $result->fetch_assoc();

				if ($existing_user['email'] === $payload['email']) {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Email is already existing.', 'error' => 'email'));
				} else if ($existing_user['username'] === $payload['username']) {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Username is already taken.', 'error' => 'username'));
				}
			} else {
				$update_user_credentials_query = "UPDATE user_accounts_tb SET ";
				$update_params = array();
				$param_types = '';

				if (isset($payload['username'])) {
					$update_user_credentials_query .= "username = ?, ";
					$update_params[] = $payload['username'];
					$param_types .= 's';
				}

				if (isset($payload['email'])) {
					$update_user_credentials_query .= "email = ?, ";
					$update_params[] = $payload['email'];
					$param_types .= 's';
				}

				if (isset($payload['password'])) {
					$hashed_password = password_hash($payload['password'], PASSWORD_DEFAULT);
					$update_user_credentials_query .= "password = ?, ";
					$update_params[] = $hashed_password;
					$param_types .= 's';
					$user_data['password'] = $payload['password'];
				}

				if (isset($payload['profilePictureFile'])) {
					$update_user_credentials_query .= "profile_image_url = ?, ";
					$update_params[] = './assets/users/' . $payload['profilePictureFile'];
					$param_types .= 's';
				}

				$update_user_credentials_query = rtrim($update_user_credentials_query, ', ');
				$update_user_credentials_query .= " WHERE user_id = $user_id";
				$statement = $this->connection->prepare($update_user_credentials_query);

				foreach ($update_params as $key => $value) {
					$statement->bind_param($param_types, ...$update_params);
				}

				$execution = $statement->execute();

				if ($execution) {
					// if (isset($payload['profilePictureFile'])) {
					// 	$folder = '.mobile-dev-finals/assets/users/' . basename($payload['profilePictureFile']);
					// 	copy($payload['profilePictureFile'], $folder);
					// }

					$search_user = 'SELECT * FROM user_accounts_tb WHERE user_id = ?';
					$statement = $this->connection->prepare($search_user);
					$statement->bind_param('s', $user_id);
					$statement->execute();
					$result = $statement->get_result();

					$user = $result->fetch_assoc();

					$user_data = array(
						'user_id' => $user['user_id'],
						'username' => $user['username'],
						'email' => $user['email'],
						'profile_image_url' => $user['profile_image_url']
					);
					echo json_encode(array('method' => 'PUT', 'status' => 'success', 'message' => 'User profile updated successfully.', 'data' => $user_data));
				} else {
					echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'Failed to update user profile.'));
				}
			}
		} else {
			echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Unknown action.'));
		}

		$this->connection->close();
	}

	public function httpDelete($payload)
	{

	}

	private function emailVerification($user_email)
	{
		$mail = new PHPMailer(true);

		//Enable verbose debug output
		$mail->SMTPDebug = 0; //SMTP::DEBUG_SERVER;

		//Send using SMTP
		$mail->isSMTP();

		//Set the SMTP server to send through
		$mail->Host = 'smtp.gmail.com';

		//Enable SMTP authentication
		$mail->SMTPAuth = true;

		//SMTP username
		$mail->Username = 'plantparenthoodassistant@gmail.com';

		//SMTP password
		$mail->Password = 'njjtgksukhvgsclc';

		//Enable TLS encryption;
		$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

		//TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
		$mail->Port = 587;

		//Recipients
		$mail->setFrom('plantparenthoodassistant@gmail.com', 'Plant Parenthood Assistant');

		//Add a recipient
		$mail->addAddress($user_email);

		//Set email format to HTML
		$mail->isHTML(true);

		$verification_code = substr(number_format(time() * rand(), 0, '', ''), 0, 6);

		$mail->Subject = 'Email verification';
		$mail->Body    = '<p>Your verification code is: <b style="font-size: 30px;">' . $verification_code . '</b></p>';

		$mail->send();

		return $verification_code;
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
