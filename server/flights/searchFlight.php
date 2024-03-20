<?php

include("../db/connection.php");

$destination=$_GET["destination"];


$query = $mysqli->prepare('
SELECT id from flights where destination = ?

');
$query->bind_param('s', $destination);
$query->execute();
$query->store_result();
$num_rows = $query->num_rows();

if ($num_rows == 0) {
    $response['status'] = "failed";
} else {
   
    $query->bind_result($id);
    $query->fetch();

    $response['status'] = "success";
    $response['id'] = $id;
}

echo json_encode($response);