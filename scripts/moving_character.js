export default class MovingCharacter {
    constructor(name, image, x, y) {
        this.name = name;

        this.div = document.createElement("img");
        this.div.src = image;
        this.div.classList.add("moving_character");
        this.div.id = `moving_character_${name}`;
        this.div.style.display = "none";

        document.body.appendChild(this.div);
        this.set_position(x, y);
    }

    show() {
        this.div.style.display = "block";
        this.div.offsetHeight;
    }

    hide() {
        this.div.style.display = "none";
        this.div.offsetHeight;
    }

    set_position(x, y) {
        this.x = x;
        this.y = y;
        const new_x = typeof x === "number" ? `${x}px` : x;
        const new_y = typeof y === "number" ? `${y}px` : y;

        this.div.style.transform = `translate(${new_x}, ${new_y})`;
    }

    set_size(width, height) {
        const new_width = typeof width === "number" ? `${width}px` : width;
        const new_height = typeof height === "number" ? `${height}px` : height;
        this.div.style.width = new_width;
        this.div.style.height = new_height;
    }

    move_to(x, y, duration) {
        return new Promise((resolve) => {
            this.div.style.transition = `transform ${duration}ms ease-in-out`;

            // run next frame so it can use the transition
            setTimeout(() => {
                this.set_position(x, y);
            }, 1);

            // resolve the promise after the transition duration
            setTimeout(() => {
                this.div.style.transition = '';
                resolve();
            }, duration);
        });
    }
}