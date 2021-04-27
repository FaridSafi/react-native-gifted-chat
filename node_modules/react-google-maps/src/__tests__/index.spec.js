describe("react-google-maps module (index.js)", () => {
  const {
    __esModule,
    default: DefaultExport,
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Circle,
    Marker,
    Polyline,
    Polygon,
    Rectangle,
    InfoWindow,
    OverlayView,
    DirectionsRenderer,
    FusionTablesLayer,
    KmlLayer,
    TrafficLayer,
    BicyclingLayer,
    StreetViewPanorama,
  } = require("../")

  it("should be an ES module", () => {
    expect(__esModule).toBe(true)
  })

  it("should have no default exported", () => {
    expect(DefaultExport).toBeUndefined()
  })

  it("should have name exports for basic components", () => {
    expect(withScriptjs).toBeDefined()
    expect(withGoogleMap).toBeDefined()
    expect(GoogleMap).toBeDefined()
    expect(Circle).toBeDefined()
    expect(Marker).toBeDefined()
    expect(Polyline).toBeDefined()
    expect(Polygon).toBeDefined()
    expect(Rectangle).toBeDefined()
    expect(InfoWindow).toBeDefined()
    expect(OverlayView).toBeDefined()
    expect(DirectionsRenderer).toBeDefined()
    expect(FusionTablesLayer).toBeDefined()
    expect(KmlLayer).toBeDefined()
    expect(TrafficLayer).toBeDefined()
    expect(BicyclingLayer).toBeDefined()
    expect(StreetViewPanorama).toBeDefined()
  })
})
