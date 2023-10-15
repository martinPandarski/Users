import { object, string } from "yup";
import { LoadingButton } from "@mui/lab";
import { Close as CloseIcon } from "@mui/icons-material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import { Box, Modal, TextField, Typography } from "@mui/material";

import { StyledForm } from "../Home/EditUser.styled";
import {
  UserPostPayload,
  useEditUserPostMutation,
  useGetPostQuery,
} from "../../app/services/posts";
import { validArray } from "../../utils";
import ErrorDisplay from "../Common/ErrorDisplay/ErrorDisplay";

interface EditPostProps {
  open: boolean;
  handleClose: () => void;
  postId: number;
}

const initialValues = {
  id: 0,
  title: "",
  body: "",
  userId: 0,
};

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
  title: string().required("Title is required"),
  body: string().required("Body is required"),
});

const EditPost: React.FC<EditPostProps> = ({ open, handleClose, postId }) => {
  const { postInfo, error } = useGetPostQuery(postId, {
    skip: postId === 0,
    selectFromResult: ({ data, error }) => ({
      postInfo: data && validArray(data) ? data[0] : initialValues,
      error,
    }),
  });
  const [editPost, { isLoading }] = useEditUserPostMutation();
  const handleSubmitForm = async (postData: UserPostPayload) => {
    try {
      await editPost(postData).unwrap();
      handleClose();
    } catch (_err) {
      return;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modify-post-title"
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
        <Typography id="modify-post-title" variant="h6" textAlign="center">
          Modify Post
        </Typography>
        <Formik
          initialValues={postInfo || initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ handleSubmit }) => {
            return (
              <StyledForm onSubmit={handleSubmit}>
                <Field name="title">
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      id="title"
                      label="Title"
                      {...field}
                      helperText={<ErrorMessage name="title" />}
                    />
                  )}
                </Field>
                <Field name="body">
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      id="body"
                      label="Text"
                      {...field}
                      helperText={<ErrorMessage name="body" />}
                    />
                  )}
                </Field>
                {error && <ErrorDisplay err={error as FetchBaseQueryError} />}
                <LoadingButton
                  loading={isLoading}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save
                </LoadingButton>
              </StyledForm>
            );
          }}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditPost;
