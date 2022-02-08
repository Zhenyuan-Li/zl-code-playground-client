import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators } from '../state';

export const useActions = () => {
  const dispatch = useDispatch();

  // bind all action only one time
  return useMemo(
    () => bindActionCreators(actionCreators, dispatch),
    [dispatch]
  );
};
