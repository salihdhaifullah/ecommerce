import { useReducer, createContext, ReactNode, useEffect } from "react";
import useGetProductsIds from "../hooks/useGetProductsIds";
import reducer, { ICartItems } from './reducer'
import actions from './actions'

export const Context = createContext(
  {
    items: 0,
    cartItems: [] as ICartItems[],
    totalPrice: 0,
    state: { } as any,
    addItem: () => { },
    removeItem: () => { },
    getCartItems: () => { },
    insertCartItem: (cartItem: ICartItems) => { },
    deleteCartItem: (id: number) => { }
  }
);

export default function Provider({ children }: { children: ReactNode }) {
  const [productsIds] = useGetProductsIds()

  const initialState = {
    items: productsIds.length,
    cartItems: [],
    totalPrice: 0,
    state: { } as any,
    addItem: () => { },
    removeItem: () => { },
    getCartItems: () => { },
    insertCartItem: (cartItem: ICartItems) => { },
    deleteCartItem: (id: number) => { }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: actions.INIT, value: productsIds.length })
  }, [productsIds.length])

  const value = {
    items: state.items as number,
    cartItems: state.cartItems,
    totalPrice: state.totalPrice,
    state: state as any,
    addItem: () => dispatch({ type: actions.ADD_ITEM }),
    removeItem: () => dispatch({ type: actions.REMOVE_ITEM }),
    getCartItems: () => dispatch({type: actions.GET_CART_ITEMS }),
    insertCartItem: (cartItem: ICartItems) => dispatch({ type: actions.INSERT_CART_ITEM, value: cartItem }),
    deleteCartItem: (id: number) =>  dispatch({ type: actions.DELETE_CART_ITEM, value: id }),
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );

};



