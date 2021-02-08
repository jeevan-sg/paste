// https://danger.systems/js/reference.html
import {danger, warn} from 'danger';

// Warn when user potentially forgets to update lockfile
const packageChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = danger.git.modified_files.includes('yarn.lock');
if (packageChanged && !lockfileChanged) {
  const message = 'Changes were made to package.json, but not to yarn.lock';
  const idea = 'Perhaps you need to run `yarn install`?';
  warn(`${message} - <i>${idea}</i>`);
}

// Warn when user potentially forgets to write tests
if (danger.git.modified_files.length > 0) {
  const testChanges = danger.git.modified_files.filter((filepath) => filepath.includes('__tests__'));
  const codeChanges = danger.git.modified_files.filter((filepath) => {
    return filepath.includes('packages') && !testChanges.includes(filepath);
  });

  // Warn if there are library changes, but not tests
  if (codeChanges.length > 0 && testChanges.length === 0) {
    warn("There are code changes, but no new tests. That's OK as long as you're refactoring existing code.");
  }
}
