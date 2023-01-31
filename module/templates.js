/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
      // Actor Sheet Partials
      "systems/openlegend-ttrpg/templates/actor/parts/actor-details.html",
      "systems/openlegend-ttrpg/templates/actor/parts/actor-defense.html",
      "systems/openlegend-ttrpg/templates/actor/parts/actor-attributes.html",
      "systems/openlegend-ttrpg/templates/actor/parts/actor-actions.html",
      "systems/openlegend-ttrpg/templates/actor/parts/action-attack.html",
      "systems/openlegend-ttrpg/templates/actor/parts/action-boon.html",
      "systems/openlegend-ttrpg/templates/actor/parts/gear-weapon.html",
      "systems/openlegend-ttrpg/templates/actor/parts/gear-armor.html",
      "systems/openlegend-ttrpg/templates/actor/parts/gear-generic.html",
      "systems/openlegend-ttrpg/templates/actor/parts/gear-feat.html",
      "systems/openlegend-ttrpg/templates/actor/parts/gear-perkflaw.html",
  
      // Item Sheet Partials
      "systems/openlegend-ttrpg/templates/item/parts/attack-target.html"
    ]);
  };