export default function TermsLegacyRedirect() {
  return null;
}

export async function getServerSideProps({ locale }) {
  const destination = locale === 'en' ? '/en/terms-of-service' : '/terms-of-service';

  return {
    redirect: {
      destination,
      permanent: true,
    },
  };
}
