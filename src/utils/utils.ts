import { Logger } from "@nestjs/common"

export const getCountryPineconeCount = async (
    country: "string"
): Promise<number> => {
    if (!country) {
        throw new Error(
            "A country needs to be specified for pinecone count to be calculated"
        )
    }

    return Promise.resolve(Math.floor(Math.random() * 10))
}
