import { readFileSync } from 'node:fs';

const TYPES = [
    'feat',
    'fix',
    'refactor',
    'chore',
    'test',
    'docs',
    'style',
    'ci',
    'build',
    'perf',
];
const SUBJECT = new RegExp(
    `^(${TYPES.join('|')})(\\([a-z0-9-]+\\))?: [a-z0-9\`]`,
);
const GENERATED = /^(Merge|Revert|fixup!|squash!)/;
const FOOTER =
    /^(co-authored-by|claude-session|generated with|signed-off-by):/i;
const EMOJI = /\p{Extended_Pictographic}/u;
const MAX_SUBJECT_LENGTH = 72;

const file = process.argv[2];

if (file === undefined) {
    console.error('usage: check-commit-message <path to the message file>');
    process.exit(2);
}

const lines = readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => !line.startsWith('#'));
const subject = lines[0] ?? '';

if (GENERATED.test(subject)) {
    process.exit(0);
}

const errors: string[] = [];

if (!SUBJECT.test(subject)) {
    errors.push(
        `subject must be "<type>: <lowercase imperative>" with type in ${TYPES.join(', ')}`,
    );
}

if (subject.length >= MAX_SUBJECT_LENGTH) {
    errors.push(
        `subject is ${subject.length} characters; keep it under ${MAX_SUBJECT_LENGTH}`,
    );
}

if (subject.trimEnd().endsWith('.')) {
    errors.push('subject must not end with a period');
}

if (lines.length > 1 && lines[1]?.trim() !== '') {
    errors.push('leave a blank line between the subject and the body');
}

if (lines.slice(1).every((line) => line.trim() === '')) {
    errors.push('write a body that says why the change is made');
}

for (const line of lines) {
    if (FOOTER.test(line.trim())) {
        errors.push(`attribution footers are not used here: ${line.trim()}`);
    }

    if (EMOJI.test(line)) {
        errors.push(`no emoji: ${line.trim()}`);
    }
}

if (errors.length > 0) {
    console.error('commit message rejected:');

    for (const error of errors) {
        console.error(`  - ${error}`);
    }

    console.error(`  subject: ${JSON.stringify(subject)}`);
    process.exit(1);
}
