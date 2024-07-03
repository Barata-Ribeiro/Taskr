import AboutSection from "@/components/home/about-section"
import FeatureSection from "@/components/home/feature-section"
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
                <AboutSection />
                <FeatureSection />
                <section id="contact" className="container snap-start"></section>
            </main>
            <Footer />
        </Fragment>
    )
}
