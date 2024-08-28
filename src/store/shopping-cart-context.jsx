import { createContext, useReducer, useState } from "react";
import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const CartContext = createContext({
    items: [],
    onAddToCart: () => { },
    onUpdateItemQuantity: () => { }
})

function shoppingCartReducer(state, action) {
    const { type, payload } = action
    if (type === 'ADD_ITEM') {
        const updatedItems = [...state.items];

        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === payload);
            updatedItems.push({
                id: payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            items: updatedItems,
        };
    }
    if (type === 'UPDATE_ITEM') {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === payload.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
        };
    }
}

export default function CartContextProvider({ children }) {
    const [shoppingCartState, shoppingCartDispath] = useReducer(
        shoppingCartReducer,
        { items: [] }
    )
    const [shoppingCart, setShoppingCart] = useState({
        items: [],
    });

    function handleAddItemToCart(id) {
        shoppingCartDispath({
            type: 'ADD_ITEM',
            payload: id
        })
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispath({
            type: 'UPDATE_ITEM',
            payload: { productId, amount }
        })
    }

    const cartContxValue = {
        items: shoppingCartState.items,
        onAddToCart: handleAddItemToCart,
        onUpdateItemQuantity: handleUpdateCartItemQuantity
    }

    return <CartContext.Provider value={cartContxValue}>
        {children}
    </CartContext.Provider>
}