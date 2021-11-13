/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DraggableLocation } from "react-beautiful-dnd";
import { GROUPS_ACTIONS } from "../reducers/groups";

export const updateActive = (payload?: { id: string; index: number }) => ({
  type: GROUPS_ACTIONS.UPDATE_ACTIVE,
  payload
});

export const updateIndex = (payload?: number) => ({ type: GROUPS_ACTIONS.UPDATE_INDEX, payload });

export const updateIsActive = (payload?: boolean) => ({ type: GROUPS_ACTIONS.UPDATE_IS_ACTIVE, payload });

export const updateName = (payload?: { index: number; name: string }) => ({
  type: GROUPS_ACTIONS.UPDATE_NAME,
  payload
});

export const updateColor = (payload?: string) => ({ type: GROUPS_ACTIONS.UPDATE_COLOR, payload });

export const updateTimestamp = (payload?: number) => ({ type: GROUPS_ACTIONS.UPDATE_TIMESTAMP, payload });

export const updateWindows = (payload?: {
  index: number;
  dnd?: { source: DraggableLocation; destination?: DraggableLocation };
  windows?: chrome.windows.Window[];
  dragOverGroup: number;
}) => ({
  type: GROUPS_ACTIONS.UPDATE_WINDOWS,
  payload
});

export const updateTabs = (payload?: {
  index: number;
  source: DraggableLocation;
  destination?: DraggableLocation;
  dragOverGroup: number;
}) => ({
  type: GROUPS_ACTIONS.UPDATE_TABS,
  payload
});

export const updateInfo = (payload?: { index: number; info?: string }) => ({
  type: GROUPS_ACTIONS.UPDATE_INFO,
  payload
});

export const updatePermanent = (payload?: boolean) => ({ type: GROUPS_ACTIONS.UPDATE_PERMANENT, payload });

export const addGroup = () => ({ type: GROUPS_ACTIONS.ADD_GROUP });

export const deleteGroup = (payload?: { id: string; index: number }) => ({
  type: GROUPS_ACTIONS.DELETE_GROUP,
  payload
});
