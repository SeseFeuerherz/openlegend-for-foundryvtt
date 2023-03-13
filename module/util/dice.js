export async function rollAttr(actor, attrName) {
    console.log("Open Legend | Roll attribute " + attrName);
    const attr = _getAttr(actor, attrName);
    if (attr) {
        const olRoll = await OLRoll(attrName, attr, 0);
        const flavorHtml = await generateFlavorHtmlForAttribute(attrName, olRoll);
        evaluateRollToChat(actor, olRoll, flavorHtml);
    }
}

async function generateFlavorHtmlForAttribute(attrName, olRoll) {
    const template = "systems/openlegend-ttrpg/templates/dialog/roll-chat.html";
    const data = {
        "name": attrName,
        "type": 'Attribute',
        "attr": olRoll.attr,
        "adv": olRoll.adv
    }
    return renderTemplate(template, data);
}

export async function rollItem(actor, item) {
    console.log("Open Legend | Roll item:");
    console.log(item);
    const attrName = item.action.attribute;
    const attr = _getAttr(actor, attrName);
    if (attr) {
        const olRoll = await OLRoll(attrName, attr, item.action.default_adv);
        const flavorHtml = await generateFlavorHtmlForItem(item, olRoll);
        evaluateRollToChat(actor, olRoll, flavorHtml);
    }
}

async function generateFlavorHtmlForItem(item, olRoll) {
    const template = "systems/openlegend-ttrpg/templates/dialog/roll-chat.html";
    const data = {
        "name": item.action.name,
        "type": item.type,
        "notes": item.details.notes,
        "attr": olRoll.attr,
        "target": item.action.target,
        "adv": olRoll.adv
    }
    return renderTemplate(template, data);
}

async function evaluateRollToChat(actor, olRoll, flavorHtml) {
    if (olRoll.roll) {
        await olRoll.roll.evaluate();
        olRoll.roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            flavor: flavorHtml
        });
    }
}


export async function OLRoll(attr_name, attr, default_adv=0) {
    const to_return = {
        "roll": null,
        "attr": {
            "name": attr_name,
            "score": attr.score,
            "dice": attr.dice
        },
        "adv": {
            "type": "",
            "value": 0
        }
    }

    // Create the Dialog window
    const adv = await _OLRollDialog(attr_name, attr, default_adv);
    if (adv == null)
        return to_return;

    const dice = attr.dice
    // If score is zero
    if (attr.score <= 0) {
        to_return.attr.dice = null;
        if (adv > 0) {
            to_return.adv.type = "Advantage";
            to_return.adv.value = 1;
            to_return.roll = new Roll('2d20kh1X');
        } else if (adv < 0) {
            to_return.adv.type = "Disadvantage";
            to_return.adv.value = 1;
            to_return.roll = new Roll('2d20kl1X');
        } else {
            to_return.adv = null;
            to_return.roll = new Roll('1d20X');
        }
    } else {
        // Normal roll
        if (adv == 0) {
            to_return.adv = null;
            console.log("Open Legend | Debug dice");
            console.log(dice);
            to_return.roll = new Roll('1d20X + ' + dice.num + dice.die + 'X');
        } else {
            to_return.adv.value = Math.abs(adv);
            var advstr = ""
            if (adv < 0) {
                to_return.adv.type = "Disadvantage";
                advstr = 'kl' + dice.num;
            } else {
                to_return.adv.type = "Advantage";
                advstr = 'kh' + dice.num;
            }
            to_return.roll = new Roll('1d20X + ' + (to_return.adv.value + dice.num) + dice.die + advstr + 'X');
        }
    }

    return to_return;
}

async function _OLRollDialog(attr_name, attr, default_adv=0) {
    const template = "systems/openlegend-ttrpg/templates/dialog/roll-dialog.html";
    const data = { 'attr': attr_name, 'score': attr.score, 'formula': '1d20', 'default_adv': default_adv }
    if (attr.score > 0)
        data.formula += ' + ' + attr.dice.num + attr.dice.die;

    const html = await renderTemplate(template, data);

    // Create the Dialog window
    return new Promise(resolve => {
        new Dialog({
            title: "Configure Roll",
            content: html,
            buttons: {
                dis: {
                    label: "Dis+1",
                    callback: html => resolve(parseInt(html[0].querySelector("input[name='advlevel']").value) - 1)
                },
                roll: {
                    label: "Roll",
                    callback: html => resolve(parseInt(html[0].querySelector("input[name='advlevel']").value))
                },
                adv: {
                    label: "Adv+1",
                    callback: html => resolve(parseInt(html[0].querySelector("input[name='advlevel']").value) + 1)
                }
            },
            default: "roll",
            close: html => resolve(null)
        }).render(true);
    });
}

export function _getAttr(actor, attr_name) {
    // Find the attribute data object using its name
    for (const [_, attr_group] of Object.entries(actor.system.attributes)) {
        if (attr_group[attr_name])
            return attr_group[attr_name]
    }
    return null;
}