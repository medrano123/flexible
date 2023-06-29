import { GraphQLClient } from "graphql-request";

import { createProjectMutation, createUserMutation, deleteProjectMutation, updateProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery } from "@/graphql";
import { ProjectForm } from "@/common.types";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';


//connection to our graphbase database
const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables);
    } catch (err) {
        throw err;
    }
  };
export const getUser = ( email : string ) => {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getUserQuery, { email } ) 
}

// export const createUser = ( name: string, email: string, avatarUrl: string ) => {
//     client.setHeader("x-api-key", apiKey);
//     const variables = {
//         input: {
//             name, email, avatarUrl 
//         }
//     }
//     return makeGraphQLRequest(createUserMutation, variables) 
// }

export const createUser = (name: string, email: string, avatarUrl: string) => {
    client.setHeader("x-api-key", apiKey);
  
    const variables = {
      input: {
        name: name,
        email: email,
        avatarUrl: avatarUrl
      },
    };
    
    return makeGraphQLRequest(createUserMutation, variables);
  };
export const uploadImage = async (imagePath: string ) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: "POST",
            body: JSON.stringify({path: imagePath,}),
        });
        return response.json();
    } catch (err) {
        throw err;
    }
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
    const imageUrl = await uploadImage(form.image);
  
    if (imageUrl.url) {
        client.setHeader("Authorization", `Bearer ${token}`);
    
        const variables = {
            input: { 
            ...form, 
            image: imageUrl.url, 
            createdBy: { 
                link: creatorId
            }
            }
        };
        console.log(variables)
        return makeGraphQLRequest(createProjectMutation, variables);
    }
};

export const fetchAllProjects = async (category?: string, endCursor?: string) => {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(projectsQuery, { category, endCursor });

}
  
export const fetchToken = async () => {
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`);
        return response.json();
    } catch (err) {
        throw err;
    }
};