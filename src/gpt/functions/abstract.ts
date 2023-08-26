import { CompletionCreateParams } from "openai/resources/chat"
import { GptConcreteFunctionNames } from "./concrete"

const getArcCompanyPineconeCountGptFunction: CompletionCreateParams.Function = {
    name: "getArcCompanyPineconeCount",
    description: "Get the pinecone count of any of the ARC companies.",
    parameters: {
        type: "object",
        properties: {
            company: {
                type: "string",
                enum: [
                    "Above",
                    "Animal",
                    "Ariel",
                    "BLCK",
                    "Conversionista",
                    "Cupole",
                    "Curamando",
                    "Curious Mind",
                    "Fabrique",
                    "Goods",
                    "Heydays",
                    "Kurppa Hosk",
                    "Mission Anew",
                    "Nameless.today",
                    "Q42",
                    "Umain"
                ],
                description:
                    "The company within ARC of which the pinecone count should be calculated"
            }
        },
        required: ["company"]
    }
}

const getArcCompanyPokemonArchtypeGptFunction: CompletionCreateParams.Function =
    {
        name: "getArcCompanyPokemonArchtype",
        description:
            "Get the Pokémon representation of any of the Arc companies, which represents their archetype or spirit",
        parameters: {
            type: "object",
            properties: {
                company: {
                    type: "string",
                    enum: [
                        "Above",
                        "Animal",
                        "Ariel",
                        "BLCK",
                        "Conversionista",
                        "Cupole",
                        "Curamando",
                        "Curious Mind",
                        "Fabrique",
                        "Goods",
                        "Heydays",
                        "Kurppa Hosk",
                        "Mission Anew",
                        "Nameless.today",
                        "Q42",
                        "Umain"
                    ],
                    description:
                        "The company within ARC of which the Pokémon archetype should be given"
                }
            },
            required: ["company"]
        }
    }

export const gptAbstractFunctionsRecord: Record<
    GptConcreteFunctionNames,
    CompletionCreateParams.Function
> = {
    getArcCompanyPineconeCount: getArcCompanyPineconeCountGptFunction,
    getArcCompanyPokemonArchtype: getArcCompanyPokemonArchtypeGptFunction
}

export const gptAbstractFunctionsArray: CompletionCreateParams.Function[] =
    Object.values(gptAbstractFunctionsRecord)
