CAHIER DE CHARGE

projet:Gestion de scolarisation de  la Faculté de Droits, Sciences Économiques et des Gestions de l’université ADAM BARKA d'abéché

I-Présentation générale

1.Contexte du projet
L’université ADAM BARKA rencontre des difficultés dans la gestion manuelle des inscriptions, emplois du temps, examens et résultats des étudiants. Le projet vise à créer un système numérique centralisé pour faciliter ces processus.

2.Objectifs attendus
Automatiser et sécuriser la gestion des inscriptions et des profils utilisateurs.
Optimiser la planification des examens, événements et emplois du temps.
Centraliser les informations académiques et administratives pour étudiants et enseignants.
Permettre un suivi efficace des absences et des résultats.

3.les besoins spécifiques
3.1- besoins fonctionnelles
Le système devra permettre :
Authentification
Connexion sécurisée pour étudiants, enseignants et administrateurs.
Gestion des rôles et droits d’accès.
Gestion des inscriptions
Formulaire d’inscription en ligne.
Validation et suivi des dossiers.
Gestion des inscriptions semestrielles.
Planning des examens et événements
Gestion et affichage du calendrier des examens.
Notification en cas de mise à jour.
 Emploi du temps
Affichage de l’emploi du temps par filière(niveau) et par enseignant.
Modification possible par l’administration.
Notification en cas de changement (salle, horaire, annulation).
Gestion des groupes (TD, TP).
Informations détaillées par cours (enseignant, salle, type : CM/TD/TP).
Gestion des résultats
Saisie des notes par les enseignants.
calcul des notes
Consultation des résultats par les étudiants.
Génération des relevés de notes.
 Gestion des profils utilisateurs
Étudiant : informations personnelles, parcours académique, statut administratif (actif, diplômé, exclu).
Enseignant : informations personnelles, matières enseignées.
3.2-Besoins non fonctionnels(techniques)
Sécurité : accès par login/mot de passe, chiffrement des données sensibles.
Disponibilité : accès en ligne 24h/24, 7j/7.
Performance : support d’un grand nombre d’utilisateurs simultanés (étudiants + enseignants + admin).
Fiabilité : sauvegarde régulière des données, récupération après panne.
Ergonomie : interface simple et responsive (ordinateur, tablette, smartphone).
Évolutivité : possibilité d’ajouter de nouvelles fonctionnalités (par ex. affichage de résultat  en ligne).
Hébergement

4.Technologie utilisées

Module
technologies
Frontend
Angular
Backend
Node.js avec Express
Base de données
MongoDB
Maquettes & Design
Figma
Compatibilité
Multi-navigateurs & Responsive
langage utilisé
HTML,CSS,JAVASCRIPT



5.-Livrables
Application web fonctionnelle (frontend + backend)
guide d’utilisation de l'application
Maquettes Figma
presentation powerpoint
Rapport 
6.Périmètre du projet


7.Validation et suivi

8.Identification des Acteurs
Étudiant (acteur principal) :s’inscrire, consulter emploi du temps, résultats, recevoir notifications.
Enseignant (acteur principal) :saisir notes, consulter emploi du temps.
Administrateur (acteur secondaire) :gérer inscriptions, emploi du temps, examens, cartes étudiantes, profils utilisateurs.

9.Identification des cas d’utilisation 
9.1cas d’utilisation pour un utilisateur
se connecter au plate forme
Gestion des inscriptions
Gestion de Planning des examens et événements
Gestion Emploi du temps
Gestion des résultats
Gestion des profils utilisateurs
9.2cas d’utilisation pour un visiteur
s’inscrire en ligne( (remplir le formulaire avant validation))
Consulter la page d’accueil
Parcourir les informations générales 
10.diagramme de cas d’utilisation








11.Identifications des classes avec leurs proprieté et comportements
les principales classes sont:
1. Classe Étudiant
Propriétés :
idÉtudiant (matricule)
nom, prénom
dateNaissance
email, téléphone
statut (actif, diplômé, exclu)
parcoursAcadémique
Comportements :
sInscrire()
consulterEmploiDuTemps()
consulterRésultats()
justifierAbsence()

2. Classe Enseignant
Propriétés :
idEnseignant
nom, prénom
spécialité / département
email, téléphone
Comportements :
saisirNotes()
gérerAbsences()
consulterEmploiDuTemps()


3. Classe Administrateur
Propriétés :
idAdmin
nom, prénom
rôle
Comportements :
gérerInscriptions()
gérerEmploiDuTemps()
créerCarteÉtudiante()
gérerProfils()
gérerFormations()

4. Classe Inscriptions
Propriétés :
idInscription
dateInscription
semestre
statut (validée, en attente, refusée)
Comportements :
valider()
suivreDossier()

5. Classe Résultat
      Propriétés :
idRésultat
note
appréciation
étudiant associé
matière associée
     Comportements :
calculerMoyenne()
consulter()
6. Classe Faculté
     Propriétés :
idFaculté
nomFaculté
adresse
Comportements :
ajouterDépartement()
listerDépartements()


7.classe Département
       Propriétés :
idDépartement
nomDépartement
responsableDépartement
       Comportements :
ajouterFilière()
listerFilières()

8.classe Filière
Propriétés :
idFilière
nomFilière
niveau (Licence, Master, etc.)
Comportements :
ajouterFormation()
consulterProgramme()

9.classe utilisateur
Propriétés :
 IdUtilisateur      
 nomUtilisateur        
email     
motDePasse
 rôle 
Comportements :
seConnecter() 
consulterProfil()


12.Identification des relations entre les classes
























reference
https://fr.slideshare.net/slideshow/1-introuse-case/250415765
