import { useAccountContext } from "../components/Account";
import ChangeDisplayName from "../components/ChangeDisplayName";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";
import SettingsPageSection from "../components/SettingsPageSection";

const Settings = () => {
  const [user, setUser, setSignedIn] = useAccountContext();
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <SettingsPageSection
        Content={ChangeDisplayName}
        user={user}
        setUser={setUser}
        setSignedIn={setSignedIn}
      />
      <SettingsPageSection
        Content={ChangePassword}
        user={user}
        setUser={setUser}
        setSignedIn={setSignedIn}
      />
      <SettingsPageSection
        Content={DeleteAccount}
        user={user}
        setUser={setUser}
        setSignedIn={setSignedIn}
      />
    </div>
  );
};

export default Settings;
