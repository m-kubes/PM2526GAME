const template_dialogue_box = document.getElementsByClassName('dialogue-box')[0];

class Dialogue {
    constructor(name, image, dialogue) {
        this._name = name;
        this._image = image;
        this.initial_dialogue = dialogue;
        this._dialogue_box = template_dialogue_box.cloneNode(true);
        this._dialogue_box.id = name + "-dialogue-box";
        this._dialogue_box.querySelector(".portrait").src = image;
        this._dialogue_box.querySelector(".name").textContent = name;
        this._dialogue_box.querySelector(".text").textContent = dialogue;
        document.body.appendChild(this._dialogue_box);
    }

    show() {
        this._dialogue_box.style.display = "flex";
        setTimeout(() => {
            this._dialogue_box.style.bottom = "1rem";
        }, 1);
    } 

    hide() {
        this._dialogue_box.style.bottom = "-100%";
        setTimeout(() => {
            this._dialogue_box.style.display = "none";
        }, 1000);
    }

    write_new_text(new_text) {
        this._dialogue_box.querySelector(".text").textContent = new_text;
    }
}

const yahu_dialogue = new Dialogue("Benjamin Netanyahu", "resources/images/yahu.png", "Hello there! I am Yahu, your guide and companion on this adventure. Let's explore together and uncover the secrets of this world!");
yahu_dialogue.show();
setTimeout(() => {
    yahu_dialogue.hide()
}, 2000);