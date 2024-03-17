<?php



include("../db/connection.php");

$email = $_POST['email'];
$password = $_POST['password'];

$query = $mysqli->prepare('select *
from users
where email=?');
$query->bind_param('s', $email);
$query->execute();
$query->store_result();
$query->bind_result($id, $name,$email,$hashed_password,$image,$coins,$isAdmin);
$query->fetch();
$num_rows = $query->num_rows();

if ($num_rows == 0) {
    $response['status'] = "user not found";
} else {
    if (password_verify($password, $hashed_password)) {
        $response['status'] = "logged in";
        $response['user']=[
            'id'=>$id,
            'name'=>$name,
            'email'=>$email,
            'image'=>$image,
            'coins'=>$coins,
            'isAdmin'=>$isAdmin
    
        ];
    } else {
        $response['status'] = "incorrect credentials";
    }
}
echo json_encode($response);