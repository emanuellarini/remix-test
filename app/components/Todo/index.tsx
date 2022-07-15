import React from 'react';
import { TodoType } from "../../models/todos";
import { useFetcher } from "@remix-run/react";
import { IconButton, ListItem, ListItemText } from "@mui/material";
import { Delete as DeleteIcon, Replay as ReplayIcon } from "@mui/icons-material";

export const Todo = ({ todo, isOptimistic = false }: { todo: TodoType, isOptimistic?: boolean }) => {
  const fetcher = useFetcher();

  const isDeleting = fetcher.submission?.formData.get('id') === todo.id.toString();
  const hasFailed = fetcher.data?.error;

  const deleteButton = !isOptimistic ?
    <fetcher.Form method="post" replace>
      <input type="hidden" name="id" value={todo.id} />
      <IconButton
        edge="end"
        aria-label="delete"
        type="submit"
        name="_action"
        value="delete"
        disabled={isDeleting}
      >
        {hasFailed ? <ReplayIcon /> : <DeleteIcon />}
      </IconButton>
    </fetcher.Form>
    :
    <IconButton edge="end" aria-label="delete" disabled>
      <DeleteIcon />
    </IconButton>

  return (
    <ListItem
      hidden={isDeleting}
      secondaryAction={deleteButton}
    >
      <ListItemText
        primary={todo.title}
        sx={{
          color: hasFailed ? 'red' : undefined
        }}
      />
    </ListItem>
  )
}