import { ChatCompletion, ChatCompletionMessage } from "openai/resources/chat"

export type OneOrZero = 1 | 0

export type ChatOptions = { apiKey: string; responseDebug: true | undefined }

export const isChatCompletionChoice = (
    choice: ChatCompletion.Choice | ChatCompletionMessage
): choice is ChatCompletion.Choice =>
    (choice as ChatCompletion.Choice).finish_reason !== undefined

export const isChatCompletionMessage = (
    message: ChatCompletion.Choice | ChatCompletionMessage
): message is ChatCompletionMessage =>
    (message as ChatCompletionMessage).content !== undefined
