/**
 * Mock plugin for development and production.
 * https://github.com/anncwb/vite-plugin-mock
 */
import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin(isBuild: boolean) {
  return viteMockServe({
    ignore: /^\_/,
    // 设置模拟数据所在的文件夹
    mockPath: 'mock',
    // 非生产环境启用mock文件来mock数据，生产环境无需打开
    localEnabled: !isBuild,

    // 生产环境 启用打包 的模拟函数
    prodEnabled: isBuild,
    // 如果prodEnabled为true，这段代码会默认注入进main.ts，即生产环境开启数据mock功能
    // 所以一般prodEnabled和injectCode配合使用
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
  });
}
