type Repository = {
	name: string;
	ownerName: string;
	image: string;
	description: string;
	starsNumber: number;
	url: string;
	age: number;
	language?: { name: string; color: string };
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
                  stargazers {
                    totalCount
                  }
                  owner {
                    login
                    avatarUrl
                  }
                  languages(first: 1) {
                    nodes {
                      name
                      color
                    }
                  }
                }
              }
            }
          }
        }
      `,
		}),
	});
	const { data } = await response.json();

	const today = new Date();

	const result: Repository[] = data.search.edges.map(({ node }: any) => ({
		name: node.name,
		ownerName: node.owner.login,
		image: node.owner.avatarUrl,
		description: node.description,
		starsNumber: node.stargazers.totalCount,
		url: node.url,
		age: today.getTime() - new Date(node.createdAt).getTime(),
		language: node.languages.nodes[0],
	}));
	return result;
});
