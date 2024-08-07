import "@logseq/libs" //https://plugins-doc.logseq.com/
import { LSPluginBaseInfo, SettingSchemaDesc, } from "@logseq/libs/dist/LSPlugin.user"
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json"
import fileTaskColor from "./css/taskColor.css?inline"
import fileTaskBold from "./css/taskBold.css?inline"
import fileCommon from "./css/common.css?inline"

/* main */
const main = async () => {
  await l10nSetup({ builtinTranslations: { ja } })
  /* user settings */
  logseq.useSettingsSchema(settingsTemplate())
  if (!logseq.settings) setTimeout(() => logseq.showSettingsUI(), 300)

  /* provideStyle */
  if (logseq.settings!.accentColorUnderline === true) accentColorUnderline()
  if (logseq.settings!.removeMenuGraphView === true) removeMenuGraphView()
  if (logseq.settings!.taskColor === true) taskColor()
  if (logseq.settings!.taskBold === true) taskBold()
  if (logseq.settings!.fontFamilyUnset === true) fontFamilyUnset()
  if (logseq.settings!.leftSidebarMenuHeight === true) leftSidebarMenuHeight()
  if (logseq.settings!.leftSidebarMenuJustifyContent !== "unset") leftSidebarMenuJustifyContent(logseq.settings!.leftSidebarMenuJustifyContent as string)
  if (logseq.settings!.leftSidebarMenuBackground !== "Theme color") leftSidebarMenuBackground(logseq.settings!.leftSidebarMenuBackground as string)

  logseq.provideStyle({ key: "common", style: fileCommon })

  logseq.onSettingsChanged((newSet: LSPluginBaseInfo["settings"], oldSet: LSPluginBaseInfo["settings"]) => {
    if (oldSet.accentColorUnderline === true
      && newSet.accentColorUnderline === false)
      removeProvideStyle(keyAccentColorUnderline)
    else
      if (oldSet.accentColorUnderline === false
        && newSet.accentColorUnderline === true)
        accentColorUnderline()
    if (oldSet.taskColor === true
      && newSet.taskColor === false)
      removeProvideStyle(keyTaskColor)
    else
      if (oldSet.taskColor === false
        && newSet.taskColor === true)
        taskColor()
    if (oldSet.taskBold === true
      && newSet.taskBold === false)
      removeProvideStyle(keyTaskBold)
    else
      if (oldSet.taskBold === false
        && newSet.taskBold === true)
        taskBold()
    if (oldSet.removeMenuGraphView !== true
      && newSet.removeMenuGraphView === true)
      removeMenuGraphView()
    else
      if (oldSet.removeMenuGraphView === true
        && newSet.removeMenuGraphView !== true)
        removeProvideStyle(keyRemoveMenuGraphView)

    if (oldSet.fontFamilyUnset !== true
      && newSet.fontFamilyUnset === true)
      fontFamilyUnset()
    else
      if (oldSet.fontFamilyUnset === true
        && newSet.fontFamilyUnset !== true)
        removeProvideStyle(keyFontFamilyUnset)
    if (oldSet.leftSidebarMenuHeight !== true
      && newSet.leftSidebarMenuHeight === true)
      leftSidebarMenuHeight()
    else
      if (oldSet.leftSidebarMenuHeight === true
        && newSet.leftSidebarMenuHeight !== true)
        removeProvideStyle(keyLeftSidebarMenuHeight)
    if (oldSet.leftSidebarMenuJustifyContent !== newSet.leftSidebarMenuJustifyContent)
      if (newSet.leftSidebarMenuJustifyContent === "unset")
        removeProvideStyle(keyLeftSidebarMenuJustifyContent)
      else
        leftSidebarMenuJustifyContent(newSet.leftSidebarMenuJustifyContent as string)
    if (oldSet.leftSidebarMenuBackground !== newSet.leftSidebarMenuBackground)
      if (newSet.leftSidebarMenuBackground !== "Theme color")
        leftSidebarMenuBackground(newSet.leftSidebarMenuBackground as string)
      else removeProvideStyle(keyLeftSidebarBackground)
  })
} /* end_main */


const keyAccentColorUnderline = "accentColorUnderline"
const accentColorUnderline = () =>
  logseq.provideStyle({
    key: keyAccentColorUnderline,
    style: String.raw`
  body div#root div#main-content-container a.page-ref {
  color: unset;
  border-bottom:1.5px solid var(--lx-accent-11,var(--ls-link-text-color,hsl(var(--primary)/.8)));
  }
`,
  })

const keyTaskColor = "taskColor"
const taskColor = () =>
  logseq.provideStyle({
    key: keyTaskColor,
    style: fileTaskColor,
  })

const keyTaskBold = "taskBold"
const taskBold = () =>
  logseq.provideStyle({
    key: keyTaskBold,
    style: fileTaskBold,
  })

const keyRemoveMenuGraphView = "removeMenuGraphView"
const removeMenuGraphView = () =>
  logseq.provideStyle({
    key: keyRemoveMenuGraphView,
    style: String.raw`
  body>div#root>div>main div#left-sidebar div.graph-view-nav {
    display:none;
  }
`,
  })

const keyFontFamilyUnset = "fontFamilyUnset"
const fontFamilyUnset = () =>
  logseq.provideStyle({
    key: keyFontFamilyUnset,
    style: String.raw`
  html:not(.is-native-android) {
    font-family: unset !important;
    /* var(--ls-font-family) */
  }
`,
  })

//左サイドバーにあるFAVORITESとRECENTのメニューの間隔を広げる
const keyLeftSidebarMenuHeight = "leftSidebarMenuHeight"
const leftSidebarMenuHeight = () =>
  logseq.provideStyle({
    key: keyLeftSidebarMenuHeight,
    style: String.raw`
  body>div#root>div>main div#left-sidebar div.left-sidebar-inner div.nav-content-item ul a .page-title {
    min-height: 2em;
    margin-right: -1em;
    white-space: pre-wrap;
  }
`,
  })

//justify-content: space-evenly
const keyLeftSidebarMenuJustifyContent = "leftSidebarMenuJustifyContent"
const leftSidebarMenuJustifyContent = (value: string) =>
  logseq.provideStyle({
    key: keyLeftSidebarMenuJustifyContent,
    style: String.raw`
  body>div#root>div>main div#left-sidebar div.left-sidebar-inner div.nav-contents-container {
    justify-content: ${value};
  }
`,
  })

//左サイドバーの背景色を同色にする
const keyLeftSidebarBackground = "leftSidebarMenuBackground"
const leftSidebarMenuBackground = (value: string) => {
  if (value !== "Theme color")
    logseq.provideStyle({
      key: keyLeftSidebarBackground,
      style: String.raw`
  html[data-theme=dark]>body>div#root>div,
  body>div#root>div.dark-theme {
    &>main div#left-sidebar div.left-sidebar-inner {
      background-color: ${value};
    }
  }
`,
    })
}

const removeProvideStyle = (className: string) => {
  const doc = parent.document.head.querySelector(
    `style[data-injected-style^="${className}"]`
  ) as HTMLStyleElement
  if (doc) doc.remove()
}

/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate = (): SettingSchemaDesc[] => [
  {// アクセントカラーを、下線に対して適用する
    key: keyAccentColorUnderline,
    title: t("Apply accent color to underline"),
    type: "boolean",
    default: true,
    description: "default: true",
  },
  {
    key: keyFontFamilyUnset,
    title: t("Unset `font-family` in `html` For fast font loading"),
    type: "boolean",
    default: false,
    description: "default: false",
  },
  {
    key: keyTaskColor,
    type: "boolean",
    title: t("Enable task marker color"),
    description: "",
    default: false,
  },
  {
    //文字を太くする
    key: keyTaskBold,
    type: "boolean",
    title: t("Enable Bold task marker"),
    description: "",
    default: false,
  },

  {
    //左サイドバー
    key: "headingLeftSidebarMenu",
    title: t("Left Sidebar Menu"),
    type: "heading",
    description: "",
    default: "",
  },
  {
    key: keyRemoveMenuGraphView,
    title: t("Remove `Graph View` button"),
    type: "boolean",
    default: false,
    description: "",
  },

  {
    key: keyLeftSidebarMenuHeight,
    title: t("Increase the gap between favorites and history a little"),
    type: "boolean",
    default: true,
    description: "default: true",
  },
  {
    key: keyLeftSidebarMenuJustifyContent,
    title: t("Adjust the position of favorites and history"),
    type: "enum",
    enumChoices: ["unset", "space-evenly", "center", "space-around"],
    default: "unset",
    description: "default: unset",
  },
  {
    key: keyLeftSidebarBackground,
    title: t("Unset background color"),
    type: "enum",
    enumChoices: ["Theme color", "black", "navy", "#2e2930", "unset"],
    default: "Theme color",
    description: `
    default: Theme color
    unset: primary background color)
    #2e2930: dark purple
    `,
  },
]

logseq.ready(main).catch(console.error)
