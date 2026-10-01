'use client';

import { useState } from 'react';

import { Team } from '@prisma/types';

import TeamsSidebar from './TeamsSidebar';
import TeamChat from './chat/TeamChat';
import { TeamWithMembers } from '@/types/team.type';

type Props = {
  createdTeams: TeamWithMembers[];
  memberTeams: TeamWithMembers[];
};

const TeamsData = ({ createdTeams, memberTeams }: Props) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamWithMembers | null>(null);

  return (
    <div className="flex h-full w-full flex-col gap-4 lg:flex-row">
      {/* Left side: Team list */}
      <TeamsSidebar
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        createdTeams={createdTeams}
        memberTeams={memberTeams}
      />

      {/* Right side: Selected Team Chat */}
      <TeamChat selectedTeam={selectedTeam} />
    </div>
  );
};

export default TeamsData;
