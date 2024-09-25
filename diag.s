@startuml
space
participant Administrateur
participant Business Analyste

participant API Checker

participant Base de Données

participant Système


== Connexion à l'application ==
Administrateur -> Système: Connexion avec admin/admin
Système -> Base de Données: Vérification des informations d'identification (admin/admin)
Base de Données --> Système: Informations valides
Système --> Administrateur: Réponse (succès)

Business Analyste -> Système: Demande de connexion
Système -> Base de Données: Vérification des informations d'identification (Business Analyste)
Base de Données --> Système: Informations valides/invalides
Système --> Business Analyste: Réponse (succès/échec)

== Gestion des utilisateurs (par l'Administrateur) ==
Administrateur -> Système: Ajouter Business Analyste
Système -> Base de Données: Enregistrer les informations utilisateur
Base de Données --> Système: Confirmation de l'ajout
Système --> Administrateur: Confirmation de l'ajout

== Exécution de tests automatiques (Business Analyste) ==
Business Analyste -> Système: Sélectionner environnement et filiale
Business Analyste -> Système: Demande d'exécution de tests automatiques
Système -> Business Analyste: Vérification du token
Business Analyste -> Système: Envoi du token
Système -> Base de Données: Vérification des informations du token
Base de Données --> Système: Informations valides/invalides
Système --> Business Analyste: Réponse (succès/échec)
Système -> API Checker: Lancer les tests
API Checker --> Système: Résultats des tests
Système --> Business Analyste: Résultats des tests

== Exécution de tests manuels (Business Analyste) ==
Business Analyste -> Système: Sélectionner environnement et filiale
Business Analyste -> Système: Soumission de résultats de tests manuels
Système -> Business Analyste: Vérification du token
Business Analyste -> Système: Envoi du token
Système -> Base de Données: Vérification des informations du token
Base de Données --> Système: Informations valides/invalides
Système --> Business Analyste: Réponse (succès/échec)
Système -> Base de Données: Enregistrer les résultats des tests
Base de Données --> Système: Confirmation de l'enregistrement
Système --> Business Analyste: Confirmation de l'enregistrement

== Vérification de l'état des APIs (Business Analyste) ==
Business Analyste -> Système: Demande de vérification de l'état des APIs
Système -> API Checker: Vérifier l'état des APIs
API Checker --> Système: État des APIs (Up/Down)
Système --> Business Analyste: Affichage de l'état des APIs

== Consultation des métriques et de la santé de l'application (Business Analyste) ==
Business Analyste -> Système: Demande des métriques et de la santé
Système -> Base de Données: Récupérer les données
Base de Données --> Système: Envoi des données
Système --> Business Analyste: Affichage des métriques et de la santé

== Visualisation des résultats des tests (Business Analyste) ==
Business Analyste -> Système: Demande de visualisation des résultats
Système -> Base de Données: Récupérer les résultats des tests
Base de Données --> Système: Envoi des résultats des tests
Système --> Business Analyste: Affichage des résultats

== Filtrage des résultats (Business Analyste) ==
Business Analyste -> Système: Demande de filtrage des résultats
Système -> Base de Données: Filtrer les résultats selon les critères
Base de Données --> Système: Résultats filtrés
Système --> Business Analyste: Affichage des résultats filtrés

== Extraction des rapports au format Excel (Business Analyste) ==
Business Analyste -> Système: Demande d'extraction de rapport
Système -> Base de Données: Récupérer les données pour le rapport
Base de Données --> Système: Données récupérées
Système --> Business Analyste: Génération et téléchargement du rapport Excel
@enduml
