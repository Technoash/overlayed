import { useSocket } from "./rpc/manager";
import { Routes, Route } from "react-router-dom";
import { MainView } from "./views/main";
import { ChannelView } from "./views/channel";

import { SettingsView } from "./views/settings";
import { ErrorView } from "./views/error";
import { NavBar } from "./components/nav-bar";
import { usePin } from "./hooks/use-pin";
import { useAlign } from "./hooks/use-align";
import { useDisableWebFeatures } from "./hooks/use-disable-context-menu";
import { useUpdate } from "./hooks/use-update";
import { useAppStore } from "./store";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { Settings3Component } from "./views/settings/account";

function App() {
  useSocket();
  useDisableWebFeatures();

  useEffect(() => {
    const styleForLog = "font-size: 20px; color: #00dffd";
    console.log(`%cOverlayed ${window.location.hash} Window`, styleForLog);
  }, []);

  const { isAvailable, error, status } = useUpdate();
  const { visible } = useAppStore();

  const { pin } = usePin();
  const { horizontal, setHorizontalDirection } = useAlign();

  const visibleClass = visible ? "opacity-100" : "opacity-0";

  return (
    <html className="text-white">
      {!pin && (
        <NavBar
          isUpdateAvailable={isAvailable}
          pin={pin}
          alignDirection={horizontal}
          setAlignDirection={setHorizontalDirection}
        />
      )}
      <Toaster />
      <Routes>
        <Route path="/" Component={MainView} />
        <Route path="/channel" element={<ChannelView alignDirection={horizontal} />} />
        <Route
          path="/settings"
          element={
            // <SettingsView
            //   update={{
            //     isAvailable,
            //     error,
            //     status,
            //   }}
            // />

            <Settings3Component />
          }
        />
        <Route path="/error" Component={ErrorView} />
      </Routes>
    </html>
  );
}

export default App;
