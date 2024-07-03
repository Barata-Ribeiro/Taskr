import Image from "next/image"
import { FaArrowUpShortWide, FaLock, FaServer } from "react-icons/fa6"
import featuresImage from "../../../public/images/features-image.jpg"

export default function FeatureSection() {
    const features = [
        {
            name: "Feature 1. ",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
            icon: FaArrowUpShortWide,
        },
        {
            name: "Feature 2. ",
            description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
            icon: FaLock,
        },
        {
            name: "Feature 3. ",
            description: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
            icon: FaServer,
        },
    ]

    return (
        <section id="features" className="container snap-start overflow-hidden bg-white py-24 sm:py-32">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pr-8 lg:pt-4">
                    <div className="font-body lg:max-w-lg">
                        <h2 className="font-heading text-base font-semibold leading-7 text-indigo-600">Title 1</h2>
                        <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Title 2
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis
                            suscipit eaque, iste dolor cupiditate blanditiis ratione.
                        </p>
                        <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                            {features.map(feature => (
                                <div key={feature.name} className="relative pl-9">
                                    <dt className="inline font-heading font-semibold text-gray-900">
                                        <feature.icon
                                            className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                                            aria-hidden="true"
                                        />
                                        {feature.name}
                                    </dt>
                                    <dd className="inline">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
                <Image
                    src={featuresImage}
                    alt="Product screenshot"
                    className="w-[48rem] max-w-none rounded-xl shadow-nextJS ring-1 ring-background-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                    width={2432}
                    height={1442}
                />
            </div>
        </section>
    )
}
