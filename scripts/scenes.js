import { character_container, dialogue_manager } from "./globals.js";
import { SceneManager, Scene } from "./scene_manager.js";
import SceneTools from "./scene_tools.js";


SceneManager.add_scene(new Scene("Main Menu", () => {
    const main_menu = document.getElementById("main_menu");
    main_menu.style.display = "block";

    // Add event listeners for main menu buttons
    const start_button = document.getElementById("start_button");
    start_button.addEventListener("click", () => {
        SceneManager.change_scene(SceneManager.get_scene("Potion Selling"));
    });

    // quit button 
    const quit_button = document.getElementById("quit_button");
    quit_button.addEventListener("click", () => {
        window.close();
    });
},
async () => {
    const game_title_and_buttons = document.getElementById("game-title-and-buttons");
    game_title_and_buttons.style.transform = "translate(0, 100vh)";

    // everything in here runs behind the fade
    // acts as a loading screen
    await SceneTools.transition_fade(1000, 500, () => {
        document.styleSheets[0].insertRule('.menu_circle { display: none; }', 0);
        document.querySelector('.linear_effect').style.display = 'none'
        document.getElementById('line_effect').style.display = 'none'
    })
}));


SceneManager.add_scene(new Scene("Yahu Intro", async () => {
    const benjamin_netanyahu = character_container.get_character("benjamin_netanyahu");
    const yahu_dialogue_box = dialogue_manager.get_character("benjamin_netanyahu");
    const yahu_intro_dialogue = dialogue_manager.get_dialogue("yahu_intro_dialogue");
    const yahu_moving_character = benjamin_netanyahu.moving_character;

    // everything in here runs behind the fade
    // acts as a loading screen
    await SceneTools.transition_fade(1000, 500, () => {
        document.body.style.backgroundImage = "url('./resources/images/office.jpg')";
        document.styleSheets[0].insertRule('.dust_circle { display: block; }', 0);
        document.body.style.backgroundSize = "cover";
        // set a timeout to fade in the light rays after 1 second
        const light_rays = document.querySelector('.light-rays');
        light_rays.classList.add('active')
    });

    // set up the moving character and dialogue box for the intro scene
    yahu_moving_character.set_position('-100%', 'calc(40vh - 50%)');
    yahu_moving_character.set_size('50vh', '50vh');
    yahu_moving_character.show();
    await yahu_moving_character.move_to('calc(50vw - 50%)', 'calc(40vh - 50%)', 2000);

    // play the intro dialogue and then have yahu exit the scene
    await yahu_dialogue_box.conversation(yahu_intro_dialogue);
    await yahu_moving_character.move_to('100vw', 'calc(40vh - 50%)', 2000);
    yahu_moving_character.hide();
    SceneManager.change_scene(SceneManager.get_scene('Potion Selling'))
}, () => {
    const light_rays = document.querySelector('.light-rays');
    light_rays.classList.remove('active')
}));


SceneManager.add_scene(new Scene("Shop", async () => {
    const shop_gui = document.querySelector(".shop");
    const exit_button = shop_gui.querySelector(".exit_button");

    exit_button.addEventListener("click", () => {
        SceneManager.change_scene();
    });

    shop_gui.style.display = "block";
    requestAnimationFrame(() => {
        shop_gui.offsetHeight; // forces reflow so the animation works
        shop_gui.classList.add("active");
    })
}, () => {
    const shop_gui = document.querySelector(".shop");
    shop_gui.classList.remove("active");
}))


SceneManager.add_scene(new Scene("Game Over", async () => {
    const game_over_screen = document.querySelector('.game_over')

    await SceneTools.transition_fade(1000, 500, () => {
        document.body.backgroundImage = ''
        document.body.style.backgroundColor = '#000'
        game_over_screen.classList.add('active')
    })
}))


SceneManager.add_scene(new Scene("Potion Selling", async () => {
    await SceneTools.transition_fade(1000, 500, () => {
        document.body.style.backgroundImage = "url('./resources/images/shop_bg.png')";
    })

    SceneManager.change_scene(SceneManager.get_scene("Customer Interaction"));
}))


SceneManager.add_scene(new Scene("Customer Interaction", async () => {
    for (let i = 0; i < 3; i++) {
        const [character, character_name] = character_container.get_random_character_with_name();
        const dialogue_box = dialogue_manager.get_character(character_name);
        const moving_character = character.moving_character;

        let dialogue;
        while(!dialogue) { // keep trying to get a dialogue for the character until one is found (some characters may not have dialogues)
            const random_dialogue_num = Math.floor(Math.random() * 3) + 1;
            const dialogue_name = character_name + random_dialogue_num
            dialogue = dialogue_manager.get_dialogue(dialogue_name);
            dialogue = dialogue_manager.get_dialogue('forwolk_q_splont1')
        }

        moving_character.hide();
        moving_character.set_size('50vh', '50vh');
        moving_character.set_position('-100%', 'calc(40vh - 50%)');
        moving_character.show();
        await moving_character.move_to('calc(50vw - 50%)', 'calc(40vh - 50%)', 2000);
        await dialogue_box.conversation(dialogue);
        await moving_character.move_to('100vw', 'calc(40vh - 50%)', 2000);
        moving_character.hide();
    }

    SceneManager.change_scene(SceneManager.get_scene("Game Over"));
}))