import Image from "next/image"
import { Fragment } from "react"
import { FaArrowUpShortWide, FaCloud, FaLock, FaPrint, FaServer, FaTooth } from "react-icons/fa6"
import featuresImage from "../../../public/images/features-image.jpg"

export default function FeatureSection() {
    const features = [
        {
            name: "Feature 1",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
            icon: FaCloud,
        },
        {
            name: "Feature 2",
            description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
            icon: FaLock,
        },
        {
            name: "Feature 3",
            description: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.",
            icon: FaArrowUpShortWide,
        },
        {
            name: "Feature 4",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
            icon: FaPrint,
        },
        {
            name: "Feature 5",
            description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
            icon: FaTooth,
        },
        {
            name: "Feature 6",
            description: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. ",
            icon: FaServer,
        },
    ]

    return (
        <Fragment>
            <div aria-hidden className="fixed inset-0 -z-10 h-full w-full">
                <div className="relative h-full w-full bg-white">
                    <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                </div>
            </div>
            <section id="features" className="container snap-start overflow-hidden py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl font-body sm:text-center">
                        <h2 className="font-heading text-base font-semibold leading-7 text-body-600">
                            What is available
                        </h2>
                        <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-body-950 sm:text-4xl">
                            Features that you will love
                        </p>
                        <p className="mt-6 text-lg leading-8 text-body-600">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis
                            suscipit eaque, iste dolor cupiditate blanditiis.
                        </p>
                    </div>
                </div>
                <div className="relative overflow-hidden pt-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <Image
                            src={featuresImage}
                            alt="App screenshot"
                            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-background-900/10"
                            width={2432}
                            height={1442}
                        />
                        <div className="relative" aria-hidden="true">
                            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
                    <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 font-body text-base leading-7 text-body-800 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
                        {features.map(feature => (
                            <div key={feature.name} className="relative pl-9">
                                <dt className="inline font-heading font-semibold text-body-950">
                                    <feature.icon
                                        className="absolute left-1 top-1 h-5 w-5 text-body-600"
                                        aria-hidden="true"
                                    />
                                    {feature.name}
                                </dt>{" "}
                                <dd className="inline">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>
        </Fragment>
    )
}
