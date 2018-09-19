#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const del = require('del');
const colors = require('colors');
const program = require('commander');
const config = require('./config.json');

const repoName = 'https://github.com/roose/boilerplate.git';
let projName;

program
  .version('1.0.0')
  .usage('<name>')
  .arguments('<cmd>')
  .action((command) => {
    projName = command;
  });

program.parse(process.argv);

// Error when no name of block
if (typeof projName === 'undefined') {
  console.error(colors.red('Project name not defined!'));
  console.log('');
  process.exit(1);
}

process.chdir(`${config.dir}`);

console.log(`Cloning into '${projName}'...`);
exec(`git clone ${repoName} ${projName}`, (error, stdout) => {
  if (error) {
    console.error(colors.red('Error:'));
    console.error(colors.red(error));
    process.exit(1);
  } else if (stdout) {
    console.log(stdout);
  } else {
    console.log('Cloning done.');
    process.chdir(`${projName}`);

    console.log('Preparing project:');

    del.sync('.git');
    console.log(colors.gray('  .git folder deleted.'));

    const rawPackage = fs.readFileSync('package.json');
    const packageJson = JSON.parse(rawPackage);

    packageJson.name = projName;
    packageJson.version = '1.0.0';
    packageJson.description = `${projName} 'markup'`;

    const newPackage = JSON.stringify(packageJson, '', 2);
    fs.writeFileSync('package.json', newPackage);

    console.log(colors.gray('  new settings added to package.json.'));

    console.log(colors.green('New project successfully created!'));
  }
});
