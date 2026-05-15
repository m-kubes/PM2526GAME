import MovingCharacter from "./moving_character.js";

// every added character needs to be added to character_files below
const character_files = [
    "bart_simpson.json",
    "benjamin_netanyahu.json",
    "cardinal.json",
    "forwolk_q_splont.json",
    "god.json",
    "goffer.json",
    "jennifer_marie_whitmer.json",
    "john_b_politics.json",
    "kronk.json",
    "rue_t_whirl.json",
    "shirley_z_morgan.json",
    "stephen_m_spectre.json",
    "sugoi_kawaii_johnson.json"
]

// character contianer class to store all character jsons and provide functions to access them
class CharacterContainer {
    constructor() {
        this._characters = {};
    }

    add_character(character_json) {
        this._characters[character_json.name] = character_json;
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

    async load_characters(file_list = character_files) {
        // load all the story/character/ json files into the character container
        for (const file of file_list) {
            const response = await fetch("../resources/jsons/characters/" + file); 
            if (!response.ok) {
                throw new Error(`Error fetching character JSON: ${response.status} ${response.statusText}`);
            }
        
            const data = await response.json();
            
            Object.defineProperty(data, "love", {
                set(value) {
                    if (typeof value === "number") {
                        this._love = value;

                        document.dispatchEvent(new CustomEvent(`${this.name}_love`, {
                            detail: { value: this._love },
                            bubbles: true
                        }));
                    }
                }
            });

            data.love = 0
            
            data.moving_character = new MovingCharacter(data.name, data.image, 0, 0);

            this.add_character(data);
        }
    }
}


export {
    CharacterContainer,
    character_files
};

