const template_dialogue_box = document.getElementsByClassName('dialogue_box')[0];

export default class Dialogue {
    constructor(name, image, is_debug = false) {
        this._is_debug = is_debug;
        this._name = name;
        this._image = image;
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
                this._dialogue_box.style.bottom = "1rem";
                this._options_menu.style.bottom = "-100%";

                // second timeout resolves promise after animation finishes
                setTimeout(() => resolve('finished'), 1000);
            }, 1);
        });
    } 

    // not a promise cuz theres really no need for it
    hide(delay = 0) {
        // animates box sliding back down to bottom
        setTimeout(() => {
            if (this._is_debug) {
                console.log("hiding dialogue box");
            }
            this._dialogue_box.style.bottom = "-100%";
            this._options_menu.style.bottom = "0";

            // timeout to hide the box after the animation finishes
            setTimeout(() => {
                this._dialogue_box.style.display = "none";
            }, 1000);
        }, delay);
    }

    // returns a promise that resolves when the text reveal is finished
    reveal_text(new_text, text_speed = 30, response_options = [], end_delay = 1000) {
        return new Promise((resolve) => {
            // uses a setInterval to reveal the text one character at a time
            const text_box = this._dialogue_box.querySelector(".text");
            
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

                                    this._options_menu.style.bottom = "-100%";
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
                            this._options_menu.style.bottom = "0%";
                        }, end_delay);
                    }
                }
                // smoothly scrolls the text box to the bottom
                text_box.scrollTo({
                    top: text_box.scrollHeight,
                    behavior: 'smooth'
                });
                // adds a single character
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

                // show prompt if there is one
                if (dialogue.prompt) {
                    // if there are options, we want to show them immediately after the text is done
                    // so we set end_delay to 0
                    const choice = await this.reveal_text(dialogue.prompt, text_speed, dialogue_options, end_delay);

                    // if there were options and there is a response for the chosen option, show it
                    if (choice !== undefined && dialogue.options[choice].response) {
                        await this.reveal_text(dialogue.options[choice].response, text_speed, [], 0);
                    }
                } 
                // if there is no prompt but there are options, we still want to show the options menu
                // so we call reveal_text with an empty string for the text
                else if (dialogue.options) {
                    const choice = await this.reveal_text("", text_speed, dialogue_options, 0);

                    // if there is a response for the chosen option, show it
                    if (dialogue.options[choice].response) {
                        await this.reveal_text(dialogue.options[choice].response, text_speed, [], 1000);
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


// conversations are objects with numbered keys (or arrays if you want) of dialogue pieces

// each piece of dialogue can have a:
    // - "prompt" - text the other character says that is revealed in the dialogue box
    // - "options" - array of options the player can choose from
    //               (each with "text" and a required "response" that is revealed when the option is chosen)

// dialogue json format example:
// {
//     "1": {
//         "prompt": "Hi! I'm Bejamin Netanyahu."
//     },
//     "2": {   
//         "prompt": "I'm also your boss.",
//         "options": [
//             {
//                 "text": "Ok cool",
//                 "response": "Great! Now make potions for me."
//             },
//             {
//                 "text": "No you aren't dude",
//                 "response": "Well unfortunately for you my friend, you don't have a choice in this matter.  You WILL make potions for me."
//             }
//         ]
//     },
//     "3": {
//         "options": [
//             {
//                 "text": "Sure thing boss",
//                 "response": "Thats the spirit!"
//             },
//             {
//                 "text": "I dont wanna do that",
//                 "response": "I really dont care what you wanna do, just make the potions."
//             }
//         ]
//     },
//     "4": {
//         "prompt": "Anyway, I have to go now. See you later!  And remember, make those potions real good for me, or else..."
//     }
// }