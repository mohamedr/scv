# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Déploiement Vercel

Le projet utilise un Cron Vercel les 1er et 15 de chaque mois pour établir une connexion à
MongoDB Atlas et éviter la mise en pause du cluster gratuit après une longue période
d'inactivité.

Définir `CRON_SECRET` dans les variables d'environnement Vercel avec une valeur aléatoire d'au
moins 16 caractères. Vercel transmet automatiquement cette valeur à la route
`/api/keepalive` dans l'en-tête `Authorization`.
