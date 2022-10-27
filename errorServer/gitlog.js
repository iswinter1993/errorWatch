const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

 const getGitInfo = (file) => {
    let name = execSync('git show -s --format=%cn').toString().trim()//姓名
    let email = execSync('git show -s --format=%ce').toString().trim()//邮箱
    let date = new Date(execSync('git show -s --format=%cd').toString())//日期
    let msg = execSync('git show -s --format=%s').toString().trim()//说明
    let fileInfo = execSync(`git blame ${file}`).toString().trim()//指定文件的修改记录
    return {
        name,email,date,msg,fileInfo
    }
}

exports.getGitInfo = getGitInfo