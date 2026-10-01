import { useState } from 'react';

import { Team } from '@prisma/types';

import EditTeamDialog from '../EditTeamDialog';
import InviteMembers from '../InviteMembers';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Edit3Icon, MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { TeamWithMembers } from '@/types/team.type';

type Props = {
  team: TeamWithMembers;
};

const TeamSidebarCardDropdown = ({ team }: Props) => {
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);
  const [isInviteMembersOpen, setIsInviteMembersOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVerticalIcon className="hover:text-primary cursor-pointer transition-colors" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsInviteMembersOpen(true);
            }}
          >
            <PlusIcon />
            Dodaj člana
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsEditTeamDialogOpen(true);
            }}
          >
            <Edit3Icon />
            Izmeni
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTeamDialog
        team={team}
        isOpen={isEditTeamDialogOpen}
        setIsOpen={setIsEditTeamDialogOpen}
      />

      <InviteMembers
        teamId={team.id}
        isOpen={isInviteMembersOpen}
        setIsOpen={setIsInviteMembersOpen}
      />
    </>
  );
};

export default TeamSidebarCardDropdown;
