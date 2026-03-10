import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { OtherRoutes } from "../utils/routes_name";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <Button
        type="primary"
        size="large"
        onClick={() => navigate(OtherRoutes?.login?.path)}
      >
        Login
      </Button>
    </div>
  );
};

export default Unauthorized;
