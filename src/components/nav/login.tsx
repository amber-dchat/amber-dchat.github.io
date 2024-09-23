"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { useMainUser, UserContextValues } from "@/hooks/user/useMainUser"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle } from "lucide-react"

export function Login({ open, setOpen }: { open: boolean, setOpen: (a: boolean) => void }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [val, setVal] = React.useState("0");

  const title = val == "0" ? "Login" : "Sign Up";
  const desc = val == "0" ? "Lets log back in to your account" : "Create a new account to get started";

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <Tabs onValueChange={setVal} value={val} className="grid gap-2 my-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="0">Login</TabsTrigger>
                  <TabsTrigger value="1">Signup</TabsTrigger>
                </TabsList>
              </Tabs>

              <span>{title}</span>
            </DialogTitle>
            <DialogDescription>
              {desc}
            </DialogDescription>
          </DialogHeader>
          <ProfileForm className="" val={val} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <Tabs onValueChange={setVal} value={val} className="grid gap-2 my-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="0">Login</TabsTrigger>
                <TabsTrigger value="1">Signup</TabsTrigger>
              </TabsList>
            </Tabs>

            <span>{title}</span>
          </DrawerTitle>
          <DrawerDescription>
            {desc}
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4 my-4" val={val} />
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className, val }: { className: string, val: string }) {
  const user = useMainUser() as UserContextValues;

  const [err, setErr] = React.useState("");

  React.useEffect(() => setErr(""), [val]);

  const [isPending, start] = React.useTransition();

  const handleLogin = React.useMemo(() => (ev: React.FormEvent<HTMLFormElement>) => {
    start(async () => {
      ev.preventDefault();

      const [username, password] = Array.from(ev.currentTarget.querySelectorAll("input")).map(el => (el as HTMLInputElement).value);
      // Login
      if (val == "0") {
        console.log("Logging in with", username, password);
        try {
          await user.account.login(username, password);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          console.log(e);
          setErr(e);
        }
      }
      // Signup
      else {
        try {
          await user.account.create(username, password);

          // eslint-disable-next-line
        } catch (e: any) {
          console.log(e);
          setErr(e);
        }
        console.log("Signing up");
      }
    });
  }, [val, user.account]);

  return (
    <form className={cn("grid items-start gap-4", className)} onSubmit={handleLogin}>
      {err != "" && <div className="grid gap-1">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      </div>}
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" type="text" required minLength={3} maxLength={64} placeholder="dchatt" autoComplete="username" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required minLength={8} placeholder={val == "0" ? "Current password" : "Enter a safe password"} autoComplete="current-password" />
      </div>
      <Button type="submit" disabled={isPending}>{val == "0" ? "Login" : "Sign Up"}</Button>
    </form>
  )
}
