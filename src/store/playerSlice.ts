import {Amulets, AmuletsStats, Armors, ArmorsStats, PlayerBaseStats, Weapons, WeaponsStats} from "../utils/eq.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type PlayerType = "fast" | "slow";

export interface PlayerSave {
  name: string;
  date: string;
  spawn: number;
  equipped: {
    armor: Armors,
    weapon: Weapons,
    amulet: Amulets,
  }
  inventory: {
    armors: Armors[],
    weapons: Weapons[],
    amulets: Amulets[],
  },
  type: PlayerType,
  level: number;
  runes: number;
}

interface PlayerSliceProps {
  playerStats: PlayerSave;
  tmpStats: {
    health: number;
    maxHealth: number;
    defense: number;
    damage: number;
    flasks: number;
  }
}

const initialState: PlayerSliceProps = {
  playerStats: {
    name: "",
    date: new Date().toString(),
    spawn: 0,
    equipped: {
      armor: Armors.JACKER_ARMOR,
      weapon: Weapons.SWORD_OF_JACKER,
      amulet: Amulets.JACKER_AMULET,
    },
    inventory: {
      armors: [Armors.JACKER_ARMOR],
      weapons: [Weapons.SWORD_OF_JACKER],
      amulets: [Amulets.JACKER_AMULET],
    },
    type: "fast",
    level: 1,
    runes: 0,
  },
  tmpStats: {
    health: 0,
    maxHealth: 0,
    defense: 0,
    damage: 0,
    flasks: 0,
  }
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setTmpStats: (state) => {
      state.tmpStats.maxHealth = PlayerBaseStats[state.playerStats.type].health + AmuletsStats[state.playerStats.equipped.amulet].health + 50 * (state.playerStats.level - 1)
      state.tmpStats.health = state.tmpStats.maxHealth;
      state.tmpStats.defense = PlayerBaseStats[state.playerStats.type].defense + ArmorsStats[state.playerStats.equipped.armor].defense + 5 * (state.playerStats.level - 1);
      state.tmpStats.damage = PlayerBaseStats[state.playerStats.type].damage + WeaponsStats[state.playerStats.equipped.weapon].damage + 10 * (state.playerStats.level - 1);
    },
    setFlasks: (state, action: PayloadAction<number>) => {
      state.tmpStats.flasks = action.payload;
    },
    useFlask: (state) => {
      if (state.tmpStats.flasks > 0) {
        state.tmpStats.flasks -= 1;
        if (state.tmpStats.health + 50 > state.tmpStats.maxHealth) {
          state.tmpStats.health = state.tmpStats.maxHealth;
        } else {
          state.tmpStats.health += 50;
        }
      }
    },
    setPlayerStats: (state, action: PayloadAction<PlayerSave>) => {
      state.tmpStats.maxHealth = PlayerBaseStats[state.playerStats.type].health + AmuletsStats[state.playerStats.equipped.amulet].health + 50 * (state.playerStats.level - 1)
      state.tmpStats.health = state.tmpStats.maxHealth;
      state.tmpStats.defense = PlayerBaseStats[state.playerStats.type].defense + ArmorsStats[state.playerStats.equipped.armor].defense + 5 * (state.playerStats.level - 1);
      state.tmpStats.damage = PlayerBaseStats[state.playerStats.type].damage + WeaponsStats[state.playerStats.equipped.weapon].damage + 10 * (state.playerStats.level - 1);
      state.tmpStats.flasks = 3;
    },
    takeDamage: (state, action: PayloadAction<number>) => {
      if (state.tmpStats.health - action.payload <= 0) {
        state.tmpStats.health = 0;
      } else {
        state.tmpStats.health -= action.payload;
      }
    },
    setSpawn: (state, action: PayloadAction<number>) => {
      state.playerStats.spawn = action.payload;
    },
    setDate: (state) => {
      state.playerStats.date = new Date().toString();
    },
    setWeapon: (state, action: PayloadAction<Weapons>) => {
      state.playerStats.equipped.weapon = action.payload;
    },
    setArmor: (state, action: PayloadAction<Armors>) => {
      state.playerStats.equipped.armor = action.payload;
    },
    setAmulet: (state, action: PayloadAction<Amulets>) => {
      state.playerStats.equipped.amulet = action.payload;
    },
    pickUpWeapon: (state, action: PayloadAction<Weapons>) => {
      if (!state.playerStats.inventory.weapons.includes(action.payload)) {
        state.playerStats.inventory.weapons.push(action.payload);
      }
    },
    pickUpArmor: (state, action: PayloadAction<Armors>) => {
      if (!state.playerStats.inventory.armors.includes(action.payload)) {
        state.playerStats.inventory.armors.push(action.payload);
      }
    },
    pickUpAmulet: (state, action: PayloadAction<Amulets>) => {
      if (!state.playerStats.inventory.amulets.includes(action.payload)) {
        state.playerStats.inventory.amulets.push(action.payload);
      }
    },
    equipNextWeapon: (state) => {
      const currentIndex = state.playerStats.inventory.weapons.indexOf(state.playerStats.equipped.weapon);
      const nextIndex = (currentIndex + 1) % state.playerStats.inventory.weapons.length;
      state.playerStats.equipped.weapon = state.playerStats.inventory.weapons[nextIndex];
    },
    equipNextArmor: (state) => {
      const currentIndex = state.playerStats.inventory.armors.indexOf(state.playerStats.equipped.armor);
      const nextIndex = (currentIndex + 1) % state.playerStats.inventory.armors.length;
      state.playerStats.equipped.armor = state.playerStats.inventory.armors[nextIndex];
    },
    equipNextAmulet: (state) => {
      const currentIndex = state.playerStats.inventory.amulets.indexOf(state.playerStats.equipped.amulet);
      const nextIndex = (currentIndex + 1) % state.playerStats.inventory.amulets.length;
      state.playerStats.equipped.amulet = state.playerStats.inventory.amulets[nextIndex];
    },
    levelUp: (state, action: PayloadAction<number>) => {
      state.playerStats.level += action.payload;
    },
    addRunes: (state, action: PayloadAction<number>) => {
      state.playerStats.runes += action.payload;
    },
    removeRunes: (state, action: PayloadAction<number>) => {
      state.playerStats.runes -= action.payload;
    },
    resetPlayerStats: (state) => {
      state.playerStats = initialState.playerStats;
    },
  },
});

export const PlayerActions = playerSlice.actions;
export const playerReducer = playerSlice.reducer;