import { PropsWithChildren } from "react"
import Navbar from "../components/Navbar/Navbar"
// import Footer from "src/components/Footer/Footer"

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Navbar />
            {children}
            {/* <Footer /> */}
        </>
    )
}

export default Layout
