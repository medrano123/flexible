"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    id: string;
    image: string;
    title: string;
    name: string;
    avatarUrl: string;
    userId: string;
};

const ProjectCard = ({ id, image, title, name, avatarUrl, userId }: Props) => {
    const [randomLikes, setRandomLikes] = useState(0);
    const [randomViews, setRandomViews] = useState('');
    useEffect(() => {
        setRandomLikes(Math.floor(Math.random() * 1000))
        setRandomViews(String((Math.floor(Math.random() * 10000) / 1000).toFixed(1) + 'k'))
    }, []);
    return (
        <div className="flex justify-center items-center flex-col rounded-lx drop-shadow-card">
            <Link
                href={`/project/${id}`}
                className="flex justify-center items-center group relative w-full h-full"
            >
                <Image
                    src={image}
                    width={414}
                    height={314}
                    className="w-full h-full object-cover rounded-2xl"
                    alt="project image"
                />
                <div className="hidden group-hover:flex justify-end items-end w-full h-1/3 bg-gradient-to-b from-transparent to-black/50 rounded-b-2xl gap-2 absolute bottom-0 right-0 font-semibold text-lg text-white p-4">
                    <p className="w-full">
                        {title}
                    </p>
                </div>
            </Link>
            <div className="flex justify-between items-center w-full px-2 mt-3 font-semibold text-sm">
                <Link href={`/profile/${userId}`}>
                    <div className="flex justify-center items-center gap-2">
                        <Image
                            src={avatarUrl}
                            width={24}
                            height={24}
                            className="rounded-full"
                            alt="profile image"
                        />
                        <p>
                            {name}
                        </p>
                    </div>               
                </Link>
                <div className="flex justify-center items-center gap-3">
                    <div className="flex justify-center items-center gap-2">
                        <Image src="/hearth.svg" width={13} height={12} alt="heart" />
                        <p className="text-sm">{randomLikes}</p>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <Image src="/eye.svg" width={12} height={9} alt="eye" />
                        <p className="text-sm">{randomViews}</p>
                    </div>
                </div>

            </div>
        </div>
    )
    }

export default ProjectCard