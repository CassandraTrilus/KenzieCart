import React, { useReducer, useContext, createContext,useState, useEffect } from 'react'

const initialState = {
  cart: [],
  itemCount: 0,
  cartTotal: 0,
  promoCode: "",
  discount: 0,
  couponId: "",
}

const calculateCartQuantity = (cartItems) => {
  let totalQuantity = cartItems.reduce((accumulator, product) => {
    return accumulator + product.quantity
  }, 0)
  return totalQuantity
}

const calculateCartTotal = (cartItems) => {
  let total = 0

  cartItems.map((item) => (total += item.price * item.quantity))

  return parseFloat(total.toFixed(2))
}

const reducer = (state, action) => {
  let nextCart = [...state.cart];
  switch (action.type) {
    case 'ADD_ITEM':
      const existingIndex = nextCart.findIndex(
        (item) => item._id === action.payload._id
      )

      const numItemsToAdd = action.payload.quantity;

      if (existingIndex >= 0) {
        const newQuantity = parseInt(
          nextCart[existingIndex].quantity + numItemsToAdd
        )

        nextCart[existingIndex] = {
          ...action.payload,
          quantity: newQuantity,
        }
        
      } else {
        nextCart.push(action.payload)
      }

      localStorage.setItem('KenzieCart', JSON.stringify(nextCart))

      return {
        ...state,
        cart: nextCart,
        itemCount: state.itemCount + numItemsToAdd,
        cartTotal: calculateCartTotal(nextCart) * (1 - state.discount),
      };

    case "APPLY_PROMO_CODE":
      const preDiscountedTotal = calculateCartTotal(nextCart);
      const discountedTotal =
        preDiscountedTotal * (1 - action.payload.discount);
      return {
        ...state,
        cartTotal: discountedTotal,
        promoCode: action.payload.code,
        discount: action.payload.discount,
        couponId: action.payload._id
      }

    case "DELETE_CART_STORAGE":
      localStorage.removeItem('KenzieCart')
      return { ...initialState }

    case 'REMOVE_ITEM':
      nextCart = nextCart
        .map((item) =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      localStorage.setItem('KenzieCart', JSON.stringify(nextCart))

      return {
        ...state,
        cart: nextCart,
        itemCount: state.itemCount > 0 ? state.itemCount - 1 : 0,
        cartTotal: calculateCartTotal(nextCart) * (1 - state.discount),
      }

    case 'REMOVE_ALL_ITEMS':
      let quantity = state.cart.find((i) => i._id === action.payload).quantity
      
      localStorage.setItem('KenzieCart', JSON.stringify(nextCart))

      return {

      nextState = {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload),
        itemCount: state.itemCount > 0 ? state.itemCount - quantity : 0,
      }
    }

    case 'RESET_CART':
      localStorage.removeItem('KenzieCart', JSON.stringify(nextCart))
      return { ...initialState }

    case 'INIT_SAVED_CART':
      nextCart = action.payload
      let nextItemCount = nextCart.length
      
      return { 
          ...state,
          cart: nextCart,
          itemCount: nextItemCount, 
          cartTotal: calculateCartTotal(nextCart),
      }

    case 'APPLY_COUPON_CODE':

      localStorage.removeItem('KenzieCart', JSON.stringify(initialState))
      return { ...initialState }

    case 'INIT_SAVED_CART':
      return { ...action.payload }

    default:
      return state
  }
}

const cartContext = createContext()

// Provider component that wraps your app and makes cart object ...
// ... available to any child component that calls useCart().
export function ProvideCart({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <cartContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </cartContext.Provider>
  )
}

// Hook for child components to get the cart object ...
// ... and re-render when it changes.
export const useCart = () => {
  return useContext(cartContext)
}

// Provider hook that creates cart object and handles state
const useProvideCart = () => {
  const { state, dispatch } = useCart()

  const addItem = (item) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: item,
    })
  }

  const applyCoupon = (promoData) => {
    dispatch({
      type: "APPLY_PROMO_CODE",
      payload: promoData,
    })
  }

  const deleteLocalStorage = () => {
    dispatch({
      type: "DELETE_CART_STORAGE",
    });
  };

  const removeItem = (id) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: id,
    })
  }

  const removeAllItems = (id) => {
    dispatch({
      type: 'REMOVE_ALL_ITEMS',
      payload: id,
    })
  }

  const resetCart = () => {
    dispatch({
      type: 'RESET_CART',
    })
  }

  const updateCart = () => {
    dispatch({
      type: "UPDATE_CART_LOCAL_STORAGE",
    });
  };

  const isItemInCart = (id) => {
    return !!state.cart.find((item) => item._id === id)
  }

  // Check for saved local cart on load and dispatch to set initial state
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('KenzieCart')) || false

    if (savedCart) {
      dispatch({
        type: 'INIT_SAVED_CART',
        payload: savedCart,
      })
    }
  }, [dispatch])

    useEffect(() => {
      console.log(state)
    }, [state])

  return {
    state,
    addItem,
    removeItem,
    removeAllItems,
    resetCart,
    updateCart,
    isItemInCart,
    calculateCartTotal,
    deleteLocalStorage,
    applyCoupon,
  }
}

export default useProvideCart