import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestSignIn, requestSignOut, requestSignUp } from "../requests/auth.request";
import { IPayloadSignIn } from "@/interfaces/auth.interface";
import { saveUserToFirestore } from "../requests/user.request";
import { toast } from "react-toastify";




export const useSignIn = () => {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (payload: IPayloadSignIn) =>
                requestSignIn(payload),
            onSuccess: (user) => {
                console.log('User signed in:', user);
                // Update user cache
                queryClient.setQueryData(['user'], user);
                toast.success('Signed in successfully');
            },
            onError: (error) => {
                console.error('Error signing in:', error.message);
            },
        });
};

export const useSignUp = () => {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: (payload: IPayloadSignIn) =>
                requestSignUp(payload),
            onSuccess: async (user) => {
                await saveUserToFirestore({
                    uid: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    totalPoints: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                // Update user cache
                queryClient.setQueryData(['user'], user);
                toast.success('Signed up successfully');
            },
            onError: (error) => {
                console.error('Error signing up:', error.message);
            },
        });
}

export const useSignOut = () => {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: () => requestSignOut(),
            onSuccess: () => {
                toast.success('Signed out successfully');
                console.log('User signed out');
                // Remove user cache
                queryClient.setQueryData(['user'], null);
            },
            onError: (error) => {
                toast.error('Error signing out');
                console.error('Error signing out:', error.message);
            },
        });
}