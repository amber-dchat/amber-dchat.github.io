import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';
import { ResponsiveDialog } from '../customDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

export function EditProfile({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (a: boolean) => void;
}) {
  const { userInfo } = useMainUser() as UserContextValues;

  const displayName = userInfo?.info?.displayName;
  const bio = userInfo?.info?.bio;

  return (
    <ResponsiveDialog open={open} setOpen={setOpen} title="" description="">
      <Tabs defaultValue="0" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="0">Profile</TabsTrigger>
          <TabsTrigger value="1">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="0">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>

            <CardContent className='space-y-2'>
              <form className='flex space-x-2'>
                <div className='w-full'>
                  <Label htmlFor='displayName' >Display Name</Label>
                  <Input id='displayName' defaultValue={displayName} type='text' required />
                </div>

                <Button className='mt-auto' type="submit" variant={"secondary"}>
                  <Check />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="1"></TabsContent>
      </Tabs>
    </ResponsiveDialog>
  );
}
