import PasswordChangeForm from './PasswordChangeForm';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeySquareIcon, UserIcon } from 'lucide-react';
import AccountChangeForm from './AccountChangeForm';

const AccountAndPasswordChange = () => {
  return (
    <Tabs defaultValue="account" className="max-w-lg">
      <TabsList>
        <TabsTrigger value="account" className="px-4">
          <UserIcon />
          Nalog
        </TabsTrigger>
        <TabsTrigger value="password" className="px-4">
          <KeySquareIcon />
          Lozinka
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Podešavanja naloga</CardTitle>
            <CardDescription>
              Ovde možete promeniti informacije vezane za Vaš nalog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountChangeForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Podešavanja lozinke</CardTitle>
            <CardDescription>
              Ovde možete promeniti Vašu lozinku. Nakon promene lozinke, bićete odjavljeni sa
              ostalih uređaja.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AccountAndPasswordChange;
