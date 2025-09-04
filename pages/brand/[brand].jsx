export default function BrandPage({ brand }) {
	return (
		<main style={{ padding: 24 }}>
			<h1 className="font-prompt" style={{ fontWeight: 700, fontSize: 24 }}>แบรนด์: {brand}</h1>
			<p style={{ marginTop: 8, color: '#666' }}>หน้านี้อยู่ระหว่างพัฒนา</p>
		</main>
	);
}

export async function getStaticPaths() {
	// ไม่สร้างล่วงหน้า ปล่อยให้สร้างแบบ on-demand หากใช้ SSR; หากทำ static export ต้องระบุ paths จริง
	return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
	return {
		props: {
			brand: params?.brand || '',
		},
		revalidate: 60,
	};
}
