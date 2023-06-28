import './globals.css';

import { Navbar, Footer } from './components';

export const metadata = {
	title: 'Flexible',
	description: 'Showcase and Discover remarkable developer projects',
}

export default function RootLayout({
  	children,
}: {
  	children: React.ReactNode
}) {
	return (
		<html lang="en">
		<body>
			<Navbar />
			<main>
				{children}
			</main>
			<Footer />	
		</body>
		</html>
  )
}
