import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/features/authSlice";
import { Button } from "antd";
import { OtherRoutes } from "../utils/routes_name";

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Landing Page</h1>
      <Button
        type="primary"
        size="large"
        onClick={() => navigate(OtherRoutes?.login?.path)}
      >
        Login
      </Button>
      <Button size="large" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Landing;
