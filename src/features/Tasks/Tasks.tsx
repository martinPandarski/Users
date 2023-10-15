/**
 * This component is now deprecated because the status cannot be changed through the API as the DB can't be mutated.
 * This is why we're using TasksComponent.tsx to do all the logic on the FE
 *
 * @deprecated
 */
import { useGetTodosQuery } from "../../app/services/tasks";
import { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
} from "@mui/material";
import { validArray } from "../../utils";
import { useDebounce } from "../../utils";
import { StyledPagination, Table, TasksContainer } from "./Tasks.styled";
import ContentSpinner from "../Common/ContentSpinner/ContentSpinner";

const Tasks: React.FC = () => {
  const [filterValues, setFilterValues] = useState({
    completed: undefined,
    title: "",
    userId: 0,
    page: 1,
  });

  const debouncedFilterValues = useDebounce(filterValues, 400);

  const { todos, totalPageCount, isFetching } = useGetTodosQuery(
    debouncedFilterValues,
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isFetching }) => ({
        todos: data?.todos && validArray(data.todos) ? data.todos : [],
        totalPageCount: data?.totalPageCount || 0,
        isFetching,
      }),
    }
  );

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    setFilterValues((prev) => ({
      ...prev,
      [fieldName]:
        fieldName === "completed" ? e.target.checked : e.target.value,
      page: 1,
    }));
  };

  return (
    <TasksContainer>
      <Stack direction="row" spacing={2}>
        <FormGroup>
          <FormControlLabel
            labelPlacement="start"
            label="Title"
            control={
              <TextField
                size="small"
                name="title"
                value={filterValues.title}
                onChange={handleChangeFilter}
              />
            }
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            labelPlacement="start"
            label="Completed"
            control={
              <Checkbox
                size="small"
                name="completed"
                checked={filterValues.completed || false}
                onChange={handleChangeFilter}
              />
            }
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            labelPlacement="start"
            label="Owner ID"
            control={
              <TextField
                type="number"
                size="small"
                name="userId"
                value={filterValues.userId}
                onChange={handleChangeFilter}
              />
            }
          />
        </FormGroup>
      </Stack>
      {isFetching ? (
        <ContentSpinner />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Title</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {todos?.map(({ id, completed, title, userId }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{userId}</td>
                  <td>{title}</td>
                  <td>{completed ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {totalPageCount > 0 && (
            <StyledPagination
              variant="outlined"
              color="primary"
              page={filterValues.page}
              count={totalPageCount - 1}
              onChange={(_e, page) => {
                if (!isFetching) {
                  setFilterValues((prev) => ({
                    ...prev,
                    page: page,
                  }));
                }
              }}
            />
          )}
        </>
      )}
    </TasksContainer>
  );
};

export default Tasks;
