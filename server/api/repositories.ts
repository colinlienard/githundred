import { emojify } from 'node-emoji';

function getDisplayName(name: string) {
	const camelPascalSplit = name.replace(/([a-z])([A-Z])/g, '$1 $2');
	const intermediate = camelPascalSplit.replace(/[_-]/g, ' ');
	const words = intermediate.split(' ');
	const capitalizedWords = words.map(
		(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
	);
	return capitalizedWords.join(' ');
}

export type Repository = {
	rank: number;
	name: string;
	displayName: string;
	ownerName: string;
	image: string;
	description?: string;
	stargazerCount: number;
	url: string;
	age: number;
	language?: { name: string; color: string };
	forkCount: number;
};

export default defineEventHandler(async (event) => {
	const { githubToken } = useRuntimeConfig(event);

	const response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			Accept: 'application/vnd.github.v4.idl',
			Authorization: `Bearer ${githubToken}`,
		},
		body: JSON.stringify({
			query: `
        query {
          search(query: "stars:>10000 sort:stars", type: REPOSITORY, first: 100) {
            edges {
              node {
                ... on Repository {
                  name
                  description
                  createdAt
                  url
                  stargazerCount
                  owner {
                    login
                    avatarUrl
                  }
                  languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
                    nodes {
                      name
                      color
                    }
                  }
                  forkCount
                }
              }
            }
          }
        }
      `,
		}),
	});
	const { data } = await response.json();

	const result: Repository[] = data.search.edges.map(({ node }: any, index: number) => ({
		rank: index + 1,
		name: node.name,
		displayName: getDisplayName(node.name),
		ownerName: node.owner.login,
		image: node.owner.avatarUrl,
		description: node.description ? emojify(node.description) : undefined,
		stargazerCount: node.stargazerCount,
		url: node.url,
		age: Date.now() - new Date(node.createdAt).getTime(),
		language: node.languages.nodes[0],
		forkCount: node.forkCount,
	}));
	return result;
});
