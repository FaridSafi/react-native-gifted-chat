describe("addons/MarkerClusterer module", () => {
  const {
    __esModule,
    default: DefaultExport,
    MarkerClusterer: NamedExport,
  } = require("../MarkerClusterer")

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
