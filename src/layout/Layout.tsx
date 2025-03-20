import { PropsWithChildren } from "react"
import Navbar from "../components/Navbar/Navbar"

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default Layout
