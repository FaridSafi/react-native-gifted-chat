describe("drawing/DrawingManager module", () => {
  const {
    __esModule,
    default: DefaultExport,
    DrawingManager: NamedExport,
  } = require("../DrawingManager")

  it("should be an ES module", () => {
    expect(__esModule).toBe(true)
  })

  it("should be default exported", () => {
    expect(DefaultExport).toBeDefined()
  })

  it("should be named exported", () => {
    expect(NamedExport).toBeDefined()
  })
})
