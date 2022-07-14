import type { LoaderFunction, HeadersFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { TodoType } from '../../models/todos';
import { getTodosWithA, deleteTodo } from '../../models/todos';
import { Todo } from '../../components/Todo';
import { Box, List, Typography } from "@mui/material";
import { ActionFunction, redirect } from "@remix-run/node";

type LoaderData = Awaited<{ todos: TodoType[] }>;

export const loader: LoaderFunction = async () => {
  const  todos = await getTodosWithA();

  return json({
    todos,
    headers: {
      'Cache-Control': 's-maxage=5, stale-while-revalidate=60'
    }
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { id } = Object.fromEntries(formData);

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


export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') || ''
})

export default function TodosWithA () {
  const { todos } = useLoaderData<LoaderData>();

  return (
    <Box>
      <Typography variant="h4" component="h1">Todos Containing Letter A</Typography>
      {!todos.length && <Typography>No Items</Typography>}
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {todos.map(todo => <Todo todo={todo} key={todo.id} />)}
      </List>
    </Box>
  );
}
