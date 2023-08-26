import { Logger } from "@nestjs/common"
import * as colors from "colors"
import { ChatCompletion, ChatCompletionMessage } from "openai/resources/chat"
import { PokeAPI } from "pokeapi-types"
import { isChatCompletion, isChatCompletionMessage } from "../types"

export const isQuitMessage = (userInput: string) =>
    userInput.toLowerCase().replace(/[^\w\s]/gi, "") === "exit" ||
    userInput.toLowerCase().replace(/[^\w\s]/gi, "") === "quit"

export const hasCalledFunction = (userInput: ChatCompletion) =>
    userInput.choices[0].message.function_call &&
    userInput.choices[0].finish_reason !== "stop"

export const logGptResponseUnconfig =
    (logger: Logger, debug = false) =>
    (response: ChatCompletion | ChatCompletionMessage): void => {
        if (!logger || !response) {
            throw new Error(
                "Couldn't log the GPT response, missing either the logger or the response"
            )
        }
        if (debug) {
            if (isChatCompletion(response)) {
                logger.log(
                    colors.bold(
                        response.choices[0].message.content
                            ? `Choice: ${JSON.stringify(
                                  response.choices[0],
                                  null,
                                  2
                              )}`
                            : `"Should I maybe call a function...?" 💭 \n ${JSON.stringify(
                                  response.choices[0],
                                  null,
                                  2
                              )}`
                    )
                )
            } else if (isChatCompletionMessage(response)) {
                logger.log(
                    colors.bold(`Message: ${JSON.stringify(response, null, 2)}`)
                )
            }

            return
        }

        if (isChatCompletion(response)) {
            logger.log(
                colors.bold(
                    `${
                        response.choices[0].message.content
                            ? response.choices[0].message.content
                            : '"Should I maybe call a function...? 💭"'
                    }`
                )
            )
        } else if (isChatCompletionMessage(response)) {
            logger.log(colors.bold(`${response.content}`))
        }
    }

export const removeElementsFromOffset = <T>(
    array: T[],
    elementsToRemove: number,
    startOffset: number
): T[] => {
    const beforeOffset = array.slice(0, startOffset)
    const afterRemoval = array.slice(startOffset + elementsToRemove)
    return [...beforeOffset, ...afterRemoval]
}

export const getRandomOldSchoolPokemon = async (): Promise<
    PokeAPI.Pokemon["name"]
> => {
    const maxOldSchoolPokemonId = 151
    const randomId = Math.floor(Math.random() * maxOldSchoolPokemonId) + 1
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`

    try {
        const response = await fetch(apiUrl)
        const pokemon = (await response.json()) as PokeAPI.Pokemon
        const pokemonUppercaseName =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

        return pokemonUppercaseName
    } catch (error) {
        return `An error occurred when retrieving a Pokémon: ${error}`
    }
}
