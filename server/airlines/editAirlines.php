<?PHP
 
 include("../db/connection.php");

 
 $request_method = $_SERVER["REQUEST_METHOD"];

 if($request_method=="POST"){

  if(!empty($_GET["id"])){
    $id = intval($_GET["id"]);
    
    
    $name= $_POST["name"];
    $logo= $_POST["logo"];
    
    
    $response = editAirline($id,$name, $logo);
    echo json_encode($response);

}

 }
 function editAirline($id,$name, $logo){
  global $mysqli; 
  $query = $mysqli->prepare("UPDATE airlines SET name=?,logo=? WHERE id=?");
  $query->bind_param("ssi",$name,$logo, $id);
  if($query->execute()){
      
      $response["status"]= "success";
  }else{
      $response["status"]= "failed";
  }
  return $response;
}