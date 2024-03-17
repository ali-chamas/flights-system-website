<?PHP
 
 include("../db/connection.php");

 
 $request_method = $_SERVER["REQUEST_METHOD"];

 if($request_method=="POST"){

  if(!empty($_GET["id"])){
    $id = intval($_GET["id"]);
    
    
    $name= $_POST["name"];
    $password= $_POST["password"];
    $image= $_POST["image"];
    
    
    $response = edituser($id,$name,$password,$image);
    echo json_encode($response);

}

 }
 function edituser($id,$name,$password,$image){
  global $mysqli; 
  $hashed_password = password_hash($password, PASSWORD_BCRYPT);
  $query = $mysqli->prepare("UPDATE users SET name=?,password=?,image=? WHERE id=?");
  $query->bind_param("sssi",$name,$hashed_password,$image, $id);
  if($query->execute()){
     $response['status']="success";
  }else{
      $response["status"]= "failed";
  }
  return $response;
}