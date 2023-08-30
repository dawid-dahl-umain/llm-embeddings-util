import { CompletionCreateParams } from "openai/resources/chat"
import { GptConcreteCodeSmellFunctionNames } from "./concrete"

const getCodeSmellsGptFunction: CompletionCreateParams.Function = {
    name: "getCodeSmells",
    description:
        "Based the given programming code, a parameter called code smells will be generated. It is always array of JSON objects, as long as needed.",
    parameters: {
        type: "array",
        description:
            "An array any necessary length, consisting of code smell objects. Code smell objects represent a code smell found in the given programming code, with the line number, and a comment about the code smell found",
        items: {
            type: "object",
            properties: {
                lineNumber: { type: "number" },
                comment: { type: "comment" }
            }
        },
        required: ["company"]
    }
}

export const gptCodeSmellAbstractFunctionsRecord: Record<
    GptConcreteCodeSmellFunctionNames,
    CompletionCreateParams.Function
> = {
    getCodeSmells: getCodeSmellsGptFunction
}

export const gptAbstractCodeSmellFunctionsArray: CompletionCreateParams.Function[] =
    Object.values(gptCodeSmellAbstractFunctionsRecord)
