#!/bin/bash

cd /home/jeanpierregau/Site-Mariage || exit 1

# Genere le fichier JS e jour (tu peux aussi appeler le script PHP ici si tu veux tout enchainer)
php generate_links_mairie.php

# Ajoute les changements
git add js/photoList-mairie.js

# Commit avec date automatique
git commit -m "Mise a jour des photos mairie - $(date +'%d/%m/%Y %H:%M')"

# Push vers GitHub
git push origin main
