import { Circles } from "react-loader-spinner";
export default function Loader() {
  return (
    <Circles
      height="60"
      width="60"
      color="#4fa94d"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
}
