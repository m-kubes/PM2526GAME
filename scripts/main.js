import Dialogue from "./dialogue.js";
import dialogue from "../dialogue/template_yahu_dialogue.json" with {type: "json"};


const yahu_dialogue = new Dialogue("Benjamin Netanyahu", "../resources/images/netanyahu.png");

await yahu_dialogue.conversation(dialogue);