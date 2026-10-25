import { notFound } from "next/navigation";
import { cache } from "react";
import { publicContent } from "@/lib/content/public";
import { pageMetadata } from "@/lib/seo";
import { getPublicText } from "@/i18n/text-server";
import { Link } from "@/i18n/navigation";
import { ProjectHero, ProjectStats, ProjectTechnologies, ProjectFeatures, ProjectChallenges, ProjectCTA, ProjectFullDescription } from "@/components/project";
type Props = { params: Promise<{locale: string; projectId: string}> };
const getProject = cache(async (id: string) => /^[a-f0-9]{24}$/i.test(id) ? publicContent("projects/" + id) : null);
export async function generateMetadata({params}: Props) {
 const {locale, projectId} = await params;
 const project = await getProject(projectId);
 if (!project) notFound();
 return pageMetadata(locale, "projects/" + projectId, project.title, project.shortDescription);
}
export default async function ProjectPage({params}: Props) {
 const {projectId} = await params;
 const project = await getProject(projectId);
 if (!project) notFound();
 const t = await getPublicText();
 return <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
  <div className="max-w-7xl mx-auto px-5 md:px-10 md:py-30 lg:px-20 py-20 pt-25">
   <Link href="/projects" className="inline-flex mb-8 font-medium text-purple-600 dark:text-purple-400">{t("Back to Projects")}</Link>
   <ProjectHero project={project} overview={project.shortDescription} />
   <ProjectStats stats={{duration: project.duration || t("N/A"), team: t(project.teamType === "solo" ? "Solo Project" : "Team Project"), status: t(project.status || "N/A")}} />
   <ProjectTechnologies technologies={project.technologies || []} />
   <ProjectFullDescription description={project.description} />
   <ProjectFeatures features={project.features || []} />
   <ProjectChallenges challenges={(project.challenges || []).map((item: {challenge: string; solution: string}) => ({title: item.challenge, description: item.solution}))} />
   <ProjectCTA project={project} />
  </div>
 </div>;
}
