import Link from "next/link";
import Image from "next/image";

import { NavLinks } from "@/constants"
import {AuthProviders} from "./"

const Navbar = () => {
	const session = {

	}
	 
	return (
		<nav className='flex justify-between items-center py-5 px-8 border-b border-nav-border gap-4'>
			<div className='flex-1 flex items-center justify-start gap-10 '>
				<Link href="/">
					<Image  
						src="logo.svg"
						width={115}
						height={43}
						alt="flexible"
					/>

				</Link>
				<ul className="xl:flex hidden text-sm gap-7">
					{NavLinks.map((link, index) =>(
						<Link
							href={link.href}
							key={link.key}
 						>
							{link.text}
						</Link>
					))}
				</ul>
			</div>
			<div className="flex justify-center items-center gap-4">
				{session ? (
					<>
						User Photo
						<Link
							href="/create-project"
						>
							Share work
						</Link>

					</>
				) : (
					<AuthProviders />
				) }
			</div>
		</nav>
	)
}

export default Navbar