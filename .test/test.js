const assert = require("assert")

describe("BasicTest", () => {
    describe("Multiply", () => {
        it("should be 15 when 3 x 5", () => {
            const result = 5 * 3
            assert.equal(result, 15)
        })
    })

    describe("Divide", () => {
        it("should not be 3 when 15 : 5", () => {
            const value = 3
            const result = 15 / 5
            assert.notEqual(result, value)
        })
    })
})
