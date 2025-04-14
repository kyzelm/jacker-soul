import {Amulets, Armors, Weapons} from "../utils/eq.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type PlayerType = "fast" | "slow";

export interface PlayerSave {
  name: string;
  date: string;
  spawn: number;
  equipped: {
    armor: Armors,
    weapon: Weapons,
    amulet: Amulets | null,
  }
  inventory: {
    armors: Armors[],
    weapons: Weapons[],
    amulets: Amulets[],
  },
  type: PlayerType,
  level: number;
}

interface PlayerSliceProps {
  playerStats: PlayerSave;
}

const initialState: PlayerSliceProps = {
  playerStats: {
    name: "",
    date: new Date().toString(),
    spawn: 0,
    equipped: {
      armor: Armors.JACKER_ARMOR,
      weapon: Weapons.SWORD_OF_JACKER,
      amulet: null,
    },
    inventory: {
      armors: [],
      weapons: [],
      amulets: [],
    },
    type: "fast",
    level: 1,
  }
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerStats: (state, action: PayloadAction<PlayerSave>) => {
      state.playerStats = action.payload;
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
    levelUp: (state) => {
      state.playerStats.level += 1;
    },
    resetPlayerStats: (state) => {
      state.playerStats = initialState.playerStats;
    },
  },
});

export const PlayerActions = playerSlice.actions;
export const playerReducer = playerSlice.reducer;