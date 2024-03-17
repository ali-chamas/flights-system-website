<?PHP
 
 include("../db/connection.php");

 
 $request_method = $_SERVER["REQUEST_METHOD"];

 if($request_method=="POST"){

  

    $flightID = intval($_POST["flightID"]);
    $userID=intval($_POST["userID"]);
    $rate= $_POST["rating"];
    $review= $_POST["review"];
    
    
    $response = rateFlight($userID,$flightID,$rate, $review);
    echo json_encode($response);



 }
 function rateFlight($userID,$flightID,$rate, $review){
  global $mysqli; 
  $query = $mysqli->prepare("insert into flightsreviews(rating,review,userID,flightID) values(?,?,?,?)");
  $query->bind_param("ssii",$rate,$review, $userID,$flightID);
  if($query->execute()){
      $updateAverage=$mysqli->prepare("
      update flights as f
      Set rating=(
        select AVG(r.rating)
        from flightsreviews as r
        where f.id=r.flightID
      )
      where f.id=?
      ");
      $updateAverage->bind_param("i",$flightID);
      if($updateAverage->execute())
      $response["status"]= "success";

      else 
      $response["status"]="failed";
  }else{
      $response["status"]= "failed";
  }
  return $response;
}