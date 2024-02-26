import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { User } from "./Account";

type SettingsPageSectionProps = {
  Content: React.ComponentType<ContentProps>;
  user: User;
  setUser: React.Dispatch<User>;
  setSignedIn: React.Dispatch<boolean>;
  setUnsavedChanges: React.Dispatch<boolean>;
};

export type ContentProps = {
  setLoading: React.Dispatch<boolean>;
  setError: React.Dispatch<string>;
  user: User;
  setUser: React.Dispatch<User>;
  setSignedIn: React.Dispatch<boolean>;
  setUnsavedChanges: React.Dispatch<boolean>;
};

const SettingsPageSection = ({
  Content,
  user,
  setUser,
  setSignedIn,
  setUnsavedChanges,
}: SettingsPageSectionProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <section>
      <Content
        setLoading={setLoading}
        setError={setError}
        user={user}
        setUser={setUser}
        setSignedIn={setSignedIn}
        setUnsavedChanges={setUnsavedChanges}
      />
      {loading && (
        <div style={{ textAlign: "center" }}>
          <ClipLoader />
        </div>
      )}
      {error && <div className="status error">{error}</div>}
    </section>
  );
};

export default SettingsPageSection;
