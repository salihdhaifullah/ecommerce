import actions, { Action } from './actions'

export interface ICartItems {
  quantity: number;
  price: number;
  id: number;
}

interface IState {
  items: number
  cartItems: ICartItems[]
  totalPrice: number
}

interface IAction { type: Action, value?: any }

export default function reducer(state: IState, action: IAction) {

  if (action.type === actions.INIT) return {  ...state, items: action?.value || 0}
  else if (action.type === actions.ADD_ITEM) return { ...state, items: state.items + 1 }
  else if (action.type === actions.REMOVE_ITEM) return { ...state, items: state.items - 1 }
  else if (action.type === actions.GET_CART_ITEMS) return { ...state, cartItems: state.cartItems }
  
  else if (action.type === actions.INSERT_CART_ITEM) {
    let data = state.cartItems;
    let totalPrice = 0;
    let objIndex = data.findIndex(((item) => item.id === action.value.id));

    if (objIndex === -1) data.push(action.value)
    else data[objIndex].quantity = action.value.quantity;

    for (let item of data) {
      totalPrice += (item.price * item.quantity);
    }
    return { ...state, cartItems: data, totalPrice: totalPrice };
  }

  else if (action.type === actions.DELETE_CART_ITEM) {
    let totalPrice = 0;
    let data = state.cartItems;
    data = data.filter((item) => item.id !== action.value);

    for (let item of data) {
      totalPrice += (item.price * item.quantity);
    }

   return { ...state, cartItems: data, totalPrice: totalPrice }

  }
  
  else throw new Error("Unknown action " + "**" + action.type + "**");
}