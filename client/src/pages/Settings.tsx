import { useAccountContext} from "../components/Account";
import ChangeDisplayName from "../components/ChangeDisplayName";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";

const Settings = () => {
  const [user, setUser, setSignedIn] = useAccountContext();
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <ChangeDisplayName user={user} setUser={setUser} />
      <ChangePassword user={user} />
      <DeleteAccount user={user} setSignedIn={setSignedIn} />
    </div>
  );
};

export default Settings;
