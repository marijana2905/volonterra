import ContentWrapper from '@/components/global/ContentWrapper';
import PrivacyPolicy from './PrivacyPolicy';

export const metadata = {
  title: 'Politika privatnosti',
  description: 'Pročitajte kako VolonTerra prikuplja, koristi i štiti vaše podatke.',
};

const PrivacyPage = () => {
  return (
    <ContentWrapper className="mb-16 flex flex-col gap-16">
      <PrivacyPolicy />
    </ContentWrapper>
  );
};

export default PrivacyPage;
