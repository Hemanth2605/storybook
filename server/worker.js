import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadRequests, loadBuilds, saveBuilds } from './store.js';

/* ------------------------------------------------------------------ config */
const CFG = {
  repoUrl: process.env.REPO_URL || 'https://github.com/Hemanth2605/storybook.git',
  botDir: process.env.BOT_DIR || 'D:/automate-bot',
  baseBranch: process.env.BASE_BRANCH || 'main',
  pollMs: Number(process.env.POLL_MS || 15000),
  claudeBin: process.env.CLAUDE_BIN || 'claude',
  // Safe by default: skip the claude build, the push, and the PR; just log.
  dryRun: String(process.env.DRY_RUN ?? 'true') === 'true',
};

const log = (...a) => console.log('[worker]', ...a);

/* ----------------------------------------------------------------- helpers */
function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  if (r.status !== 0) {
    const msg = `${cmd} ${args.join(' ')} -> exit ${r.status}\n${r.stderr || r.stdout || ''}`;
    throw new Error(msg.trim());
  }
  return (r.stdout || '').trim();
}

const git = (args, opts = {}) => run('git', args, { cwd: CFG.botDir, ...opts });

/** "Date Range Picker" -> { pascal:'DateRangePicker', kebab:'date-range-picker' } */
function names(componentName) {
  const words = String(componentName).replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/);
  const pascal = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('') || 'Component';
  const kebab = words.map((w) => w.toLowerCase()).join('-') || 'component';
  return { pascal, kebab };
}

/** Ensure the isolated bot clone exists and its deps are installed. */
function ensureRepo() {
  if (!existsSync(CFG.botDir)) {
    log(`cloning ${CFG.repoUrl} -> ${CFG.botDir}`);
    mkdirSync(dirname(CFG.botDir), { recursive: true });
    run('git', ['clone', CFG.repoUrl, CFG.botDir]);
    log('installing deps (first time, may take a minute)…');
    run('npm', ['install'], { cwd: CFG.botDir, shell: true });
  }
  git(['fetch', 'origin', '--prune']);
}

/** The instruction handed to headless Claude to implement the component. */
function buildPrompt(request, { pascal }) {
  const { componentName, description, project } = request;
  return [
    `You are implementing an APPROVED component request in this repository.`,
    ``,
    `FIRST read DESIGN.md — it defines the "Automate Design System" (ADS), our`,
    `OWN design system. Also read a few existing components under src/components/`,
    `(e.g. AppButton, StatCard, DataTable) to match their patterns exactly.`,
    ``,
    `Implement a new component named "${pascal}" that does the following:`,
    `${description}`,
    ``,
    `Hard requirements:`,
    `- Build it in ADS: use the MUI theme tokens for ALL typography, spacing,`,
    `  color, radius and elevation — NO hard-coded hex values or pixel margins.`,
    `- Follow ADS patterns and states (default/hover/focus/disabled, plus any of`,
    `  loading/empty/error that apply). The described functionality must WORK,`,
    `  not be a static shell.`,
    `- Create src/components/${pascal}/${pascal}.tsx, ${pascal}.stories.tsx, and`,
    `  index.ts; add the component to the src/components/index.ts barrel.`,
    `- Document its contract in DESIGN.md under "Appendix B — Component reference".`,
    `- Do not modify unrelated files. Ensure \`npm run build\` passes.`,
    ``,
    `Context: this request came from project "${project}" (original name:`,
    `"${componentName}").`,
    ``,
    `Finally, write a file "PR_META.json" at the repo root containing a JSON`,
    `object with two fields:`,
    `  - "title": a concise pull-request title for what you built`,
    `  - "body": a markdown PR description summarizing the component, the`,
    `    functionality it supports, and how it uses ADS tokens.`,
    `This is metadata for the PR (the caller reads it, then deletes it). Do NOT`,
    `commit or push — the caller handles git and opens the PR.`,
  ].join('\n');
}

/** Parse "owner/repo" from the remote URL. */
function ownerRepo() {
  const m = CFG.repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)(\.git)?$/);
  if (!m) throw new Error(`Cannot parse owner/repo from ${CFG.repoUrl}`);
  return { owner: m[1], repo: m[2] };
}

/** Retrieve the stored GitHub token from Git Credential Manager. */
function githubToken() {
  const r = spawnSync('git', ['credential', 'fill'], {
    input: 'protocol=https\nhost=github.com\n\n',
    encoding: 'utf8',
  });
  const m = (r.stdout || '').match(/password=(.+)/);
  return m ? m[1].trim() : null;
}

/** Open a PR via the GitHub API; fall back to a compare URL. */
async function openPr(branch, title, body) {
  const { owner, repo } = ownerRepo();
  const compareUrl = `https://github.com/${owner}/${repo}/compare/${CFG.baseBranch}...${branch}?expand=1`;
  const token = githubToken();
  if (!token) {
    log('no GitHub token available; returning compare URL');
    return compareUrl;
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ads-component-bot',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, head: branch, base: CFG.baseBranch, body }),
    });
    const data = await res.json();
    if (res.ok && data.html_url) return data.html_url;
    log('PR API responded', res.status, data.message || '');
    return compareUrl;
  } catch (err) {
    log('PR API failed:', err.message);
    return compareUrl;
  }
}

/* --------------------------------------------------------------- pipeline */
async function implement(id, entry) {
  const { pascal, kebab } = names(entry.request.componentName);
  const branch = `feat/${kebab}`;
  log(`building "${pascal}" (id ${id}) on ${branch}${CFG.dryRun ? ' [DRY RUN]' : ''}`);

  ensureRepo();
  git(['checkout', CFG.baseBranch]);
  git(['reset', '--hard', `origin/${CFG.baseBranch}`]);
  git(['checkout', '-B', branch, `origin/${CFG.baseBranch}`]);

  if (CFG.dryRun) {
    // Prove the pipeline without invoking Claude: drop a spec note as the diff.
    const dir = `${CFG.botDir}/src/components/${pascal}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      `${dir}/REQUEST.md`,
      `# ${pascal} (requested)\n\n${entry.request.description}\n\nProject: ${entry.request.project}\n`,
    );
  } else {
    log('invoking Claude headless to implement…');
    const prompt = buildPrompt(entry.request, { pascal });
    const r = spawnSync(CFG.claudeBin, ['-p', '--permission-mode', 'bypassPermissions'], {
      cwd: CFG.botDir,
      input: prompt,
      encoding: 'utf8',
      shell: true,
      maxBuffer: 64 * 1024 * 1024,
    });
    if (r.status !== 0) throw new Error(`claude exited ${r.status}: ${r.stderr || ''}`);
    log('build-verifying…');
    run('npm', ['run', 'build'], { cwd: CFG.botDir, shell: true });
  }

  // Hybrid: the agent authors the PR title/body (it knows what it built); the
  // git plumbing below stays deterministic. Fall back to a template if the
  // agent didn't produce usable metadata.
  let prTitle = `Add ${pascal} component (approved request)`;
  let prBody =
    `Implements the approved request for **${pascal}** from project ` +
    `_${entry.request.project}_.\n\n**Requested functionality:**\n\n` +
    `${entry.request.description}\n\n---\n🤖 Auto-generated from an approved ` +
    `ComponentRequestWizard submission. Review before merging.`;

  const metaPath = join(CFG.botDir, 'PR_META.json');
  if (existsSync(metaPath)) {
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
      if (typeof meta.title === 'string' && meta.title.trim()) prTitle = meta.title.trim();
      if (typeof meta.body === 'string' && meta.body.trim()) prBody = meta.body.trim();
      log('using agent-authored PR title/body');
    } catch (err) {
      log('PR_META.json unparseable, using template:', err.message);
    }
    rmSync(metaPath, { force: true }); // never commit the metadata file
  } else {
    log('no PR_META.json from agent, using template');
  }

  git(['add', '-A']);
  git(['commit', '-m', `Add ${pascal} component (approved request)\n\nProject: ${entry.request.project}`]);

  if (CFG.dryRun) {
    log(`[DRY RUN] would push ${branch} and open a PR. Skipping.`);
    return { branch, prUrl: null, dryRun: true };
  }

  git(['push', '-u', 'origin', branch, '--force-with-lease']);
  const prUrl = await openPr(branch, prTitle, prBody);
  return { branch, prUrl, dryRun: false };
}

/* -------------------------------------------------------------------- loop */
async function tick() {
  const requests = loadRequests();
  const builds = loadBuilds();
  const pending = Object.entries(requests).filter(
    ([id, e]) => e.status === 'approved' && !builds[id],
  );
  if (pending.length === 0) return;

  for (const [id, entry] of pending) {
    builds[id] = { status: 'building', at: Date.now() };
    saveBuilds(builds);
    try {
      const { branch, prUrl, dryRun } = await implement(id, entry);
      builds[id] = { status: 'done', branch, prUrl, dryRun, at: Date.now() };
      log(`done: ${branch}${prUrl ? ` -> ${prUrl}` : ''}`);
    } catch (err) {
      builds[id] = { status: 'error', error: String(err.message || err), at: Date.now() };
      log(`error on ${id}:`, err.message);
    }
    saveBuilds(builds);
  }
}

async function main() {
  const once = String(process.env.RUN_ONCE ?? 'false') === 'true' || process.argv.includes('--once');
  log(`starting. repo=${CFG.repoUrl} bot=${CFG.botDir} base=${CFG.baseBranch} poll=${CFG.pollMs}ms dryRun=${CFG.dryRun} once=${once}`);
  if (once) {
    await tick();
    return;
  }
  // Simple sequential poll loop.
  // eslint-disable-next-line no-constant-condition
  for (;;) {
    try {
      await tick();
    } catch (err) {
      log('tick failed:', err.message);
    }
    await new Promise((r) => setTimeout(r, CFG.pollMs));
  }
}

main();
