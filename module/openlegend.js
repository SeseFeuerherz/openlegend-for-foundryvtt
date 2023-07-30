// Import Modules
import { OlActor } from "./actor/actor.js";
import { OlActorSheet } from "./actor/actor-sheet.js";
import { OlItem, hasRange, hasArea } from "./item/item.js";
import { OlItemSheet } from "./item/item-sheet.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import * as macros from "./util/macros.js";
import { weaponproperties, weaponcategories } from "./util/weapon_const.js";

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

console.log("Open Legend | Register Handlebars eq helper");
  Handlebars.registerHelper('eq', function(arg1, arg2) {
    return arg1 == arg2;
  });

  console.log("Open Legend | Register Handlebars hasRangedCategory helper");
  Handlebars.registerHelper('hasRangedCategory', function(item) {
    return hasRange(item);
  });

  console.log("Open Legend | Register Handlebars hasAreaProperty helper");
  Handlebars.registerHelper('hasAreaProperty', function(item) {
    return hasArea(item);
  });

  console.log("Open Legend | Register Handlebars moddedRangeInFeet helper");
  Handlebars.registerHelper('moddedRangeInFeet', function(categories, multiplier) {
    let longestRangeKey = "Close Ranged";
    for(const key in categories) {
      if (categories[key] === true)
        if (weaponcategories[key].type === "ranged")
          longestRangeKey = key;
    }
    return weaponcategories[longestRangeKey].rangeIncrement * multiplier;
  });

  console.log("Open Legend | Register Handlebars gtz helper");
  Handlebars.registerHelper('gtz', function (value) {
    return value > 0;
  });

  console.log("Open Legend | Register Handlebars weaponpropertydesc helper");
  Handlebars.registerHelper('weaponpropertydesc', function (propertyName) {
    return weaponproperties[propertyName];
  });

  console.log("Open Legend | Register Handlebars weaponcategorydesc helper");
  Handlebars.registerHelper('weaponcategorydesc', function (categoryName) {
    return weaponcategories[categoryName].description;
  });

  console.log("Open Legend | Register Handlebars lastSelectedProperty helper");
  Handlebars.registerHelper('lastSelectedProperty', function (properties, propertyName) {
    let lastSelectedProperty = "";
    for(const key in properties) {
      if (properties[key] === true)
        lastSelectedProperty = key;
    }
    return lastSelectedProperty == propertyName;
  });

  console.log("Open Legend | Register Handlebars lastSelectedCategory helper");
  Handlebars.registerHelper('lastSelectedCategory', function (categories, categoryName) {
    let lastSelectedCategory = "";
    for(const key in categories) {
      if (categories[key] === true)
        lastSelectedCategory = key;
    }
    return lastSelectedCategory == categoryName;
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
  console.log("Open Legend | Calculated initiative formula of a combatant");
  return formula;
};