import { Updater } from "@/components/updater";
import type { UpdateStatus } from "@tauri-apps/api/updater";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Account } from "./account";
import { JoinHistory } from "./join-history";
import { useState } from "react";
import { usePlatformInfo } from "@/hooks/use-platform-info";
import { SiX, SiTwitch, SiDiscord, type IconType } from "@icons-pack/react-simple-icons";

function Link({ icon: Icon, url }: { icon: IconType; url: string }) {
  return (
    <a className="text-gray-400 hover:text-gray-300" target="_blank" rel="noreferrer" href={url}>
      <Icon />
    </a>
  );
}

export const SettingsView = ({
  update,
}: {
  update: { isAvailable: boolean; status: UpdateStatus | null; error: string };
}) => {
  const { canary } = usePlatformInfo();
  const [currentTab, setCurrentTab] = useState("account");
  return (
    <div className="bg-zinc-900 w-[calc(100vw)]">
      <Account />
    </div>
  );
};
