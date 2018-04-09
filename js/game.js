/**
 * Game was created by Pim de Bree
 * 
 * finished at 13-9-2017
 * 
 * Please contact: pim_debree@hotmail.com
 * if any bugs occur
 * 
 * Geen plagiaat aub.
 * 
 */

window.onload = function () {
    
        /**
         * Eventueel wanneer ik geen scrollbars wil in mijn game
         */

        document.documentElement.style.overflow = 'hidden';  // firefox, chrome
        document.body.scroll = "no"; // ie only
    

        /**
         * Zoekt het element dat 'battlepusher' heet in de html, dit
         * slaat hij op in de variabel 'canvas'
         */
        canvas = document.getElementById("battlepusher");

        /**
         * Maakt van dit canvas een 2d vlak, het vertegenwoordigt
         * een tweedimensionaal weergavecontext
         */
        canvas_2d = canvas.getContext("2d");
    
        /**
         * Een event listener, deze 'luistert' wanneer er een toets wordt gedrukt
         * op het toetsenbord
         */
        document.addEventListener("keydown", keyPush);
    
        /**
         * De main loop van de game, hierdoor speelt hij elke keer af, hierdoor speelt alles
         * De snelheid van de game wordt bepaald door de 'gametime'
         */
        setInterval(game, gametime);
    
        /**
         * We zetten hierbij het canvas aan de hoogte en breedte van het scherm
         * Het cavas past dus automatisch aan de grootte
         */
        canvas_2d.canvas.width = window.innerWidth - 400;//Math.floor(window.innerWidth / devided_by_screen);
        canvas_2d.canvas.height = Math.floor(window.innerHeight / devided_by_screen);

}
    
    /**
     * of de AI bezig is of niet
     */
    may_control = false
    /**
     * Bepaalt het grootte, de schaal van het spel
     */
    devided_by_screen = 1.5;

    /**
     * De positie van de huidige speler zonder tail, dus wat achter hem hangt
     */
    player_position_x = player_position_y = 10;

    /**
     * De positie van de bot, oftewel ai, zonder tail
     */
    ai_position_x = ai_position_y = 10;

    /**
     * De grootte van de grid size, oftewel hoe groot het veld is qua blokjes
     */
    gridsize = 10,

    /**
     * Hoe groot de game zich afspeelt in de x en y richting, deze wordt bepaalt met
     * de grootte van het scherm en de gridsize
     */
    tilecount_x = Math.floor((window.innerWidth - 400) / gridsize);
    tilecount_y = Math.floor((window.innerHeight / devided_by_screen) / gridsize);

    /**
     * Hoe snel het spel zich afspeelt
     */
    gametime = 1000 / 17;

    /**
     * De score van de speler, deze score verkrijg je door het pakken van de bonussen
     */
    score = 0;

    /**
     * De score van de ai, deze krijgt hij ook door het verkijgen van de bonussen
     */
    score_ai = 0;

    /**
     * Wat er op het moment in het spel om gaat, wat er gebeurt met de bot (de ai) en de speler zelf
     */
    event = "Niets";
    
    /**
     * De grootte van de 'staart' van de speler en de bot in het begin
     */
    const tail_default_size = 2;
    const tail_default_size_ai = 10;
    
    /**
     * De posities van de appels die punten geven, in een array gestored met de variabelen X en Y
     */
    apple_positions = [
        {x : getRandomXTile(), y : getRandomYTile()}
    ];

    /**
     * De posities van de dead spikes die punten afnemen, in een array gestored met de variabelen X en Y
     */
    dead_spikes = [
        {x : getRandomXTile(), y : getRandomYTile()}
    ]

    /**
     * De posities van de bonus punten die punten geven, in een array gestored met de variabelen X en Y
     */
    bonus_points = [
        {x : getRandomXTile(), y : getRandomYTile()}
    ]
    
    /**
     * De posities van de start appel;
     */
    apple_position_x = apple_position_y = 15;

    /**
     * De variabelen die de player en de ai bewegen
     */
    player_movement_x = player_movement_y = 0;
    ai_movement_x = ai_movement_y = 0;

    /**
     * De staart van de speler en de ai, dit wordt gestored in een array
     */
    trail = [];
    trail_ai = [];

    /**
     * De huidige grootte van de staart van de ai en de speler
     */
    tail = 5;
    tail_ai = 5;
    
    /**
     * Om een leuk effect te creeëren wordt bij elke tail een nieuw kleurtje gegeven,
     * deze kleuren zijn de kleuren van de regenboog
     */
    function getRandomColor(player) {

        //een random value tussen en 0 4
        let random_value = Math.floor(Math.random() * 2);
    
        if (player) {
            switch (random_value) {
                /**
                 * Hier de verschillende kleuren die de tail mag krijgen
                 */
                case 0:
                return "blue";
        
                case 1:
                return "green";
            }
        } else {
            switch (random_value) {
                /**
                 * Hier de verschillende kleuren die de tail mag krijgen
                 */
                case 0:
                return "purple";
        
                case 1:
                return "yellow";
            }
        }
    }

    /**
     * Switch statement maakt het overzichtelijker
     * Wanneer de AI al een bepaalde kant is opgegaan, willen we niet dat die nog een keer die kant opgaat
     * Dit wordt telkens gechecked
     * 
     * Dit zijn de bewegingen die de ai wil maken en deze worden later geupdate naar het scherm
     */
    function getAIMovementKeys() {
        let random_value = Math.floor(Math.random() * 50);

        switch (random_value) {
            case 0:

                if (ai_movement_x == 1) {
                    ai_movement_x = 0; 
                    ai_movement_y = 1;
                } else {
                    ai_movement_x = -1; 
                    ai_movement_y = 0;
                }
            break;
            case 1:
                if (ai_movement_y == 1) {
                    ai_movement_x = -1; 
                    ai_movement_y = 0;
                } else {
                    ai_movement_x = 0; 
                    ai_movement_y = -1;
                }
            break;
            case 2:
                if (ai_movement_x == -1) {
                    ai_movement_x = 0;
                    ai_movement_y = 1;
                } else {
                    ai_movement_x = 1;
                    ai_movement_y = 0;
                }
                
            break;
            case 3:
            if (ai_position_y == -1) {
                ai_movement_x = 1;  
                ai_movement_y = 0;
            } else {
                ai_movement_x = 0; 
                ai_movement_y = 1;
            }
            break;
        }
    }
    
    /**
     * De beweging van de ai, deze wordt random bepaalt met elke game loop
     */
    function getAIMovement() {
        /**
         * In het geval de ai uit het scherm wil lopen, gaat hij nu aan de tegenovergestelde kant weer verder
         */
        ai_position_x += ai_movement_x;
        ai_position_y += ai_movement_y;

        //tilecount - 1, moet omdat hij anders aan de zijkant terecht komt
        if (ai_position_x < 0) {
            ai_position_x = tilecount_x - 1;
        }
        if (ai_position_x > tilecount_x - 1) {
            ai_position_x = 0;
        }
        if (ai_position_y < 0) {
            ai_position_y = tilecount_y - 1;
        }
        if (ai_position_y > tilecount_y - 1) {
            ai_position_y = 0;
        }
    }

    /**
     * Hier gebeurt alle updating van de ai, text en speler zelf
     */
    function game() {

        /**
         * De movement van de AI
         */
        if (!may_control) {
            getAIMovementKeys();
        }
        getAIMovement();   

        /**
         * Het updaten van de tekst op het scherm
         */
        var score = document.getElementById("score");
        score.innerHTML = "Jouw huidige score: "+ this.score;

        var score_ai = document.getElementById("score_ai");
        score_ai.innerHTML = "Jouw tegenstander's score: "+ this.score_ai;

        var event = document.getElementById("event");

        event.innerHTML = "Laatste gebeurtenis "+ this.event+" <br>";
        
        /**
         * Het updaten van de speler positie wanneer deze uit het scherm gaat, net zoals
         * bij de ai
         */
        player_position_x += player_movement_x;
        player_position_y += player_movement_y;
        if (player_position_x < 0) {
            player_position_x = tilecount_x - 1;
        }
        if (player_position_x > tilecount_x - 1) {
            player_position_x = 0;
        }
        if (player_position_y < 0) {
            player_position_y = tilecount_y - 1;
        }
        if (player_position_y > tilecount_y - 1) {
            player_position_y = 0;
        }

        /**
         * Het scherm opvullen met een zwarte kleur canvas
         */
        canvas_2d.fillStyle = "black";
        canvas_2d.fillRect(0, 0, canvas.width, canvas.height);
    
        /**
         * Een loop van trail en vult deze met een rectangle, met de kleur die eerder is aangegeven
         */
        for (var i = 0; i < trail.length; i++) {
            canvas_2d.fillStyle = trail[i].col;
            canvas_2d.fillRect(trail[i].x * gridsize, trail[i].y * gridsize, gridsize - 2, gridsize - 2);
            
            /**
             * De tail resetten wanneer de speler op zijn eigen staart komt te staan, waardoor hij ook
             * al zijn punten verliest
             */
            if (trail[i].x == player_position_x && trail[i].y == player_position_y) {

                /**
                 * Wanneer nog geen score bekend is, wordt gezegd dat je met de pijltjes toetsen kan
                 * bewegen
                 */
                if (this.score == 0) {
                    this.event = "Je kunt bewegen met de pijltjes toetsen!";
                } else {
                    this.event = "Jij bent tegen jezelf aan gebotst, 100 punten weg!";
                }

                /**
                 * Je staart wordt gereset naar de default size
                 */
                tail = tail_default_size;
    
                /**
                 * Score wordt gereset naar 0
                 */
                this.score = 0;
            } 
        }
        

        /**
         * Zelfde bij de AI als bij de speler zelf
         */
        for (var i = 0; i < trail_ai.length; i++) {
            /**
             * Vullen van de rechthoek met een kleur
             */
            canvas_2d.fillStyle = trail_ai[i].col;
            canvas_2d.fillRect(trail_ai[i].x * gridsize, trail_ai[i].y * gridsize, gridsize - 2, gridsize - 2);
            
            /**
             * De tail resetten wanneer speler op zijn eigen staart komt
             */
            if (trail_ai[i].x == ai_position_x && trail_ai[i].y == ai_position_y) {
                tail_ai = tail_default_size_ai;
    
                if (may_control) {
                    this.score_ai = 0;
                    this.tail_ai = tail_default_size;
                }
                
                this.event = "De AI/tegenstander botst tegen zichzelf aan";
            }
        }
    
        /**
         * Laat de snake van de speler en de ai lopen, waardoor steeds nieuwe deeltjes in de array worden gezet
         */
        trail.push({ col: getRandomColor(true), x: player_position_x, y: player_position_y });

        trail_ai.push({ col: getRandomColor(false), x: ai_position_x, y: ai_position_y });
    
        /**
         * Laat de snake verkleinen bij het bewegen
         */
        while (trail.length > tail) {
            trail.shift();
        }

        /**
         * Laat de ai verkleinen bij het bewegen
         */
        while (trail_ai.length > tail_ai) {
            trail_ai.shift();
        }
    

        

        /**
         * Een loop van de apples die in het spelletje worden gemarkeerd als rood, bij het vangen van deze
         * punten, dan gaat de appel weg en krijg je dus 50 punten. de ai krijgt meer punten.
         * De staart wordt langer en er worden 3 nieuwe appels in het spel toegekend.
         */
        for (var b = 0; b < apple_positions.length; b++) {
            // console.log(apple_positions[b].x+" "+apple_positions[b].y);
            if (apple_positions[b].x == player_position_x && apple_positions[b].y == player_position_y) {
                tail++;
    
                /**
                 * Het event zegt dat 50 punten zijn gevangen.
                 */
                this.event = "Jij hebt een appel gevangen, 50 punten!";

                /**
                 * Een score van 50 wordt toegekend aan de speler
                 */
                this.score += 50;
    
                /**
                 * De oude appel wordt niet verwijderd, maar wordt op een andere plek gezet
                 */
                apple_positions[b].x = Math.floor(Math.random() * tilecount_x);
                apple_positions[b].y = Math.floor(Math.random() * tilecount_y);
                
                /**
                 * 3 nieuwe appels komen in het spel terecht
                 */
                apple_positions.push({x : getRandomXTile(), y : getRandomYTile()});
                apple_positions.push({x : getRandomXTile(), y : getRandomYTile()});
                apple_positions.push({x : getRandomXTile(), y : getRandomYTile()});

            } else if(apple_positions[b].x == ai_position_x && apple_positions[b].y == ai_position_y) {
                /**
                 * idem dito.
                 */
                
                this.event = "De AI/tegenstander heeft een appel gevangen, 100 punten!";

                tail_ai++;

                if (may_control) {
                    this.score_ai += 50;
                } else {
                    this.score_ai += 100;
                }

                apple_positions[b].x = Math.floor(Math.random() * tilecount_x);
                apple_positions[b].y = Math.floor(Math.random() * tilecount_y);
                
                apple_positions.push({x : getRandomXTile(), y : getRandomYTile()});
            }   

            /**
             * Het vullen van de appels met een rode kleur
             */
            canvas_2d.fillStyle = "red";
            canvas_2d.fillRect(apple_positions[b].x * gridsize, apple_positions[b].y * gridsize, gridsize - 2, gridsize - 2);
        }
        
        /**
         * Botsen tegen elkaar, loopt en kijkt dan of in de trail de coords zijn
         * in de coords van de andere
         */
        for (var snake_one = 0; snake_one < trail.length; snake_one++) {
            for (var snake_two = 0; snake_two < trail_ai.length; snake_two++) {

            if (trail[snake_one].x == trail_ai[snake_two].x &&
                trail[snake_one].y == trail_ai[snake_two].y) {

                    /**
                     * Gaat nu checken wie de foute is
                     * 
                     * Wanneer het hoofdje van de snake in de ander zijn trail is, dan is de snake met het hoofdje
                     * die er in komt fout.
                     * 
                     * Andersom idem dito.
                     */
                    for (var snake_one_head = 0; snake_one_head < trail.length; snake_one_head++) {
                        for (var snake_two_head = 0; snake_two_head < trail_ai.length; snake_two_head++) {

                            
                            if (ai_position_x == trail[snake_one_head].x && ai_position_y == trail[snake_one_head].y) {
                                //de ai is nu de foute
                                
                                this.tail_ai = tail_default_size;
                                if (may_control) {
                                    if (this.score_ai - 500 > 0) {
                                        this.score_ai -= 500;
                                    } else {
                                        this.score_ai = 0;
                                    }
                                }
                                this.event = "De tegenstander is tegen jou aan gebotst!";
                                // console.log("De tegenstander is tegen jou aan gebotst!");
                            } else if (player_position_x == trail_ai[snake_two_head].x && player_position_y == trail_ai[snake_two_head].y) {
                                
                                this.event = "Jij bent tegen de tegenstander aangebotst! 500 punten weg!";
                                // console.log("Jij bent tegen de tegenstander aangebotst! 500 punten weg!");
        
                                // console.log(snake_one_head);
                                this.tail = tail_default_size;
                                
                                if (this.score - 500 > 0) {
                                    this.score -= 500;
                                } else {
                                    this.score = 0;
                                }
                            }
                            
                        }
                    }
                }
            }
        }     
        /**
         * De bonus punten die als paars worden aangeven, deze worden random in het spel toegevoegd en geven meer punten
         * dan normale appels, bij het ontvangen krijg je 100 score en word je staart iets langer met 3 blokjes, hierna wordt een nieuw bonus punt
         * en het oude gerelocated
         * 
         * de ai heeft hetzelfde principe
         */
        for (var b = 0; b < bonus_points.length; b++) {
            // console.log(apple_positions[b].x+" "+apple_positions[b].y);
            if (bonus_points[b].x == player_position_x && bonus_points[b].y == player_position_y) {
                tail += 3;
    
                this.event = "Jij hebt een ongelooflijke goede appel gevangen, 100 punten!";

                this.score += 100;
    
                bonus_points[b].x = Math.floor(Math.random() * tilecount_x);
                bonus_points[b].y = Math.floor(Math.random() * tilecount_y);
                
                bonus_points.push({x : getRandomXTile(), y : getRandomYTile()});

            }  else if(bonus_points[b].x == ai_position_x && bonus_points[b].y == ai_position_y) {
                tail_ai++;

                if (may_control) {
                    this.score_ai += 100;
                } else {
                    this.score_ai += 200;
                }

                this.event = "De AI heeft een ongelooflijke goede appel gevangen, 200 punten!";

                bonus_points[b].x = Math.floor(Math.random() * tilecount_x);
                bonus_points[b].y = Math.floor(Math.random() * tilecount_y);
                
                bonus_points.push({x : getRandomXTile(), y : getRandomYTile()});
                apple_positions.push({x : getRandomXTile(), y : getRandomYTile()});
                apple_positions.push({x : getRandomXTile(), y : getRandomYTile()});
            }   
            canvas_2d.fillStyle = "purple";
            canvas_2d.fillRect(bonus_points[b].x * gridsize, bonus_points[b].y * gridsize, gridsize - 2, gridsize - 2);
        }
    
        /**
         * Het random aanmaken van de spikes, die punten daling geven en het aanmaken van de
         * bonus punten, die juist een punten toename geven
         */
        if (Math.floor(Math.random() * 20) == 0) {
            dead_spikes.push({x : getRandomXTile(), y : getRandomYTile()});
        }

        if (Math.floor(Math.random() * 100) == 0) {
            bonus_points.push({x : getRandomXTile(), y : getRandomYTile()});
        }
    
        /**
         * Een loop van de dead spikes, deze spikes geven een punten daling bij de speler, maar niet bij de ai
         * De kleur wordt hier aan geven van wit
         */
        for (var b = 0; b < dead_spikes.length; b++) { 
            canvas_2d.fillStyle = "white";
            canvas_2d.fillRect(dead_spikes[b].x * gridsize, dead_spikes[b].y * gridsize, gridsize - 2, gridsize - 2);
    
            // console.log(apple_positions[b].x+" "+apple_positions[b].y);
                if (dead_spikes[b].x == player_position_x && dead_spikes[b].y == player_position_y) {
                    trail.shift();
    
                    this.event = "Jij bent tegen een rotte appel gevallen, 250 punten weg!";

                    if (this.score - 250 >= 0) {
                        this.score -= 250;
                    } else if (this.score - 250 < 0) {
                        this.score = 0;
                    }
                    delete dead_spikes[b].x, dead_spikes[b].y;
    
                    // while (dead_spikes.length > 0) {
                    //     dead_spikes.pop();
                    // }
                } else if(dead_spikes[b].x == ai_position_x && dead_spikes[b].y == ai_position_y) {
                    trail_ai.shift();

                    this.event = "De AI is tegen een rotte appel gevallen!";
                    
                    // if (this.score_ai - 100 >= 0) {
                    //     this.score_ai -= 100;
                    // }

                    if (may_control) {
                        if (this.score_ai - 250 >= 0) {
                            this.score_ai -= 250;
                        }
                    }

                    delete dead_spikes[b].x, dead_spikes[b].y;
                }
            }
     }
    
    /**
     * Een random locatie wordt hierbij gereturned uit het speelscherm
     * met een x waarde
    */
    function getRandomXTile() {
        return Math.floor(Math.random() * tilecount_x);
    }

    /**
     * Een random locatie wordt hierbij gereturned uit het speelscherm
     * met een y waarde
    */
    function getRandomYTile() {
        return Math.floor(Math.random() * tilecount_y);
    }
    
    /**
     * Het eventhandler dat bepaalt wat de speler doet met het toetsenbord
     * @param {*} evt   
     */
    function keyPush(evt) {


        switch (evt.keyCode) {
            case 65:
            case 87:
            case 68:
            case 83:
            if (!may_control) {
                tail_ai = 2;
                score_ai = 0;
                score = 0;
                may_control = true;
                this.event = "Player 2 may now also use the W A S D buttons";
            }
            break;
        }

        switch (evt.keyCode) {
            // left
            case 37:

                //player movement is 1 of player movement y is 1
                player_movement_x = -1; player_movement_y = 0;
                break;
            //left p2
            case 65:
                if (may_control) {
                    ai_movement_x = -1;
                    ai_movement_y = 0;
                }
            break;

            // up
            case 38:
                player_movement_x = 0; player_movement_y = -1;
                break;
    
            //up p2
            case 87:
            if (may_control) {
                ai_movement_x = 0;
                ai_movement_y = -1;
            }
            break;

            // right
            case 39:
                player_movement_x = 1; player_movement_y = 0;
                break;

            //p2 right
            case 68:
                if (may_control) {
                    ai_movement_x = 1;
                    ai_movement_y = 0;
                }
                break;
            // down
            case 40:
                player_movement_x = 0; player_movement_y = 1;
                break;

            case 83:
            if (may_control) {
                ai_movement_x = 0;
                ai_movement_y = 1;
            }
            break;
        }
    }