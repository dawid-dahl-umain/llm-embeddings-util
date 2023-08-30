import { CompletionCreateParams } from "openai/resources/chat"
import { GptConcreteFunctionNames } from "./concrete"

const getArcCompanyPineconeCountGptFunction: CompletionCreateParams.Function = {
    name: "getArcCompanyPineconeCount",
    description:
        "Get the pinecone count of any of the ARC companies. At ARC, every company has a number of pinecones from the forest. It is not a metaphor, they are actual biological pinecones",
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

const getArcCompanyProjectedAnnualRevenueInMillionsGptFunction: CompletionCreateParams.Function =
    {
        name: "getArcCompanyProjectedAnnualRevenueInMillions",
        description:
            "Get the projected revenue of any of the Arc companies, given in millions",
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
                        "The company within ARC of which the annual revenue should be given"
                },
                currency: {
                    type: "string",
                    enum: ["SEK", "Dollar", "British Pounds", "Euro"],
                    description:
                        "The currency in which the annual revenue will be given in"
                }
            },
            required: ["company", "currency"]
        }
    }

export const gptAbstractFunctionsRecord: Record<
    GptConcreteFunctionNames,
    CompletionCreateParams.Function
> = {
    getArcCompanyPineconeCount: getArcCompanyPineconeCountGptFunction,
    getArcCompanyPokemonArchtype: getArcCompanyPokemonArchtypeGptFunction,
    getArcCompanyProjectedAnnualRevenueInMillions:
        getArcCompanyProjectedAnnualRevenueInMillionsGptFunction
}

export const gptAbstractFunctionsArray: CompletionCreateParams.Function[] =
    Object.values(gptAbstractFunctionsRecord)
