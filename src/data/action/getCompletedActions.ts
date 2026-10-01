import { getAllActions as getActions } from '@/data/action/getAllActions';

export const getCompletedActions = async () => {
  const actions = await getActions();
  return actions.filter(a => a.status === 'COMPLETED');
};
