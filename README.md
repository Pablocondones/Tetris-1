1. Tetris Neon Edition
Ett modernt Tetris-spel byggt med JavaScript, HTML Canvas och CSS i visual studio code. Spelet har ett responsivt partikelsystem och neon-tema.

2. Gruppen
Abolfazl: Huvudutvecklare: Ansvarig för filstrukturen (HTML, CSS, java) för websidan, grafik, next piece fönster, timer, figma design, figma lowfi, HTML grid, line logic(tabort rader, ge poäng, flytta rad) och menysystem.
Melvin: Skapare av metris för spelplanen, block creation (L, T, O osv), particle system i bakgrunden (rörliga neon doter i bakgrund flr snyggare spelplan).'
Mohammed: Movement funktioner (rotation, collide, merge, keyboard controlls), 

3. Beskrivning
Detta projekt är ett klassiskt Tetris-spel med en modern visuell neonish stil. Det fokuserar på snygg spelkänsla och prestanda genom effektiv hantering av HTML Canvas-ritning. Spelet innehåller funktioner som "Hard Drop", poängsystem, nivåökning (drop-hastighet) och en animerad bakgrund.

4. kom igång
Du kan använda dig av vilken webbläsare som helst för att kunna ladda upp spelet (websidan) och börja spela. Exempel på webbläsare kan vara Chrome, Firefox eller edge.
Och by the way, ingen installation krävs då spelet körs direkt i webbläsaren. Så det är inget tid tagare och enkel att få tag på spelet.

5. Köra programmet
1. Ladda ner källkoden eller klona repositoryt.
2. Öppna filen `index.html` i din webbläsare.
3. Klicka på "START GAME".
4. Använd piltangenterna för att flytta/rotera och Space för att skjuta ner blocket direkt.

6. Hur kan projektet utvecklas
Projektet kan vidareutvecklas genom att lägga till:
Global High-score lista via en databas.
Olika svårighetsgrader som ändrar dropInterval snabbare.
Ljudeffekter vid radrensning och Hard Drop.

7. Test och fel
Ett av de första problemen var att spelet ville inte starta helt och hållet, vilket berodde på att startknappen i koden inte var kopplad till rätt ID i HTML-filen.
Vi löste det genom att se till att JavaScript-koden hämtade exakt det elementet som fanns i HTML-strukturen.
Ett annat fel var att timern fortsatte räkna även när vi pausade spelet, och när man startade igen kunde blocken plötsligt hoppa långt ner på skärmen.
Detta fixade vi genom att skapa en egen variabel för den spelade tiden och se till att nollställa tidräknaren precis när man trycker på resume.
Vi hade också problem med att blocken fastnade i väggen när man försökte rotera dem nära kanten.
Detta löste vi genom att lägga till logik som knuffar in blocket i spelplanen igen vid krock, det basicaly låter inte blocker går åt sidan mer än det.
Det mest synliga felet var dock bakgrundens partiklar, som lämnade långa, fula spår efter sig istället för att vara små prickar. Det försvann inte heller.
Problemet visade sig vara ett enkelt stavfel där vi skrivit wdith istället för width på canvasens bredd, vilket gjorde att bakgrunden aldrig raderades ordentligt
mellan bildrutorna. När vi rättade till stavningen försvann spåren och partiklarna fungerade som de skulle.

Vår material
Planering & Backlog (Jira): (https://tetrisgrabbana.atlassian.net/jira/core/projects/TG/board?filter=&groupBy=status)
Loggbok: LOGGBOK-md
Figma: (https://www.figma.com/design/YPp8PRSLwpOIA2BRIkIWTa/Tetris-Project?node-id=0-1&t=uX75zSARYJRSyli6-0)
