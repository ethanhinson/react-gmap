/* eslint-disable no-case-declarations */
import React, {
  useReducer, createContext, useContext,
} from 'react';
import PropTypes from 'prop-types';

const initialState = { map: null };

const GmapDispatchContext = createContext();
const GmapStateContext = createContext(initialState);

/**
 * Handle state changes in the gmap component.
 * @param state
 * @param action
 * @returns {*}
 */
const reducer = (state, action) => {
  const { type, value } = action;
  switch (type) {
    case 'SET_MAP':
      return {
        ...state,
        map: value,
      };
    default:
      return state;
  }
};

/**
 * HOC for providing the wrapping elements.
 * @param children
 * @param defaultState
 * @returns {*}
 * @constructor
 */
const GmapProvider = ({
  children, defaultState,
}) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return (
    <GmapStateContext.Provider value={state}>
      <GmapDispatchContext.Provider value={dispatch}>
        {children}
      </GmapDispatchContext.Provider>
    </GmapStateContext.Provider>
  );
};

GmapProvider.propTypes = {
  children: PropTypes.shape({}).isRequired,
  defaultState: PropTypes.shape({
    // @todo: gmap?
    map: PropTypes.shape({}),
  }),
};

GmapProvider.defaultProps = {
  defaultState: initialState,
};

/**
 * Provide only the current state.
 * @returns {*}
 */
const useGmapState = () => {
  const context = useContext(GmapStateContext);
  if (context === undefined) {
    throw new Error('useGmapState must be used within a GmapProvider');
  }
  return context;
};

/**
 * Provide access to the dispatch method for this context.
 * @returns {*}
 */
const useGmapDispatch = () => {
  const context = useContext(GmapDispatchContext);
  if (context === undefined) {
    throw new Error('useGmapDispatch must be used within a GmapProvider');
  }
  return context;
};

/**
 * Use dispatch and the state.
 * @returns {*[]}
 */
const useGmap = () => [useGmapState(), useGmapDispatch()];

export {
  GmapProvider as default,
  useGmapState,
  useGmapDispatch,
  useGmap,
  reducer,
  initialState,
};
