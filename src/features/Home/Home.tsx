import { useState } from "react";
import { Link } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Grid,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  CancelScheduleSend as CancelIcon,
  Send as SendIcon,
  ArrowRight as ArrowRightIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import {
  EditUserPayload,
  useGetUserListQuery,
  useUpdateUserMutation,
} from "../../app/services/users";
import EditUser from "./EditUser";
import { validArray } from "../../utils";
import ErrorDisplay from "../Common/ErrorDisplay/ErrorDisplay";
import ContentSpinner from "../Common/ContentSpinner/ContentSpinner";

const Home: React.FC = () => {
  const { data: userList, error, isFetching } = useGetUserListQuery();
  const [open, setOpen] = useState<boolean>(false);
  const [editableId, setEditableId] = useState<number>(0);
  const [editedUser, setEditedUser] = useState<EditUserPayload>();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [updateUser, { isLoading, isSuccess, reset, error: updateUserError }] =
    useUpdateUserMutation();

  const handleEdit = async () => {
    if (editedUser) {
      try {
        await updateUser(editedUser).unwrap();
        setEditedUser(undefined);
      } catch (_err) {
        return;
      }
    }
  };

  const handleUpdate = (userId: number) => {
    setEditableId(userId);
    handleOpen();
  };

  const [expanded, setExpanded] = useState<number | false>(false);

  const handleChange =
    (userId: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? userId : false);
    };
  return (
    <div>
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
      <h1>User list</h1>
      {isFetching ? (
        <ContentSpinner />
      ) : validArray(userList) ? (
        userList?.map((user) => {
          const {
            company,
            email,
            id,
            name,
            phone,
            username,
            website,
            address,
          } = user;
          const { city, street, suite } = address;
          return (
            <Accordion
              key={id}
              expanded={expanded === id}
              onChange={handleChange(id)}
              elevation={3}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`user-${id}-content`}
                id={`user-${id}-header`}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="body1">{name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {email}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {username}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ textAlign: "right", paddingRight: 10 }}
                  >
                    <Link to="/posts" state={{ userId: id }}>
                      <Button
                        variant="contained"
                        startIcon={<ArrowRightIcon />}
                      >
                        See posts
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" color="primary">
                      Company:
                    </Typography>
                    <Typography>{company.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" color="primary">
                      Phone:
                    </Typography>
                    <Typography>{phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" color="primary">
                      Website:
                    </Typography>
                    <Typography>{website}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" color="primary">
                      City:
                    </Typography>
                    <Typography>{city}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" color="primary">
                      Street:
                    </Typography>
                    <Typography>{street}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" color="primary">
                      Suite:
                    </Typography>
                    <Typography>{suite}</Typography>
                  </Grid>
                </Grid>
                {editedUser && editedUser.id === id ? (
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Tooltip title="Revert">
                        <IconButton
                          aria-label="revert"
                          onClick={() => setEditedUser(undefined)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <LoadingButton
                        onClick={handleEdit}
                        endIcon={<SendIcon />}
                        loading={isLoading}
                        loadingPosition="end"
                        variant="contained"
                      >
                        <span>Submit</span>
                      </LoadingButton>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item xs={12} sx={{ textAlign: "right" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleUpdate(id)}
                    >
                      Edit User
                    </Button>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Typography>No users available</Typography>
      )}
      {error && <ErrorDisplay err={error as FetchBaseQueryError} />}
      <EditUser
        userId={editableId}
        handleClose={handleClose}
        setEditedUser={setEditedUser}
        open={open}
      />
    </div>
  );
};

export default Home;
