import LinkButton from "@/components/general/link-button"

export default function FaqSection() {
    const faqs = [
        {
            question: "Question 1",
            answer:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute" +
                " id magna. Anim aute id magna aliqua ad ad non deserunt sunt.",
        },
        // More questions...
    ]

    return (
        <section id="faq" className="container snap-start bg-white">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <h2 className="font-heading text-2xl font-bold leading-10 tracking-tight text-body-900">
                            Frequently asked questions
                        </h2>
                        <p className="mt-4 font-body text-base leading-7 text-body-600">
                            Can’t find the answer you’re looking for? Reach out to our{" "}
                            <LinkButton
                                href="#"
                                className="font-semibold text-body-600 hover:text-body-500 active:text-body-400">
                                customer support
                            </LinkButton>{" "}
                            team.
                        </p>
                    </div>
                    <div className="mt-10 lg:col-span-7 lg:mt-0">
                        <dl className="space-y-10">
                            {faqs.map(faq => (
                                <div key={faq.question}>
                                    <dt className="font-heading text-base font-semibold leading-7 text-body-950">
                                        {faq.question}
                                    </dt>
                                    <dd className="mt-2 font-body text-base leading-7 text-body-400">{faq.answer}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    )
}
