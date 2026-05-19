import { stats } from "./stats.js";
import { character_container } from "./globals.js";

const template_dialogue_box = document.getElementsByClassName('dialogue_box')[0];

// every added dialogue json needs to be in here
const dialogue_list = [
    "benjamin_netanyahu_Intro.json",
    "john_b_politics2.json",
    "john_b_politics1.json",
    "forwolk_q_splont_proposal.json",
    "forwolk_q_splont_hate3.json",
    "forwolk_q_splont_hate2.json",
    "forwolk_q_splont_hate1.json",
    "forwolk_q_splont3.json",
    "forwolk_q_splont2.json",
    "forwolk_q_splont1.json",
    "bart_simpson_propose.json",
    "bart_simpson_love1.json",
    "bart_simpson3.json",
    "bart_simpson2.json",
    "bart_simpson1.json",
]

// dialogue manager class to store all dialogue boxes for characters as well as jsons and provide functions to access them and run conversation
class DialogueManager {
    constructor() {
        this._characters = {};
        this._dialogues = {};
    }

    add_character(name, character_json) {
        this._characters[name] = character_json;
    }

    get_character(name) {
        return this._characters[name];
    }

    get_all_characters() {
        return this._characters;
    }

    async load_characters(file_list) {
        // load all the story/character/ json files into the character container
        for (const file of file_list) {
            const file_name = file.split(".")[0];
            const response = await fetch("../resources/jsons/characters/" + file); 

            if (!response.ok) {
                throw new Error(`Error fetching character JSON: ${response.status} ${response.statusText}`);
            }
        
            const data = await response.json();
            const dialogue = new Dialogue(data.name, data.image);
            this.add_character(file_name, dialogue);
        }
    }

    add_dialogue(name, dialogue_json) {
        this._dialogues[name] = dialogue_json;
    }

    get_dialogue(name) {
        return this._dialogues[name];
    }

    get_all_dialogues() {
        return this._dialogues;
    }

    async load_dialogues(file_list) {
        // load all the story/character/ json files into the character container
        for (const file of file_list) {
            const file_name = file.split(".")[0];
            const response = await fetch("../resources/jsons/dialogue/" + file); 

            if (!response.ok) {
                throw new Error(`Error fetching dialogue JSON: ${response.status} ${response.statusText}`);
            }
        
            const data = await response.json();
            this.add_dialogue(file_name, data);
        }
    }
}

class Dialogue {
    constructor(name, image, is_debug = false, character_class) {
        this._is_debug = is_debug;
        this._name = name;
        this._image = image;
        this._character = character_class
        this._dialogue_box = template_dialogue_box.cloneNode(true);
        this._dialogue_box.id = name + "_dialogue_box";
        this._dialogue_box.querySelector(".portrait img").src = image;
        this._dialogue_box.querySelector(".name").textContent = name;
        this._options_menu = this._dialogue_box.querySelector(".options");
        document.body.appendChild(this._dialogue_box);
    }

    // returns a promise that resolves when the dialogue box is done showing
    // so we can await it before revealing text
    show() {
        return new Promise((resolve) => {
            // aniamtes box sliding up from bottom and reveals initial dialogue
            this._dialogue_box.style.display = "flex";

            // the first timeout is here to queue it for next frame so the animation works
            setTimeout(() => {
                if (this._is_debug) {
                    console.log("showing dialogue box");
                }
                window.requestAnimationFrame(() => {
                    this._dialogue_box.offsetHeight; // forces reflow so the animation works
                    this._dialogue_box.classList.add("active");
                })

                // second timeout resolves promise after animation finishes
                setTimeout(() => resolve('finished'), 1000);
            }, 1);
        });
    } 

    // not a promise cuz theres really no need for it
    hide(delay = 0) {
        return new Promise((resolve) => {
            // animates box sliding back down to bottom
            setTimeout(() => {
                if (this._is_debug) {
                    console.log("hiding dialogue box");
                }
                this._dialogue_box.classList.remove("active");

                // timeout to hide the box after the animation finishes
                setTimeout(() => {
                    this._dialogue_box.style.display = "none";
                    resolve();
                }, 1000);
            }, delay);
        });
    }

    // returns a promise that resolves when the text reveal is finished
    reveal_text(new_text, text_speed = 30, response_options = [], end_delay = 1000, is_player_response = false) {
        return new Promise((resolve) => {
            // uses a setInterval to reveal the text one dialogue at a time
            const text_box = this._dialogue_box.querySelector(".text");
            const name_box = this._dialogue_box.querySelector(".name");
            const old_name_box_content = name_box.textContent;

            if (is_player_response) {
                this._dialogue_box.classList.add("player_response");
                name_box.textContent = "You";
            }

            // reset text box only if there is text to reveal
            if (new_text !== "") {
                text_box.textContent = "";
            }
            let index = 0
            
            if (this._is_debug) {
                console.log("starting text reveal interval");
            }
            const typing_interval = setInterval(() => {
                // stop interval when all text is done
                // also present dialogue options
                // also stop interval if there is no text to reveal and just present dialogue options immediately
                if (index >= new_text.length - 1 || new_text === "") {
                    const controller = new AbortController();
                    clearInterval(typing_interval);
                    
                    // only provide options if there are any, otherwise just resolve the promise after end_delay ms
                    if (!response_options.length) {
                        setTimeout(() => {
                            if (this._is_debug) {
                                console.log("text reveal resolved with no options");
                            }
                            text_box.textContent = old_name_box_content;
                            this._dialogue_box.classList.remove("player_response");
                            resolve();
                        }, end_delay);
                    } else {
                        // create a new button for each option and add it to the options menu
                        const response_divs = []

                        // timeout here so options are created after end_delay ms
                        setTimeout(() => {
                            // creates a new button for each option and adds it to the options menu
                            response_options.forEach((option, i) => {
                                const template = this._options_menu.querySelector(".template");
                                const new_button = template.cloneNode(true);
                                new_button.classList.remove("template");
                                new_button.textContent = option;
                                new_button.display = "block";
                                this._options_menu.appendChild(new_button);
                                response_divs.push(new_button);

                                // clicking on a button resolves with the index of the button clicked (so we know which option was chosen)
                                new_button.addEventListener("click", () => {
                                    if (this._is_debug) {
                                        console.log("text reveal resolved with option " + i);
                                    }
                                    // aborts the event listener so it doesn't resolve multiple times if multiple buttons are clicked
                                    controller.abort();

                                    window.requestAnimationFrame(() => {
                                        this._dialogue_box.offsetHeight; // forces reflow so the animation works
                                        this._options_menu.classList.remove("active");
                                    });
                                    
                                    text_box.textContent = old_name_box_content;
                                    this._dialogue_box.classList.remove("player_response");
                                    resolve(i);

                                    // delete all other dialogue options
                                    setTimeout(() => {
                                        for (const div of response_divs) {
                                            div.remove();
                                        }
                                    }, 1000);
                                }, { signal: controller.signal });
                            });
                            
                            // animates the options menu sliding up from bottom
                            window.requestAnimationFrame(() => {
                                this._dialogue_box.offsetHeight; // forces reflow so the animation works
                                this._options_menu.classList.add("active");
                            });
                        }, end_delay);
                    }
                }
                // smoothly scrolls the text box to the bottom
                text_box.scrollTo({
                    top: text_box.scrollHeight,
                    behavior: 'smooth'
                });
                // adds a single dialogue
                if (index < new_text.length) {
                    text_box.textContent += new_text[index];
                    index++;
                }
            }, text_speed);
        });
    }

    // input json and it runs a whole conversation for you
    conversation(dialogue_arr, text_speed = 30) {
        return new Promise(async (resolve) => {
            if (this._is_debug) {
                console.log(this._name + ": starting new conversation");
            }

            await this.show();

            for (const index in dialogue_arr) {
                const dialogue = dialogue_arr[index];

                // create array of options text if there are any options for this dialogue
                let dialogue_options = [];
                if (dialogue.options) {
                    dialogue_options = dialogue.options.map(option => option.text);
                }

                // determine end_delay
                let end_delay = dialogue.options ? 0 : 1000
                let choice;

                // show prompt if there is one
                if (dialogue.prompt) {
                    // if there are options, we want to show them immediately after the text is done
                    // so we set end_delay to 0
                    choice = await this.reveal_text(dialogue.prompt, text_speed, dialogue_options, end_delay);
                } 
                // if there is no prompt but there are options, we still want to show the options menu
                // so we call reveal_text with an empty string for the text
                else if (dialogue.options) {
                    choice = await this.reveal_text("", text_speed, dialogue_options, 0);
                }
                
                if (choice !== undefined) {
                    // if there is an extended response, show that
                    if (dialogue.options[choice].extended_response) {
                        await this.reveal_text(dialogue.options[choice].extended_response, text_speed, [], 1500, true);
                    }

                    // if there is a response for the chosen option, show it
                    if (choice !== undefined && dialogue.options[choice].response) {
                        await this.reveal_text(dialogue.options[choice].response, text_speed, [], 1000);
                    }

                    // if there are stats impacts for the chosen option, update stats accordingly
                    if (choice !== undefined && dialogue.options[choice].stats_impact) {
                        let keys = Object.keys(dialogue.options[choice].stats_impact);
                        let values = Object.values(dialogue.options[choice].stats_impact);

                        keys.forEach(stat => {
                            // updates stats based on the stats_impact object in the dialogue json for that option
                            stats[stat].value = stats[stat].value + values[keys.indexOf(stat)];
                        });
                    }

                    // if there are character love impacts for the chosen option, update character love accordingly
                    if (choice !== undefined && dialogue.options[choice].character_love_impact) {
                        let keys = Object.keys(dialogue.options[choice].character_love_impact);
                        let values = Object.values(dialogue.options[choice].character_love_impact);

                        keys.forEach(character => {
                            // updates character love based on the character_love_impact object in the dialogue json for that option
                            character_container.get_character(character).love = character_container.get_character(character).love + values[keys.indexOf(character)];
                        });
                    }
                }
            }

            // hide dialogue box and end conversation
            await this.hide();
            resolve();

            if (this._is_debug) {
                console.log(this._name + ": conversation ended");
            }
        });
    }   
}

export {
    DialogueManager,
    Dialogue,
    dialogue_list
};


// conversations are objects with numbered keys (or arrays if you want) of dialogue pieces

// each piece of dialogue can have a:
    // - "prompt" - text the other dialogue says that is revealed in the dialogue box
    // - "options" - array of options the player can choose from
    //               (each with "text" and a required "response" that is revealed when the option is chosen)
    // - "stats_impact" - an object with keys as stats and values as the amount to change the stat by when the option is chosen

// dialogue json format example is in dialogue/template_yahu_dialogue.json