import tw from "@/utils/tw"
import { auth } from "auth"
import { ReactNode } from "react"
import authImage from "../../../public/images/auth-image.jpg"

export default async function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
    const session = await auth()
    const mainStyles = tw`relative h-screen w-screen bg-ebony-900 bg-opacity-60 bg-cover bg-center bg-no-repeat bg-blend-multiply`

    return (
        <main className={mainStyles} style={{ backgroundImage: `url(${authImage.src}` }}>
            {children}
        </main>
    )
}
