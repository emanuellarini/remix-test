import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"

import { json } from "@remix-run/node";
import { useLoaderData, useTransition, Outlet } from "@remix-run/react";
import { useRef, useEffect, } from "react";
import { getTodos, Todo } from '../../models/todos';

type LoaderData = Awaited<{ todos: Todo[] }>;


export const loader: LoaderFunction = async () => {
  const  todos = await getTodos();

  return json<LoaderData>({ todos: todos.filter(todo => todo.title.includes('a')) })
}

export default function TodosWithA() {
  const { todos } = useLoaderData<LoaderData>();
  const transition = useTransition();

  const isAdding = transition.submission?.formData.get('_action') == 'create';

  const formRef = useRef<HTMLFormElement | undefined>();
  const titleRef = useRef<HTMLInputElement | undefined>();

  useEffect(() => {
    return () => {
      if (!isAdding) {
        formRef.current?.reset();
        titleRef.current?.focus();
      }
    };
  }, [isAdding]);

  return (
    <div>
      <h1>Todos With A</h1>
      <ul>
        {!todos?.length && 'No Items'}
        {todos?.map(todo => <li key={`with-a-${todo.id}`}>{todo.title}</li>)}
      </ul>

      <Outlet />
    </div>
  );
}
