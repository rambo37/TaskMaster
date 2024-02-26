import { useAccountContext } from "../components/Account";
import ChangeDisplayName from "../components/ChangeDisplayName";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";
import SettingsPageSection from "../components/SettingsPageSection";
import TaskListSettings from "../components/TaskListSettings";

const Settings = () => {
  const { user, setUser, setSignedIn, setUnsavedChanges } = useAccountContext();
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <SettingsPageSection
        Content={TaskListSettings}
        user={user}
        setUser={setUser}
        setSignedIn={setSignedIn}
        setUnsavedChanges={setUnsavedChanges}
      />
      <SettingsPageSection
        Content={ChangeDisplayName}
        user={user}
        setUser={setUser}
        setSignedIn={setSignedIn}
        setUnsavedChanges={setUnsavedChanges}
      />
      <SettingsPageSection
        Content={ChangePassword}
        user={user}
        setUser={setUser}
        setSignedIn={setSignedIn}
        setUnsavedChanges={setUnsavedChanges}
      />
      <SettingsPageSection
        Content={DeleteAccount}
        user={user}
        setUser={setUser}
        setSignedIn={setSignedIn}
        setUnsavedChanges={setUnsavedChanges}
      />
    </div>
  );
};

export default Settings;
