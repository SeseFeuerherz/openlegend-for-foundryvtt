/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class OlItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    console.log("Open Legend | Prepare item data")
    super.prepareData();
    if (this.type === 'boon')
      this._prepareBoonData();

    if (this.type === 'weapon' && typeof this.system.properties === 'string')
      this._migrateWeaponProperties();
  }

  _prepareBoonData(itemData) {
  }

  async _migrateWeaponProperties() {
    console.log("Open Legend | Migrate Weapon Properties");
    console.log(this);

    this.system.properties = {
        "Area": this.system.properties.includes("Area"),
        "Expendable": this.system.properties.includes("Expendable"),
        "Defensive": this.system.properties.includes("Defensive"),
        "Delayed Ready": this.system.properties.includes("Delayed Ready"),
        "Forceful": this.system.properties.includes("Forceful"),
        "Heavy": this.system.properties.includes("Heavy"),
        "Precise": this.system.properties.includes("Precise"),
        "Reach": this.system.properties.includes("Reach"),
        "Slow": this.system.properties.includes("Slow"),
        "Stationary": this.system.properties.includes("Stationary"),
        "Swift": this.system.properties.includes("Swift")
      };
    console.log(this);
/*
    const update = {
      _id: this._id,
      system:{properties:{
        "Area": this.system.properties.includes("Area"),
        "Expendable": this.system.properties.includes("Expendable"),
        "Defensive": this.system.properties.includes("Defensive"),
        "Delayed Ready": this.system.properties.includes("Delayed Ready"),
        "Forceful": this.system.properties.includes("Forceful"),
        "Heavy": this.system.properties.includes("Heavy"),
        "Precise": this.system.properties.includes("Precise"),
        "Reach": this.system.properties.includes("Reach"),
        "Slow": this.system.properties.includes("Slow"),
        "Stationary": this.system.properties.includes("Stationary"),
        "Swift": this.system.properties.includes("Swift")
      }}
    }
    const updatedWeapon = await this.update(update);
    console.log(updatedWeapon);*/
  }
}
