import LinkButton from "@/components/general/link-button"
import SignUpForm from "@/components/sign/sign-up-form"

export default function SignUpPage() {
    return (
        <main className="relative flex min-h-full flex-1 flex-col justify-center px-6 py-12 font-body lg:px-8">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_110%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#c0b0e8,transparent)]"></div>
            </div>
            <div className="relative sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="mx-auto w-max select-none bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-background-800 via-background-500 to-background-400 bg-clip-text font-heading text-3xl font-bold leading-none tracking-wider text-transparent transition-colors duration-200 ease-in-out">
                    TASkR
                </h1>
                <h2 className="mt-10 text-center font-heading text-2xl font-bold leading-9 tracking-tight text-body-950">
                    Create a new account
                </h2>
                <h3 className="text-center font-heading font-semibold leading-9 tracking-tight text-body-950">
                    Or{" "}
                    <LinkButton
                        href="/sign/in"
                        className="text-center tracking-normal text-body-400 hover:text-body-500 active:text-body-400">
                        sign in to your account
                    </LinkButton>
                </h3>
            </div>

            <div className="relative mt-8 rounded-lg border border-background-50/30 bg-white bg-opacity-10 bg-clip-padding p-6 shadow-derek backdrop-blur-3xl backdrop-contrast-100 backdrop-saturate-100 backdrop-filter sm:mx-auto sm:w-full sm:max-w-sm">
                <SignUpForm />
            </div>
        </main>
    )
}
