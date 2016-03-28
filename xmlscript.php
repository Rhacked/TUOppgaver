<?php
/*
*Script til oppgave 2.
*/
$xml = simplexml_load_file($argv[1]);
foreach($xml->channel->children() as $children){
    if($children->category['nicename']=="artikler"){
        echo $children->title;
        echo "\n";
    }
}
?>