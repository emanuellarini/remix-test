export type Todo = { id: number; title: string }

export const postTodo = async (title: string):  Promise<Todo> => {
  const response = await fetch(`http://localhost:3001/todos`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    mode: 'cors',
    body: JSON.stringify({
      title
    })
  });

  return await response.json();
}

export const deleteTodo = async (id: number): Promise<boolean> => {
  const response = await fetch(`http://localhost:3001/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    mode: 'cors'
  });

  return await response.json();
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`http://localhost:3001/todos`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    mode: 'cors',
  });

  return await response.json();
}