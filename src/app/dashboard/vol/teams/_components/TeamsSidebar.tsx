import { Team } from '@prisma/types';
import AlertCard from '@/components/global/AlertCard';

import NewTeamDialog from './NewTeamDialog';
import TeamSidebarCard from './card/TeamSidebarCard';

import { TeamWithMembers } from '@/types/team.type';

type Props = {
  selectedTeam: TeamWithMembers | null;
  setSelectedTeam: (team: TeamWithMembers | null) => void;
  createdTeams: TeamWithMembers[];
  memberTeams: TeamWithMembers[];
};

const TeamsSidebar = ({ selectedTeam, setSelectedTeam, createdTeams, memberTeams }: Props) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border p-4 lg:w-2/5">
      <NewTeamDialog />

      <div className="flex flex-col gap-8">
        {createdTeams.length === 0 && memberTeams.length === 0 && (
          <AlertCard
            title="Niste član nijednog tima."
            description="Kreirajte svoj tim i dodajte svoje prijatelje."
          />
        )}

        <div>
          {createdTeams.length > 0 && (
            <div className="flex flex-col gap-2">
              {createdTeams.map((team) => (
                <TeamSidebarCard
                  key={team.id}
                  team={team}
                  selectedTeam={selectedTeam}
                  setSelectedTeam={setSelectedTeam}
                  canEdit={true}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          {memberTeams.length > 0 && (
            <div className="flex flex-col gap-2">
              {memberTeams.map((team) => (
                <TeamSidebarCard
                  key={team.id}
                  team={team}
                  selectedTeam={selectedTeam}
                  setSelectedTeam={setSelectedTeam}
                  canEdit={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsSidebar;
