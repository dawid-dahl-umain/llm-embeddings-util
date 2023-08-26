import { removeElementsFromOffset } from "./utils"

describe("removeElementsFromOffset", () => {
    it("should remove elements from the middle of the array", () => {
        expect(removeElementsFromOffset([1, 2, 3, 4, 5], 2, 1)).toEqual([
            1, 4, 5
        ])
    })

    it("should return the same array if zero elements are to be removed", () => {
        expect(removeElementsFromOffset([1, 2, 3], 0, 1)).toEqual([1, 2, 3])
    })

    it("should remove elements from the beginning if startOffset is zero", () => {
        expect(removeElementsFromOffset([1, 2, 3], 1, 0)).toEqual([2, 3])
    })

    it("should return an empty array if the input array is empty", () => {
        expect(removeElementsFromOffset([], 2, 1)).toEqual([])
    })

    it("should return an array up to startOffset if elementsToRemove is greater than remaining elements", () => {
        expect(removeElementsFromOffset([1, 2, 3, 4, 5], 10, 1)).toEqual([1])
    })
})
