import Footer from "@/components/home/footer"
import Header from "@/components/home/header"
import { Fragment } from "react"

export default function Home() {
    return (
        <Fragment>
            <Header />
            <main className="container h-screen">
                <h1>Welcome to Test!</h1>
            </main>
            <Footer />
        </Fragment>
    )
}
