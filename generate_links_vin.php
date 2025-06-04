<?php
// CONFIGURATION
$sharedLink = 'https://cloud.cezannefamily.fr:16443/s/yPYgRDZWqcfFnd7'; // lien public du dossier "vin"
$webdavUrl = 'https://cloud.cezannefamily.fr:16443/remote.php/dav/files/jeanpierregau/photos/vin/';
$username = 'jeanpierre37';
$password = 'Ynjw3ruaUJ.b2Mm'; 
$outputFile = 'photoList.js';

// Recuperer la liste des fichiers depuis WebDAV
$ch = curl_init();
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Depth: 1']);
curl_setopt($ch, CURLOPT_URL, $webdavUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PROPFIND');
$response = curl_exec($ch);
if (!$response) {
    die("Erreur WebDAV : " . curl_error($ch));
}
curl_close($ch);

// Extraire les noms des fichiers image
$photos = [];
preg_match_all('/<d:href>(.*?)<\/d:href>/', $response, $matches);
foreach ($matches[1] as $href) {
    $filename = urldecode(basename($href));
    if (preg_match('/\.(jpg|jpeg|png)$/i', $filename)) {
        $photos[] = $filename;
    }
}

// Trier par nom naturel
sort($photos, SORT_NATURAL | SORT_FLAG_CASE);

// Generer le fichier photoList.js
$js = "const photos = [\n";
foreach ($photos as $file) {
    $url = $sharedLink . "/preview?file=/" . rawurlencode($file);
    $js .= "  \"$url\",\n";
}
$js .= "];\n";
file_put_contents($outputFile, $js);

echo "Fichier $outputFile genere avec " . count($photos) . " photos.\n";
