import { useReducer, createContext, ReactNode, useEffect } from "react";
import useGetProductsIds from "../hooks/useGetProductsIds";
import reducer from './reducer'
import actions from './actions'

export const Context = createContext(
  {
    items: 10,
    addItem: () => { },
    removeItem: () => { }
  }
);

export default function Provider({ children }: { children: ReactNode }) {
  const [productsIds] = useGetProductsIds()

  const initialState = {
    items: productsIds.length,
    addItem: () => { },
    removeItem: () => { }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({type: actions.INIT, value: productsIds.length})
  }, [productsIds.length])
  
  const value = {
    items: state.items,
    addItem: () => dispatch({ type: actions.ADD_ITEM }),
    removeItem: () => dispatch({ type: actions.REMOVE_ITEM })
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );

};



