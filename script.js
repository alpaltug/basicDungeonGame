let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;  // index in the weapon array
let fighting;
let monsterHealth;
let inventory = ["stick"];

// to store the var with the given id to this el field
// let el = document.querySelector("#el");
// create a button

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterNameText");
const monsterHealthText = document.querySelector("#monsterHealthText");

const locations = [
    {
        name: "Town: Square",
        "button text": ["Go to store", "Go to cave", "Fight Dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: `You are in the town square. You see a sign that \"store"\.`
    },
    {
        name: "Store",
        "button text": ["Buy 30 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: `You entered the market`
    },
    {
        name: "Cave",
        "button text": ["Fight slime", "Fight beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goStore],
        text: `You entered the cave. You see some monsters`
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: `You are fighting a monster.`
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, goTown],
        text: `The monster screams "Arg!" as it dies. You gain experience points and find gold.`
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: `You died.`
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: `You defeated the Ender Dragon and saved the Kingdom of Hyrule! But more importantly, YOU WIN THE GAME!!!`
    }
];

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "goblin beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 40,
        health: 200
    }
]

// initialize buttons
//button1.onclick = function
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// to change the inner text in a button
//button.innerText = "new text";

function update(location) {
    monsterStats.style.display = "none";
    // change the button texts of the buttons for town
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    // change the routed functions for the buttons for town
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];

    // change the main text for town
    text.innerHTML = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function fightDragon() {
    fighting = 2;
    goFight(fighting);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You don't have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon += 1;     // to upgrade the weapon, just increase the weapon index
            let newWeapon = weapons[currentWeapon].name;
            text.innerHTML = `You now have a ${newWeapon}.`;
            goldText.innerHTML = gold;
            inventory.push(newWeapon);  // push the new weapon to the inventory
            text.innerHTML += ` In your inventory you have: ${inventory}`;
        } else {
            text.innerHTML = "You don't have enough gold to buy a weapon.";
        }
    } else {
        text.innerHTML = "You already have the most powerful weapon.";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerHTML = gold;
        let currentWeapon = inventory.shift();  //pop the first element and return
        text.innerHTML = `You sold a ${currentWeapon}.`;
        text.innerHTML += ` In your inventory you have: ${inventory}`;
    } else {
        text.innerHTML = `You cannot sell your only weapon.`;
    }
}

function fightSlime() {
    fighting = 0;
    goFight(fighting);
}

function fightBeast() {
    fighting = 1;
    goFight(fighting);
}

function goFight(){
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterHealthText.innerText = monsterHealth;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
}

function attack(){
    text.innerText = `The ${monsters[fighting]} attacks!`;
    text.innerText = `You attack it with your ${weapons[currentWeapon].name}.`;
    health -= Math.floor(monsters[fighting].level * 7 * Math.random());
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    monsterHealth.innerText = monsterHealth;
    healthText.innerText = health;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        console.log(fighting);
        fighting === 2 ? winGame() : defeatMonster();
    }
}

function dodge(){
    text.innerHTML = "You dodged the monster attack but what will you do next?";
}

function defeatMonster(){
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerHTML = gold;
    xpText.innerHTML = xp;
    update(locations[4])
}

function lose() {
    update(locations[5]);
}

function restart() {
    // Restart all of the parameters to the beginning
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerHTML = gold;
    xpText.innerHTML = xp;
    healthText.innerHTML = health;
    goTown();
}

function winGame() {
    update(locations[5]);
}


