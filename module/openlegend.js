// Import Modules
import { OlActor } from "./actor/actor.js";
import { OlActorSheet } from "./actor/actor-sheet.js";
import { OlItem } from "./item/item.js";
import { OlItemSheet } from "./item/item-sheet.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import * as macros from "./util/macros.js";

Hooks.once('init', async function() {
  console.log("Open Legend | Loading openlegend.js on init");
  game.openlegend = {
    OlActor,
    OlItem,
    macros: macros
  };

  
  console.log("Open Legend | Set default initiative formula");
  CONFIG.Combat.initiative.formula = "1d20X";
  Combatant.prototype._getInitiativeFormula = _getInitiativeFormula;

  
  console.log("Open Legend | Define custom document classes");
  CONFIG.Actor.documentClass = OlActor;
  CONFIG.Item.documentClass = OlItem;

  
  console.log("Open Legend | Register sheet application classes");
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("openlegend", OlActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("openlegend", OlItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:

  console.log("Open Legend | Register Handlebars concat helper");
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

console.log("Open Legend | Register Handlebars toLowerCase helper");
  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });

console.log("Open Legend | Register Handlebars ifeq helper");
  Handlebars.registerHelper('eq', function(arg1, arg2) {
    return arg1 == arg2;
  });

  console.log("Open Legend | Register Handlebars gtz helper");
  Handlebars.registerHelper('gtz', function (value) {
    return value > 0;
  });

  console.log("Open Legend | Preload Handlebars templates");
  await preloadHandlebarsTemplates();

  console.log("Open Legend | Loaded openlegend.js");
});

Hooks.once("ready", function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => macros.createOLMacro(data, slot));
  console.log("Open Legend | Registered callback for hotbarDrop on ready");
});

export const _getInitiativeFormula = function() {
  const actor = this.actor;
  if ( !actor ) return "1d20";
  const agi = actor.system.attributes.physical.agility.dice;
  
  const init_mod = actor.system.initiative_mod;
  // If this actor doesn't have an init mod, or the init_mod is 0, default d10
  if ( init_mod == undefined || init_mod == 0) {
    if (agi.num == 0)
      return "1d20X";
    else return `1d20X + ${agi.str}X`;
  // If it has an init mod, and that mod is not 0, and its agi score is 0
  } else if (agi.num == 0) {
    if (init_mod < 0)
      return "2d20kl1X";
    else
      return "2d20kh1X";
  }
  // Generate KH/KL for adv/dis
  const keep_str = init_mod < 0 ? `kl${agi.num}` : `kh${agi.num}`;
  const multiplier = Math.abs(init_mod);
  const dice_to_roll = multiplier + agi.num;
  const formula = `1d20X + ${dice_to_roll}${agi.die}${keep_str}X`;
  return formula;
  console.log("Open Legend | Calculated initiative formula of a combatant");
};