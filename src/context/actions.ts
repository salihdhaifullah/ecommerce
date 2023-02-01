export interface IActionsTypes {
    INIT: "INIT";
    ADD_ITEM: "ADD_ITEM";
    REMOVE_ITEM: "REMOVE_ITEM";
    INSERT_CART_ITEM: "INSERT_ITEM";
    DELETE_CART_ITEM: "DELETE_ITEM";
}

export type Action = "INIT" | "ADD_ITEM" | "REMOVE_ITEM" | "INSERT_ITEM" | "DELETE_ITEM";

const actions: IActionsTypes = {
    INIT: "INIT",
    ADD_ITEM: "ADD_ITEM",
    REMOVE_ITEM: "REMOVE_ITEM",
    INSERT_CART_ITEM: "INSERT_ITEM",
    DELETE_CART_ITEM: "DELETE_ITEM",
};

export default actions;
