// vue-cli3中会将webpack配置隐藏起来，如果需要加入新的配置需要新建一个vue.config.js(名字是固定的，不可以改)，
// vue在启动和编译是会自动将这个文件里面的配置和它隐藏起来的配置合并起来
module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                "assets": "@/assets",
                'content': 'components/content',
                'common': 'components/common',
                "components": "@/components",
                "network": "@/network",
                "views": "@/views"
            }
        }

    }
}