import { createAsyncThunk } from '@reduxjs/toolkit';
import { actions } from './slice';
import { ActionType } from './common';
import { WorkspaceApi } from 'services';

const loadUsers = createAsyncThunk(
  ActionType.SetUsers,
  async (workspaceId: string, { dispatch }): Promise<void> => {
    const response = await new WorkspaceApi().loadUsers(workspaceId);
    dispatch(actions.setUsers(response));
  },
);

const workspaceActions = {
  ...actions,
  loadUsers,
};

export { workspaceActions };
