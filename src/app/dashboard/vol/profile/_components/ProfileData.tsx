import AvatarUploaderWithCropper from '@/app/dashboard/_components/AvatarUploaderWithCropper';
import AlertCard from '@/components/global/AlertCard';
import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { getVolunteerData } from '@/data/volunteer/getVolunteerData';
import EditVolunteerProfileForm from './EditVolunteerProfileForm';

const ProfileData = async () => {
  const session = await requireVolunteer();
  const volunteerData = await getVolunteerData(session.user.id);

  if (!volunteerData) {
    return (
      <AlertCard
        variant="destructive"
        title="Greška:"
        description="Informacije o volonteru nisu pronađene."
      />
    );
  }

  const { fullName, email, username, image, phone, bio, facebookLink, instagramLink, xLink } =
    volunteerData;

  return (
    <div className="flex flex-col gap-4 md:px-8">
      {/* Osnovni podaci i mogucnost promene avatara */}
      <div className="bg-muted/50 flex flex-col items-center gap-4 rounded-lg border p-8 md:flex-row md:items-start md:gap-8">
        <AvatarUploaderWithCropper
          initialUrl={image || '/default_avatar.svg'}
          username={session.user.username!}
        />
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-xl font-semibold tracking-tight md:text-3xl">{fullName}</h1>
          <p className="text-muted-foreground text-sm">@{username}</p>
          <p className="text-muted-foreground text-sm">{email}</p>
        </div>
      </div>

      <EditVolunteerProfileForm data={volunteerData} />
    </div>
  );
};

export default ProfileData;
