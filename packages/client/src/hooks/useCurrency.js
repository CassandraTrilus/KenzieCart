import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";

const initialState = {
  currencySymbol: "$",
  multiplierFactor: 1,
};

export const UICurrencyContext = createContext(initialState);

UICurrencyContext.displayName = "UICurrencyContext";

function uiCurrencyReducer(state, action) {
  switch (action.type) {
    case "SET_CURRENCY":
      return {
        ...state,
        currencySymbol: action.payload,
        multiplierFactor: action.payload === "$" ? 1 : 0.8,
      };
    case "INIT_SAVED_CURRENCY":
      localStorage.setItem("CurrencySymbol", JSON.stringify(action.payload));
      return {
        ...state,
        currencySymbol: action.payload,
        multiplierFactor: action.payload === "$" ? 1 : 0.8,
      };
    default:
      return state;
  }
}

export const UICurrencyProvider = (props) => {
  const [currencyState, dispatch] = useReducer(uiCurrencyReducer, initialState);

  const localStorageValue = localStorage.getItem("CurrencySymbol");

  if (localStorageValue === null) {
    localStorage.setItem(
      "CurrencySymbol",
      JSON.stringify(currencyState.currencySymbol)
    );
  }

  const getPrice = (amount) => {
    const newAmount = (amount * currencyState.multiplierFactor).toFixed(2);
    return `${currencyState.currencySymbol}${newAmount}`;
  };

  const toggleCurrency = (currencyType) => {
    dispatch({
      type: "SET_CURRENCY",
      payload: currencyType,
    });
  };

  useEffect(() => {
    const savedCurrency =
      JSON.parse(localStorage.getItem("CurrencySymbol")) || false;
    if (savedCurrency) {
      dispatch({
        type: "INIT_SAVED_CURRENCY",
        payload: savedCurrency,
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      currencyState,
      toggleCurrency,
      getPrice,
    }),
    [currencyState]
  );

  return <UICurrencyContext.Provider value={value} {...props} />;
};

const useCurrency = () => {
  const context = useContext(UICurrencyContext);
  if (context === undefined) {
    throw new Error(`useCurrency must be used within a UIProvider`);
  }
  return context;
};

export const ManagedUICurrencyContext = ({ children }) => (
  <UICurrencyProvider>{children}</UICurrencyProvider>
);

export default useCurrency