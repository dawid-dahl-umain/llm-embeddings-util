import { ArcCompany } from "src/types"
import { getRandomOldSchoolPokemon } from "../../utils/utils"
import { PokeAPI } from "pokeapi-types"

export const getArcCompanyPineconeCount = async ({
    company
}: {
    company: ArcCompany
}): Promise<number> => {
    if (!company) {
        throw new Error(
            "A company needs to be specified for pinecone count to be calculated"
        )
    }

    return Promise.resolve(Math.floor(Math.random() * 1000))
}

export const getArcCompanyPokemonArchtype = async ({
    company
}: {
    company: ArcCompany
}): Promise<PokeAPI.Pokemon["name"]> => {
    if (!company) {
        throw new Error(
            "A company needs to be specified for its Pokémon archetype to be given"
        )
    }

    console.log("getArcCompanyPokemonArchtype company argument ->", company)

    const randomPokemon = await getRandomOldSchoolPokemon().catch(
        error => `Something went wrong while getting the Pokémon: ${error}`
    )

    return Promise.resolve(randomPokemon)
}

export type GptConcreteFunctionNames =
    | "getArcCompanyPineconeCount"
    | "getArcCompanyPokemonArchtype"

export type GptConcreteFunctionTypes =
    | typeof getArcCompanyPineconeCount
    | typeof getArcCompanyPokemonArchtype

export const gptConcreteFunctionsRecord: Record<
    GptConcreteFunctionNames,
    GptConcreteFunctionTypes
> = {
    getArcCompanyPineconeCount: getArcCompanyPineconeCount,
    getArcCompanyPokemonArchtype: getArcCompanyPokemonArchtype
}
