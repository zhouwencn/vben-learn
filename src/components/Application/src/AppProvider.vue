<script lang="ts">
  import { defineComponent, toRefs, ref, unref } from 'vue';
  import { createAppProviderContext } from './useAppContext';
  import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';
  import { prefixCls } from '/@/settings/designSetting';
  import { useAppStore } from '/@/store/modules/app';
  import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

  const props = {
    /**
     * class style prefix
     */
    prefixCls: { type: String, default: prefixCls },
  };

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const isMobile = ref(false);
      const isSetState = ref(false);

      const appStore = useAppStore();

      // Monitor screen breakpoint information changes
      // 检测屏幕的大小变化，同时挂载好window.resize事件
      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        // document.body.clientWidth小于LG 992就判断为手机
        const lgWidth = screenMap.get(sizeEnum.LG);
        if (lgWidth) {
          isMobile.value = width.value - 1 < lgWidth;
        }
        handleRestoreState();
      });

      const { prefixCls } = toRefs(props);

      // Inject variables into the global
      createAppProviderContext({ prefixCls, isMobile });

      /**
       * Used to maintain the state before the window changes
       */
      function handleRestoreState() {
        // 是手机
        //
        if (unref(isMobile)) {
          if (!unref(isSetState)) {
            isSetState.value = true;
            const {
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            } = appStore.getProjectConfig;
            appStore.setProjectConfig({
              menuSetting: {
                type: MenuTypeEnum.SIDEBAR,
                mode: MenuModeEnum.INLINE,
                split: false,
              },
            });
            appStore.setBeforeMiniInfo({ menuMode, menuCollapsed, menuType, menuSplit });
          }
        } else {
          // 不是手机
          if (unref(isSetState)) {
            isSetState.value = false;
            const { menuMode, menuCollapsed, menuType, menuSplit } = appStore.getBeforeMiniInfo;
            appStore.setProjectConfig({
              menuSetting: {
                type: menuType,
                mode: menuMode,
                collapsed: menuCollapsed,
                split: menuSplit,
              },
            });
          }
        }
      }
      // 暴露一个默认的slot插槽，类似返回一个render函数
      return () => slots.default?.();
    },
  });
</script>
