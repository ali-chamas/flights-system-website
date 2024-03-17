<?PHP
 
 include("../db/connection.php");

 $request_method = $_SERVER["REQUEST_METHOD"];

 switch ($request_method) {
    case "GET":
        if(!empty($_GET["id"])){
            $id = intval($_GET["id"]);
            $response = getUser($id);
            echo json_encode($response);
        }else{
            $response = getAllUsers();
            echo json_encode($response);
        }
    break;
    case 'DELETE':
        if(!empty($_GET["id"])){
            $id = intval($_GET["id"]);
            $response = deleteUser($id);
            echo json_encode($response);
        }else{
            echo json_encode([
                "status"=>"something went wrong",
            ]);
        }
        break;

   
    
    default:
        echo json_encode([
            "status"=>"something went wrong",
        ]);
        break;
 }

 function getUser($id){
    global $mysqli;
    $query=$mysqli->prepare("select * from users where id = ?");
    $query->bind_param("i",$id);
    $query->execute();
    $query->store_result();
    $query->bind_result($id,$name,$email,$password,$image,$coins,$isAdmin); 
    $query->fetch();

    $response['status']="Success";
    $response["user"]= [
        'id'=>$id,
        'name'=>$name,
        'email'=>$email,
        'password'=>$password,
        'image'=>$image,
        'coins'=>$coins,
        'isAdmin'=>$isAdmin,
    ];

    return $response;

 }

 function getAllUsers(){
    global $mysqli;
    $query=$mysqli->prepare('select * from users');
    $query->execute();
    $query->store_result();
    $query->bind_result($id,$name,$email,$password,$image,$coins,$isAdmin); 
    $totalRows=$query->num_rows;
    if($totalRows==0){
        $response['status']='failed';
        $response['message']= 'no users found';
    }else{
        $users=[];
        while($query->fetch()){
            $user=[
                'id'=>$id,
                'name'=>$name,
                'email'=>$email,
                'password'=>$password,
                'image'=>$image,
                'coins'=>$coins,
                'isAdmin'=>$isAdmin,
            ];
            $users[]=$user;
        }
        $response['status']='success';
        $response['users']=$users;
    }
    return $response;
 }

 function deleteUser($id){
    global $mysqli;
    
    $query = $mysqli->prepare("DELETE FROM bookings WHERE userID = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $query = $mysqli->prepare("DELETE FROM flightsreviews WHERE userID = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $query = $mysqli->prepare("DELETE FROM airlinesreviews WHERE userID = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $query = $mysqli->prepare("DELETE FROM messages WHERE userID = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $query = $mysqli->prepare("DELETE FROM users WHERE id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    
    $response["status"] = "Success";

    return $response;
 }