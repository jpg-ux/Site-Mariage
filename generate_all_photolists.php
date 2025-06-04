<?php
$categories = [
    'vin' => [
        'folder' => __DIR__ . '/photos/vin',
        'share_url' => 'https://cloud.cezannefamily.fr:16443/s/yPYgRDZWqcfFnd7',
    ],
    'mairie' => [
        'folder' => __DIR__ . '/photos/mairie',
        'share_url' => 'https://cloud.cezannefamily.fr:16443/s/LnxrRncJFQtZePH',
    ],
    'eglise' => [
        'folder' => __DIR__ . '/photos/eglise',
        'share_url' => 'https://cloud.cezannefamily.fr:16443/s/R8YaBX43GDdcFa4',
    ],
    'fete' => [
        'folder' => __DIR__ . '/photos/fete',
        'share_url' => 'https://cloud.cezannefamily.fr:16443/s/rM8AwLrAsSoqEcm',
    ],
    'couples' => [
        'folder' => __DIR__ . '/photos/couples',
        'share_url' => 'https://cloud.cezannefamily.fr:16443/s/yMJZBcz7t4sxQjKour',
    ],
];

foreach ($categories as $cat => $data) {
    $folder = $data['folder'];
    $share = rtrim($data['share_url'], '/');
    $jsFile = "photoList-$cat.js";

    if (!is_dir($folder)) {
        echo "? Dossier introuvable pour '$cat' : $folder\n";
        continue;
    }

    $photos = glob("$folder/*.jpg");
    natsort($photos);

    $entries = [];
    foreach ($photos as $photoPath) {
        $fileName = basename($photoPath);
        $publicUrl = "$share/download/$fileName";
        $entries[] = "  \"$publicUrl\"";
    }

    $jsContent = "const photoList = [\n" . implode(",\n", $entries) . "\n];\n";
    file_put_contents($jsFile, $jsContent);
    echo "? $jsFile genere avec " . count($entries) . " photos.\n";
}
