import type { Repository } from './repositories';

type NumericKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type RepositoryNumbers = keyof Pick<Repository, Exclude<NumericKeys<Repository>, undefined>>;

export default defineEventHandler(async (event) => {
	const { githubToken } = useRuntimeConfig(event);
	const repositories = await $fetch('/api/repositories');

	function findMost(key: RepositoryNumbers, invert = false): { name: string; value: number } {
		const [repo] = repositories.sort((a, b) => (invert ? a[key] - b[key] : b[key] - a[key]));
		return { name: `${repo.ownerName}/${repo.name}`, value: repo[key] };
	}

	async function getCountFromRestApi(type: 'commits' | 'contributors', repo: Repository) {
		const searchParams = new URLSearchParams({ per_page: '1', page: '1' });
		if (type === 'contributors') {
			searchParams.set('anon', '1');
		}
		const response = await fetch(
			`https://api.github.com/repos/${repo.ownerName}/${repo.name}/${type}?${searchParams.toString()}`,
			{
				headers: {
					Accept: 'application/vnd.github.v4.idl',
					Authorization: `Bearer ${githubToken}`,
				},
			},
		);
		const link = response.headers.get('Link');
		const value = parseInt(link?.match(/page=(\d+)(?:&anon=1)?>; rel="last"/)?.[1] ?? '0');
		return { name: `${repo.ownerName}/${repo.name}`, value };
	}

	async function findMostFromRestApi(type: 'commits' | 'contributors') {
		const reposWithCount = await Promise.all(
			repositories.map((repo) => getCountFromRestApi(type, repo)),
		);
		return reposWithCount.sort((a, b) => b.value - a.value)[0];
	}

	const mostForked = findMost('forkCount');
	const mostRecent = findMost('age', true);
	const oldest = findMost('age');

	const [mostCommits, mostContributors] = await Promise.all([
		findMostFromRestApi('commits'),
		findMostFromRestApi('contributors'),
	]);

	const [mostUsedLanguage] = repositories
		.reduce<{ name: string; value: number }[]>((previous, { language }) => {
			if (!language) return previous;
			const existing = previous.find((l) => l.name === language.name);
			if (existing) {
				existing.value++;
			} else {
				previous.push({ name: language.name, value: 1 });
			}
			return previous;
		}, [])
		.sort((a, b) => b.value - a.value);

	return { mostForked, mostRecent, oldest, mostCommits, mostContributors, mostUsedLanguage };
});
