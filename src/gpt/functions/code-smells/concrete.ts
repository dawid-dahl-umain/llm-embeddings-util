import * as colors from "colors"
import { CodeSmell } from "src/types"

export const getCodeSmells = ({
    smells
}: {
    smells: CodeSmell[]
}): CodeSmell[] => {
    if (!smells) {
        throw new Error("Something went wrong while processing the code smells")
    }

    console.log(
        colors.magenta(
            colors.italic(`[getCodeSmells][smells] Parameter -> ${smells}`)
        )
    )

    return smells
}

export type GptConcreteCodeSmellFunctionNames = "getCodeSmells"

export type GptConcreteCodeSmellFunctionTypes = typeof getCodeSmells

export const gptConcreteCodeSmellFunctionsRecord: Record<
    GptConcreteCodeSmellFunctionNames,
    GptConcreteCodeSmellFunctionTypes
> = {
    getCodeSmells: getCodeSmells
}
