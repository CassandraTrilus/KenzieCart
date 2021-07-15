import React, { useReducer, useContext, createContext,useState, useEffect } from 'react'

const initialState = {
  cart: [],
  itemCount: 0,
  cartTotal: 0,
}

const calculateCartTotal = (cartItems) => {
  let total = 0

  cartItems.map((item) => (total += item.price * item.quantity))

  return parseFloat(total.toFixed(2))
}

const reducer = (state, action) => {
  let nextCart = [...state.cart];
  let nextState;
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

      nextState = {
        ...state,
        cart: nextCart,
        itemCount: state.itemCount + numItemsToAdd,
        cartTotal: calculateCartTotal(nextCart)
      }

      localStorage.setItem('KenzieCart', JSON.stringify(nextState))
      console.log(localStorage)
      return nextState

    case 'REMOVE_ITEM':
      nextCart = nextCart
        .map((item) =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      nextState = {
        ...state,
        cart: nextCart,
        itemCount: state.itemCount > 0 ? state.itemCount - 1 : 0,
        cartTotal: calculateCartTotal(nextCart),
      }

      localStorage.setItem('KenzieCart', JSON.stringify(nextState))
      return nextState

    case 'REMOVE_ALL_ITEMS':
      let quantity = state.cart.find((i) => i._id === action.payload).quantity
      
      nextState = {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload),
        itemCount: state.itemCount > 0 ? state.itemCount - quantity : 0,
      }

      localStorage.setItem('KenzieCart', JSON.stringify(nextState))
      return nextState

    case 'RESET_CART':
      localStorage.setItem('KenzieCart', JSON.stringify(initialState))
      return { ...initialState }

    case 'INIT SAVED CART':
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
  const [ isLoading, setIsLoading ] = useState(false)

  const addItem = (item) => {
    setIsLoading(true)
    dispatch({
      type: 'ADD_ITEM',
      payload: item,
    })
    setIsLoading(false)
  }

  const removeItem = (id) => {
    setIsLoading(true)
    dispatch({
      type: 'REMOVE_ITEM',
      payload: id,
    })
    setIsLoading(false)
  }

  const removeAllItems = (id) => {
    setIsLoading(true)
    dispatch({
      type: 'REMOVE_ALL_ITEMS',
      payload: id,
    })
    setIsLoading(false)
  }

  const resetCart = () => {
    setIsLoading(true)
    dispatch({
      type: 'RESET_CART',
    })
    setIsLoading(false)
  }

  const isItemInCart = (id) => {
    return !!state.cart.find((item) => item._id === id)
  }

  // Check for saved local cart on load and dispatch to set initial state
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('KenzieCart')) || false
    if (savedCart) {
      setIsLoading(true)
      dispatch({
        type: 'INIT_SAVED_CART',
        payload: savedCart,
      })
      setIsLoading(false)
    }
  }, [dispatch])

  return {
    state,
    addItem,
    removeItem,
    removeAllItems,
    resetCart,
    isItemInCart,
    calculateCartTotal,
  }
}

export default useProvideCart
