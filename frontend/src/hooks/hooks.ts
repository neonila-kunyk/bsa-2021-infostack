export { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
export { useHistory, useLocation, useParams } from 'react-router-dom';
export { useCookies } from 'react-cookie';
import { AppDispatch, RootState } from 'common/types/app/root-state.type';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppDispatch, useAppSelector };
