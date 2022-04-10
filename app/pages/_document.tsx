// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Zilla+Slab&family=Dosis:wght@300&display=swap"
						rel="stylesheet"
					/>
					<meta name="application-name" content="ComputerStacks" />
					<meta name="author" content="Poly-Pixel" />
					<meta
						name="description"
						content="A digital collection of computer-related resources and support"
					/>
					<meta
						name="keywords"
						content="computers,programming,learn,resources"
					/>
					<meta name="theme-color" content="#23272a" />
					<meta name="color-schema" content="dark light" />
					<meta name="robots" content="index,follow" />
					<meta
						name="google-site-verification"
						content="SzBZ_W2YLnR5bFcSt2D8GQkEAq_7-lwhNM4ObEmuyGc"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
