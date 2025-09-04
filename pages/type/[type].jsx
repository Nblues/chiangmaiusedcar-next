export default function TypePage({ type }) {
	return (
		<main style={{ padding: 24 }}>
			<h1 className="font-prompt" style={{ fontWeight: 700, fontSize: 24 }}>ประเภท: {type}</h1>
			<p style={{ marginTop: 8, color: '#666' }}>หน้านี้อยู่ระหว่างพัฒนา</p>
		</main>
	);
}

export async function getStaticPaths() {
	return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
	return {
		props: {
			type: params?.type || '',
		},
		revalidate: 60,
	};
}
