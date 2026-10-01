import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { getOrganizerActions } from '@/data/action/getOrganizerActions';

import AlertCard from '@/components/global/AlertCard';
import ActionItem from './ActionItem';
import { ActionStatusExtended } from '@/types/action.type';

type Props = {
  filter: ActionStatusExtended;
};

const ActionsList = async ({ filter }: Props) => {
  const session = await requireOrganizer();
  const actions = await getOrganizerActions(session.user.id, filter);

  return (
    <div>
      {actions.length === 0 ? (
        <AlertCard title="Nema akcija za prikaz" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {actions.map(action => (
            <ActionItem key={action.id} action={action} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionsList;
