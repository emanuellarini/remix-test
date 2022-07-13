import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { TodoType } from '../../models/todos';
import { getTodosWithA } from '../../models/todos';

type LoaderData = Awaited<{ todos: TodoType[] }>;

export const loader: LoaderFunction = async () => {
  const  todos = await getTodosWithA();

  return json<LoaderData>({ todos })
}

export const headers = () => ({
  'Cache-Control': 's-maxage: 300, stale-while-revalidate=600'
})

export default function TodosWithA () {
  const { todos } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Todos With A</h1>
      <ul>
        {!todos?.length && 'No Items'}
        {todos?.map(todo => <li key={`with-a-${todo.id}`}>{todo.title}</li>)}
      </ul>
    </div>
  );
}
