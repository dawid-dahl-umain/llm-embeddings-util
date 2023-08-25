export const getCountryPineconeCount = async ({
    country
}: {
    country: string
}): Promise<number> => {
    if (!country) {
        throw new Error(
            "A country needs to be specified for pinecone count to be calculated"
        )
    }

    return Promise.resolve(Math.floor(Math.random() * 1000))
}

export const getPlanetPineconeCount = async ({
    planet
}: {
    planet: string
}): Promise<number> => {
    if (!planet) {
        throw new Error(
            "A planet needs to be specified for pinecone count to be calculated"
        )
    }

    return Promise.resolve(Math.floor(Math.random() * 1000))
}

export type GptConcreteFunctionNames =
    | "getCountryPineconeCount"
    | "getPlanetPineconeCount"

export type GptConcreteFunctionTypes =
    | typeof getCountryPineconeCount
    | typeof getPlanetPineconeCount

export const gptConcreteFunctionsRecord: Record<
    GptConcreteFunctionNames,
    GptConcreteFunctionTypes
> = {
    getCountryPineconeCount: getCountryPineconeCount,
    getPlanetPineconeCount: getPlanetPineconeCount
}
