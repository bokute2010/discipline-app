// src/slices/index.ts
import { combineReducers } from '@reduxjs/toolkit';
import aiReducer from './ai.slice';
import auditReducer from './audit.slice';
import ragReducer from './rag.slice';

const rootReducer = combineReducers({
  ai: aiReducer,
  audit: auditReducer,
  rag: ragReducer
});

export default rootReducer;
