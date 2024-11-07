import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      // Paramètres de l'authentification ici
      // Par exemple, username et password
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Logique d'authentification ici
        // Retournez un objet user si l'authentification réussit
        // Retournez null si l'authentification échoue
        const user = { id: 1, name: 'John Doe', email: 'jaures.kouassi@gmail.com' };
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
});
