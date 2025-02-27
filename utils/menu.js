const menu = {
    list() {
        return [{"backMenu":[{"child":[{"appFrontIcon":"cuIcon-form","buttons":["新增","查看","修改","删除"],"menu":"用户","menuJump":"列表","tableName":"yonghu"}],"menu":"用户管理"},{"child":[{"appFrontIcon":"cuIcon-link","buttons":["新增","查看","修改","删除"],"menu":"单词分类","menuJump":"列表","tableName":"dancifenlei"}],"menu":"单词分类管理"},{"child":[{"appFrontIcon":"cuIcon-time","buttons":["新增","查看","修改","删除","查看评论"],"menu":"单词本","menuJump":"列表","tableName":"danciben"}],"menu":"单词本管理"},{"child":[{"appFrontIcon":"cuIcon-brand","buttons":["查看","修改","删除"],"menu":"学习清单","menuJump":"列表","tableName":"xuexiqingdan"}],"menu":"学习清单管理"},{"child":[{"appFrontIcon":"cuIcon-link","buttons":["新增","查看","修改","删除"],"menu":"奖励机制","menuJump":"列表","tableName":"jianglijizhi"}],"menu":"奖励机制管理"},{"child":[{"appFrontIcon":"cuIcon-pic","buttons":["新增","查看","修改","删除"],"menu":"试卷管理","tableName":"exampaper"}],"menu":"试卷管理"},{"child":[{"appFrontIcon":"cuIcon-list","buttons":["新增","查看","修改","删除"],"menu":"试题管理","tableName":"examquestion"}],"menu":"试题管理"},{"child":[{"appFrontIcon":"cuIcon-service","buttons":["新增","查看","修改","删除"],"menu":"反馈中心","tableName":"chat"},{"appFrontIcon":"cuIcon-cardboard","buttons":["查看","修改","删除"],"menu":"轮播图管理","tableName":"config"},{"appFrontIcon":"cuIcon-news","buttons":["新增","查看","修改","删除"],"menu":"公告资讯","tableName":"news"}],"menu":"系统管理"},{"child":[{"appFrontIcon":"cuIcon-time","buttons":["查看"],"menu":"考试记录","tableName":"examrecord"},{"appFrontIcon":"cuIcon-pay","buttons":["查看"],"menu":"错题本","tableName":"examfailrecord"}],"menu":"考试管理"}],"frontMenu":[{"child":[{"appFrontIcon":"cuIcon-medal","buttons":["查看","查看评论","加入"],"menu":"单词本列表","menuJump":"列表","tableName":"danciben"}],"menu":"单词本模块"},{"child":[{"appFrontIcon":"cuIcon-album","buttons":["查看"],"menu":"奖励机制列表","menuJump":"列表","tableName":"jianglijizhi"}],"menu":"奖励机制模块"}],"hasBackLogin":"是","hasBackRegister":"否","hasFrontLogin":"否","hasFrontRegister":"否","roleName":"管理员","tableName":"users"},{"backMenu":[{"child":[{"appFrontIcon":"cuIcon-time","buttons":["查看","查看评论","加入"],"menu":"单词本","menuJump":"列表","tableName":"danciben"}],"menu":"单词本管理"},{"child":[{"appFrontIcon":"cuIcon-brand","buttons":["查看","修改","删除"],"menu":"学习清单","menuJump":"列表","tableName":"xuexiqingdan"}],"menu":"学习清单管理"},{"child":[{"appFrontIcon":"cuIcon-pay","buttons":["查看"],"menu":"错题本","tableName":"examfailrecord"},{"appFrontIcon":"cuIcon-full","buttons":["查看"],"menu":"试卷列表","tableName":"exampaperlist"},{"appFrontIcon":"cuIcon-time","buttons":["查看"],"menu":"考试记录","tableName":"examrecord"}],"menu":"考试管理"}],"frontMenu":[{"child":[{"appFrontIcon":"cuIcon-medal","buttons":["查看","查看评论","加入"],"menu":"单词本列表","menuJump":"列表","tableName":"danciben"}],"menu":"单词本模块"},{"child":[{"appFrontIcon":"cuIcon-album","buttons":["查看"],"menu":"奖励机制列表","menuJump":"列表","tableName":"jianglijizhi"}],"menu":"奖励机制模块"},
            {
                "child":[
                    {
                        "appFrontIcon":"cuIcon-album",
                        "buttons":[
                            "查看"
                        ],
                        "menu":"AI学习列表",
                        "menuJump":"列表",
                        "tableName":"ai"
                    }
                ],
                "menu":"AI学习模块"
            }, {
                "child":[
                    {
                        "appFrontIcon":"cuIcon-album",
                        "buttons":[
                            "查看"
                        ],
                        "menu":"看物学习列表",
                        "menuJump":"列表",
                        "tableName":"kanwu"
                    }
                ],
                "menu":"看物学习模块"
            }],"hasBackLogin":"否","hasBackRegister":"否","hasFrontLogin":"是","hasFrontRegister":"是","roleName":"用户","tableName":"yonghu"}]
    }
}
export default menu;
