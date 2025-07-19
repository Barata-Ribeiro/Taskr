import { ProjectRole } from "@/@types/project"
import ProjectRoleIcon from "@/components/shared/project/ProjectRoleIcon"

interface ProjectRoleBadgeProps {
    role: ProjectRole
}

export default function ProjectRoleBadge({ role }: Readonly<ProjectRoleBadgeProps>) {
    return (
        <div
            className="inline-flex items-center gap-x-2 select-none"
            role="group"
            aria-label={`Project role: ${role.toLowerCase()}`}>
            <ProjectRoleIcon role={role} aria-hidden="true" />
            <span className="capitalize">{role.toLowerCase()}</span>
        </div>
    )
}
