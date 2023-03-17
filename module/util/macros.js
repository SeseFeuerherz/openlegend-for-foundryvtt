import { rollAttr, rollItem } from "./dice.js";

const attr_imgs = {
    //Physical
    "agility": "modules/game-icons-net/blackbackground/body-balance.svg",
    "fortitude": "modules/game-icons-net/blackbackground/health-normal.svg",
    "might": "modules/game-icons-net/blackbackground/strong.svg",
    //Mental
    "learning": "modules/game-icons-net/blackbackground/archive-research.svg",
    "logic": "modules/game-icons-net/blackbackground/checkbox-tree.svg",
    "perception": "modules/game-icons-net/blackbackground/semi-closed-eye.svg",
    "will": "modules/game-icons-net/blackbackground/fist.svg",
    //Social
    "deception": "modules/game-icons-net/blackbackground/duality-mask.svg",
    "persuasion": "modules/game-icons-net/blackbackground/shaking-hands.svg",
    "presence": "modules/game-icons-net/blackbackground/public-speaker.svg",
    //Extraordinary
    "alteration": "modules/game-icons-net/blackbackground/transform.svg",
    "creation": "modules/game-icons-net/blackbackground/anvil-impact.svg",
    "energy": "modules/game-icons-net/blackbackground/rolling-energy.svg",
    "entropy": "modules/game-icons-net/blackbackground/skull-bolt.svg",
    "influence": "modules/game-icons-net/blackbackground/hive-mind.svg",
    "movement": "modules/game-icons-net/blackbackground/tron-arrow.svg",
    "prescience": "modules/game-icons-net/blackbackground/crystal-ball.svg",
    "protection": "modules/game-icons-net/blackbackground/rosa-shield.svg"
};

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */
export async function createOLMacro(data, slot) {
    console.log("Open Legend | Creating a OlMacro for slot " + slot + " with data:");
    console.log(data);
    if (data.macro == 'attr') {
        console.log("Open Legend | Macro is for attribute " + data.attr)
        const command = `game.openlegend.macros.rollAttrMacro("${data.actor}", "${data.attr}")`;
        let macro = game.macros.find(m => m.data.command === command);
        if (!macro) {
            macro = await Macro.create({
                name: _capitalize(data.attr),
                type: "script",
                img: attr_imgs[data.attr],
                command: command
            });
        }
        game.user.assignHotbarMacro(macro, slot);
    } else if (data.macro == 'item') {
        const command = `game.openlegend.macros.rollItemMacro("${data.actor}", "${data.item}")`;
        let macro = game.macros.entities.find(m => m.command === command);
        if (!macro) {
            const actor = game.actors.get(data.actor);
            const item = actor.getOwnedItem(data.item);
            macro = await Macro.create({
                name: data.name,
                type: "script",
                img: item.img,
                command: command
            });
        }
        game.user.assignHotbarMacro(macro, slot);
    }
    return false;
}

/* -------------------------------------------- */
export async function rollAttrMacro(actor_id, attr_name) {
    const actor = game.actors.get(actor_id);
    rollAttr(actor, attr_name);
}

export function rollItemMacro(actor_id, item_id) {
    const actor = game.actors.get(actor_id);
    const item = actor.getOwnedItem(item_id);
    rollItem(actor, item);
}

function _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}