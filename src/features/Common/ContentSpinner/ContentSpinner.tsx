import { Circles } from "react-loader-spinner";

const ContentSpinner: React.FC = () => (
  <Circles
    height="80"
    width="80"
    color="#4fa94d"
    ariaLabel="circles-loading"
    wrapperStyle={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    wrapperClass=""
    visible={true}
  />
);

export default ContentSpinner;
