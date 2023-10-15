import { useState } from "react";
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  CancelScheduleSend as CancelIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import {
  EditUserPayload,
  User,
  useUpdateUserMutation,
} from "../../app/services/users";
import EditUser from "../Home/EditUser";

const UserCard: React.FC<{ userInfo: User }> = ({ userInfo }) => {
  const [open, setOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<EditUserPayload>();

  const [updateUser, { isLoading, isSuccess, reset, error: updateUserError }] =
    useUpdateUserMutation();

  const handleEditUser = async () => {
    if (editedUser) {
      try {
        await updateUser(editedUser).unwrap();
        setEditedUser(undefined);
      } catch (_err) {
        return;
      }
    }
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isSuccess}
        autoHideDuration={1000}
        onClose={reset}
      >
        {updateUserError ? (
          <Alert severity="error" sx={{ width: "100%" }}>
            Something went wrong
          </Alert>
        ) : (
          <Alert severity="success" sx={{ width: "100%" }}>
            Changes saved!
          </Alert>
        )}
      </Snackbar>
      <Card elevation={2} sx={{ maxWidth: 275 }}>
        <CardContent>
          {userInfo.email && <Typography>{userInfo.email}</Typography>}
          {userInfo.username && <Typography>{userInfo.username}</Typography>}
          {userInfo.name && <Typography>{userInfo.name}</Typography>}
          {userInfo.website && <Typography>{userInfo.website}</Typography>}
        </CardContent>
        <CardActions>
          {editedUser && editedUser.id === userInfo.id ? (
            <>
              <Tooltip title="Revert">
                <IconButton
                  aria-label="revert"
                  onClick={() => setEditedUser(undefined)}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
              <LoadingButton
                onClick={handleEditUser}
                endIcon={<SendIcon />}
                loading={isLoading}
                loadingPosition="end"
                variant="contained"
              >
                <span>Submit</span>
              </LoadingButton>
            </>
          ) : (
            <Chip label="Edit" onClick={() => setOpen(true)} />
          )}
        </CardActions>
      </Card>
      <EditUser
        userId={userInfo.id}
        handleClose={() => setOpen(false)}
        open={open}
        setEditedUser={setEditedUser}
      />
    </>
  );
};

export default UserCard;
