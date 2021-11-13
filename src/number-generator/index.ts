#!/usr/bin/env node

import { Runner } from './runner/runner';

const runner = new Runner();
runner.run(process.argv);