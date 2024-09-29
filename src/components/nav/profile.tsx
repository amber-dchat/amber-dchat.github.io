import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';
import { ResponsiveDialog } from '../customDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function EditProfile({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (a: boolean) => void;
}) {
  const { userInfo } = useMainUser() as UserContextValues;

  // const displayName = userInfo?.info?.displayName;
  // const bio = userInfo?.info?.bio;

  return (
    <ResponsiveDialog open={open} setOpen={setOpen} title="" description="">
      <Tabs defaultValue="0" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="0">Profile</TabsTrigger>
          <TabsTrigger value="1">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="0"></TabsContent>

        <TabsContent value="1"></TabsContent>
      </Tabs>
    </ResponsiveDialog>
  );
}
