import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// 为打包后的文件提供传统浏览器兼容性支持。
import legacy from '@vitejs/plugin-legacy';
// PurgeIcons will load the icons from it locally, otherwise, PurgeIcons will try to fetch the iconset your requested online.
import purgeIcons from 'vite-plugin-purge-icons';
//  It's FAST - 20~100x times faster than Tailwind on Vite  就是快
import windiCSS from 'vite-plugin-windicss';
// Use mkcert to provide certificate support for vite https development services. 提供证书
import VitePluginCertificate from 'vite-plugin-mkcert';
//import vueSetupExtend from 'vite-plugin-vue-setup-extend';

// 使用vite-plugin-html插件，类似webpack的HtmlWebpackPlugin，文档地址https://github.com/vbenjs/vite-plugin-html/blob/main/README.zh_CN.md
// 指定是否压缩，以及入口文件和要使用的template页面
import { configHtmlPlugin } from './html';
// 配置pwa https://developer.mozilla.org/zh-CN/docs/Web/Manifest
import { configPwaConfig } from './pwa';
// 配置数据mock的功能
import { configMockPlugin } from './mock';
// 是否使用 gzip 或者 brotli 来压缩资源.
import { configCompressPlugin } from './compress';
// 该插件可按需导入组件库样式
import { configStyleImportPlugin } from './styleImport';
// 生成一个分析文件，类似webpack的report.html
import { configVisualizerConfig } from './visualizer';
// 用于更改页面的整体样式，比如黑白切换，以及特定样式的修改，比如修改一些button组件的样式等等，总之这个文件是和样式切换有关
// 可以参考掘金这篇文章 https://juejin.cn/post/7004460945468555278
import { configThemePlugin } from './theme';
// 一个压缩图片资源的 vite 插件
import { configImageminPlugin } from './imagemin';
// 用于生成 svg 雪碧图.
import { configSvgIconsPlugin } from './svgSprite';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_IMAGEMIN,
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv;

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // have to
    vue(),
    // have to
    vueJsx(),
    // support name
    //vueSetupExtend(),
    VitePluginCertificate({
      source: 'coding',
    }),
  ];

  // vite-plugin-windicss
  vitePlugins.push(windiCSS());

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  // vite-plugin-purge-icons
  vitePlugins.push(purgeIcons());

  // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin(isBuild));

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig());

  // vite-plugin-theme
  vitePlugins.push(configThemePlugin(isBuild));

  // The following plugins only work in the production environment
  if (isBuild) {
    // vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    );

    // vite-plugin-pwa
    vitePlugins.push(configPwaConfig(viteEnv));
  }

  return vitePlugins;
}
