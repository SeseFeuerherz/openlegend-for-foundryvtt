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
    if (this.type === 'boon') this._prepareBoonData();
  }

  _prepareBoonData(itemData) {
  }
}
