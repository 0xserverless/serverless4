import * as uuid  from 'uuid'

import { todoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoStorage } from '../fileStorage/todoStorage';

const todosAccess = new todoAccess()

export async function getUserTodo(userId: string): Promise<TodoItem[]> {
    return todosAccess.get(userId)
}

export async function createTodo(userId: string, CreateTodoRequest: CreateTodoRequest): Promise<TodoItem> {
      const itemId = uuid.v4()

    return await todosAccess.create({
        todoId: itemId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: CreateTodoRequest.name,
        dueDate: CreateTodoRequest.dueDate,
        done: false
    })
}

export async function updateTodo(userId: string, todoId: string, todoUpdate: UpdateTodoRequest): Promise<TodoUpdate> {
    return await todosAccess.update(userId, todoId, {
        name: todoUpdate.name,
        dueDate: todoUpdate.dueDate,
        done: todoUpdate.done
    })
}

export async function deleteTodo(userId: string, todoId: string, ) {
    await todosAccess.delete(userId, todoId)
}

const todosStorage = new TodoStorage()

export async function generateUploadUrl(userId: string, todoId: string): Promise<string> {

    const uploadUrl = await todosStorage.generateUploadUrl(todoId)
    await todosAccess.todoUrl(userId, todoId, todosStorage.generateItemAttechmentUrl(todoId))

    return uploadUrl
}
