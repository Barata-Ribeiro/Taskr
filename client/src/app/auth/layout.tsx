import tw from "@/utils/tw"
import { ReactNode } from "react"
import authImage from "../../../public/images/auth-image.jpg"

export default async function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
    const mainStyles = tw`relative min-h-screen w-auto bg-ebony-900 bg-opacity-60 bg-cover bg-fixed bg-center bg-no-repeat bg-blend-multiply`

    return (
        <main className={mainStyles} style={{ backgroundImage: `url(${authImage.src}` }}>
            {children}
        </main>
    )
}
