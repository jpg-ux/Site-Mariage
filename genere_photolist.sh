#!/bin/bash

# Liens publics Nextcloud
PHOTO_KEY="xKfrzJzk3d8mq3s"
PHOTO_LINK="https://cloud.cezannefamily.fr:16443/public.php/webdav"

MINI_KEY="ei4dSHdXdr8RG3R"
MINI_LINK="https://cloud.cezannefamily.fr:16443/public.php/webdav"

# Categories de sous-repertoires
categories=("mairie" "eglise" "vin" "fete" "couples")

# Dossier de sortie
mkdir -p output

for cat in "${categories[@]}"; do
    echo "Traitement : $cat"

    # Recuperation des fichiers miniatures
    thumbs=$(curl -s -u "$MINI_KEY:" -X PROPFIND -H "Depth: 1" \
        "$MINI_LINK/$cat/" -H "Content-Type: application/xml" | \
        xmlstarlet sel -t -m "//d:response" \
        -v "substring-after(d:href, '/webdav/$cat/')" -n 2>/dev/null | \
        grep '_resultat\.jpg$' | sort)

    # Generation du fichier photoList-<cat>.js
    out="output/photoList-$cat.js"
    echo "const photoList = [" > "$out"

   for thumb in $thumbs; do
        full=$(echo "$thumb" | sed 's/_resultat//')
        echo "  {" >> "$out"
        echo "    thumb: 'https://cloud.cezannefamily.fr:16443/s/$MINI_KEY/download/$cat/$thumb'," >> "$out"
        echo "    url:   'https://cloud.cezannefamily.fr:16443/s/$PHOTO_KEY/download/$cat/$full'" >> "$out"
        echo "  }," >> "$out"
    done

    echo "];" >> "$out"
    echo "Fichier genere : $out"
done
