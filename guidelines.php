<?php

$contextOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false
    )
);

$context = stream_context_create($contextOptions);

$GUIDE_ITEMS = array();

$GUIDE_URL ='https://docs.google.com/a/unitn.it/spreadsheets/d/1MhMoM17qN7bZNZ1v0xMginvBi9pakR4NFISTp47f9xI/export?format=csv&id=1MhMoM17qN7bZNZ1v0xMginvBi9pakR4NFISTp47f9xI&gid=691960774';


/* Load guidelines from Google Spreadsheets */                                   
function load_csv(){     
    global $GUIDE_ITEMS, $GUIDE_URL, $context;                                                                                   

    // open file for reading
    $n = 0;
    $media = FALSE;
    
    if (($handle = fopen($GUIDE_URL, "r", TRUE, $context)) !== FALSE)
    {
        while (($row = fgetcsv($handle, 1000, ",")) !== FALSE)
        {
            if ($n > 0 && $row[0] != '') {            
                            
                $pub = array(
                    "id" => $row[0],
                    "count" => $row[1],
                    "ability_1" => $row[2],
                    "ability_2" => $row[3],
                    "severity" => $row[4],
                    "design_1" => $row[5],
                    "design_2" => $row[6],
                    "guideline" => $row[7],
                    "ref"       => $row[8],
                    "ref_title" => $row[9],
                    "device"    => $row[10]                    
                );

                array_push($GUIDE_ITEMS, $pub);      
            }
            $n++;
        }
        fclose($handle);
    }
}

/* dump the array to json */
function to_json_guidelines(){
  global $GUIDE_ITEMS;
  $json = json_encode($GUIDE_ITEMS);
  print $json;
}

load_csv();
to_json_guidelines();

?>