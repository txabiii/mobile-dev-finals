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
			$users = $result->fetch_all(MYSQLI_ASSOC);

			echo json_encode(array('method' => 'GET', 'status' => 'success', 'message' => 'We found your email address. Please verify your email address.'));
		} else {
			echo json_encode(array('method' => 'GET', 'status' => 'failed', 'message' => 'User not found'));
		}
	}

	public function httpPost($payload)
	{  	
		if ($payload['action'] === 'signup') {

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
					echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Account creation successful. Please verify your email address.', 'user_id' => $user_id, 'email' => $email));
				} else {
					echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Account creation failed. Please try again.'));
				}
			}
		} else if ($payload['action'] === 'login') {
			$usernameOrEmail = $payload['usernameOrEmail'];
			$password = $payload['password'];

			$search_user = "SELECT * FROM user_accounts_tb WHERE (username = ? OR email = ?)";
			$statement = $this->connection->prepare($search_user);
			$statement->bind_param("ss", $usernameOrEmail, $usernameOrEmail);
			$statement->execute();
			$result = $statement->get_result();

			if ($result->num_rows > 0) {
				$user = $result->fetch_assoc();

				if ($user['email_verified_at'] !== null) {
					if (password_verify($password, $user['password'])) {
						$_SESSION['user_id'] = $user['user_id'];
						$_SESSION['username'] = $user['username'];

						echo json_encode(array('method' => 'POST', 'status' => 'success', 'message' => 'Login successful.', 'username' => $_SESSION['username']));
					} else {
						echo json_encode(array('method' => 'POST', 'status' => 'failed', 'message' => 'Incorrect username/email address or password.'));
					}
				} else {
					echo json_encode(array('method' => 'POST', 'status' => 'warning', 'message' => 'Please verify your email account before signing in.', 'user_id' => $user['user_id'], 'email' => $user['email']));
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
		if($payload['action'] === 'verify_email') {
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
		} else if ($payload['action'] === 'resend_code') {
			$user_id = $payload['user_id'];
			$email = $payload['email'];
			$verification_code = $this->emailVerification($email);

			$resend_code_query = "UPDATE user_accounts_tb SET verification_code = ? WHERE user_id = ?";
			$statement = $this->connection->prepare($resend_code_query);
			$statement->bind_param("ss", $verification_code, $user_id);

			if ($statement->execute()) {
				echo json_encode(array('method' => 'PUT', 'status' => 'success', 'message' => 'Verification code successfully resent to your email address.'));
			} else {
				echo json_encode(array('method' => 'PUT', 'status' => 'failed', 'message' => 'Failed to resend the verification code to your email address.'));
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
