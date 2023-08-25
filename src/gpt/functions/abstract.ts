import { CompletionCreateParams } from "openai/resources/chat"
import { GptConcreteFunctionNames } from "./concrete"

const getCountryPineconeCountGptFunction: CompletionCreateParams.Function = {
    name: "getCountryPineconeCount",
    description: "Get the pinecone count inside any country on the planet",
    parameters: {
        type: "object",
        properties: {
            country: {
                type: "string",
                description:
                    "The country of which the pinecone count should be given"
            }
        },
        required: ["country"]
    }
}

const getPlanetPineconeCountGptFunction: CompletionCreateParams.Function = {
    name: "getPlanetPineconeCount",
    description: "Get the pinecone count of any planet in the universe",
    parameters: {
        type: "object",
        properties: {
            planet: {
                type: "string",
                description:
                    "The planet of which the pinecone count should be given"
            }
        },
        required: ["planet"]
    }
}

export const gptAbstractFunctionsRecord: Record<
    GptConcreteFunctionNames,
    CompletionCreateParams.Function
> = {
    getCountryPineconeCount: getCountryPineconeCountGptFunction,
    getPlanetPineconeCount: getPlanetPineconeCountGptFunction
}

export const gptAbstractFunctionsArray: CompletionCreateParams.Function[] =
    Object.values(gptAbstractFunctionsRecord)
