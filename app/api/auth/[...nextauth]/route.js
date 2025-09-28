import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/backend/models/user';
import dbConnect from '@/backend/config/dbConnect';

const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          const { email, password } = credentials;

          if (!email || !password) {
            throw new Error('Please provide both email and password');
          }

          // Utiliser la méthode statique du modèle pour rechercher avec le mot de passe
          const user = await User.findByEmail(email, true);

          if (!user) {
            throw new Error('Invalid Email or Password');
          }

          // Vérifier si le compte est verrouillé
          if (user.isLocked()) {
            throw new Error(
              'Account temporarily locked due to too many failed login attempts. Please try again later.',
            );
          }

          // Vérifier si l'utilisateur est actif
          if (!user.isActive) {
            throw new Error('Account is deactivated. Please contact support.');
          }

          // Comparer le mot de passe en utilisant la méthode du modèle
          const isPasswordMatched = await user.comparePassword(password);

          if (!isPasswordMatched) {
            // Incrémenter les tentatives échouées
            await user.incrementLoginAttempts();
            throw new Error('Invalid Email or Password');
          }

          // Réinitialiser les tentatives de connexion en cas de succès
          await user.resetLoginAttempts();

          // Retourner l'utilisateur (sans le mot de passe)
          const userObject = user.toObject();
          delete userObject.password;

          return userObject;
        } catch (error) {
          console.error('Authentication error:', error.message);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Si c'est une nouvelle connexion, stocker les infos utilisateur
      if (user) {
        token.user = user;
      }

      // Gestion de la mise à jour de session
      if (trigger === 'update' && session) {
        try {
          await dbConnect();
          const updatedUser = await User.findById(token.user._id);
          if (updatedUser) {
            token.user = updatedUser.toObject();
            delete token.user.password;
          }
        } catch (error) {
          console.error('Error updating user in token:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Passer les données utilisateur à la session
      if (token.user) {
        session.user = token.user;
        // S'assurer que le mot de passe n'est jamais exposé
        delete session.user.password;
      }

      return session;
    },
    async signIn({ user }) {
      try {
        // Vérifications supplémentaires lors de la connexion
        if (user.role !== 'admin') {
          return false; // Seuls les admins peuvent se connecter
        }
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirection après connexion
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/admin`;
    },
  },
  pages: {
    signIn: '/',
    error: '/', // Rediriger vers la page de connexion en cas d'erreur
  },
  events: {
    async signIn({ user }) {
      try {
        await dbConnect();
        // Mettre à jour la dernière connexion
        await User.findByIdAndUpdate(user._id, {
          lastLogin: new Date(),
          'engagementStats.lastActiveAt': new Date(),
        });
      } catch (error) {
        console.error('Error updating last login:', error);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Créer le handler NextAuth
const handler = NextAuth(authOptions);

// Exporter pour tous les méthodes HTTP
export { handler as GET, handler as POST, authOptions as auth };
