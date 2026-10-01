import AuthFormCard from '../_components/AuthFormCard';
import RegisterForm from '../_components/RegisterForm';

export const metadata = {
  title: 'Registracija',
  description: 'Postanite deo naše zajednice!',
};

const RegisterPage = () => {
  return (
    <AuthFormCard
      title="Dobro došli!"
      description="Postanite deo VolonTerra zajednice."
      children={<RegisterForm />}
    />
  );
};

export default RegisterPage;
