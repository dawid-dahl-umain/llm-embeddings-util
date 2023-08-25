import { CompletionCreateParams } from "openai/resources/chat"

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

const gptFunctions: CompletionCreateParams.Function[] = [
    getCountryPineconeCountGptFunction
]

export default gptFunctions
