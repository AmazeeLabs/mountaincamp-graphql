# Documentation

## Quick start

### Requirements

* [NodeJS](https://nodejs.org/en/)

### Development mode

This will boot up a development server running on http://localhost:3000/ .

The development environment includes hot-reloading and source maps, for a better development experience. The site runs on your host machine as much as possible, only using docker for the backend data service.

1. Run ``yarn install`` to install required packages.
2. Run ``yarn run dev`` to start the web server in Dev mode.

### Testing

We've got unit test support built into our application frame. In order to run
the test suite, simply run the ``yarn run test`` script.

## Directories and structure

### Root structure

#### ``/app``

Contains the actual application structure.

The entry points for both, server- and client-side rendering can be found in the
``/app/entry/server`` and ``/app/entry/client`` directories.

During development, most of your time will be spent in the ``/app/screens``,
``/app/shared`` and ``/app/components`` directory hierarchies. This code makes
up the actual React application including route (screen) and drop-in components
as well as utility functions related to them.

### Application structure and module directories

The Webpack configuration specifies three special directories that are part of
the Node module lookup strategy:

- ``shared``
  Contains shared utility functionality for the directory hierarchy nested within a given module.
- ``components``
  Contains shared components that are used in the route component itself or shared with other sub-routes or other components that are part of a given module's hierarchy.
- ``screens``
  Contains the main route- and sub-route hierarchy. This is the main structural element in our application as we are building our directory hierarchy around our route definitions.

Please check the ``/app/screens`` directory to get an idea how the directory hierarchy looks in reality.

## Rendering

Server-side rendering (SSR) and Client-side rendering (CSR) work by ultimately
transpiling the same code that using two different Webpack compiler
configurations: Once for NodeJS and once for the Web.

This works through two different entry points ``/app/entry/server`` and
``/app/entry/client`` which both produce slightly different initialization
logic but ultimately import and render the same components using the same route
definitions, and other pieces from the source code living in the ``/app``
directory.

### Server-side rendering

In case of the server entry point we generate and export an ExpressJS
controller. When called through its catch-all route then runs nearly the same
initialization logic as the client-side code entry point. It sets up the Apollo
network layer, the Redux store, the Router, etc. and internally invokes the
route matcher before ultimately producing an HTML string through the special 
rendering function from the ``react-dom/server`` package.

The generated HTML string, along with the extracted state snapshot from the
previously initialized store as well as the current status of the Relay cache,
is the passed to the pre-built ``index.ejs`` template file. The ``index.ejs`` is
a build artifact from the Webpack bundling process for the client-side
application and is produced as a side-effect when processing the
``/app/entry/client`` entry point, picking up the different JS and CSS chunks
through the ``html-webpack-plugin`` plugin. Injecting rendered HTML as well as
the store and cache data into this template produces the final output which is
then returned to the client.

The initial state of the Redux store and the Relay cache are written into window
properties in script tags which makes them accessible to the JavaScript
code running on the client.

### Client-side rendering

The initialization logic defined in the ``/app/entry/client`` entry point picks
up the aforementioned window properties to *hydrate* the client-side Redux store
and Relay cache. The React router, Redux store and the Relay network layer are
otherwise set up and configured nearly the same as in the server-side entry
point.

The main difference is that, instead of rendering a the React application as a
plain string, we are now rendering it into proper (Shadow) DOM and mounting it
into an actual DOM Node (``#app``).

Even though the initial HTML is already rendered on the server, the same
rendering process is initially executed on the client a single time to build up
the initial Shadow DOM version of the rendered HTML. At this point, the
server-side rendered HTML has been fully *hydrated* on the client and is now
enhanced with JavaScript functionality. The React application is fully rendered
and ready for use by the client.

The import part to note here is, that even if the downloading of the JavaScript
assets is still in progress or JavaScript is not enabled or available on the
client's device or browser, the server-side rendered HTML is still delivered to
the client. It also includes the required CSS and therefore enables the client
to use the website regardless, although in a less interactive fashion.

## Node server

The NodeJS server is powered by ExpressJS. Since routing is taken care of within
the React application, the set up logic for the ExpressJS server is very slim.
Based on the environment (production or development) we conditionally either add
server-side rendering or hot-reloading for a better developer experience.

For the development environment, we simply render the ``index.ejs`` template
without any initial state, cache or server-side rendered output. Instead, we
render the React application only on the client. This prevents a lot of annoying
issues with server-side rendering and hot-reloading and also makes the startup
of the server much faster (nearly instantaneous).

## Routing

For routing, we use the ``react-router`` project together with a few wrappers
around this project to enable server-side rendering support and better, built-in
support for Relay.

The application's routes are defined in ``/app/shared/routing``. For an
overview of the full route definition syntax and the available options, please
consult the excellent documentation of the ``react-router`` project.

### Lazy loading

We can achieve lazy loading of route components by leveraging ``require.ensure``
together with the ``getComponent`` property on a route definition object.

Together with the code chunking configured in our Webpack configuration, this
enables us to split our compiled code into separate chunks that are only loaded
when needed.

This is essential for our application and should be used for all our route
definitions whenever possible to reduce and distribute the amount of JavaScript
that is downloaded on each of the routes.

Dependencies that are required for more than one of the routes are bundled into
the ``common`` chunk and therefore not downloaded multiple times.

For further information about lazy loading, please consult the excellent
``react-router`` documentation and look at the examples implemented in the
repository on GitHub.

In addition to lazy loading route components it is also possible to lazily load
reducer functions or other assets.

## Data and state

Our data and state management stack is built around the populare Relay and Redux
projects.

### Transient application state

For transient (non-persistent) application state (e.g. state of a modal, the
active tab in a given widget or whether or not a side-bar is currently open) we
use Redux.

Redux allows us to execute actions on composed reducer functions which make up
our data store. The store is configured in ``/app/shared/state``.

Based on the environment, it is enhanced with different middlewares. In the
development environment, for example, we are adding a middleware to support
a browser extension for monitoring and debugging the Redux store and state
transitions.

Remember to always export your action types as string constants so we don't end
up with string typos ruining our day with hours of debugging.

It is encouraged to use namespacing for your action types (e.g. use
``counter/increment`` instead of just ``increment``).

#### Selecting state from the store

For selecting state from the store, we use the ``reselect`` project to create
intelligent selectors with support for internal caching. These can be re-used
outside of your module's code and therefore provide a nice way of hiding the
business logic and structure of your reducers from the outside.

When exporting selector functions, please make sure to encapsulate them in a
creator function instead of directly exporting them. Since selectors by default
only provide a cache cardinality of 1, the internal cache would otherwise be
invalidated on every invocation if used in two different contexts. If, however,
you wrap the creation of your custom selector in a function, you will produce a
separate instance of the selector each time, circumventing the problem of the
otherwise shared cache altogether.

This aspect is also further detailed in the ``reselect`` documentation.

It is encouraged to enhance your reducers by exporting a set of re-usable
selector creators along with it. This enables us to easily interact with our
application's state through a nice and descriptive API without needing to know
the internal structure of alien reducers.

#### Further documentation

To learn more about the ``redux``, ``redux-saga`` and ``reselect`` projects,
please consult the respective documentation of each of these projects. They are
all very thoroughly crafted and informative. Additionally, for learning and
fully grasping Redux and the concept of reducers there is an excellent
egghead.io series by the author of Redux about this topic.

### Persistent application state and data

To be done ...

## Styling

To be done ...
