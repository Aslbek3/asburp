import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectCardGrid } from "@/components/projects/ProjectCardGrid";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-[14px]">
      <ProjectFilters />
      <ProjectCardGrid />
    </div>
  );
}
