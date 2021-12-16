# Redis shopping cart UI

## Development

```
# Environmental variables

Copy `.env.example` to `.env`

cp .env.example .env

# Install dependencies

npm install

### If the following error occurs while executing npm install:

npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! 
npm ERR! While resolving: redis-shopping-cart-client@1.0.0
npm ERR! Found: eslint@7.32.0
npm ERR! node_modules/eslint

Run: npm install --force

# Install BootstrapVue

npm install --save bootstrap-vue

# Serve locally

npm run serve

### If the error "ENOSPC: System limit for number of file watchers reached" occurs

It can be solved increasing the file watcher limit
At most Linux distributions you can run the following command:

echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
