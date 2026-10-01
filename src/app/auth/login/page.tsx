import AuthFormCard from '../_components/AuthFormCard';
import LoginForm from '../_components/LoginForm';

export const metadata = {
  title: 'Prijava',
  description: 'Prijavite se na svoj nalog i nastavite sa svojim aktivnostima.',
};

const LoginPage = () => {
  return (
    <AuthFormCard
      title="Dobro došli nazad!"
      description="Prijavite se na svoj nalog."
      children={<LoginForm />}
    />
  );
};

export default LoginPage;
