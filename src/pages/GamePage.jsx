import {Link} from "react-router-dom";
import CameraFeed from "../components/CameraFeed";

export const GamePage = () => {
  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h1>Game Page</h1>
      <CameraFeed />
    </div>
  );
};
