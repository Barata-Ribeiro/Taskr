import Image from "next/image"
import Link from "next/link"
import newOrgImage from "../../../public/images/new-org-image.jpg"

function ImageOverlay() {
    return (
        <svg
            viewBox="0 0 926 676"
            aria-hidden="true"
            className="absolute -bottom-24 left-24 w-[57.875rem] transform-gpu blur-[118px]">
            <path
                d="m254.325 516.708-90.89 158.331L0 436.427l254.325 80.281 163.691-285.15c1.048 131.759 36.144 345.144 168.149 144.613C751.171 125.508 707.17-93.823 826.603 41.15c95.546 107.978 104.766 294.048 97.432 373.585L685.481 297.694l16.974 360.474-448.13-141.46Z"
                fill="url(#60c3c621-93e0-4a09-a0e6-4c228a0116d8)"
                fillOpacity=".4"
            />
            <defs>
                <linearGradient
                    id="60c3c621-93e0-4a09-a0e6-4c228a0116d8"
                    x1="926.392"
                    x2="-109.635"
                    y1=".176"
                    y2="321.024"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#776FFF" />
                    <stop offset={1} stopColor="#FF4694" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default function NewOrganizationCTA() {
    return (
        <section
            id="organization-new-cta"
            aria-labelledby="organization-new-cta-title"
            className="relative rounded-lg bg-gray-900 shadow-derek">
            <div className="relative h-80 overflow-hidden bg-ebony-300 max-md:rounded-t-md md:absolute md:left-0 md:h-full md:w-1/3 md:rounded-bl-md md:rounded-tl-md lg:w-1/2">
                <Image
                    alt="Brown wooden rectangular table with lot of chair inside building photo. Photo by Benjamin Child on Unsplash."
                    src={newOrgImage}
                    placeholder="blur"
                    className="h-full w-full object-cover mix-blend-multiply"
                    sizes="(min-width: 808px) 50vw, 100vw"
                    priority
                    quality={60}
                />
                <ImageOverlay />
            </div>
            <div className="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40">
                <div className="pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
                    <h2
                        id="organization-new-cta-title"
                        className="text-base font-semibold leading-7 text-english-holly-400">
                        Get Started Today
                    </h2>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Manage Projects Easily
                    </p>
                    <p className="mt-6 text-base leading-7 text-gray-300">
                        Elevate your organization&apos;s productivity by registering with our platform. Collaborate
                        seamlessly with your team and keep all your projects organized in one place. Our intuitive tools
                        make it simple to assign tasks, track progress, and meet deadlines efficiently. Experience the
                        benefits of streamlined project management tailored to your needs. Start today and transform the
                        way you manage projects.
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/dashboard/organizations/new"
                            className="inline-flex rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-white/30">
                            Register Your Organization
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
