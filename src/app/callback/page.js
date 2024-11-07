"use client";

import { Fragment, useEffect } from 'react';
import { magic } from '../../../magic'; // Assurez-vous que magic est bien importé
import { useRouter } from 'next/navigation';
import { urlconstant } from "@/app/constants";

// Fonction pour vérifier si l'email existe dans votre base de données
async function emailexist(email) {
    const response = await fetch(`${urlconstant}/api/userexist?email=${email}`);
    const data = await response.json();
    return data;
}

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        const loginUser = async () => {
            try {
                // Vérification si l'instance magic existe
                if (magic && magic.auth) {
                    const didToken = await magic.auth.loginWithCredential();
                    console.log("didToken1")
                    const userMetadata = await magic.user.getMetadata();
                    const emailuser = userMetadata.email;
                    console.log("Utilisateur avec email :", emailuser);

                    // Vérifier si l'email existe dans la base de données
                    const data = await emailexist(emailuser);
                    if (data?.data?.user?.active === 1) {

                        try {
                         //   const didToken = await magic.auth.loginWithCredential();
                            console.log("DID Token reçu :", didToken);

                            // Si le token a été correctement généré
                            if (didToken) {
                                const res = await fetch(`${urlconstant}/api/login`, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${didToken}`
                                    },
                                });

                                console.log("Réponse du serveur :", res.status);

                                if (res.status === 200) {
                                    let href;
                                    // Définir la route en fonction du type d'utilisateur
                                    if (data.data.user.typeusers_id == 2) {
                                        href = `/panel/societegestionpanel/pagehome?id=${data.data.user.denomination}`;
                                        localStorage.setItem('isLoggedIn', 'true');
                                        localStorage.setItem('userId', data.data.user.denomination);
                                    } else if (data.data.user.typeusers_id == 1) {
                                        href = `/panel/portefeuille/home?id=${data.data.user.id}`;
                                        localStorage.setItem('isLoggedIn', 'true');
                                        localStorage.setItem('userId', data.data.user.id);
                                    } else if (data.data.user.typeusers_id == 5) {
                                        href = `/payspanel/pagehome?id=${data.data.user.pays}`;
                                        localStorage.setItem('isLoggedIn', 'true');
                                        localStorage.setItem('userId', data.data.user.id);
                                    } else if (data.data.user.typeusers_id == 0) {
                                        href = `/panel/admin/home?id=${data.data.user.id}`;
                                        localStorage.setItem('isLoggedIn', 'true');
                                        localStorage.setItem('userId', data.data.user.id);
                                    }
                                    // Rediriger l'utilisateur vers la page appropriée
                                    console.log("href", href);
                                    router.push(href);
                                } else {
                                    console.error("Échec de la connexion : Statut", res.status);
                                }
                            } else {
                                console.error("DID Token non reçu");
                                router.push(`/panel/societegestionpanel/login?id=Unauthorized`);
                            }
                        } catch (magicError) {
                            console.error("Erreur Magic Login:", magicError);
                        }

                    } else {
                        console.error("L'utilisateur n'est pas actif ou introuvable.");
                        router.push(`/panel/societegestionpanel/login?id=Unauthorized`);

                    }
                } else {
                    console.error("L'instance magic ou magic.auth n'existe pas.");

                }
            } catch (error) {
                console.error("Erreur générale dans loginUser :", error);
            }
        };

        loginUser();
    }, []);

    return <div>Chargement...</div>;
}
