import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
} from "@mui/material";
import { Autorenew as AutoRenewIcon } from "@mui/icons-material";

import { AppDispatch } from "../../app/store";
import { useDebounce, validArray } from "../../utils";
import ContentSpinner from "../Common/ContentSpinner/ContentSpinner";
import { StyledPagination, Table, TasksContainer } from "./Tasks.styled";
import { Todo, tasksApi, useGetAllTodosQuery } from "../../app/services/tasks";

const itemsPerPage = 10;

const TasksComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { todos, isFetching } = useGetAllTodosQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      todos: data && validArray(data) ? data : [],
      isFetching,
    }),
  });
  const [filterValues, setFilterValues] = useState({
    completed: undefined,
    title: "",
    userId: 0,
    page: 1,
  });

  const debouncedFilterValues = useDebounce(filterValues, 400);

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    setFilterValues((prev) => ({
      ...prev,
      [fieldName]:
        fieldName === "completed" ? e.target.checked : e.target.value,
      page: 1,
    }));
  };

  const updateStatus = (newStatus: true | false, id: number) => {
    dispatch(
      tasksApi.util.updateQueryData(
        "getAllTodos",
        undefined,
        (draftTodos: Todo[]) => {
          const todoIndex = draftTodos.findIndex((todo) => todo.id === id);

          if (todoIndex !== -1) {
            const updatedTodos = [
              ...draftTodos.slice(0, todoIndex),
              { ...draftTodos[todoIndex], completed: newStatus },
              ...draftTodos.slice(todoIndex + 1),
            ];

            return updatedTodos;
          }
          return draftTodos;
        }
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    return (
      (debouncedFilterValues.completed === undefined ||
        todo.completed === debouncedFilterValues.completed) &&
      (debouncedFilterValues.title === "" ||
        todo.title.includes(debouncedFilterValues.title)) &&
      (Number(debouncedFilterValues.userId) === 0 ||
        todo.userId === Number(debouncedFilterValues.userId))
    );
  });

  const startIndex = (filterValues.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedTodos = filteredTodos.slice(startIndex, endIndex);

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
              {displayedTodos?.map(({ id, completed, title, userId }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{userId}</td>
                  <td>{title}</td>
                  <td>
                    <div className="status-container">
                      <span>{completed ? "Yes" : "No"}</span>
                      <Button
                        onClick={() => updateStatus(!completed, id)}
                        variant="contained"
                        startIcon={<AutoRenewIcon />}
                      >
                        Switch to {completed ? "Incomplete" : "Completed"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <StyledPagination
            variant="outlined"
            color="primary"
            page={filterValues.page}
            count={Math.ceil(filteredTodos.length / itemsPerPage)}
            onChange={(_e, page) => {
              if (!isFetching) {
                setFilterValues((prev) => ({
                  ...prev,
                  page: page,
                }));
              }
            }}
          />
        </>
      )}
    </TasksContainer>
  );
};

export default TasksComponent;
