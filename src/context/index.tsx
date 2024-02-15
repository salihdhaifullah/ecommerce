import { useReducer, createContext, ReactNode, useEffect } from "react";
import useGetProductsIds from "../hooks/useGetProductsIds";
import reducer, { ICartItems } from './reducer'
import actions from './actions'

const initialState = {
  items: 0,
  cartItems: [] as ICartItems[],
  totalPrice: 0,
  state: { } as any,
  addItem: () => { },
  removeItem: () => { },
  insertCartItem: (cartItem: ICartItems) => { },
  deleteCartItem: (id: number) => { },
};

export const Context = createContext(initialState);

export default function Provider({ children }: { children: ReactNode }) {
  const [productsIds] = useGetProductsIds()

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { dispatch({ type: actions.INIT, value: productsIds.length }) }, [productsIds.length])

  const value = {
    items: state.items as number,
    cartItems: state.cartItems,
    totalPrice: state.totalPrice,
    state: state as any,
    addItem: () => dispatch({ type: actions.ADD_ITEM }),
    removeItem: () => dispatch({ type: actions.REMOVE_ITEM }),
    insertCartItem: (cartItem: ICartItems) => dispatch({ type: actions.INSERT_CART_ITEM, value: cartItem }),
    deleteCartItem: (id: number) =>  dispatch({ type: actions.DELETE_CART_ITEM, value: id }),
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );

};



