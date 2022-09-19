#!/bin/sh
`pnpm prisma migrate reset --skip-seed`
`pnpm run prismix`
`pnpm prisma db push`
`pnpm run test-seed`