<?php
if($t == "test"){
    $data['status'] = 200;

    header("Content-type: application/json");
    echo json_encode($data);
    mysqli_close($dbConnect);
    exit();
}