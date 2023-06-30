"use client"

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation';


import { FormState, ProjectInterface, SessionInterface } from '@/common.types';
import { FormField, CustomMenu, Button } from './'
import { updateProject, createNewProject, fetchToken } from '@/lib/actions';

import { categoryFilters } from '@/constants';


type Props = {
    type: string,
    session: SessionInterface,
    project?: ProjectInterface 
}


const ProjectForm = ({ type, session, project }: Props) => {
    const router = useRouter()
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [form, setForm] = useState<FormState>({
        title: project?.title || "",
        description: project?.description || "",
        image: project?.image || "",
        liveSiteUrl: project?.liveSiteUrl || "",
        githubUrl: project?.githubUrl || "",
        category: project?.category || ""
    })

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setSubmitting(true)
        console.log(session)
        const { token } = await fetchToken()

        try {
            if (type === "create") {
                await createNewProject(form, session?.user?.id, token)

                router.push("/")
            }
            
            if (type === "edit") {
                await updateProject(form, project?.id as string, token)

                router.push("/")
            }

        } catch (error) {
            alert(`Failed to ${type === "create" ? "create" : "edit"} a project. Try again!`);
        } finally {
            setSubmitting(false)
        }
    }
    
    const handleChangeImage = (e: ChangeEvent  <HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0]

        if(!file) return
        if(!file.type.includes('image')){
            return alert('Please upload an image file')
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
            const result = reader.result as string;

            handleStateChange("image", result)
        }
     }

    const handleStateChange = (fieldName: keyof FormState, value: string) => {
        setForm((prevForm) => ({ ...prevForm, [fieldName]: value }));
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className="flex items-center justify-start flex-col w-full lg:pt-24 pt-12 gap-10 text-lg max-w-5xl mx-auto;"
        >  
            <div className='flex items-center justify-start w-full lg:min-h-[400px] min-h-[200px] relative'>
                <label htmlFor='poster' className='flex justify-center items-center z-10 text-center w-full h-full p-20 text-gray-100 border-2 border-gray-50 border-dashed'>
                    {!form.image && 'Choose a poster for your project'}
                </label>
                <input 
                    id="image"
                    type='file'
                    accept="image/*"
                    required={type === 'create'}
                    className='absolute z-30 w-full opacity-0 h-full cursor-pointer'
                    onChange={handleChangeImage}
                />
                {form?.image && (
                     <Image 
                        src={form?.image}
                        className="sm:p-10 object-contain z-20"
                        alt="image"
                        fill                        
                    />
                )}
            </div>
            
            <FormField
                title="Title"
                state={form.title}
                placeholder="Flexibble"
                setState={(value) => handleStateChange('title', value)}
            />

            <FormField
                title='Description'
                state={form.description}
                placeholder="Showcase and discover remarkable developer projects."
                isTextArea
                setState={(value) => handleStateChange('description', value)}
            />

            <FormField 
                type="url"
                title="Website URL"
                state={form.liveSiteUrl}
                placeholder="https://jsmastery.pro"
                setState={(value) => handleStateChange('liveSiteUrl', value)}
            />

            <FormField
                type="url"
                title="GitHub URL"
                state={form.githubUrl}
                placeholder="https://github.com/adrianhajdin"
                setState={(value) => handleStateChange('githubUrl', value)}
            />
            <CustomMenu
                title="Category"
                state={form.category}
                filters={categoryFilters}
                setState={(value) => handleStateChange('category', value)}
            />
            <div className='flexStart w-full'>
                <Button
                    title={submitting ? `${type === "create" ? "Creating" : "Editing"}` : `${type === "create" ? "Create" : "Edit"}`}
                    // title="Create"
                    type="submit"
                    leftIcon={submitting ? "" : "/plus.svg"}
                    submitting={submitting}
                />
            </div>
        </form>
    )
}

export default ProjectForm