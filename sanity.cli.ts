import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {projectId: 'ppsg7ml5', dataset: 'test'},
  deployment: {appId: 'g2def28kqacghk3oy8ezpte1', autoUpdates: true},
  reactCompiler: {target: '19'},
  reactStrictMode: true,
})
