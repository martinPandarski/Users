import { Modal, Box, Button, Stack } from "@mui/material";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ConfirmDeletePost: React.FC<{
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}> = ({ open, handleClose, handleSubmit }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-delete-post-title"
      aria-describedby="confirm-delete-post-description"
    >
      <Box sx={{ ...style, width: 400 }}>
        <h2 id="confirm-delete-post-title">Confirmation</h2>
        <p id="confirm-delete-post-description">
          Do you want to delete this post?
        </p>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Yes
          </Button>
          <Button variant="contained" onClick={handleClose}>
            No
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmDeletePost;
