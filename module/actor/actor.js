/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class OlActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    console.log("Open Legend | Preparing actor data");
    super.prepareData();

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (this.type === 'character')
      this._prepareCharacterData();
    else if (this.type === 'npc')
      this._prepareNPCData();
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData() {
    this._prepareCharacterLevelXp();
    this._prepareAttributePointTrackingAndDice();
    this._prepareDefenses();
    this._prepareFeatPointTracking();
  }

  _prepareNPCData() {
    this._prepareNpcLevelXp();
    this._prepareAttributePointTrackingAndDice();
    this._prepareFeatPointTracking();
  }

  _prepareCharacterLevelXp() {
    this.system.level = Math.floor(this.system.xp/3) + 1;
  }

  _prepareNpcLevelXp() {
    this.system.xp = (this.system.level-1) * 3;
  }

  _prepareAttributePointTrackingAndDice() {
    let pointsSpent = 0;
    // Loop through attribute scores, and add their dice to our sheet output.
    for (const attr_group of Object.values(this.system.attributes)) {
      for (const attr of Object.values(attr_group)) {
        attr.dice = this.getDieForAttrScore(attr.score);
        pointsSpent += (attr.score*attr.score + attr.score)/2;
      }
    }
    this.system.attribute_points.spent = pointsSpent;
    this.system.attribute_points.available = 40 + this.system.xp*3;
  }

  _prepareDefenses() {
    const agility = this.system.attributes.physical.agility.score;
    const fortitude = this.system.attributes.physical.fortitude.score;
    const might = this.system.attributes.physical.might.score;
    const will = this.system.attributes.mental.will.score;
    const presence = this.system.attributes.social.presence.score;

    // Set max hp based on: 2 * (Fortitude + Will + Presence) + 10
    // Cap current lethal between 0 and max
    const hp = this.system.defense.hp;
    hp.lethal = Math.min(Math.max(hp.lethal, 0), hp.max);
    hp.hint = 2 * (fortitude + will + presence) + 10;
    hp.max = Math.max(hp.max, hp.hint);
    hp.value = Math.min(Math.max(hp.value, hp.min), hp.max - hp.lethal);
    this.system.defense.hp = hp;

    // Set guard to 10 + Agility + Might + Armor + Other
    let armor = 0
    this.items.forEach(item => {
      if (item.type == 'armor') {
        if (item.system.equipped && fortitude >= item.system.req_fort)
          armor += item.system.defense;
      }
    });
    const guard = this.system.defense.guard;
    guard.armor = armor;
    guard.value = Math.max(0, 10 + agility + might + guard.armor + guard.other);
    this.system.defense.guard = guard;

    // Set toughness to 10 + Fortitude + Will + Other
    const toughness = this.system.defense.toughness;
    toughness.value = Math.max(0, 10 + fortitude + will + toughness.other);
    this.system.defense.toughness = toughness;

    // Set resolve to 10 + Presence + Will + Other
    const resolve = this.system.defense.resolve;
    resolve.value = Math.max(0, 10 + presence + will + resolve.other);
    this.system.defense.resolve = resolve;
  }

  _prepareFeatPointTracking() {
    let total_feat_cost = 0;
    this.items.forEach(item => {
      if (item.type == 'feat')
        total_feat_cost += item.system.cost;
    });
    this.system.feat_points.spent = total_feat_cost;
    this.system.feat_points.available = 6 + this.system.xp;
  }

  getDieForAttrScore(score) {
    switch (score){
      case 1: return {"str": "1d4", "num": 1, "die": "d4"};
      case 2: return {"str": "1d6", "num": 1, "die": "d6"};
      case 3: return {"str": "1d8", "num": 1, "die": "d8"};
      case 4: return {"str": "1d10", "num": 1, "die": "d10"};
      case 5: return {"str": "2d6", "num": 2, "die": "d6"};
      case 6: return {"str": "2d8", "num": 2, "die": "d8"};
      case 7: return {"str": "2d10", "num": 2, "die": "d10"};
      case 8: return {"str": "3d8", "num": 3, "die": "d8"};
      case 9: return {"str": "3d10", "num": 3, "die": "d10"};
      case 10: return {"str": "4d8", "num": 4, "die": "d8"};
      default: return {"str": "X", "num": 0, "die": 0};
    }
  }

  async addGuardMod() {
    const newMod = await Item.create({name: "Guard Modifier", type: "modifier"});
    const guardModifiers = this.system.defense.guard.modifiers;
    guardModifiers.push(newMod);
    this.update({
      _id: this._id,
      system:{defense:{guard:{modifiers: guardModifiers}}}
    });
  }

  deleteDefenseMod(modId) {
    this.deleteEmbeddedDocuments("Item", [modId]);
  }

  setDefenseModName(modId, newName) {
    this.updateEmbeddedDocuments("Item", [{
      _id: modId,
      system:{name: newName}
    }]);
  }

  setDefenseModValue(modId, newValue) {
    this.updateEmbeddedDocuments("Item", [{
      _id: modId,
      system:{value: newValue}
    }]);
  }

}