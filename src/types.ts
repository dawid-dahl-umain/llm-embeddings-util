import { ChatCompletion, ChatCompletionMessage } from "openai/resources/chat"

export type ArcCompany =
    | "Above"
    | "Animal"
    | "Ariel"
    | "BLCK"
    | "Conversionista"
    | "Cupole"
    | "Curamando"
    | "Curious Mind"
    | "Fabrique"
    | "Goods"
    | "Heydays"
    | "Kurppa Hosk"
    | "Mission Anew"
    | "Nameless.today"
    | "Q42"
    | "Umain"

export type Currency = "SEK" | "Dollar" | "British Pounds" | "Euro"

export type OneOrZero = 1 | 0

export type ChatOptions = { apiKey: string; responseDebug: true | undefined }

export const isChatCompletion = (
    completion: any // Adjust this as needed based on the possible types you are checking against
): completion is ChatCompletion =>
    completion.id !== undefined &&
    Array.isArray(completion.choices) &&
    completion.created !== undefined &&
    completion.model !== undefined &&
    completion.object === "chat.completion"

export const isChatCompletionChoice = (
    choice: ChatCompletion.Choice | ChatCompletionMessage
): choice is ChatCompletion.Choice =>
    (choice as ChatCompletion.Choice).finish_reason !== undefined

export const isChatCompletionMessage = (
    message: ChatCompletion.Choice | ChatCompletionMessage
): message is ChatCompletionMessage =>
    (message as ChatCompletionMessage).role !== undefined
