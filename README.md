# Hire Me

## Content ideas

- LinkedIn Recommendations
- Live chat + auth
- - Some super cost effective way of doing this + some limit on how many people can live chat I guess
- - Maybe no auth and just live chat with whoever's there?
- - - if no one's there, LLM?
- Test results from Github actions
- performance metrics?
- Regular resume info with downloadable PDF?
- in-window playground for testing out responsiveness
- Stack details?
- Different experiences for different types of users?
- - Recruiters
- - Technical Peeps
- - Product Managers

Generated with [Bati](https://batijs.dev) ([version 318](https://www.npmjs.com/package/create-bati/v/0.0.318)) using this command:

```sh
pnpm create bati --react --express --eslint --prettier
```

## Contents

- [React](#react)

  - [`/pages/+config.ts`](#pagesconfigts)
  - [Routing](#routing)
  - [`/pages/_error/+Page.jsx`](#pages_errorpagejsx)
  - [`/pages/+onPageTransitionStart.ts` and `/pages/+onPageTransitionEnd.ts`](#pagesonpagetransitionstartts-and-pagesonpagetransitionendts)
  - [SSR](#ssr)
  - [HTML Streaming](#html-streaming)

## React

This app is ready to start. It's powered by [Vike](https://vike.dev) and [React](https://react.dev/learn).

### `/pages/+config.ts`

Such `+` files are [the interface](https://vike.dev/config) between Vike and your code. It defines:

- A default [`<Layout>` component](https://vike.dev/Layout) (that wraps your [`<Page>` components](https://vike.dev/Page)).
- A default [`title`](https://vike.dev/title).
- Global [`<head>` tags](https://vike.dev/head-tags).

### Routing

[Vike's built-in router](https://vike.dev/routing) lets you choose between:

- [Filesystem Routing](https://vike.dev/filesystem-routing) (the URL of a page is determined based on where its `+Page.jsx` file is located on the filesystem)
- [Route Strings](https://vike.dev/route-string)
- [Route Functions](https://vike.dev/route-function)

### `/pages/_error/+Page.jsx`

The [error page](https://vike.dev/error-page) which is rendered when errors occur.

### `/pages/+onPageTransitionStart.ts` and `/pages/+onPageTransitionEnd.ts`

The [`onPageTransitionStart()` hook](https://vike.dev/onPageTransitionStart), together with [`onPageTransitionEnd()`](https://vike.dev/onPageTransitionEnd), enables you to implement page transition animations.

### SSR

SSR is enabled by default. You can [disable it](https://vike.dev/ssr) for all your pages or only for some pages.

### HTML Streaming

You can enable/disable [HTML streaming](https://vike.dev/stream) for all your pages, or only for some pages while still using it for others.
