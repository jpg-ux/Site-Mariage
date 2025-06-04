<?php
// Configuration
$nextcloud_url = "https://cloud.cezannefamily.fr:16443";
$username = "jeanpierre37";
$password = "Ynjw3ruaUJ.b2Mm";  // remplace par ton vrai mot de passe
$remote_path = "/photos/mairie";
$js_output_file = __DIR__ . "/js/photoList-mairie.js";

// Initialise WebDAV
$webdav_url = "$nextcloud_url/remote.php/dav/files/$username$remote_path/";
$ocs_api_url = "$nextcloud_url/ocs/v2.php/apps/files_sharing/api/v1/shares";

// Fonction pour lister les fichiers distants
function list_remote_files($url, $username, $password) {
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => "$username:$password",
        CURLOPT_HTTPHEADER => ["Depth: 1"],
        CURLOPT_CUSTOMREQUEST => "PROPFIND",
    ]);
    $response = curl_exec($curl);
    curl_close($curl);
    if (!$response) return [];

    // Parse XML brut pour extraire les noms de fichiers
    $files = [];
    $xml = simplexml_load_string($response);
    foreach ($xml->xpath("//d:response") as $file) {
        $href = (string)$file->xpath("d:href")[0];
        $basename = basename(urldecode($href));
        if (preg_match('/\.(jpe?g|png)$/i', $basename)) {
            $files[] = $basename;
        }
    }
    return $files;
}

// Fonction pour obtenir ou creer un lien de partage public
function get_or_create_share_link($file_path, $ocs_api_url, $username, $password) {
    // Verifie s'il existe deja un lien
    $curl = curl_init("$ocs_api_url?path=" . urlencode($file_path) . "&reshares=true&subfiles=true");
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => "$username:$password",
        CURLOPT_HTTPHEADER => ["OCS-APIRequest: true"],
    ]);
    $response = curl_exec($curl);
    curl_close($curl);

    if (strpos($response, "<status>ok</status>") !== false && preg_match('/<url>(.*?)<\/url>/', $response, $matches)) {
        return $matches[1];
    }

    // Sinon, cree un nouveau lien
    $post = http_build_query([
        "path" => $file_path,
        "shareType" => 3,
        "permissions" => 1
    ]);
    $curl = curl_init($ocs_api_url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => "$username:$password",
        CURLOPT_HTTPHEADER => ["OCS-APIRequest: true"],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $post
    ]);
    $response = curl_exec($curl);
    curl_close($curl);

    if (strpos($response, "<status>ok</status>") !== false && preg_match('/<url>(.*?)<\/url>/', $response, $matches)) {
        return $matches[1];
    }
    return null;
}

// ---- MAIN ----
echo "? Traitement du dossier distant : $remote_path\n";
$files = list_remote_files($webdav_url, $username, $password);
$links = [];
$created = 0;
foreach ($files as $file) {
    $path = "$remote_path/$file";
    $link = get_or_create_share_link($path, $ocs_api_url, $username, $password);
    if ($link) {
        $links[] = $link;
        $created++;
        echo "??  $file ? $link\n";
    } else {
        echo "? Erreur lien $file\n";
    }
}
// Genere le fichier JS
$content = "const photoList = [\n";
foreach ($links as $link) {
    $content .= "  \"$link\",\n";
}
$content .= "];\n";

file_put_contents($js_output_file, $content);
echo "? Fichier JS genere : $js_output_file ($created liens)\n";
?>

