import { properties, category } from "../util/weapon_const.js";
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class OlItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["openlegend", "sheet", "item"],
      width: 650,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const basePath = "systems/openlegend-ttrpg/templates/item";
    return `${basePath}/${this.item.type}.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    console.log("Open Legend | Retrieving render data for OlItemSheet");
    const renderTemplateInput = super.getData();
    if (renderTemplateInput.item.type === 'weapon') {
      const propertiesForRendering = {
        "Area": {
          "name": "Area",
          "selected": renderTemplateInput.item.system.properties.get("Area"),
          "hint": properties.get("Area")
        },
        "Expendable": {
          "name": "Expendable",
          "selected": renderTemplateInput.item.system.properties.get("Expendable"),
          "hint": properties.get("Expendable")
        },
        "Defensive": {
          "name": "Defensive",
          "selected": renderTemplateInput.item.system.properties.get("Defensive"),
          "hint": properties.get("Defensive")
        },
        "Delayed Ready": {
          "name": "Delayed Ready",
          "selected": renderTemplateInput.item.system.properties.get("Delayed Ready"),
          "hint": properties.get("Delayed Ready")
        },
        "Forceful": {
          "name": "Forceful",
          "selected": renderTemplateInput.item.system.properties.get("Forceful"),
          "hint": properties.get("Forceful")
        },
        "Heavy": {
          "name": "Heavy",
          "selected": renderTemplateInput.item.system.properties.get("Heavy"),
          "hint": properties.get("Heavy")
        },
        "Precise": {
          "name": "Precise",
          "selected": renderTemplateInput.item.system.properties.get("Precise"),
          "hint": properties.get("Precise")
        },
        "Reach": {
          "name": "Reach",
          "selected": renderTemplateInput.item.system.properties.get("Reach"),
          "hint": properties.get("Reach")
        },
        "Slow": {
          "name": "Slow",
          "selected": renderTemplateInput.item.system.properties.get("Slow"),
          "hint": properties.get("Slow")
        },
        "Stationary": {
          "name": "Stationary",
          "selected": renderTemplateInput.item.system.properties.get("Stationary"),
          "hint": properties.get("Stationary")
        },
        "Swift": {
          "name": "Swift",
          "selected": renderTemplateInput.item.system.properties.get("Swift"),
          "hint": properties.get("Swift")
        }
      }
      renderTemplateInput.item.system.properties = propertiesForRendering;
    }
    console.log(renderTemplateInput);
    return renderTemplateInput;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".add-attack").click(async () => {
      const template = "systems/openlegend-ttrpg/templates/item/parts/attack-target.html";
      const data = { 'attack': {}, 'attributes': this.object.system.attributes };
      const new_attack = await renderTemplate(template, data);
      html.find(".attack-list").append(new_attack);
    });

    html.find(".attack-delete").click(ev => $(ev.currentTarget).closest('li').remove());
    html.find(".update-action").click(ev => {
      const btn = $(ev.currentTarget);
      if (btn.html() == "Edit")
        btn.html("Save");
      else {
        var data = {}
        html.find(".attr-checkbox").each((i, obj) => {
          data['data.attributes.' + obj.dataset.attr] = obj.checked;
        });

        if (this.object.system.attacks) {
          const attacks = []
          html.find(".action-attack").each((i, attack) => {
            const attr = $(attack).find('.attack-attribute').val();
            const target = $(attack).find('.attack-target').val();
            attacks.push({ "attribute": attr, "target": target });
          });
          data['data.attacks'] = attacks;
        }
        this.object.update(data);
        btn.html("Edit");
      }

      html.find(".action-list").toggle();
      html.find(".action-edit").toggle();
    });

    html.find('.scale').keyup(ev => {
      const input = $(ev.currentTarget);
      const tester = html.find('.scale-tester');
      tester.text(input.val());
      input.width(tester.width() + 5);
    });

    html.find('.scale').each((i, tag) => {
      const tester = html.find('.scale-tester');
      tester.text($(tag).val());
      $(tag).width(tester.width() + 5);
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }

  resizeInput() {
    console.log($(this));
    $(this).attr('size', $(this).val().length);
  }
}
