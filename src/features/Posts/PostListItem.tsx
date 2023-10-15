import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  IconButton,
  AccordionSummary,
  Grid,
  Typography,
  AccordionDetails,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { UserPost } from "../../app/services/posts";
import { useState } from "react";

interface PostListItemProps {
  post: UserPost;
  onDelete: (postId: number) => void;
  onEdit: (postId: number) => void;
  isDeleting: boolean;
}

const PostListItem: React.FC<PostListItemProps> = ({
  post: { id, title, body },
  onDelete,
  onEdit,
  isDeleting,
}) => {
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleChange =
    (id: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? id : false);
    };
  return (
    <Accordion
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
            <Typography variant="body1">{title}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right", paddingRight: 10 }}>
            <IconButton
              aria-label="edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
            >
              <EditIcon />
            </IconButton>
            <LoadingButton
              aria-label="delete"
              loadingPosition="start"
              loading={isDeleting}
              startIcon={<DeleteIcon />}
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              Delete
            </LoadingButton>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="primary">
              Body:
            </Typography>
            <Typography>{body}</Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default PostListItem;
