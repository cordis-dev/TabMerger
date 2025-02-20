import { IAction } from "../../typings/reducers";

export const HEADER_ACTIONS = {
  SET_TYPING: "SET_TYPING",
  UPDATE_INPUT_VALUE: "UPDATE_INPUT_VALUE",
  SET_FILTER_CHOICE: "SET_FILTER_CHOICE"
};

export interface IHeaderState {
  typing: boolean;
  inputValue: string;
  filterChoice: string;
}

const initState: IHeaderState = {
  typing: false,
  inputValue: "",
  filterChoice: "tab"
};

const headerReducer = (state = initState, action: IAction): IHeaderState => {
  const { type, payload } = action;

  switch (type) {
    case HEADER_ACTIONS.SET_TYPING:
      return {
        ...state,
        typing: payload as IHeaderState["typing"]
      };

    case HEADER_ACTIONS.UPDATE_INPUT_VALUE:
      return {
        ...state,
        inputValue: payload as IHeaderState["inputValue"]
      };

    case HEADER_ACTIONS.SET_FILTER_CHOICE:
      return {
        ...state,
        filterChoice: payload as IHeaderState["filterChoice"]
      };

    default:
      return state;
  }
};

export default headerReducer;
