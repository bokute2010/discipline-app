import { auth } from "@/config/firebase";
import { IPayloadSignIn, IPayloadSignUp } from "@/interfaces/auth.interface";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "@firebase/auth";



export const requestSignIn = async ({ email, password }: IPayloadSignIn) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const requestSignUp = async ({ email, password }: IPayloadSignUp) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
};

export const requestSignOut = async () => {
    return auth.signOut();
};