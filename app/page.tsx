import { ProjectCard } from "@/components";
import { ProjectInterface } from "@/common.types";
import { fetchAllProjects } from "@/lib/actions";
import { Categories, LoadMore } from "@/components"

type SearchParams = {
	category?: string;
	endcursor?: string;
}

type Props = {
	searchParams: SearchParams
}

type ProjectSearch = {
    projectSearch: {
		edges: { node: ProjectInterface }[];
		pageInfo: {
			hasPreviousPage: boolean;
			hasNextPage: boolean;
			startCursor: string;
			endCursor: string;
		};
    },
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({ searchParams: { category, endcursor } }: Props) => {
	const data = await fetchAllProjects(category, endcursor) as ProjectSearch
  
    const projectsToDisplay = data?.projectSearch?.edges || [];

    if (projectsToDisplay.length === 0) {
        return (
          <section className="flex items-center justify-start flex-col paddings">
            <Categories />
    
            <p className="w-full my-10 px-2 text-center">No projects found, go create some first.</p>
          </section>
        )
    }

	const pagination = data?.projectSearch?.pageInfo;
    return (
        <section className="flex-start flex-col paddings mb-16">
            <Categories />
            <section className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 mt-10 w-full">
                {projectsToDisplay.map(({ node }: { node: ProjectInterface }) =>(
                    <ProjectCard
                        key={node?.id}
                        id={node?.id}
                        image={node?.image}
                        title={node?.title}
                        name={node?.createdBy.name}
                        avatarUrl={node?.createdBy.avatarUrl}
                        userId={node?.createdBy.id}
                    />
                ))}
            </section>
            <LoadMore 
				startCursor={pagination.startCursor} 
				endCursor={pagination.endCursor} 
				hasPreviousPage={pagination.hasPreviousPage} 
				hasNextPage={pagination.hasNextPage}
			/>
        </section>
    )
}

export default Home; 