import { Button } from "@/components/ui/button";
import { exit } from "@tauri-apps/plugin-process";
import * as dateFns from "date-fns";
import { saveWindowState, StateFlags } from "@tauri-apps/plugin-window-state";

import { invoke } from "@tauri-apps/api/core";
import { usePlatformInfo } from "@/hooks/use-platform-info";
import Config from "@/config";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { emit } from "@tauri-apps/api/event";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { VoiceUser } from "@/types";
import { useConfigValue } from "@/hooks/use-config-value";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as shell from "@tauri-apps/plugin-shell";

export const Developer = () => {
  const platformInfo = usePlatformInfo();
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 pb-2">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await invoke("open_devtools");
            }}
          >
            Open Devtools
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await shell.open(platformInfo.configDir);
            }}
          >
            Open Config Dir
          </Button>
        </div>
      </div>
    </>
  );
};

const canaryVersionToCommit = (version: string) => {
  const split = version.split("-");
  if (split.length > 1 && split[1]) {
    const [, commitSha] = split[1].split(".");

    return commitSha;
  }

  return null;
};

interface SettingItemProps {
  icon: FC<{ className: string }>;
  label: string;
  description: string;
  children?: ReactNode;
  labelHtmlFor?: string;
}

const SettingItem: FC<SettingItemProps> = ({ icon: Icon, label, description, children, labelHtmlFor }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 shadow-md hover:shadow-lg">
          <Label className="flex items-center gap-2 cursor-pointer" htmlFor={labelHtmlFor}>
            <Icon className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium text-white">{label}</span>
          </Label>
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs text-gray-200">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section: FC<SectionProps> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">{title}</h2>
    <div className="grid gap-4">{children}</div>
  </div>
);

export const Settings3Component = () => {
  return (
    <body className={"bg-zinc-900 text-white overflow-y-scroll nice-scroll h-screen"}>
      <div className="sm:px-8 md:px-32 px-4 mx-auto my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-8 lg:gap-x-16">
          <Section title="General Settings">
            <SettingItem
              icon={PinIcon}
              label="Pinned Items"
              description="Enables or disables the display of pinned items in the interface."
              labelHtmlFor="pinned-items"
            >
              <Checkbox id="pinned-items" />
            </SettingItem>
          </Section>

          <Section title="User Preferences">
            <SettingItem
              icon={UserIcon}
              label="Show Only Talking Users"
              description="Hides users who are not currently speaking in the interface."
              labelHtmlFor="show-talking-users"
            >
              <Checkbox id="show-talking-users" />
            </SettingItem>
            <SettingItem
              icon={UserIcon}
              label="Show My User"
              description="Displays your user avatar and name in the interface."
              labelHtmlFor="show-my-user"
            >
              <Checkbox id="show-my-user" />
            </SettingItem>
          </Section>

          <Section title="Notifications">
            <SettingItem
              icon={UserPlusIcon}
              label="Join History Notifications"
              description="Enables or disables notifications when users join or leave the session."
              labelHtmlFor="join-history-notifications"
            >
              <Checkbox id="join-history-notifications" />
            </SettingItem>
          </Section>

          <Section title="Display">
            <SettingItem
              icon={CrosshairIcon}
              label="Overlay Alignment"
              description="Adjusts the position of the overlay on the screen."
              labelHtmlFor="overlay-alignment"
            >
              <Select>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Left" />
                </SelectTrigger>
                <SelectContent id="overlay-alignment">
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </SettingItem>
            <SettingItem
              icon={UserIcon}
              label="Only Show Active Users"
              description="Hides users who have been inactive for a certain period of time."
              labelHtmlFor="show-active-users"
            >
              <Checkbox id="show-active-users" />
            </SettingItem>
          </Section>

          <Section title="Data & Privacy">
            <SettingItem
              icon={SignalIcon}
              label="Telemetry"
              description="Allows the application to collect and send usage data to improve the product."
              labelHtmlFor="telemetry"
            >
              <Checkbox id="telemetry" />
            </SettingItem>
          </Section>

          <Section title="Advanced">
            <SettingItem
              icon={CodeIcon}
              label="Open Devtools"
              description="Opens the browser's developer tools for debugging purposes."
              labelHtmlFor="open-devtools"
            >
              <Button variant="outline" size="sm">
                Open
              </Button>
            </SettingItem>
            <SettingItem
              icon={FolderIcon}
              label="Open Config Directory"
              description="Opens the directory where the application's configuration files are stored."
              labelHtmlFor="open-config-directory"
            >
              <Button variant="outline" size="sm">
                Open
              </Button>
            </SettingItem>
          </Section>

          <Section title="Account">
            <SettingItem
              icon={KeyIcon}
              label="Token Information"
              description="Displays information about your authentication token and its expiration date."
            >
              <div className="text-sm grid">
                <span>
                  Token: <span className="font-medium">abcdef123456789</span>
                </span>
                <span>
                  Expires: <span className="font-medium">2023-12-31</span>
                </span>
                <span>
                  Discord: <span className="font-medium">@username</span>
                </span>
              </div>
            </SettingItem>
            <SettingItem
              icon={LogOutIcon}
              label="Logout"
              description="Logs you out of the application and clears your session data."
              labelHtmlFor="logoutBtn"
            >
              <Button variant="outline" size="sm" id="logoutBtn">
                Logout
              </Button>
            </SettingItem>
            <SettingItem
              icon={PowerIcon}
              label="Quit"
              description="Exits the application completely."
              labelHtmlFor="exitBtn"
            >
              <Button variant="destructive" size="sm" id="exitBtn">
                Quit
              </Button>
            </SettingItem>
          </Section>
        </div>
      </div>
    </body>
  );
};

export const Settings2Component = () => {
  return (
    <nav className="flex flex-col w-80 gap-4 p-4 bg-background">
      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground">General</h3>
        <div className="grid gap-1">
          <Label className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground">
            <PinIcon className="w-4 h-4" />
            Pin overlay
          </Label>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground">User Preferences</h3>
        <div className="grid gap-1">
          <Label className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-background hover:text-accent-foreground">
            <UserIcon className="w-4 h-4" />
            <Checkbox id="show-talking" />
            Show Only Talking Users
          </Label>
          <Label className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground">
            <CircleUserIcon className="w-4 h-4" />
            <Checkbox id="show-self" />
            Show Your User
          </Label>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground">Notifications</h3>
        <div className="grid gap-1">
          <Label className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground">
            <BellIcon className="w-4 h-4" />
            <Checkbox id="join-history" />
            View Join History Notifications
          </Label>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground">Display</h3>
        <div className="grid gap-1">
          <div className="w-full">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Overlay Alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Label className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground">
            <VolumeIcon className="w-4 h-4" />
            <Checkbox id="show-speaking" />
            Show Only Speaking Users
          </Label>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground">
          Data &amp; Privacy
        </h3>
        <div className="grid gap-1">
          <Label className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground">
            <LockIcon className="w-4 h-4" />
            <Checkbox id="telemetry" />
            Enable Telemetry Data Collection
          </Label>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground">Advanced</h3>
        <div className="grid gap-1">
          <a
            href="#"
            className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground"
          >
            <TerminalIcon className="w-4 h-4" />
            Open Devtools
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground"
          >
            <FolderOpenIcon className="w-4 h-4" />
            Open Config Directory
          </a>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground">Account</h3>
        <div className="grid gap-1">
          <div className="px-2 py-1 text-sm">
            <KeyIcon className="w-4 h-4 inline-block mr-1" />
            <span className="font-semibold">Token:</span>
            abc123def456ghi789jkl012
          </div>
          <a
            href="#"
            className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground"
          >
            <LogOutIcon className="w-4 h-4" />
            Logout
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-2 py-1 text-sm transition-colors rounded-md hover:bg-green-500 hover:text-accent-foreground"
          >
            <PowerIcon className="w-4 h-4" />
            Quit Application
          </a>
        </div>
      </div>
    </nav>
  );
};

export const SettingsComponent = () => {
  return (
    <main className="p-6">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="Wompus" />
          <AvatarFallback>W</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">Wompus</h1>
      </div>
      <div className="mt-6 space-y-8">
        <div className="space-y-4 border-b border-muted-foreground/20 pb-4">
          <h2 className="flex items-center space-x-2">
            <PinIcon className="w-4 h-4" />
            <span>Pinned Settings</span>
          </h2>
          <div className="flex items-center justify-between">
            <span>Pinned</span>
            <Switch id="pinned" />
          </div>
        </div>
        <div className="space-y-4 border-b border-muted-foreground/20 pb-4">
          <h2 className="flex items-center space-x-2">
            <UserIcon className="w-4 h-4" />
            <span>User Settings</span>
          </h2>
          <div className="flex items-center justify-between">
            <span>Show Only Talking Users</span>
            <Switch id="talking-users" />
          </div>
          <div className="flex items-center justify-between">
            <span>Show my user</span>
            <Switch id="show-user" defaultChecked />
          </div>
        </div>
        <div className="space-y-4 border-b border-muted-foreground/20 pb-4">
          <h2 className="flex items-center space-x-2">
            <BellIcon className="w-4 h-4" />
            <span>Notification Settings</span>
          </h2>
          <div className="flex items-center justify-between">
            <span>Join History Notifications</span>
            <Switch id="history-notifications" />
          </div>
        </div>
        <div className="space-y-4 border-b border-muted-foreground/20 pb-4">
          <h2 className="flex items-center space-x-2">
            <LayoutTemplateIcon className="w-4 h-4" />
            <span>Layout Settings</span>
          </h2>
          <div className="flex items-center justify-between">
            <span>Overlay Alignment</span>
            <div className="flex items-center space-x-2">
              <span className="bg-[#2c2c2c] px-2 py-1 rounded">Right</span>
              <FilePenIcon className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="flex items-center space-x-2">
            <DatabaseIcon className="w-4 h-4" />
            <span>Data Settings</span>
          </h2>
          <div className="flex items-center justify-between">
            <span>Telemetry</span>
            <Switch id="telemetry" />
          </div>
        </div>
      </div>
    </main>
  );
};

export const AppInfo = () => {
  const platformInfo = usePlatformInfo();
  const { value: showOnlyTalkingUsers } = useConfigValue("showOnlyTalkingUsers");

  const urlForVersion = platformInfo.canary
    ? `https://github.com/overlayeddev/overlayed/commit/${canaryVersionToCommit(platformInfo.appVersion)}`
    : `https://github.com/overlayeddev/overlayed/releases/tag/v${platformInfo.appVersion}`;

  return (
    <div>
      <div className="flex items-center pb-2">
        <Checkbox
          id="notification"
          checked={showOnlyTalkingUsers}
          onCheckedChange={async () => {
            const newBool = !showOnlyTalkingUsers;
            await Config.set("showOnlyTalkingUsers", newBool);

            await emit("config_update", await Config.getConfig());
          }}
        />
        <label
          htmlFor="notification"
          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Only show users who are speaking
        </label>
      </div>
      <div className="flex items-center gap-2 pb-4 text-zinc-400">
        <div>
          <p className="text-sm">
            <strong>OS</strong> {platformInfo.os} {platformInfo.kernalVersion} {platformInfo.arch}
          </p>
        </div>
        <span className="text-xs">/</span>
        <div>
          <p className="text-sm">
            <strong>Tauri</strong> {platformInfo.tauriVersion}
          </p>
        </div>
        <span className="text-sm">/</span>
        <div>
          <p className="text-sm">
            <strong>App</strong>{" "}
            <a target="_blank" rel="noreferrer" href={urlForVersion}>
              {platformInfo.appVersion}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export const Account = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [user, setUser] = useState<VoiceUser | null>(null);
  const [tokenExpires, setTokenExpires] = useState(localStorage.getItem("discord_access_token_expiry"));

  // pull out the user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user_data");
    if (user) {
      setUser(JSON.parse(user));
    }

    // TODO: these should have keys that are shared from perhaps and abstraction
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "user_data" && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }

      if (e.key === "discord_access_token_expiry" && e.newValue) {
        setTokenExpires(e.newValue);
      }
    };

    // if we get a login update the data
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  const avatarUrl = `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`;
  return (
    <div>
      <div>
        <div className="flex items-center mb-2">
          {user?.id && (
            <Avatar className="w-16 h-16 mr-3">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
          <div>
            {user?.id ? (
              <div>
                <p className="mt-3 mb-3 font-bold">
                  {user?.global_name} ({user?.id})
                </p>
              </div>
            ) : (
              <p>Please Login to use Overlayed</p>
            )}

            <div className="pb-4">
              {tokenExpires && (
                <p className="text-sm">
                  <strong>Token Expires</strong> {dateFns.formatDistanceToNow(new Date(tokenExpires))}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 pb-4">
          <div>
            <Dialog
              onOpenChange={e => {
                setShowLogoutDialog(e);
              }}
              open={showLogoutDialog}
            >
              <DialogTrigger asChild>
                <Button size="sm" disabled={!user?.id} className="w-[100px]">
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[80%]">
                <form
                  onSubmit={async event => {
                    event.preventDefault();
                    setShowLogoutDialog(false);
                    // TODO: move this to the other window but for now this works
                    localStorage.removeItem("discord_access_token");
                    localStorage.removeItem("discord_access_token_expiry");
                    localStorage.removeItem("user_data");
                    setTokenExpires(null);
                    setUser(null);
                  }}
                >
                  <DialogHeader>
                    <DialogTitle className="mb-4 text-xl text-white">Logout</DialogTitle>
                    <DialogDescription className="mb-4 text-xl text-white">
                      Are you sure you want to log out of Overlayed?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Confirm Logout</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog
            onOpenChange={e => {
              setShowQuitDialog(e);
            }}
            open={showQuitDialog}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="w-[100px]">
                Quit
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[80%]">
              <form
                onSubmit={async event => {
                  event.preventDefault();
                  await saveWindowState(StateFlags.POSITION && StateFlags.SIZE);
                  await exit();
                }}
              >
                <DialogHeader>
                  <DialogTitle className="mb-4 text-xl text-white">Quit Overlayed</DialogTitle>
                  <DialogDescription className="mb-4 text-xl text-white">
                    Are you sure you want to quit the Overlayed app?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" type="submit">
                    Quit
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Developer />
        </div>
        <AppInfo />
      </div>
    </div>
  );
};

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function FilePenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LayoutTemplateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="7" x="3" y="3" rx="1" />
      <rect width="9" height="7" x="3" y="14" rx="1" />
      <rect width="5" height="7" x="16" y="14" rx="1" />
    </svg>
  );
}

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="17" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CircleUserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

function FolderOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function KeyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function PowerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </svg>
  );
}

function TerminalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

function VolumeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    </svg>
  );
}

function SignalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  );
}

function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CrosshairIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="22" x2="18" y1="12" y2="12" />
      <line x1="6" x2="2" y1="12" y2="12" />
      <line x1="12" x2="12" y1="6" y2="2" />
      <line x1="12" x2="12" y1="22" y2="18" />
    </svg>
  );
}

function UserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}
