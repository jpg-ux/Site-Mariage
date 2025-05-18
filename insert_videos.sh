#!/bin/bash

# Chemins
INDEX_HTML="index.html"
TEMP_FILE="index_temp.html"
VIDEO_DIRS=("vidéo" "photos")

# Générer le HTML des vidéos
VIDEO_HTML=$(mktemp)
echo "<div id=\"video-gallery\">" >> "$VIDEO_HTML"

for DIR in "${VIDEO_DIRS[@]}"; do
  if [ -d "$DIR" ]; then
    find "$DIR" -type f \( -iname "*.mp4" -o -iname "*.webm" -o -iname "*.mov" \) | sort | while read -r FILE; do
      BASENAME=$(basename "$FILE")
      TITLE="${BASENAME%.*}"
      echo "  <div class=\"video-block\">" >> "$VIDEO_HTML"
      echo "    <h3>${TITLE}</h3>" >> "$VIDEO_HTML"
      echo "    <video width=\"480\" controls>" >> "$VIDEO_HTML"
      echo "      <source src=\"$FILE\" type=\"video/mp4\">" >> "$VIDEO_HTML"
      echo "      Votre navigateur ne supporte pas la lecture vidéo." >> "$VIDEO_HTML"
      echo "    </video>" >> "$VIDEO_HTML"
      echo "  </div>" >> "$VIDEO_HTML"
    done
  fi
done

echo "</div>" >> "$VIDEO_HTML"

# Intégrer dans index.html
if grep -q '<div id="video-gallery">' "$INDEX_HTML"; then
  # Remplacer le contenu existant
  awk -v new_content="$(<"$VIDEO_HTML")" '
    BEGIN { in_gallery = 0 }
    /<div id="video-gallery">/ { print new_content; in_gallery = 1; next }
    in_gallery && /<\/div>/ { in_gallery = 0; next }
    !in_gallery { print }
  ' "$INDEX_HTML" > "$TEMP_FILE"
else
  # Ajouter avant la balise </body>
  awk -v new_content="$(<"$VIDEO_HTML")" '
    /<\/body>/ {
      print new_content;
      print;
      next;
    }
    { print }
  ' "$INDEX_HTML" > "$TEMP_FILE"
fi

# Remplacer l'ancien fichier
mv "$TEMP_FILE" "$INDEX_HTML"
rm "$VIDEO_HTML"

echo "Les vidéos ont été intégrées dans '$INDEX_HTML'."