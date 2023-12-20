import ClipLoader from "react-spinners/ClipLoader";

interface LoadingProps {
  loadingMessage?: string;
}

const Loading = ({ loadingMessage }: LoadingProps) => {
  const defaultMessage = "Loading, please wait...";

  return (
    <div className="loading">
      <div style={{ marginRight: "15px" }}>
        {loadingMessage ? loadingMessage : defaultMessage}
      </div>
      <ClipLoader />
    </div>
  );
};

export default Loading;
