export const weaponproperties = {
	"Area": "An area weapon always makes multi-target area attacks of the listed size and shape and cannot be used for single-target attacks. If a weapon has multiple area sizes, the attacker chooses from them with each attack. These attacks do not incur any of the disadvantage penalties associated with multi-target attacks.",
	"Expendable": "An expendable item can be used once to make an attack. Afterwards, the item is expended and cannot be used again.",
	"Defensive": "A defensive weapon grants advantage equal to the listed value when its wielder takes the defend action. Additionally, you gain a +1 armor bonus when wielding a defensive weapon (regardless of the defensive value listed). While wielding an item with the defensive property, you don't gain the advantage 1 to attacks normally associated with Melee One-handed or Two-handed weapons. A weapon cannot have a defensive value greater than 3",
	"Delayed Ready": "This weapon can only be used once per round. In addition, prior to using the weapon, the wielder must spend a move action to ready it.",
	"Forceful": "This weapon can make attacks with the Might attribute and invoke banes accessible via Might.",
	"Heavy": "The weapon is particularly heavy to carry. You may carry a maximum number of heavy items equal to your Might score.",
	"Precise": "This weapon can be used to make attacks with the Agility attribute and invoke banes accessible via Agility.",
	"Reach": "This weapon extends the natural melee range of the creature by 5'.",
	"Slow": "If you are wielding this weapon at the beginning of combat, you gain disadvantage 2 on your initiative roll. If you are not wielding the weapon but plan to use it on your first turn, this penalty is still applied. If you are wielding multiple weapons, your initiative modifier is equal to the slowest among them (slow, swift, or neither).",
	"Stationary": "The bulk and weight of this weapon is enormous. Moving it requires a focus action, which allows it to be moved up to 30 feet.",
	"Swift": "If you are wielding this weapon at the beginning of combat, you gain advantage 2 on your initiative roll. If you are not wielding the weapon but plan to use it on your first turn, you still get this bonus. If you are wielding multiple weapons, your initiative modifier is equal to the slowest among them (slow, swift, or neither)."
}

export const weaponcategories = {
	"One-handed Melee": {
		"type": "melee",
		"description": "The weapon uses a single hand and allows the other hand to be used for carrying another object, second weapon, or kept free for other actions. When wielding a one-handed weapon in each hand, if neither has the defensive property, you gain advantage 1 to all melee attacks. If both weapons you are wielding have passive benefits such as the defensive property, use the best of the two benefits; they are not added together."
	},
	"Two-Handed Melee": {
		"type": "melee",
		"description": "The weapon requires two hands to wield and cannot be used with a shield or other weapon. Two-handed melee weapons grant advantage 1 to all attacks."
	},
	"Versatile Melee": {
		"type": "melee",
		"description": "The weapon can be wielded either one-handed or two-handed. The wielder can freely switch between the two modes and has all of the benefits and restrictions of whichever mode they are using."
	},
	"Close Ranged": {
		"type": "ranged",
		"rangeIncrement": 25,
		"description": "Weapons in this category can be used to make ranged attacks with no penalty up to their range increment (25 feet). Attacks made up to twice the normal range suffer disadvantage 1, and attacks made up to three times the normal range suffer disadvantage 2. Attacks at farther distances cannot be made. Note that ammunition for ranged weapons is generally not kept track of, as it is assumed you have brought enough ammo with you."
	},
	"Short Ranged": {
		"type": "ranged",
		"rangeIncrement": 50,
		"description": "Weapons in this category can be used to make ranged attacks with no penalty up to their range increment (50 feet). Attacks made up to twice the normal range suffer disadvantage 1, and attacks made up to three times the normal range suffer disadvantage 2. Attacks at farther distances cannot be made. Note that ammunition for ranged weapons is generally not kept track of, as it is assumed you have brought enough ammo with you."
	},
	"Medium Ranged": {
		"type": "ranged",
		"rangeIncrement": 75,
		"description": "Weapons in this category can be used to make ranged attacks with no penalty up to their range increment (75 feet). Attacks made up to twice the normal range suffer disadvantage 1, and attacks made up to three times the normal range suffer disadvantage 2. Attacks at farther distances cannot be made. Note that ammunition for ranged weapons is generally not kept track of, as it is assumed you have brought enough ammo with you."
	},
	"Long Ranged": {
		"type": "ranged",
		"rangeIncrement": 125,
		"description": "Weapons in this category can be used to make ranged attacks with no penalty up to their range increment (125 feet). Attacks made up to twice the normal range suffer disadvantage 1, and attacks made up to three times the normal range suffer disadvantage 2. Attacks at farther distances cannot be made. Note that ammunition for ranged weapons is generally not kept track of, as it is assumed you have brought enough ammo with you."
	},
	"Extreme Ranged": {
		"type": "ranged",
		"rangeIncrement": 300,
		"description": "Weapons in this category can be used to make ranged attacks with no penalty up to their range increment (300 feet). Attacks made up to twice the normal range suffer disadvantage 1, and attacks made up to three times the normal range suffer disadvantage 2. Attacks at farther distances cannot be made. Note that ammunition for ranged weapons is generally not kept track of, as it is assumed you have brought enough ammo with you."
	}
}
