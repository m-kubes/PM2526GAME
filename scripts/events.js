import { stats } from "./stats.js";  

/*
    HOW TO USE: import this in main.js and nowhere else.
    Place all event listeners in this file and import their respective things that they will trigger.
*/


/*

Add a event listener for each stat in the stats object and make sure the names are the same.

Stat template event listener is below:

document.addEventListener("event_name", (event) => {
    if (event.detail.value < 0) {
        console.log("Example");
    }
});

*/

for (const stat_name of stats.keys()) {
    document.addEventListener(stat_name, (event) => {
        switch (stat_name) {
            case "money":
                if (event.detail.value <= 0) {
                    console.log("bankrupt ending");
                }
                break;
            case "schizophrenia":
                if (event.detail.value >= 100) {
                    console.log("schizo ending");
                } else if (event.detail.value < 0 ) {
                    stats.schizophrenia.value = 0;
                }
                break;
            case "gambling_anxiety":
                if (event.detail.value >= 100) {
                    console.log("Trigger All in bet sequence");
                } else if (event.detail.value < 0 ) {
                    stats.gambling_anxiety.value = 0;
                }
                break;
            case "netneyau_rage_love":
                if (event.detail.value <= -100) {
                    console.log("trigger rage ending");
                } else if (event.detail.value >= 100) {
                    console.log("trigger love ending");
                }
                break;
        }
    });
}