<template>
	<Html lang="en">
		<Head>
			<Title>GitHundred • Top 100 starred GitHub repositories</Title>
			<Meta
				name="description"
				content="Explore the world's top 100 most starred GitHub repositories, from frameworks to languages to learning resources, with a highlight section."
			/>
		</Head>
		<NuxtLoadingIndicator color="oklch(77.7% 0.152 181.912)" :height="4" :duration="4000" />
		<Layout>
			<NuxtPage />
		</Layout>
	</Html>
</template>
