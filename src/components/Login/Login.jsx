import axios from "axios";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

const Login = () => {
  const loginSchema = yup.object().shape({
    uname: yup.string().required("Username is required"),
    passwd: yup.string().required("Password is required"),
  });

  // logout the user
  const handleLogout = () => {
    localStorage.clear();
  };

  // login the user
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // send the uname and password to the server

    await axios
      .post("/login", values)
      .then((response) => {
        setSubmitting(false);
        localStorage.setItem("user", JSON.stringify(response.data));
        window.location.reload();
      })
      .catch((error) => {
        setErrors({
          uname: "Invalid Username or Password",
          passwd: "Invalid Username or Password",
        });
        setSubmitting(false);
      });
  };

  return (
    <Formik
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
      initialValues={{
        uname: "",
        passwd: "",
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="validationFormik101">
            <Form.Label>User Name</Form.Label>
            <InputGroup>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="User Name"
                name="uname"
                value={values.uname}
                onChange={handleChange}
                isValid={touched.uname && !errors.uname}
                isInvalid={!!errors.uname}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.uname}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="passwd"
              value={values.passwd}
              onChange={handleChange}
              isValid={touched.passwd && !errors.passwd}
              isInvalid={!!errors.passwd}
            />
            <Form.Control.Feedback type="invalid">
              {errors.passwd}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            style={{ width: `100%` }}
            type="submit"
            variant="outline-primary"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
