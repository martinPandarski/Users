import { object, string } from "yup";
import { Close as CloseIcon } from "@mui/icons-material";
import { Formik, Field, ErrorMessage, FieldProps } from "formik";
import { Typography, Box, TextField, Button, Modal } from "@mui/material";

import { EditUserPayload, useGetUserInfoQuery } from "../../app/services/users";
import { StyledForm } from "./EditUser.styled";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const validationSchema = object({
  email: string().required("Email is required").email("Enter a valid email"),
  username: string().required("Username is required"),
  address: object({
    street: string().required("Street is required"),
    suite: string().required("Suite is required"),
    city: string().required("City is required"),
  }),
});

const EditUser: React.FC<{
  userId: number;
  open: boolean;
  handleClose: () => void;
  setEditedUser: (userData: EditUserPayload) => void;
}> = ({ userId, open, handleClose, setEditedUser }) => {
  const { data: userInfo } = useGetUserInfoQuery(userId, {
    skip: userId === 0,
  });

  const handleSubmitForm = (userData: EditUserPayload) => {
    setEditedUser(userData);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modify-user-title"
    >
      <Box sx={style}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </div>
        <Typography id="modify-user-title" variant="h6" textAlign="center">
          Modify user
        </Typography>
        <Formik
          initialValues={
            userInfo || {
              id: 0,
              email: "",
              username: "",
              address: {
                street: "",
                suite: "",
                city: "",
                geo: { lat: "", lng: "" },
                zipcode: "",
              },
            }
          }
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ handleSubmit }) => {
            return (
              <StyledForm onSubmit={handleSubmit}>
                <Field name="email">
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      id="email"
                      label="Email"
                      {...field}
                      helperText={<ErrorMessage name="email" />}
                    />
                  )}
                </Field>
                <Field name="username">
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      id="username"
                      label="Username"
                      {...field}
                      helperText={<ErrorMessage name="username" />}
                    />
                  )}
                </Field>
                <Field name="address.street">
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      id="address.street"
                      label="Street"
                      {...field}
                      helperText={<ErrorMessage name="address.street" />}
                    />
                  )}
                </Field>
                <Field name="address.suite">
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      id="address.suite"
                      label="Suite"
                      {...field}
                      helperText={<ErrorMessage name="address.suite" />}
                    />
                  )}
                </Field>
                <Field name="address.city">
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      id="address.city"
                      label="City"
                      {...field}
                      helperText={<ErrorMessage name="address.city" />}
                    />
                  )}
                </Field>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </StyledForm>
            );
          }}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditUser;
