# IHM Web - Les timbres : poésie chantée du XVIe siècle
Développement d'une IHM Web pour l'exploration de corpus de poésies chantées

![Interface web - Timbres](https://i.ytimg.com/vi/RWHYzeiAYyY/maxresdefault.jpg "Interface web - Timbres")

 - L'Institut de Recherche en Musicologie du CNRS développe une base de données de poésie chantée au XVIème siècle, objet de recherche interdisciplinaire réunissant musicologues, historiens et littéraires. L'étudiant réalisant la TX aura pour mission de développer une interface graphique Web permettant l'exploitation scientifique de ce corpus, en prenant en compte les différentes pratiques spécifiques impliquées dans le projet. Un des enjeux de ces développements logiciels est de faire émerger des relations signifiantes existant au sein des données (textuelles, musicales, audio), et de contribuer à l'amélioration de la qualité des données. 
 - Les technologies mobilisées constituent l'état de l'art des technologies Web front et back : création de composants d'IHM ergonomiques avec React JS, accès aux données via une API GraphQL, visualisations interactives des données avec D3.js, mise en production avec Docker.

## Etude de l'existant (en cours)
IHM de projets 'Humanités numériques' : étudier leurs fonctions de recherches/explorations de données et les technologies utilisées

 - [Theaville : parodies dramatiques d’opéra au XVIIIe siècle](http://www.theaville.org/)
 - [USTC : Universal short title catalogue](https://www.ustc.ac.uk/)
 - [Base JONAS (CNRS)](http://jonas.irht.cnrs.fr/)

*Google Sheet* du benchmarck : [lien de l'étude](https://docs.google.com/spreadsheets/d/1B1YnON8SuA0V4xN6E9_GuyWgDd_7prJPd_0kmvBpcFY/edit?usp=sharing)

## Technologies et bibliothèque *JavaScript* utilisées pour le développement des fonctions primaires de l'IHM

 - bibliothèque utilisée pour les composants *React* "primaires" : [**Material UI**](https://material-ui.com/)
 - consultation des tables sous formes de tableaux : [**Material Table**](https://material-table.com/#/)

## Suggestions de technologies à utiliser pour des visualisations futures

 - visualisation des structures strophiques : **Canvas (HTML5)**
 - visualisation des objets de la bdd en graphe : [**SigmaJS**](http://sigmajs.org/)
 - visualisation personnalisable de fichiers audio : [**WaveSurferJS**](https://wavesurfer-js.org/)
 - visualisation de potentielles statistiques résultantes de recherches d'utilisateurs : [**ApexChartsJS**](https://apexcharts.com/react-chart-demos/)

## Tâches à réaliser

### Fonctions de recherches 
- [x] Fonctions de recherches simples (chaîne de caratères recherchée dans l'ensemble de la base)
- [ ] Fonctions de recherches complexes par champs (choisir les champs des tables où éxécuter les recherches)
- [ ] Fonctions de recherches sur la structure strophique des textes publiés

### Visualisation des textes
- [x] Visualisation des structures strophiques 

### Visualisations des familles de textes
- [ ] Visualisation des familles de textes ('groupes_textes') via une _timeline_ permettant l'identification d'un potentiel texte _racine_ pour chaque famille

### Visualisation des airs
- [ ] Implémentation d'un module interactif pour écouter les interprétations musicales des airs
- [ ] Visualisation des patterns des _airs_ via la notation musicale moderne
 
