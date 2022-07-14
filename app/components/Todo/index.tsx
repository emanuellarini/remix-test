import React from 'react';
import { TodoType } from "../../models/todos";
import { useFetcher, useTransition } from "@remix-run/react";
import { IconButton, ListItem, ListItemText } from "@mui/material";
import { Delete as DeleteIcon, Replay as ReplayIcon } from "@mui/icons-material";

export const Todo = ({ todo, isOptimistic = false }: { todo: TodoType, isOptimistic?: boolean }) => {
  const fetcher = useFetcher();
  const transition = useTransition();

  const isDeleting = fetcher.submission?.formData.get('id') === todo.id.toString() || transition.state === 'loading';
  const hasFailed = fetcher.data?.error;

  const deleteButton = !isOptimistic ?
    <fetcher.Form method="post">
      <input type="hidden" name="id" value={todo.id} />
      <IconButton edge="end" aria-label="delete" type="submit">
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