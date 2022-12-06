interface IState { items: number }
interface IAction { type: "ADD_ITEM" | 'REMOVE_ITEM' | 'INIT', value?: number }
import actions from './actions'


export default function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case actions.INIT:
      return { items: action?.value || 0 };
    case actions.ADD_ITEM:
      return { items: state.items + 1 };
    case actions.REMOVE_ITEM:
      return { items: state.items - 1 };
    default:
      throw new Error();
  }
}