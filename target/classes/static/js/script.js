let adventurersList = [];
let monstersList = [];
let activeHero = null;
let activeMonster = null;



async function displayAdventurers() {
    try {
        const response = await fetch("/home");
        adventurersList = await response.json();
        const container = document.getElementById('adventurer-list');

        container.innerHTML = adventurersList.map(adv => `
        <div class="card adventurer-card">
            <div class="card-header">
                <h3>${adv.name}</h3>
                <span class="lvl-badge">Lvl ${adv.level}</span>
            </div>
            <div class="stats-row">
                <p><strong>Class:</strong> ${adv.adventurerClass}</p>
                <p><strong>Weapon:</strong> ⚔️ ${adv.weapon}</p>
            </div>
            <div class="combat-stats">
                <p class="hp"><strong>HP:</strong> ❤️ ${adv.hp}</p>
                <p class="dmg"><strong>DMG:</strong> 💥 ${adv.damage}</p>
            </div>

            <div class="inventory-container">
                <h4>Backpack</h4>
                <ul class="inventory-list">
                    ${(adv.inventory && adv.inventory.length > 0)
            ? adv.inventory.map(item => `
                            <li>
                                <span>${item.itemName}</span>
                                <button class="btn-mini" onclick="removeItem('${adv.name}', '${item.itemName}')">x</button>
                            </li>`).join('')
            : '<li><small>Empty...</small></li>'}
                </ul>
                <button class="btn-small" onclick="addItemPrompt('${adv.name}')">+ Add Item</button>
            </div>
         </div>
        `).join('');
    } catch (err) { console.error("Failed to load adventurers", err); }
}

async function displayQuests() {
    try {
        const response = await fetch("/quests");
        const quests = await response.json();
        const container = document.getElementById('quest-list');

        container.innerHTML = quests.map(q => `
            <div class="card quest-card">
                <h3>${q.name}</h3>
                <p>${q.description}</p>
                <p><strong>Min Level:</strong> ${q.level}</p>
                <button onclick="deleteQuest('${q.name}')" class="delete-btn">Completed</button>
            </div>
        `).join('');
    } catch (err) { console.error("Failed to load quests", err); }
}

async function displayMonsters() {
    try {
        const response = await fetch("/monsters");
        monstersList = await response.json();
        const container = document.getElementById('monster-list');

        container.innerHTML = monstersList.map(m => `
            <div class="card monster-card">
                <div class="card-header">
                    <h3>👾 ${m.name}</h3>
                    <span class="lvl-badge">Lvl ${m.level}</span>
                </div>
                <div class="combat-stats">
                    <p class="hp-text"><strong>HP:</strong> ❤️ ${m.health}</p>
                    <p class="dmg-text"><strong>DMG:</strong> 💥 ${m.damage}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Failed to load monsters", err);
    }
}

async function addAdventurer(event) {
    event.preventDefault();
    const adventurerData = {
        name: document.getElementById('advName').value,
        adventurerClass: document.getElementById('advClass').value,
        level: parseInt(document.getElementById('advLevel').value),
        weapon: document.getElementById('advWeapon').value,
        hp: parseInt(document.getElementById('advHp')?.value || 100),
        damage: parseInt(document.getElementById('advDamage')?.value || 10),
        inventory: []
    };

    await fetch("/add-adventurer", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(adventurerData)
    });

    event.target.reset();
    displayAdventurers();
    setupSelection();
}

async function addQuest(event) {
    event.preventDefault();
    const questData = {
        name: document.getElementById('qName').value,
        description: document.getElementById('qDesc').value,
        level: parseInt(document.getElementById('qLevel').value)
    };

    await fetch('/add-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questData)
    });

    event.target.reset();
    displayQuests();
}


async function setupSelection() {
    try {
        const heroesRes = await fetch("/home");
        const monstersRes = await fetch("/monsters");

        adventurersList = await heroesRes.json();
        monstersList = await monstersRes.json();

        const heroSelect = document.getElementById('select-adventurer');
        const monsterSelect = document.getElementById('select-monster');

        heroSelect.innerHTML = '<option value="">Select Adventurer</option>' +
            adventurersList.map(h => `<option value="${h.name}">${h.name} (Lvl ${h.level})</option>`).join('');

        monsterSelect.innerHTML = '<option value="">Select Monster</option>' +
            monstersList.map(m => `<option value="${m.name}">${m.name} (HP: ${m.health})</option>`).join('');
    } catch (err) { console.error("Setup failed", err); }
}

function startFight() {
    const heroName = document.getElementById('select-adventurer').value;
    const monsterName = document.getElementById('select-monster').value;

    if (!heroName || !monsterName) {
        alert("Select both combatants!");
        return;
    }

    activeHero = { ...adventurersList.find(h => h.name === heroName) };
    activeMonster = { ...monstersList.find(m => m.name === monsterName) };

    document.getElementById('battle-arena').style.display = 'block';
    document.getElementById('attack-btn').disabled = false;
    document.getElementById('battle-log').innerHTML = "<p>Battle Started!</p>";

    updateArenaUI();
}

function attackTurn() {
    if (!activeHero || !activeMonster) return;
    activeMonster.health -= activeHero.damage;
    logMessage(`⚔️ ${activeHero.name} hits ${activeMonster.name} for ${activeHero.damage} damage!`);

    if (activeMonster.health <= 0) {
        activeMonster.health = 0;
        logMessage(`🏆 ${activeMonster.name} has been defeated!`);
        endBattle();
    } else {

        activeHero.hp -= activeMonster.damage;
        logMessage(`💥 ${activeMonster.name} strikes back for ${activeMonster.damage} damage!`);

        if (activeHero.hp <= 0) {
            activeHero.hp = 0;
            logMessage(`💀 ${activeHero.name} has fallen...`);
            endBattle();
        }
    }
    updateArenaUI();
}

function updateArenaUI() {
    document.getElementById('player-combatant').innerHTML = `
        <div class="card">
            <h3>${activeHero.name}</h3>
            <p>HP: ❤️ <strong>${activeHero.hp}</strong></p>
        </div>`;

    document.getElementById('enemy-combatant').innerHTML = `
        <div class="card">
            <h3>${activeMonster.name}</h3>
            <p>HP: ❤️ <strong>${activeMonster.health}</strong></p>
        </div>`;
}

async function addItemPrompt(adventurerName) {
    const itemName = prompt(`What are you giving to ${adventurerName}?`);
    if (!itemName) return;

    const type = prompt("Item type? (e.g., Potion, Armor, Weapon)");
    const worth = parseInt(prompt("Worth/Value? (e.g., 50)"));

    const itemData = {
        itemName: itemName,
        type: type || "Misc",
        worth: worth || 0
    };

    const response = await fetch(`/adventurer/${adventurerName}/add-item`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
    });

    if (response.ok) {
        displayAdventurers();
    }
}


async function removeItem(advName, itemName) {
    if (!confirm(`Remove ${itemName} from ${advName}?`)) return;

    const response = await fetch(`/adventurer/${advName}/remove-item/${itemName}`, {
        method: "DELETE"
    });

    if (response.ok) {
        displayAdventurers();
    }
}

function logMessage(msg) {
    const log = document.getElementById('battle-log');
    log.innerHTML = `<p>${msg}</p>` + log.innerHTML;
}

function endBattle() {
    document.getElementById('attack-btn').disabled = true;
}


async function deleteQuest(name) {
    await fetch(`/remove-quest/${name}`, { method: 'DELETE' });
    displayQuests();
}


window.onload = () => {
    displayAdventurers();
    displayQuests();
    displayMonsters();
    setupSelection();
};