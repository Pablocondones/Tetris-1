Vi började med grunden. Fixade HTML och CSS för att få till färgerna och alla menyer. Vi skapade startmenyn och fick igång en startGame-funktion med en knapp som 
faktiskt gör något. Vi la också in en timer tidigt bara så och sedan kan vi förtsäta jobba med den och anpassa den med paus och såna saker.
Sen började det riktiga kodandet. Vi skapade alla klassiska Tetris-blocks och byggde "arenan" alltså rutnätet där allt händer. Jag (Abolfazl) fixade player-objektet
för att hålla koll på vilket block som är aktivt, nästa block och poängen. Vi fick också kämpa med collide-logiken så att blocken faktiskt stannar när de träffar något.
Jag (Abolfazl) fixade arenasweep(). Det var lite pilligt att få den att fatta när en rad är full, ta bort den, och sen dra ner alla block ovanför rätt antal steg.
Ju fler rader man tar, desto mer poäng får man. Fixade också playerReset så att ett nytt slumpmässigt block spawnar högst upp (y=1). 
Om det redan ligger ett block där det nya ska komma fram så blir det Game Over direkt.
Spelet gick inte att starta för att JS inte hittade start-knappen i HTML:en. Jag fick fixa det och se till att drawNext och drawMatrix
faktiskt ritade blocken rätt när de föll ner. Jag uppdaterade också startGame så att alla menyer stängs ner ordentligt när man börjar spela.
Melvin märkte att timern var helt efter, den fortsatte räkna även när spelet var pausat för att den tog tid från datorns klocka. Han skapade totalElapsedTime
för att lösa det. Han fixade också padStart så tiden ser snygg ut (00:00). En annan viktig grej han löste var att blocken "hoppade" ner jättelångt om man pausade
länge. Han fixade det genom att nollställa lastTime precis när man kör igång igen.
Jag (Abolfazl) la till knappar för paus på sidan så man slipper använda tangentbordet hela tiden. Fixade så att Restart-knappen i Game Over-skärmen faktiskt startar
om spelet. Mohammed fixade den tunga logiken för kontrollerna. Han la in vänster/höger-rörelse och rotation som funkar även vid väggar. Han la också till manuell
drop-bonus och "Hard Drop" på Space – det gjorde att spelet känns mycket snabbare.
Melvin skapade partikelsystemet för bakgrunden. Det blev snyggt med neon-prickarna, men vi fick en jobbig bugg där prickarna blev gigantiska och aldrig försvann.
Vi letade som fan och fattade till slut att det bara var ett stavfel: wdith istället för width. När vi ändrade det funkade allt perfekt. Nu är vi klara!
