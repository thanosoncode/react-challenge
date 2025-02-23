import React, { useReducer } from 'react';
import { Cat, Breed, FavoriteIds } from '../utils/models';

type AppState = {
    cats: Cat[];
    selectedCat: Cat | null;
    favorites: FavoriteIds[];
    breeds: Breed[];
    isHomeModalOpen: boolean;
    confirmationDialog: boolean;
};

const defaultState: AppState = {
    cats: [],
    selectedCat: null,
    favorites: [],
    breeds: [],
    isHomeModalOpen: false,
    confirmationDialog: false,
};

type Action =
    | { type: 'CHANGE_GLOBAL_VAR'; updatedVar: string }
    | { type: 'SET_CAT_LIST'; cats: Cat[] }
    | { type: 'SET_SELECTED_CAT'; cat: Cat }
    | { type: 'ADD_TO_FAVORITES'; favorite: FavoriteIds }
    | { type: 'REMOVE_FROM_FAVORITES'; favoriteId: number }
    | { type: 'SET_BREED_LIST'; breeds: Breed[] }
    | { type: 'SET_FAVORITE_LIST'; favorites: FavoriteIds[] }
    | { type: 'TOGGLE_CAT_MODAL'; catModal: boolean }
    | { type: 'TOGGLE_CONFIRMATION_DIALOG'; dialog: boolean };

const appReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case 'SET_CAT_LIST':
            return { ...state, cats: [...state.cats, ...action.cats] };
        case 'SET_BREED_LIST':
            return { ...state, breeds: action.breeds };
        case 'SET_SELECTED_CAT':
            return { ...state, selectedCat: action.cat };
        case 'ADD_TO_FAVORITES':
            return {
                ...state,
                favorites: [...state.favorites, action.favorite],
            };
        case 'REMOVE_FROM_FAVORITES':
            return {
                ...state,
                favorites: state.favorites.filter((item) => item.id !== action.favoriteId),
            };
        case 'SET_FAVORITE_LIST':
            return { ...state, favorites: action.favorites };
        case 'TOGGLE_CAT_MODAL':
            return { ...state, isHomeModalOpen: action.catModal };
        case 'TOGGLE_CONFIRMATION_DIALOG':
            return { ...state, dialog: action.dialog };
        default:
            return state;
    }
};

type Dispatch = (action: Action) => void;
type AppProviderProps = {
    children: React.ReactNode;
    optionalContext?: AppState | undefined;
};

const AppStateContext = React.createContext<AppState | undefined>(undefined);
const AppDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const AppProvider = ({ children, optionalContext }: AppProviderProps) => {
    const initialState = optionalContext ? optionalContext : defaultState;
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
};

const useAppState = () => {
    const context = React.useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within a AppProvider');
    }
    return context;
};

const useAppDispatch = () => {
    const context = React.useContext(AppDispatchContext);
    if (context === undefined) {
        throw new Error('useAppDispatch must be used within a AppProvider');
    }
    return context;
};

export { AppProvider, useAppState, useAppDispatch };
