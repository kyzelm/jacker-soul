export enum Weapons {
  SWORD_OF_JACKER = "Sword of Jacker",
  FIST_OF_JACKER = "Fist of Jacker",
  ASY_SWORD = "Assassin's Sword",
  ASY_DAGGER = "Assassin's Dagger",
}

export const WeaponsStats: {
  [key in Weapons]: {
    damage: number;
    type: "fast" | "slow";
  };
} = {
  [Weapons.SWORD_OF_JACKER]: {
    damage: 10,
    type: "slow",
  },
  [Weapons.FIST_OF_JACKER]: {
    damage: 5,
    type: "fast",
  },
  [Weapons.ASY_SWORD]: {
    damage: 15,
    type: "slow",
  },
  [Weapons.ASY_DAGGER]: {
    damage: 7,
    type: "fast",
  },
}

export enum Armors {
  JACKER_ARMOR = "Jacker Armor",
  ASY_ARMOR = "Assassin's Armor",
}

export const ArmorsStats: {
  [key in Armors]: {
    defense: number;
  };
} = {
  [Armors.JACKER_ARMOR]: {
    defense: 10,
  },
  [Armors.ASY_ARMOR]: {
    defense: 15,
  },
}

export enum Amulets {
  JACKER_AMULET = "Jacker Amulet",
  ASY_AMULET = "Assassin's Amulet",
}

export const AmuletsStats: {
  [key in Amulets]: {
    fire: number;
  };
} = {
  [Amulets.JACKER_AMULET]: {
    fire: 10,
  },
  [Amulets.ASY_AMULET]: {
    fire: 25,
  },
}

export const PlayerBaseStats = {
  "fast": {
    damage: 10,
    defense: 5,
    health: 100,
  },
  "slow": {
    damage: 20,
    defense: 7,
    health: 120,
  }
}