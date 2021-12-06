import { IAction } from "../../typings/reducers";
import { nanoid } from "nanoid";
import { DraggableLocation } from "react-beautiful-dnd";

export const GROUPS_ACTIONS = {
  UPDATE_AVAILABLE: "UPDATE_AVAILABLE",
  UPDATE_ACTIVE: "UPDATE_ACTIVE",
  UPDATE_INDEX: "UPDATE_INDEX",
  UPDATE_IS_ACTIVE: "UPDATE_IS_ACTIVE",
  UPDATE_NAME: "UPDATE_NAME",
  UPDATE_COLOR: "UPDATE_COLOR",
  UPDATE_TIMESTAMP: "UPDATE_TIMESTAMP",
  UPDATE_WINDOWS: "UPDATE_WINDOWS",
  UPDATE_WINDOWS_FROM_GROUP_DND: "UPDATE_WINDOWS_FROM_GROUP_DND",
  UPDATE_WINDOWS_FROM_SIDEPANEL_DND: "UPDATE_WINDOWS_FROM_SIDEPANEL_DND",
  UPDATE_TABS: "UPDATE_TABS",
  UPDATE_TABS_FROM_GROUP_DND: "UPDATE_TABS_FROM_GROUP_DND",
  UPDATE_TABS_FROM_SIDEPANEL_DND: "UPDATE_TABS_FROM_SIDEPANEL_DND",
  UPDATE_PERMANENT: "UPDATE_PERMANENT",
  UPDATE_INFO: "UPDATE_INFO",
  ADD_GROUP: "ADD_GROUP",
  ADD_WINDOW: "ADD_WINDOW",
  DELETE_GROUP: "DELETE_GROUP",
  CLEAR_EMPTY_GROUPS: "CLEAR_EMPTY_GROUPS",
  CLEAR_EMPTY_WINDOWS: "CLEAR_EMPTY_WINDOWS",
  UPDATE_GROUP_ORDER: "UPDATE_GROUP_ORDER"
};

export interface IGroupState {
  name: string;
  id: string;
  color: string;
  updatedAt: number;
  windows: chrome.windows.Window[];
  permanent?: boolean;
  info?: string;
}

export interface IGroupsState {
  active: { id: string; index: number };
  available: IGroupState[];
}

const createWindowWithTabs = (tabs: chrome.tabs.Tab[]): chrome.windows.Window => ({
  alwaysOnTop: false,
  focused: false,
  incognito: false,
  state: "maximized",
  type: "normal",
  tabs
});

const activeId = nanoid(10);
const initState: IGroupsState = {
  active: { id: activeId, index: 0 },
  available: [
    {
      name: "Awaiting Storage",
      id: activeId,
      color: "rgba(128, 128, 128, 1)",
      updatedAt: Date.now(),
      windows: [],
      permanent: true
    },
    {
      name: "Duplicates",
      id: nanoid(10),
      color: "rgba(128, 128, 128, 1)",
      updatedAt: Date.now(),
      windows: [],
      permanent: true
    }
  ]
};

const GroupsReducer = (state = initState, action: IAction): IGroupsState => {
  const available = [...state.available];

  switch (action.type) {
    case GROUPS_ACTIONS.UPDATE_AVAILABLE:
      return {
        ...state,
        available: action.payload as IGroupsState["available"]
      };

    case GROUPS_ACTIONS.UPDATE_ACTIVE:
      return {
        ...state,
        active: action.payload as IGroupsState["active"]
      };

    case GROUPS_ACTIONS.UPDATE_NAME: {
      const { index, name } = action.payload as { index: number; name: string };
      available[index].name = name;

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_COLOR: {
      const { index, color } = action.payload as { index: number; color: string };
      available[index].color = color;

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_TIMESTAMP: {
      const { index, updatedAt } = action.payload as { index: number; updatedAt: number };
      available[index].updatedAt = updatedAt;

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_WINDOWS: {
      const { index, windows } = action.payload as {
        index: number;
        windows: chrome.windows.Window[];
      };

      available[index].windows = windows;

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_WINDOWS_FROM_GROUP_DND: {
      const { index, source, destination } = action.payload as {
        index: number;
        source: DraggableLocation;
        destination?: DraggableLocation;
      };

      if (destination) {
        const removedWindows = available[index].windows.splice(source.index, 1);
        available[index].windows.splice(destination.index, 0, ...removedWindows);
      }

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_WINDOWS_FROM_SIDEPANEL_DND: {
      const { index, source, dragOverGroup } = action.payload as {
        index: number;
        source: DraggableLocation;
        dragOverGroup: number;
      };

      const removedWindows = available[index].windows.splice(source.index, 1);
      removedWindows.forEach((w) => (w.focused = false));
      available[dragOverGroup].windows.unshift(...removedWindows);

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_TABS: {
      const { groupIdx, windowIdx, tabs } = action.payload as {
        groupIdx: number;
        windowIdx: number;
        tabs: chrome.tabs.Tab[];
      };

      available[groupIdx].windows[windowIdx].tabs = tabs;

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_TABS_FROM_GROUP_DND: {
      const { index, source, destination } = action.payload as {
        index: number;
        source: DraggableLocation;
        destination?: DraggableLocation;
      };

      if (destination) {
        const [srcWindowIdx, destWindowIdx] = [source, destination].map((item) =>
          Number(item.droppableId.split("-")[1])
        );

        const removedTabs = available[index].windows[srcWindowIdx].tabs?.splice(source.index, 1);
        available[index].windows[destWindowIdx].tabs?.splice(destination.index, 0, ...(removedTabs ?? []));
      }

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_TABS_FROM_SIDEPANEL_DND: {
      const { index, source, dragOverGroup } = action.payload as {
        index: number;
        source: DraggableLocation;
        dragOverGroup: number;
      };

      if (dragOverGroup > 1) {
        const srcWindowIdx = Number(source.droppableId.split("-")[1]);
        const removedTabs = available[index].windows[srcWindowIdx].tabs?.splice(source.index, 1);
        const newWindow = createWindowWithTabs(removedTabs ?? []);
        available[dragOverGroup].windows.unshift(newWindow);
      }

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_PERMANENT: {
      const { index, permanent } = action.payload as { index: number; permanent: boolean };
      available[index].permanent = permanent;

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_INFO: {
      const { index, info } = action.payload as { index: number; info: string };
      available[index].info = info;

      return { ...state, available };
    }

    case GROUPS_ACTIONS.ADD_GROUP: {
      const NEW_GROUP: IGroupState = {
        name: "No Name",
        id: nanoid(10),
        color: "rgba(128, 128, 128, 1)",
        updatedAt: Date.now(),
        windows: [],
        permanent: false,
        info: "0T | 0W"
      };

      available.push(NEW_GROUP);

      return { ...state, available };
    }

    case GROUPS_ACTIONS.DELETE_GROUP: {
      const { index } = action.payload as { index: number };

      // re-assign active group if deleted group was the active one (use the group above if needed)
      const activeIdx = state.active.index;
      const active =
        activeIdx < index
          ? { ...state.active }
          : activeIdx === index
          ? { index: activeIdx - 1, id: available[activeIdx - 1].id }
          : { ...state.active, index: activeIdx - 1 };

      available.splice(index, 1);

      return { ...state, active, available };
    }

    case GROUPS_ACTIONS.CLEAR_EMPTY_GROUPS: {
      const filteredGroups = available.filter((group, i) => i <= 1 || (i > 1 && group.windows.length > 0));
      const filteredIds = filteredGroups.map((group) => group.id);

      // if filtered groups do not contain the active group, it was deleted, thus can assign the group above as active ...
      // ... as it is not the source of the dnd event - must be non-empty.
      const { index, id } = state.active;
      const newIdx = Math.max(0, index - 1);
      const active = !filteredIds.includes(id) ? { index: newIdx, id: available[newIdx].id } : { ...state.active };

      return { ...state, available: filteredGroups, active };
    }

    case GROUPS_ACTIONS.ADD_WINDOW: {
      const { index } = action.payload as { index: number };
      available[index].windows.push(createWindowWithTabs([]));

      return { ...state, available };
    }

    case GROUPS_ACTIONS.CLEAR_EMPTY_WINDOWS: {
      const { index } = action.payload as { index: number };

      // possible to have cleaned up the group (by removing all of its tabs) ...
      // ... now the above index has already been cleared, so the window won't exist ...
      // ... this should not happen, but is a good "safety guard"
      if (available[index].windows.length > 0) {
        available[index].windows = available[index].windows.filter(({ tabs }) => tabs && tabs.length > 0);
      }

      return { ...state, available };
    }

    case GROUPS_ACTIONS.UPDATE_GROUP_ORDER: {
      const { source, destination } = action.payload as { source: DraggableLocation; destination: DraggableLocation };

      const removedGroups = available.splice(source.index, 1);
      available.splice(destination.index, 0, ...removedGroups);

      return { ...state, available };
    }

    default:
      return state;
  }
};

export default GroupsReducer;
