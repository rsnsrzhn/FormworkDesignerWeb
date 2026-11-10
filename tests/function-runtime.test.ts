import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

test('compiled API entries run in plain Node without TypeScript sources or tsx', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'formwork-api-'));
  try {
    const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(
      config.config,
      ts.sys,
      process.cwd(),
    );
    const files = [
      'api/site-config.ts',
      'api/inquiries.ts',
      'server/http.ts',
      'server/inquiries.ts',
      'server/config.ts',
      'server/rate-limit.ts',
      'src/lib/validation.ts',
    ];
    await writeFile(join(directory, 'package.json'), '{"type":"module"}');
    for (const file of files) {
      const output = join(directory, file.replace(/\.ts$/, '.js'));
      await mkdir(dirname(output), { recursive: true });
      const compiled = ts.transpileModule(await readFile(file, 'utf8'), {
        fileName: resolve(file),
        compilerOptions: {
          ...parsed.options,
          noEmit: false,
          module: ts.ModuleKind.ESNext,
        },
      });
      await writeFile(output, compiled.outputText);
    }
    const result = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
      import assert from 'node:assert/strict';
      import {createServer} from 'node:http';
      import configHandler from './api/site-config.js';
      import inquiryHandler from './api/inquiries.js';
      const server=createServer((req,res)=>(req.url.startsWith('/api/site-config')?configHandler:inquiryHandler)(req,res));
      await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
      const base='http://127.0.0.1:'+server.address().port;
      try {
        const config=await fetch(base+'/api/site-config');
        assert.equal(config.status,200);
        assert.equal((await config.json()).inquiriesEnabled,false);
        assert.equal((await fetch(base+'/api/inquiries')).status,405);
        const invalid=await fetch(base+'/api/inquiries',{method:'POST',headers:{origin:base,'content-type':'application/json'},body:'{}'});
        assert.equal(invalid.status,400);
      } finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
    `,
      ],
      {
        cwd: directory,
        env: { ...process.env, ACCEPT_INQUIRIES: 'false', VERCEL: '' },
        encoding: 'utf8',
        timeout: 15000,
      },
    );
    assert.equal(
      result.status,
      0,
      result.stderr || String(result.error || 'API runtime failed'),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
