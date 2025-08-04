# Dynasty8
#  Structure du Projet

Une structure propre et modulaire pour afficher, filtrer et consulter des biens immobiliers dynamiques dans un univers GTA-like.

## Architecture des fichiers

```
/project-root
│
├── index.html               # Page principale
│
├── css/                    # Feuilles de style
│   ├── style.css           # Style global (UI, boutons, cartes...)
│   ├── lightbox.css        # Style spécifique au zoom/lightbox
│   └── modal.css           # Style spécifique aux modales de détails
│
├── js/                     # Scripts JavaScript organisés
│   ├── main.js             # Initialisation et gestion de catégorie
│   ├── filters.js          # Rendu des filtres et recherches
│   ├── display.js          # Génération des cartes et résultats
│   ├── modal.js            # Ouverture/fermeture de la modale de détails
│   └── lightbox.js         # Lightbox classique et slider photo
│
├── data/                   # Fichiers JSON de données
│   ├── villas.json
│   ├── garages.json
│   └── zone-luxe.json
│
└── assets/
    └── photos/             # Images des biens immobiliers
```

## Flux de fonctionnement

1. **Chargement initial** : `main.js` appelle `switchCategory('villas')`
2. **Affichage des filtres** : via `filters.js` selon la catégorie choisie
3. **Lancement recherche** : click bouton déclenche `filterVillas`, `filterZone` ou `filterGarages`
4. **Résultats affichés** : `display.js` génère dynamiquement les cartes
5. **Modale détaillée** : `modal.js` injecte les données dans une modale
6. **Galerie interactive** : `lightbox.js` affiche un zoom ou un slider des photos
