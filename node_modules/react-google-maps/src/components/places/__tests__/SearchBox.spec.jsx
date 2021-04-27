describe("addons/SearchBox module", () => {
  const {
    __esModule,
    default: DefaultExport,
    SearchBox: NamedExport,
  } = require("../SearchBox")

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
