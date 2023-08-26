import * as colors from "colors"
import { PokeAPI } from "pokeapi-types"
import { ArcCompany, Currency } from "src/types"
import { getRandomOldSchoolPokemon } from "../../utils/utils"

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

    console.log(
        colors.magenta(
            colors.italic(
                `[getArcCompanyPineconeCount][company] Parameter -> ${company}`
            )
        )
    )

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

    console.log(
        colors.magenta(
            colors.italic(
                `[getArcCompanyPokemonArchtype][company] Parameter -> ${company}`
            )
        )
    )

    const randomPokemon = await getRandomOldSchoolPokemon().catch(
        error => `Something went wrong while getting the Pokémon: ${error}`
    )

    return Promise.resolve(randomPokemon)
}

export const getArcCompanyProjectedAnnualRevenueInMillions = async ({
    currency,
    company
}: {
    currency: Currency
    company: ArcCompany
}): Promise<number> => {
    if (!currency) {
        throw new Error(
            "A currency needs to be specified for the annual revenue to be calculated"
        )
    }

    if (!company) {
        throw new Error(
            "A company needs to be specified for the annual revenue to be calculated"
        )
    }

    console.log(
        colors.magenta(
            colors.italic(
                `[getArcCompanyProjectedAnnualRevenueInMillions][currency] Parameter -> ${currency}`
            )
        )
    )
    console.log(
        colors.magenta(
            colors.italic(
                `[getArcCompanyProjectedAnnualRevenueInMillions][company] Parameter -> ${company}`
            )
        )
    )

    return company === "Umain"
        ? Promise.resolve(Math.floor(Math.random() * 10000))
        : Promise.resolve(Math.floor(Math.random() * 1000))
}

export type GptConcreteFunctionNames =
    | "getArcCompanyPineconeCount"
    | "getArcCompanyPokemonArchtype"
    | "getArcCompanyProjectedAnnualRevenueInMillions"

export type GptConcreteFunctionTypes =
    | typeof getArcCompanyPineconeCount
    | typeof getArcCompanyPokemonArchtype
    | typeof getArcCompanyProjectedAnnualRevenueInMillions

export const gptConcreteFunctionsRecord: Record<
    GptConcreteFunctionNames,
    GptConcreteFunctionTypes
> = {
    getArcCompanyPineconeCount: getArcCompanyPineconeCount,
    getArcCompanyPokemonArchtype: getArcCompanyPokemonArchtype,
    getArcCompanyProjectedAnnualRevenueInMillions:
        getArcCompanyProjectedAnnualRevenueInMillions
}
