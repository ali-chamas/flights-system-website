<?php
include("../db/connection.php");


$request_method = $_SERVER["REQUEST_METHOD"];

if($request_method=="POST"){
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$image=$_POST['image'];

$check_email = $mysqli->prepare('select email from users where email=?');
$check_email->bind_param('s', $email);
$check_email->execute();
$check_email->store_result();
$email_exists = $check_email->num_rows();


if ($email_exists == 0) {
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $query = $mysqli->prepare('insert into users(name,email,password,image) values(?,?,?,?);');
    $query->bind_param('ssss', $name, $email, $hashed_password,$image);
    $query->execute();
    $query->store_result();
   
    $getUsers=$mysqli->prepare('select * from users where email=?');
    $getUsers->bind_param('s', $email);
    $getUsers->execute();
    $getUsers->store_result();
    $getUsers->bind_result($id,$newName,$newEmail,$newPassword,$newImage,$coins,$isAdmin);
    $getUsers->fetch();
    $fetchedUser=$getUsers->num_rows();
    if($fetchedUser==0){
        $response['status']='error';
    }
    else{
    $response["status"]='success';
    $response['user']=[
        'id'=>$id,
        'name'=>$newName,
        'email'=>$newEmail,
        'image'=>$newImage,
        'coins'=>$coins,
        'isAdmin'=>$isAdmin

    ];
    }

} else {
    $response["status"] = "user already exists";
    $response["message"] = "user $name wasn't created";
}
echo json_encode($response);
}