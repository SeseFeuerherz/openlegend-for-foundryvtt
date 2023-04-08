import { rollAttr, rollItem } from "../util/dice.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class OlActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    console.log("Open Legend | Retrieving default options for OlActorSheet");
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["openlegend", "sheet", "actor"],
      width: 1000,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    console.log("Open Legend | Retrieving template for OlActorSheet");
    if (this.actor.type == 'character')
      return "systems/openlegend-ttrpg/templates/actor/actor-sheet.html";
    else
      return "systems/openlegend-ttrpg/templates/actor/npc-sheet.html";
  }

  /* -------------------------------------------- */

  /** @override */
  async getData(options) {
    const renderData = await super.getData(options);

    if (renderData.actions == undefined) {
      renderData.actions = [];
      renderData.gear    = [];
      renderData.feats   = [];
      renderData.perks   = [];
      renderData.flaws   = [];
    }
    renderData.items.forEach(item => {
      if (item.system.action)
        renderData.actions.push(item);
      if (item.system.gear)
        renderData.gear.push(item);
      if (item.type == 'feat')
        renderData.feats.push(item);
      else if (item.type == 'perk')
        renderData.perks.push(item);
      else if (item.type == 'flaw')
        renderData.flaws.push(item);
    });
    renderData.actions.sort((a, b) => a.system.action.index - b.system.action.index);
    renderData.gear.sort((a, b) => a.system.gear.index - b.system.gear.index);
    renderData.feats.sort((a, b) => a.system.index - b.system.index);
    console.log("Open Legend | Retrieved render data for OlActorSheet");
    console.log(renderData);
    return renderData;
  }

  /** @override */
  async _onDropItemCreate(itemData) {
    const data = await this.getData();
    if (itemData.system.action) {
      itemData.system.action.index = data.actions.length;
      itemData.system.action.name = itemData.name;
    }

    if (itemData.system.gear)
      itemData.system.gear.index = data.gear.length;

    if (itemData.type == 'feat')
      itemData.system.index = data.feats.length;

    // Create the owned item as normal
    super._onDropItemCreate(itemData);
  }

  /** @override */
  activateListeners(html) {
    console.log("Open Legend | Activating listeners for OlActorSheet");

    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html.find('.macro').on('dragstart', ev => {
      const dataset = ev.currentTarget.dataset;
      dataset.actor = this.actor._id;
      ev.originalEvent.dataTransfer.setData("text/plain", JSON.stringify(dataset));
    });

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const tag = ev.currentTarget;
      const item = this.actor.items.get(tag.dataset.item);
      item.sheet.render(true);
    });

    // Move items up in their corresponding rows
    html.find('.action-move-up').click(ev => {
      // Get the item to move up
      const tag = ev.currentTarget;
      const item = this.actor.items.get(tag.dataset.item);
      // Get this items current and new indexes
      const curr_index = item.system.action.index;
      const new_index = curr_index - 1;
      const updates = [];
      // Skip if already at top
      if (curr_index > 0) {
        // Find the item above it
        this.actor.items.forEach(_sub_item => {
          if (_sub_item.system.action) {
            const i = _sub_item.system.action.index;
            if (i == new_index) {
              updates.push({
                _id: _sub_item._id,
                system:{action:{index: curr_index}}
              });
            }
          }
        });
        updates.push({
          _id: item._id,
          system:{action:{index: new_index}}
        });
        this.actor.updateEmbeddedDocuments("Item", updates);
      }
    });
    html.find('.gear-move-up').click(ev => {
      // Get the item to move up
      const tag = ev.currentTarget;
      const item = this.actor.items.get(tag.dataset.item);
      // Get this items current and new indexes
      const curr_index = item.system.gear.index;
      const new_index = curr_index - 1;
      const updates = [];
      // Skip if already at top
      if (curr_index > 0) {
        // Find the item above it
        this.actor.items.forEach(_sub_item => {
          if (_sub_item.system.gear) {
            const i = _sub_item.system.gear.index;
            if (i == new_index) {
              updates.push({
                _id: _sub_item._id,
                system:{gear:{index: curr_index}}
              });
            }
          }
        });
        updates.push({
          _id: item._id,
          system:{gear:{index: new_index}}
        });
        this.actor.updateEmbeddedDocuments("Item", updates);
      }
    });
    html.find('.feat-move-up').click(ev => {
      // Get the item to move up
      const tag = ev.currentTarget;
      const item = this.actor.items.get(tag.dataset.item);
      // Get this items current and new indexes
      const curr_index = item.system.index;
      const new_index = curr_index - 1;
      const updates = [];
      // Skip if already at top
      if (curr_index > 0) {
        // Find the item above it
        this.actor.items.forEach(_sub_item => {
          if (_sub_item.type == 'feat') {
            const i = _sub_item.system.index;
            if (i == new_index) {
              updates.push({
                _id: _sub_item._id,
                system:{index: curr_index}
              });
            }
          }
        });
        updates.push({
          _id: item._id,
          system:{index: new_index}
        });
        this.actor.updateEmbeddedDocuments("Item", updates);
      }
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const tag = ev.currentTarget;
      const item = this.actor.items.get(tag.dataset.item);
      item.delete();
    });

    // Update action 'items' directly
    html.find('.action-edit').change(ev => {
      const tag = ev.currentTarget;
      const item = this.actor.items.get(tag.dataset.item);
      const field = tag.dataset.field;
      const value = tag.value;

      var data = item.data.toJSON();
      if( field == 'name') data.name = value;
      else if( field == 'action_attr') data.data.action.attribute = value;
      else if( field == 'action_name') data.data.action.name = value;
      else if (field == 'action_adv') data.data.action.default_adv = value;
      else if( field == 'notes') data.data.details.notes = value;
      else if( field == 'attack') {
        // Set both attack attribute and find its target
        data.data.action.attribute = value;
        data.data.attacks.forEach(attack => {
          if (attack.attribute == value)
            data.data.action.target = attack.target;
        });
      }
      item.update(data);
    });

    // Update curr hp of npcs if max hp changes
    html.find('.npc_hp_edit').change(ev => {
      const hp_val = $(ev.currentTarget).val()
      const data = this.actor.data.toJSON();
      const hp = data.data.defense.hp;
      hp.max = hp_val;
      hp.value = hp_val;
      this.actor.update(data);
    });

    html.find(".update-npc-attributes").click(ev => {
      const btn = $(ev.currentTarget);
      if (btn.html() == "Edit")
        btn.html("Save");
      else {
        var data = {}
        html.find(".npc-attr-setter").each((i, obj) => {
          data[`data.attributes.${obj.dataset.group}.${obj.dataset.attr}.score`] = parseInt(obj.value);
        });
        this.actor.update(data);
        btn.html("Edit");
      }
      html.find(".npc-attributes-display").toggle();
      html.find(".npc-attributes-edit").toggle();
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
    html.find('.init-rollable').click(ev => {
      this.actor.rollInitiative({createCombatants: true});
    });

    console.log("Open Legend | Activated listeners for OlActorSheet");
  }

  /* -------------------------------------------- */

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    console.log("Open Legend | Handling clickable roll event of OlActorSheet");
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Roll using the appropriate logic -- item vs attribute
    if (dataset.item)
      rollItem(this.actor, this.actor.items.get(dataset.item).data);
    else if (dataset.attr)
      rollAttr(this.actor, dataset.attr);
    console.log("Open Legend | Handled clickable roll event of OlActorSheet");
  }
}
