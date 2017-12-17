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

#### Changements notables du fichier station.json:
- Gare de "Brussel-Zuid/Bruxelles-Midi", le nom anglais est réduit uniquement à "Brussels-South"