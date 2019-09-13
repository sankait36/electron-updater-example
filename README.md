# Auto Updater
This project demonstrates how to use electron with an auto updater

# To Test
- Fork this repo
- Change the repository url and author in ```package.json```
- Install dependencies with ```yarn install```
- Generate a [GitHub access token](https://github.com/settings/tokens/new) with `repo` permissions, assign it to the following environent variable
  - export GH_TOKEN=<YOUR_TOKEN_HERE>
- Publish using ```yarn run publish```
- It will automatically draft a new release for you on GitHub. Navigate to your repo and release the new version
- Download the version from releases
- Change version in package.json and publish again
- Open the app and it should notify you of the update
