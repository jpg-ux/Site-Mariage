#!/bin/bash

# Configuration
REPO_DIR="/home/jeanpierregau/Site-Mariage"   # a adapter si besoin
BRANCH="main"                                 # Branche GitHub
TARGET_DIR="js"                         # Dossier dans le repo
COMMIT_MESSAGE="Mise a jour automatique des photoList"

# Aller dans le depot
cd "$REPO_DIR" || exit 1

# Copier les fichiers generes
mkdir -p "$TARGET_DIR"
cp output/photoList-*.js "$TARGET_DIR/"

# Git push
git add "$TARGET_DIR/photoList-*.js"
git commit -m "$COMMIT_MESSAGE"
git push origin "$BRANCH"

