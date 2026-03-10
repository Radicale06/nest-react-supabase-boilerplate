import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/features/authSlice";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, Card } from "antd";
import { AdminRoutes, OtherRoutes, UserRoutes } from "../utils/routes_name";
import { apiClient } from "../api";
import AlertDialog from "../components/AlertDialog";

interface LoginResponse {
  data: {
    accessToken: string;
    user: {
      roleId: number;
    };
  };
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Get form values (email and password)
      const { email, password } = form.getFieldsValue();

      // Call the login API
      const response: LoginResponse = await apiClient.auth.authControllerLogin({
        email,
        password,
      });

      if (response?.data) {
        // Dispatch the login action
        dispatch(login(response?.data));

        // Redirect based on role
        if (response.data.user.roleId === 2) {
          navigate(AdminRoutes?.dashboard?.path);
        } else if (response.data.user.roleId === 3) {
          navigate(UserRoutes?.dashboard?.path);
        }
      }
    } catch (error) {
      // Handle login error
      setErrorMessage("Login failed. Please check again!");
      setErrorVisible(true);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Login Page</h1>
      <Card
        style={{
          width: "100%",
          borderRadius: 5,
          boxShadow: "0px 0px 10px -5px rgba(0,0,0,0.75)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={() => handleLogin()}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
            style={{ textAlign: "left" }}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
            style={{ textAlign: "left" }}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{ marginTop: 10 }}
            >
              Login
            </Button>
            <Button
              size="large"
              onClick={() => navigate(OtherRoutes?.login?.path)}
              block
              style={{ marginTop: 10 }}
            >
              Create an account
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <AlertDialog
        visible={errorVisible}
        title="Login Error"
        content={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </div>
  );
}
