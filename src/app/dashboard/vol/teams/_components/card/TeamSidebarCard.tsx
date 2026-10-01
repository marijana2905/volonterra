import { Team } from '@prisma/types';
import AvatarUploaderWithCropper from '@/app/dashboard/_components/AvatarUploaderWithCropper';
import { Card, CardHeader } from '@/components/ui/card';
import TeamSidebarCardDropdown from './TeamSidebarCardDropdown';
import MyAvatar from '@/components/global/MyAvatar';
import { TeamWithMembers } from '@/types/team.type';

type Props = {
  team: TeamWithMembers;
  selectedTeam: TeamWithMembers | null;
  setSelectedTeam: (team: TeamWithMembers | null) => void;
  canEdit: boolean;
};

const TeamSidebarCard = ({ team, selectedTeam, setSelectedTeam, canEdit }: Props) => {
  const isSelected = selectedTeam?.id === team.id;

  return (
    <Card
      className={`cursor-pointer shadow-none transition-shadow ${
        isSelected ? 'border-primary shadow' : 'border-muted'
      }`}
      onClick={() => setSelectedTeam(team)}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          {canEdit ? (
            <AvatarUploaderWithCropper
              username={team.id} // na cloudinary se pamti kao team_{id}_avatar jer ce ime moci da se menja
              initialUrl={team.image || '/default_avatar.svg'}
              size={48}
              teamId={team.id}
            />
          ) : (
            <MyAvatar imageUrl={team.image} fallbackText={team.name} className="h-12 w-12" />
          )}

          <span>{team.name}</span>
        </div>

        {canEdit && <TeamSidebarCardDropdown team={team} />}
      </CardHeader>
    </Card>
  );
};

export default TeamSidebarCard;
