import Footer from "@/components/home/footer"
import Header from "@/components/home/header"
import HeroSection from "@/components/home/hero-section"
import { Fragment } from "react"

export default function Home() {
    return (
        <Fragment>
            <Header />
            <main className="snap-y scroll-smooth">
                <HeroSection />
                <section id="about" className="container snap-start"></section>
                <section id="features" className="container snap-start"></section>
                <section id="contact" className="container snap-start"></section>
            </main>
            <Footer />
        </Fragment>
    )
}
