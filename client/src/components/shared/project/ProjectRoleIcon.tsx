import { ProjectRole } from "@/@types/project"
import { CrownIcon, UsersIcon } from "lucide-react"
import { JSX } from "react"

interface ProjectRoleIconProps {
    role: ProjectRole
}

export default function ProjectRoleIcon({ role }: Readonly<ProjectRoleIconProps>) {
    const roleIcons: Record<ProjectRole, JSX.Element> = {
        OWNER: <CrownIcon aria-hidden size={16} className="text-yellow-600" />,
        MEMBER: <UsersIcon aria-hidden size={16} className="text-blue-600" />,
    }

    return roleIcons[role]
}
