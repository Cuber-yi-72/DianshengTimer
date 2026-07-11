#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION_FILE = resolve(ROOT, 'version.json');
const GENERATED_FILES = [
    'version.json',
    'package.json',
    'js/constants.js',
    'index.html',
    'README.md'
];
const VERSION_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const SOURCE_FILE_RE = /^(?:index\.html|css\/|js\/|pictures\/)/;

function fail(message) {
    console.error(`[version] ${message}`);
    process.exit(1);
}

function parseVersion(version) {
    const match = VERSION_RE.exec(version);
    if (!match) fail(`无效版本号“${version}”，必须使用 x.y.z 格式`);
    return match.slice(1).map(Number);
}

function readVersion() {
    if (!existsSync(VERSION_FILE)) fail('找不到 version.json');
    const data = JSON.parse(readFileSync(VERSION_FILE, 'utf8'));
    parseVersion(data.version);
    return data.version;
}

function writeVersion(version) {
    parseVersion(version);
    writeFileSync(VERSION_FILE, `${JSON.stringify({ version }, null, 2)}\n`);
}

function replaceRequired(text, regex, replacement, file) {
    if (!regex.test(text)) fail(`${file} 中没有找到需要同步的版本位置`);
    regex.lastIndex = 0;
    return text.replace(regex, replacement);
}

function updateTextFile(relativePath, transform) {
    const file = resolve(ROOT, relativePath);
    if (!existsSync(file)) fail(`找不到 ${relativePath}`);
    const before = readFileSync(file, 'utf8');
    const after = transform(before);
    if (before !== after) {
        writeFileSync(file, after);
        return true;
    }
    return false;
}

function syncVersion(version = readVersion(), { quiet = false } = {}) {
    const changed = [];

    if (updateTextFile('js/constants.js', text => replaceRequired(
        text,
        /APP_VERSION\s*:\s*['"][^'"]+['"]/, 
        `APP_VERSION: '${version}'`,
        'js/constants.js'
    ))) changed.push('js/constants.js');

    if (updateTextFile('index.html', text => {
        let count = 0;
        const next = text.replace(
            /((?:href|src)=["'][^"']+\.(?:css|js))\?v=[^"']+(["'])/g,
            (_, prefix, quote) => {
                count++;
                return `${prefix}?v=${version}${quote}`;
            }
        );
        if (count === 0) fail('index.html 中没有找到本地 CSS/JS 的 ?v= 版本参数');
        return next;
    })) changed.push('index.html');

    if (updateTextFile('README.md', text => replaceRequired(
        text,
        /版本-v\d+\.\d+\.\d+-brightgreen/,
        `版本-v${version}-brightgreen`,
        'README.md'
    ))) changed.push('README.md');

    if (updateTextFile('package.json', text => {
        const data = JSON.parse(text);
        data.version = version;
        return `${JSON.stringify(data, null, 2)}\n`;
    })) changed.push('package.json');

    if (!quiet) {
        const detail = changed.length ? `；已更新 ${changed.join('、')}` : '；所有文件已经一致';
        console.log(`[version] 已同步 v${version}${detail}`);
    }
    return changed;
}

function getVersionsFromFiles() {
    const constants = readFileSync(resolve(ROOT, 'js/constants.js'), 'utf8')
        .match(/APP_VERSION\s*:\s*['"]([^'"]+)['"]/)?.[1];
    const indexVersions = [...readFileSync(resolve(ROOT, 'index.html'), 'utf8')
        .matchAll(/(?:href|src)=["'][^"']+\.(?:css|js)\?v=([^"']+)["']/g)]
        .map(match => match[1]);
    const readme = readFileSync(resolve(ROOT, 'README.md'), 'utf8')
        .match(/版本-v(\d+\.\d+\.\d+)-brightgreen/)?.[1];
    const packageVersion = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')).version;
    return { constants, indexVersions, readme, packageVersion };
}

function checkVersion() {
    const expected = readVersion();
    const actual = getVersionsFromFiles();
    const errors = [];
    if (actual.constants !== expected) errors.push(`constants.js=${actual.constants ?? '缺失'}`);
    if (!actual.indexVersions.length) errors.push('index.html=没有版本参数');
    if (actual.indexVersions.some(version => version !== expected)) {
        errors.push(`index.html=${[...new Set(actual.indexVersions)].join(',')}`);
    }
    if (actual.readme !== expected) errors.push(`README.md=${actual.readme ?? '缺失'}`);
    if (actual.packageVersion !== expected) errors.push(`package.json=${actual.packageVersion ?? '缺失'}`);
    if (errors.length) fail(`版本不一致，version.json=${expected}；${errors.join('；')}`);
    console.log(`[version] 检查通过：所有位置均为 v${expected}`);
}

function bumpVersion(kind) {
    const current = parseVersion(readVersion());
    if (kind === 'major') return `${current[0] + 1}.0.0`;
    if (kind === 'minor') return `${current[0]}.${current[1] + 1}.0`;
    if (kind === 'patch') return `${current[0]}.${current[1]}.${current[2] + 1}`;
    fail(`未知递增类型“${kind}”，只能是 major、minor、patch`);
}

function git(args, options = {}) {
    return execFileSync('git', args, {
        cwd: ROOT,
        encoding: options.encoding === null ? null : 'utf8',
        stdio: options.stdio ?? ['ignore', 'pipe', 'pipe']
    });
}

function tryGit(args, options = {}) {
    try {
        return git(args, options);
    } catch {
        return null;
    }
}

function normalizeVersionContent(path, content) {
    if (content === null) return '<deleted>';
    let text = content.toString('utf8');
    if (path === 'index.html') {
        text = text.replace(/(\.(?:css|js))\?v=[^"']+/g, '$1?v=<VERSION>');
    } else if (path === 'js/constants.js') {
        text = text.replace(/APP_VERSION\s*:\s*['"][^'"]+['"]/, "APP_VERSION: '<VERSION>'");
    }
    return text;
}

function stagedContent(path) {
    return tryGit(['show', `:${path}`], { encoding: null });
}

function headContent(path) {
    return tryGit(['show', `HEAD:${path}`], { encoding: null });
}

function meaningfulStagedChanges() {
    const output = git(['diff', '--cached', '--name-only', '--diff-filter=ACMRD']);
    const paths = output.split(/\r?\n/).filter(Boolean).filter(path => SOURCE_FILE_RE.test(path));
    const meaningful = [];
    for (const path of paths) {
        const staged = normalizeVersionContent(path, stagedContent(path));
        const head = normalizeVersionContent(path, headContent(path));
        if (staged !== head) meaningful.push({ path, staged });
    }
    return meaningful;
}

function stagedHeadVersion() {
    const content = headContent('version.json');
    if (!content) return null;
    try {
        return JSON.parse(content.toString('utf8')).version ?? null;
    } catch {
        return null;
    }
}

function stateFile() {
    const gitDirRaw = git(['rev-parse', '--git-dir']).trim();
    const gitDir = isAbsolute(gitDirRaw) ? gitDirRaw : resolve(ROOT, gitDirRaw);
    return resolve(gitDir, 'diansheng-version-state.json');
}

function stageGeneratedFiles() {
    git(['add', '--', ...GENERATED_FILES]);
}

function autoVersion() {
    const changes = meaningfulStagedChanges();
    if (!changes.length) {
        console.log('[version] 没有影响应用的暂存改动，跳过自动递增');
        return;
    }

    const head = tryGit(['rev-parse', 'HEAD'])?.trim() ?? '<no-head>';
    const key = createHash('sha256')
        .update(head)
        .update('\0')
        .update(changes.map(item => `${item.path}\0${item.staged}`).join('\0'))
        .digest('hex');
    const statePath = stateFile();
    let state = null;
    if (existsSync(statePath)) {
        try { state = JSON.parse(readFileSync(statePath, 'utf8')); } catch { state = null; }
    }

    const current = readVersion();
    const headVersion = stagedHeadVersion();
    let next = current;

    if (state?.key === key) {
        console.log(`[version] 本次暂存内容已经递增过，保持 v${current}`);
    } else if (headVersion === null || headVersion !== current) {
        console.log(`[version] 检测到手动版本变更，保持 v${current}`);
    } else {
        next = bumpVersion('patch');
        writeVersion(next);
        console.log(`[version] 检测到应用代码变更：v${current} → v${next}`);
    }

    syncVersion(next, { quiet: true });
    stageGeneratedFiles();
    writeFileSync(statePath, `${JSON.stringify({ key, version: next }, null, 2)}\n`);
}

const [command = 'check', argument] = process.argv.slice(2);

if (command === 'check') {
    checkVersion();
} else if (command === 'sync') {
    syncVersion();
    checkVersion();
} else if (command === 'bump') {
    const next = bumpVersion(argument ?? 'patch');
    writeVersion(next);
    syncVersion(next);
    checkVersion();
} else if (command === 'set') {
    if (!argument) fail('请提供版本号，例如：npm run version:set -- 1.3.0');
    writeVersion(argument);
    syncVersion(argument);
    checkVersion();
} else if (command === 'auto') {
    autoVersion();
} else {
    fail(`未知命令“${command}”`);
}
