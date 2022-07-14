import type { LoaderFunction, ActionFunction } from "@remix-run/node";

import { redirect, json, HeadersFunction } from "@remix-run/node";
import { useLoaderData, useFetcher, Outlet } from "@remix-run/react";
import { useRef, useEffect, } from "react";
import { Add as PlusIcon } from '@mui/icons-material';
import { Button, TextField, List, Typography, Box } from '@mui/material';

import {Todo} from '../components/Todo';
import type { TodoType } from '../models/todos';
import { postTodo, deleteTodo, getTodos } from '../models/todos'

type LoaderData = Awaited<{ todos: TodoType[] }>;

export const loader: LoaderFunction = async () => {
  return json({ todos: await getTodos() }, {
    headers: {
      'cache-control': 's-maxage=5, stale-while-revalidate=55'
    }
  })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'cache-control': loaderHeaders.get('cache-control') || ''
})

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, id, title } = Object.fromEntries(formData)

  if (_action === 'delete') {
    try {
      // randomizing a failing request for you to see the optimistic in action!
      if (Math.random() > 0.75) throw new Error();

      await deleteTodo(Number(id));

      // redirects to nested route or main
      return redirect(request.headers.get("Referer") || '/todos');
    } catch (e) {
      return { error: true }
    }
  }

  try {
    await postTodo(title.toString());

    // redirects to nested route or main
    return redirect(request.headers.get("Referer") || '/todos');
  } catch (e) {
    return { error: true }
  }
}

export default function Index () {
  const { todos } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const isAdding = fetcher.submission?.formData.get('_action') == 'create';

  const formRef = useRef<HTMLFormElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (!isAdding) {
        formRef.current?.reset();
        titleRef.current?.focus();
      }
    };
  }, [isAdding]);

  return (
    <Box>
      <Typography variant="h4" component="h1">Todos</Typography>

      {!todos.length && <Typography>No Items</Typography>}
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {todos.map(todo => <Todo todo={todo} key={todo.id} />)}
        {isAdding && <Todo todo={{ title: fetcher.submission?.formData.get('title')?.toString() || '', id: 0 }} isOptimistic />}
      </List>

      <Box method="post" ref={formRef} component={fetcher.Form} sx={{ display: 'flex', maxWidth: 360, justifyContent: 'space-between' }}>
        <TextField type="text" name="title" ref={titleRef} size="small" fullWidth />
        <Button
          type="submit"
          name="_action"
          value="create"
          disabled={isAdding}
          variant="contained"
          sx={{ ml: 2 }}
          size="medium"
        >
          <PlusIcon />
        </Button>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Outlet />
      </Box>
    </Box>
  );
}