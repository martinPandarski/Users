import { Pagination } from "@mui/material";
import { styled } from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    background-color: #f0f0f0;
    padding: 8px;
    text-align: left;
    border: 1px solid gray;

    .status-container {
      display: flex;
      justify-content: space-between;
      button {
        text-transform: capitalize;
      }
    }
  }
`;

const TasksContainer = styled.div`
  margin: 10px 0;

  display: flex;
  flex-flow: column nowrap;
  gap: 15px;

  .MuiFormControlLabel-root {
    gap: 10px;
  }
`;

const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: center;
  margin-top: 20px; /* Adjust the top margin as needed */
`;

export { Table, StyledPagination, TasksContainer };
