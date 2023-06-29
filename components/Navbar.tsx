import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

import { NavLinks } from "@/constants"
import { AuthProviders } from "."
import { getCurrentUser } from "@/lib/session";
import { ProfileMenu, Button} from ".";

const Navbar = async () => {
	const session = await getCurrentUser();
	// console.log(session )

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
				{session?.user ? (
					<>
						{/* {session?.user?.image && (
							<Link
								href={`/profile/${session?.user?.id}`}
							>
								<Image
									src={session.user.image}
									width={40}
									height={40}
									className="rounded-full"
									alt={session.user.name}
								/>
							</Link>
						)} */}
						<ProfileMenu session={session} />
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