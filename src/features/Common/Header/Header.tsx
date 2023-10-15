import { AppBar, Toolbar, Button } from "@mui/material";
import { Task as TaskIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Link to="/tasks">
          <Button
            variant="contained"
            startIcon={<TaskIcon />}
            disableRipple
            disableElevation
            disableFocusRipple
          >
            Tasks
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
