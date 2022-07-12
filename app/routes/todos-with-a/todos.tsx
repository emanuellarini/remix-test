import type { LoaderFunction, ActionFunction } from "@remix-run/node";

import { redirect, json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useRef, useEffect, } from "react";

import { postTodo, deleteTodo, getTodos, Todo } from '../../models/todos'
import { randomSleep } from '../../utils';

type LoaderData = Awaited<{ todos: Todo[] }>;

export const loader: LoaderFunction = async () => {
  await randomSleep();

  return json<LoaderData>({ todos: await getTodos() })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, id, title  } = Object.fromEntries(formData)

  await randomSleep();

  if (_action === 'delete') {
    try {
      if (Math.random() > 0.5) throw new Error();

      await deleteTodo(id);

      // redirects to nested route or main
      return redirect(request.headers.get("Referer") || '/todos');
    } catch (e) {
      return { error: true }
    }
  }

  try {
    await postTodo(title);

    // redirects to nested route or main
    return redirect(request.headers.get("Referer") || '/todos');
  } catch (e) {
    return { error: true }
  }
}

const Todo = ({ todo }: { todo: Todo }) => {
  const fetcher = useFetcher();

  const isDeleting = fetcher.submission?.formData.get('id') === todo.id.toString()
  const hasFailed = fetcher.data?.error;

  return (
    <li style={{ color: hasFailed ? 'red' : 'inherit'}} hidden={isDeleting}>
      <span>{todo.title} </span>
      <fetcher.Form method="post" style={{ display: 'inline' }}>
        <input type="hidden" name="id" value={todo.id} />
        <button type="submit" name="_action" value="delete" >{hasFailed ? 'Retry' : 'x'}</button>
      </fetcher.Form>
    </li>
  )
}

export default function Todos() {
  const { todos } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const isAdding = fetcher.submission?.formData.get('_action') == 'create';

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
      <h1>Todos</h1>
      <ul>
        {!todos?.length && 'No Items'}
        {todos?.map(todo => <Todo todo={todo} key={todo.id} />)}
        {isAdding && <li><span>{fetcher.submission?.formData.get('title')}</span> <button disabled>x</button></li>}
        <fetcher.Form method="post" ref={formRef}>
          <input type="text" name="title" ref={titleRef} />{' '}
          <button
            type="submit"
            name="_action"
            value="create"
            disabled={isAdding}
          >
            Add
          </button>
        </fetcher.Form>
      </ul>
    </div>
  );
}
