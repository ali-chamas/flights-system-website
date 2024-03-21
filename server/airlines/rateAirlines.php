<?PHP
 
 include("../db/connection.php");

 
 $request_method = $_SERVER["REQUEST_METHOD"];

 if($request_method=="POST"){

  

    $airlineID = intval($_POST["airlineID"]);
    $userID=intval($_POST["userID"]);
    $rate= $_POST["rating"];
    $review= $_POST["review"];
    
    
    $response = rateAirlines($userID,$airlineID,$rate, $review);
    echo json_encode($response);



 }
 function rateAirlines($userID,$airlineID,$rate, $review){
  global $mysqli; 
  $query = $mysqli->prepare("insert into airlinesreviews(rating,review,userID,airlineID) values(?,?,?,?)");
  $query->bind_param("ssii",$rate,$review, $userID,$airlineID);
  if($query->execute()){
      $updateAverage=$mysqli->prepare("
      update airlines as a
      Set rating=(
        select AVG(r.rating)
        from airlinesreviews as r
        where a.id=r.airlineID
      )
      where a.id=?
      ");
      $updateAverage->bind_param("i",$airlineID);
      if($updateAverage->execute())
      $response["status"]= "success";

      else 
      $response["status"]="failed";
  }else{
      $response["status"]= "failed";
  }
  return $response;
}