The station.csv file come from https://github.com/iRail/stations/
And was converted into JSON to the stations.json file.

#### Règles de génération des noms de gare internes:

Les noms de gare internes sont générés sur base du fichier station.json. Pour chacune des gares, ce fichier contient un nom, un nom alternatif en français et un nom alternatif en néerlandais.

La génération d'un nom interne n'est d'application que pour les gares situées en Belgique.

La sélection de la langue de la gare pour son enregistrement en interne ce fait comme suit:
- sélection du nom alternatif en néerlandais si disponible
- sinon, sélection alternatif du nom en français
- sinom, sélection du nom principale

Le nom interne est le résultat d'une normalisation du nom séléctionné, qui s'effectue comme suit:
- aucune majuscule
- aucun apostrophe
- aucun accent
- aucun préfixe ni suffixe, càd aucun petit mot comme "De" ou "La". Les mots attachés avec un tiret son conservés.

##### Cas d'exceptions:
- Le nom interne de la gare de "Brussel - Airport Zaventem" est "airport" et non "brussel". Cette règle est gérée automatiquement.

#### Information sur la génération des données de recherches des gares
Les données de recherches des gares sont deux tableaux de données contenant les gares belges. Chacune des gares y est enregistrée avec son nom principale, celui affiché dans la réalité sur les quai de la gare, et si disponible, ses traduction en français, néerlandais, anglais et allemand.

Ces données sont générées depuis le fichier station.json, et sont utilisées dans l'application sur l'écran de recherche d'une gare.

Elles sont divisées en deux fichiers: Le premier contient uniquement les noms, le second contient les noms, avec pour chacun des noms, le nom interne et un nom raccourci à 4 lettres.

Le premier fichier est utilisé pour la recherche d'une gare. Le second permet, lors de l'affichage des résultats, de faire le lien entre le nom de la gare trouvé et le nom interne qui, par la suite, sera envoyé par l'application vers le serveur pour effectuer une recherche de billet.

##### Ordre d'affichage des gares dans les résultats d'une recherche
