import { PopoverOrigin, PopoverVirtualElement } from "@mui/material"
import { ReactNode } from "react"

export interface ToggleProps {
    open: boolean
    disabledMenuItem?: boolean
    disabledMenuItemHouver?: boolean
    handleClose: () => void
    anchorEl:
        | Element
        | (() => Element)
        | PopoverVirtualElement
        | (() => PopoverVirtualElement)
        | null
        | undefined
    header: ReactNode
    children: ReactNode
    handleActionClick?: () => void
    anchorOrigin?: PopoverOrigin
    transformOrigin?: PopoverOrigin
    margin?: string
}
