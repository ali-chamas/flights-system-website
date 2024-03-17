<?PHP
 
 include("../db/connection.php");

 
 $request_method = $_SERVER["REQUEST_METHOD"];

 if($request_method=="POST"){

  if(!empty($_GET["id"])){
    $id = intval($_GET["id"]);
    
    
    $departureTime= $_POST["departureTime"];
    $arrivalTime= $_POST["arrivalTime"];
    
    
    $response = rescheduleFlight($id,$departureTime,$arrivalTime);
    echo json_encode($response);

}

 }
 function rescheduleFlight($id,$departureTime,$arrivalTime){
  global $mysqli; 
  $query = $mysqli->prepare("UPDATE flights SET departureTime=?,arrivalTime=? WHERE id=?");
  $query->bind_param("ssi",$departureTime,$arrivalTime, $id);
  if($query->execute()){
      $updateStatus=$mysqli->prepare('UPDATE tickets SET status="scheduled" WHERE flightID=?');
      $updateStatus->bind_param('i',$id);
      if($updateStatus->execute())
      $response["status"]= "success";
  }else{
      $response["status"]= "failed";
  }
  return $response;
}