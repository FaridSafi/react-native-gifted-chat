// TypeScript Version: 2.3

export interface InfoBoxOptions {
    alignBottom?: boolean
    boxClass?: string
    boxStyle?: object
    closeBoxMargin?: string
    closeBoxURL?: string
    content?: string | Node
    disableAutoPan?: boolean
    enableEventPropagation?: boolean
    infoBoxClearance?: google.maps.Size
    isHidden?: boolean
    maxWidth?: number
    pixelOffset?: google.maps.Size
    position?: google.maps.LatLng
    pane?: string
    visible?: boolean
    zIndex?: number
}

export default class InfoBox {
    constructor(options?: InfoBoxOptions)

    addClickHandler_(): void

    close(): void

    createInfoBoxDiv_(): void

    draw(): void

    getBoxWidths_(): { bottom: number; left: number; right: number; top: number; }

    getCloseBoxImg_(): string

    getCloseClickHandler_(): (e: MouseEvent) => void

    getContent(): string | Node

    getPosition(): google.maps.LatLng

    getVisible(): boolean

    getZIndex(): number

    hide(): void

    onRemove(): void

    open(map: google.maps.Map | google.maps.StreetViewPanorama, anchor: google.maps.MVCObject): void

    panBox_(disablePan: boolean): void

    setBoxStyle_(): void

    setContent(content: string | Node): void

    setOptions(options?: InfoBoxOptions): void

    setPosition(latLng: google.maps.LatLng): void

    setVisible(isVisible: boolean): void

    setZIndex(index: number): void

    show(): void
}
