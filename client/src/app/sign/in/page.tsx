import LinkButton from "@/components/general/link-button"
import SignInForm from "@/components/sign/sign-in-form"

export default function SignInpage() {
    return (
        <main className="relative flex min-h-full flex-1 flex-col justify-center bg-neutral-900 px-6 py-12 font-body lg:px-8">
            <div className="absolute inset-0 -z-0 bg-background-400 bg-[size:20px_20px] opacity-20 blur-[100px]"></div>

            <div className="relative sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center font-heading text-2xl font-bold leading-9 tracking-tight text-body-50">
                    Sign in to your account
                </h2>
                <h3 className="text-center font-heading font-semibold leading-9 tracking-tight text-body-50">
                    Or{" "}
                    <LinkButton
                        href="/sign/up"
                        className="text-center tracking-normal text-body-200 hover:text-body-300 active:text-body-400">
                        create a new account
                    </LinkButton>
                </h3>
            </div>

            <div className="relative mt-8 rounded-lg border border-background-50/30 bg-white bg-opacity-10 bg-clip-padding p-6 shadow-nextJS backdrop-blur-3xl backdrop-contrast-100 backdrop-saturate-100 backdrop-filter sm:mx-auto sm:w-full sm:max-w-sm">
                <SignInForm />
            </div>
        </main>
    )
}
