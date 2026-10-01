import { requireSession } from '@/data/auth/requireSession';
import { getOrganizerData } from '@/data/organizer/getOrganizerData';

import { updateOrganizerFieldAction } from '@/actions/organizer/updateOrganizerField.action';

import AlertCard from '@/components/global/AlertCard';

import AvatarUploaderWithCropper from '../../../_components/AvatarUploaderWithCropper';
import PhoneNumberInput from '../../../_components/inputs/PhoneNumberInput';
import AdressInput from '../../../_components/inputs/AdressInput';
import TextInput from '../../../_components/inputs/TextInput';

import { EditDescriptionDialog } from './EditDescriptionDialog';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ProfileData = async () => {
  const session = await requireSession();
  const organizerData = await getOrganizerData(session.user.id);

  if (!organizerData) {
    return (
      <AlertCard
        variant="destructive"
        title="Greška:"
        description="Informacije o organizatoru nisu pronađene."
      />
    );
  }

  const {
    organizationName,
    username,
    email,
    image,
    phone,
    description,
    address,
    website,
    facebookLink,
    instagramLink,
    xLink,
    paypalLink,
    bankAccount,
    verifiedByAdmin,
  } = organizerData;

  return (
    <div className="flex flex-col gap-4 md:px-8">
      {/* Ime organizacije, username, email, imageUrl */}
      <div className="bg-muted/50 flex flex-col items-center gap-4 rounded-lg border p-8 md:flex-row md:items-start md:gap-8">
        <AvatarUploaderWithCropper
          initialUrl={image || '/default_avatar.svg'}
          username={session.user.username!}
        />
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-xl font-semibold tracking-tight md:text-3xl">{organizationName}</h1>
          <p className="text-muted-foreground text-sm">@{username}</p>
          <p className="text-muted-foreground text-sm">{email}</p>
        </div>
      </div>

      <Accordion type="multiple" className="w-full space-y-2" defaultValue={['0']}>
        {/* Opis profila organizacije */}
        <AccordionItem
          value="1"
          className="bg-background rounded-md border px-4 py-1 outline-none last:border-b"
        >
          <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
            <div className="flex flex-col gap-1">
              <span>Opis organizacije</span>
              <span className="text-muted-foreground text-xs">
                Ovaj deo je vidljiv volonterima na našoj platformi i treba da im pruži više
                informacija o vašoj organizaciji
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="flex flex-col gap-4 p-2">
              {description ? (
                <div
                  className="minimal-tiptap-content"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className="text-muted-foreground">Trenutno nema opisa.</p>
              )}

              {/* Klikom na olovku se otvara dialog koji ima Rich Text Editor za izmenu opisa */}
              <div className="flex justify-start">
                <EditDescriptionDialog initialDescription={description || ''} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Kontakt informacije */}
        <AccordionItem
          value="2"
          className="bg-background rounded-md border px-4 py-1 outline-none last:border-b"
        >
          <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
            Kontakt informacije
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <PhoneNumberInput initialValue={phone || ''} onSave={updateOrganizerFieldAction} />
            <AdressInput initialValue={address || ''} onSave={updateOrganizerFieldAction} />
          </AccordionContent>
        </AccordionItem>

        {/* Social media links */}
        <AccordionItem
          value="3"
          className="bg-background rounded-md border px-4 py-1 outline-none last:border-b"
        >
          <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
            Društvene mreže i linkovi
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-col gap-2">
                <TextInput
                  type="xLink"
                  initialValue={xLink || ''}
                  onSave={updateOrganizerFieldAction}
                />
                <TextInput
                  type="instagramLink"
                  initialValue={instagramLink || ''}
                  onSave={updateOrganizerFieldAction}
                />
              </div>
              <div className="flex flex-col gap-2">
                <TextInput
                  type="facebookLink"
                  initialValue={facebookLink || ''}
                  onSave={updateOrganizerFieldAction}
                />
                <TextInput
                  type="website"
                  initialValue={website || ''}
                  onSave={updateOrganizerFieldAction}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PayPal i BankAccountNumber (TODO: paypal je u stvari mail input, a bank account number text input, probaj da napravis reusable komponentu) */}
        <AccordionItem
          value="4"
          className="bg-background rounded-md border px-4 py-1 outline-none last:border-b"
        >
          <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
            PayPal i broj bankovnog računa
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <TextInput
              type="paypalLink"
              initialValue={paypalLink || ''}
              onSave={updateOrganizerFieldAction}
            />
            <TextInput
              type="bankAccount"
              initialValue={bankAccount || ''}
              onSave={updateOrganizerFieldAction}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProfileData;
