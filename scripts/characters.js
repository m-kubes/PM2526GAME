import MovingCharacter from "./moving_character.js";

// every added character needs to be added to character_files below
const character_files = [
    "benjamin_netanyahu.json",
    "bart_simpson.json",
    "forwolk_q_splont.json"
]

// character contianer class to store all character jsons and provide functions to access them
class CharacterContainer {
    constructor() {
        this._characters = {};
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

    get_all_character_names() {
        return Object.keys(this._characters);
    }

    get_random_character() {
        const character_names = Object.keys(this._characters);
        const random_index = Math.floor(Math.random() * character_names.length);
        return this._characters[character_names[random_index]];
    }

    get_random_character_with_name(exclude_netanyahu = true) {
        const character_names = exclude_netanyahu ? Object.keys(this._characters).slice(1) : Object.keys(this._characters);
        const random_index = Math.floor(Math.random() * character_names.length);
        return [this._characters[character_names[random_index]], character_names[random_index]];
    }

    async load_characters(file_list = character_files) {
        // load all the story/character/ json files into the character container
        for (const file of file_list) {
            const response = await fetch("../resources/jsons/characters/" + file); 
            if (!response.ok) {
                throw new Error(`Error fetching character JSON: ${response.status} ${response.statusText}`);
            }
        
            const data = await response.json();
            
            Object.defineProperty(data, "love", {
                set love(value) {
                    if (typeof value === "number") {
                        this._love = value;

                        document.dispatchEvent(new CustomEvent(`${this.name}_love`, {
                            detail: { value: this._love },
                            bubbles: true
                        }));
                    }
                },
                writable: true
            });
            
            data.moving_character = new MovingCharacter(data.name, data.image, 0, 0);

            this.add_character(file.split(".")[0], data);
        }
    }
}


export {
    CharacterContainer,
    character_files
};

