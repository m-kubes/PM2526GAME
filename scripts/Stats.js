//Rough draft for stats and their basic increase/decrease functions
//Print is used as a filler until we have something to put the text into
//Remember to convert money into plat/gold/silver/copper
let money = 19798458
let plat = 0
let gold = 0
let silver = 0
let copper = 0

function convert_money() {
  let money_copy = money

  plat = Math.floor(money_copy / 1000000);
  money_copy %= 1000000;

  gold = Math.floor(money_copy / 10000);
  money_copy %= 10000;

  silver = Math.floor(money_copy / 100);
  money_copy %= 100;

  copper = money_copy
}

function money_add(amount) {
  money+= amount
  convert_money()
  print("You have $" + money)
}

function money_subtract(amount) {
  money-= amount
  convert_money()
  if (money <= 0 ) {
    print("you're broke")
    //trigger the bankruptcy ending
  } else {
    print("You have $" + money)
  }
}

class Character {
  constructor(name, personality, difficulty_rating, race, gender, other_info, img_url) {
    this.name = name
    this.personality = personality
    this.difficulty_rating = difficulty_rating
    this.race = race
    this.gender = gender
    this.other_info = other_info
    this.img_url = img_url
    this.love = 0
  }
  love_add(amount) {
    this.love += amount
    // Check if love with ben reaches max and then trigger the ending for marrying him, or trigger a switch to cause it
  }
  love_subtract(amount) {
    this.love -= amount
  }
}

let character_steven = new Character("Steven M. Spectre", "intellectual, weary, in his 60s, speaks like a New Englander from the 19th century", "5/10", "Human", "Male", "gray hair and a modest-sized beard, smokes an old-timey cigar", "Imagine there's an image URL Here")
let character_forwolk = new Character("Forwolk Q. Splont", "bland, unimaginative, steady, straightforward", "3/10", "Profugus", "ambiguous", "Comes from a species that is prone to bias on this planet, do whatever you want for the design", "Imagine there's an image URL Here")
let character_bart = new Character("Bart Simpson", "cool, troublesome, obscene, rude", "6/10", "Vaguely human", "Male", "Not actually Bart Simpson from the Simpsons, but he should look relatively similar and he should also be in his 30s", "Imagine there's an image URL Here")
let character_god = new Character("God", "Holy, god-like deity, speaks like a biblical angel", "8/10", "Seorsus", "ascended beyond the concept", "very very bright. Basically should be unable to make out most details because of how bright it is ", "Imagine there's an image URL Here")
let character_kronk = new Character("Kronk", "Literally just Kronk’s personality", "0/10", "Whatever race the main character is supposed to be", "Ambiguous", "Basically a carbon copy of Kronk (this will never be addressed), has the exact same character portrait as Kronk but flipped horizontally", "Imagine there's an image URL Here")
let character_john = new Character("John B. Politics", "Sleazeball politician, never gives a committal response, respectable bipartisan, wants the Borox equivalent of the middle east nuked ASAP", "9/10", "Human", "Male", "Looks something like this", "Imagine there's an image URL Here")
let character_sugoi = new Character("Sugoi Kawaii Johnson", "annoying, speaks in a really cringe manner, genuinely unbearable to be around, hasn’t changed her sense of humor since 2018", "10/10", "humanoid but with really exaggerated anime-like features", "female", "she’s really rich after hitting it big at the slot machines", "Imagine there's an image URL Here")
let character_jennifer = new Character("Jennifer Marie Whitmer", "Facebook-using suburban wine mom, loves minions, divorcee", "8/10", "whatever creature you can make that is the furthest from looking like a human", "female", "nothing really", "Imagine there's an image URL Here")
let character_shirley = new Character("Shirley Z. Morgan", "remarkably normal, in her early twenties, has average income, goes to a normal university, has a normal apartment, etc…", "7/10", "Human, african american", "female", "Nothing in particular", "Imagine there's an image URL Here")
let character_rue = new Character("Rue T. Whirl", "Surreal, doesn’t really make that much sense most of the time", "7/10", "Shark-like humanoid alien thing", "Non-Binary", "N/A", "Imagine there's an image URL Here")
let character_goffer = new Character("Goffer", "Evil, cool, violent, doesn’t talk, really hates someone named “Goober”, flat broke", "4/10", "???", "Male", "There’s already a design for this one since it’s from a game some of my friends made, I’ll share it later.", "Imagine there's an image URL Here")
let character_cardinal = new Character("cardinal", "Evil, funny, chaotic", "???", "demon", "???", "no design yet but im tempted to use my oc just bc they kinda look like a demon, as well this character will most likely not be an option to marry but an obstacle to go around ", "Imagine there's an image URL Here")

let schitzo_level = 0

function increase_schitzo(amount) {
  schitzo_level+= amount
  if (schitzo_level >= 100) {
    print("You are too far gone and need to be admitted to a hospital")
    //Trigger whatever happens at max schitzophrenia
  }
}

let meds_amount = 10

function take_meds() {
  if (meds_amount <= 0) {
    print("You have no medication left")
  } else {
    meds_amount--
    schitzo_level-= 35
    print("You take a potion and feel better")
  }
  if (schitzo_level < 0){
    schitzo_level = 0
  }
}

function add_meds(amount) {
  meds_amount+=amount
}

let anxiety = 0

function anxiety_increase(amount) {
  anxiety+= amount
  if (anxiety >= 100) {
    print("You feel an irresistable urge to gamble")
  }
  print("You feel the urge to gamble")
}


function anxiety_decrease(amount) {
  anxiety-= amount
  if (anxiety < 0) {
    anxiety = 0
  }
  print("You feel your urge to gamble lessen")
}

let net_rage_love = 0

function increase_love(amount) {
  net_rage_love += amount
  //If it reaches 10 then you get married and lose
}

function decrease_love(amount) {
  net_rage_love -= amount
  //If it reaches -10 then you get bombed and lose
}