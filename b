#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h> // Nécessaire pour fork()

// ==========================================
// EXERCICE 1 : Moyenne des paramètres
// ==========================================
void exercice1(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <nombres...>\n", argv[0]);
        return;
    }

    double somme = 0;
    int nombre_elements = argc - 1;

    for (int i = 1; i < argc; i++) {
        somme += atof(argv[i]); 
    }

    if (nombre_elements > 0) {
        double moyenne = somme / nombre_elements;
        printf("La moyenne est : %f\n", moyenne);
    }
}

// ==========================================
// EXERCICE 2 : Affichage caractère par caractère
// ==========================================
void exercice2(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Usage: %s <chaine>\n", argv[0]);
        return;
    }

    char *chaine = argv[1];
    int longueur = strlen(chaine);

    FILE *fichier = fopen("sortie.txt", "w");
    if (fichier == NULL) {
        perror("Erreur lors de l'ouverture du fichier");
        return;
    }

    for (int i = 0; i < longueur; i++) {
        printf("%c\n", chaine[i]);
        fprintf(fichier, "%c\n", chaine[i]);
    }

    fclose(fichier);
}

// ==========================================
// EXERCICE 3 : Explication (Pas de code C)
// ==========================================
// Voir l'explication dans la réponse précédente. 
// Commandes terminal : ./afficher ICS & ./afficher Systeme &

// ==========================================
// EXERCICE 4 : Analyse de fork() dans une boucle
// ==========================================
void exercice4() {
    printf("--- Debut Exercice 4 ---\n");
    int i;
    for (i=0; i<3; i++) {
        fork();
        printf("Hello World!\n");
    }
    printf("--- Fin Exercice 4 ---\n");
    // Note : Il y aura 14 messages "Hello World!" au total.
    // Pour éviter de salir l'écran si on teste d'autres exos, tu peux commenter la boucle.
}

// ==========================================
// EXERCICE 5a : Fork bomb (DANGER)
// ==========================================
void exercice5a() {
    printf("--- Debut Exercice 5a (DANGER: Boucle infinie) ---\n");
    /* 
    int p=1;
    while(p>0)
        p=fork();
    printf("Hello World!\n");
    */
    printf("Code commente pour eviter de faire planter la machine.\n");
    printf("--- Fin Exercice 5a ---\n");
}

// ==========================================
// EXERCICE 5b : Analyse de fork() complexe
// ==========================================
void exercice5b() {
    printf("--- Debut Exercice 5b ---\n");
    int i=2 ;
    int j=10; int p ;
    
    while((--i)&&(p=fork())) {
        if(p<0) exit(1);
    }
    
    j +=2;
    
    if (p==0) { 
        i *= 3; j *= 3; 
    } else { 
        i *= 2; j *= 2; 
    }
    
    printf("i=%d, j=%d\n", i, j);
    printf("--- Fin Exercice 5b ---\n");
}


// ==========================================
// FONCTION MAIN PRINCIPALE
// ==========================================
int main(int argc, char *argv[]) {
    
    // ========================================================
    // DECOMMENTE LA LIGNE DE L'EXERCICE QUE TU VEUX TESTER
    // ========================================================

    // exercice1(argc, argv); // Pour tester : ./programme 1 2 45 4
    // exercice2(argc, argv); // Pour tester : ./programme ICS
    
    // exercice4();
    // exercice5a(); // ATTENTION DANGER
    exercice5b(); 

    return 0;
}