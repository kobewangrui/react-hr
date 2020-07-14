/**
 * global configuration
 * @type {{copyright: string, logoPath: string, siteName: string, i18n: {defaultLanguage: string, languages: *[]}}}
 */
module.exports = {
  siteName: '浙农金服人事管理系统',
  copyright: `浙农金服人事管理系统 ©${new Date().getFullYear()}`,
  logoPath: '/logo.svg',
  adminBasePath: '/app',
  URLString:process.env.NODE_ENV==='development'?'':'/hrms',//生产和开发环境的路由切换
  /* I18n configuration */
  i18n: {
    languages: [
      // {
      //   key: 'en',
      //   title: 'English',
      //   flag: '/america.svg',
      // },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'zh'
  }
}
